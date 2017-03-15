var slice = [].slice;
var each = [].forEach;


var markup = function(html, onlyelements) {
  if( typeof(html) !== 'string' ) return null;
  
  var fragment = document.createDocumentFragment();
  
  var lower = html.trim().toLowerCase();
  var el;
  if( !lower.indexOf('<tr') ) el = document.createElement('tbody');
  else if( !lower.indexOf('<tbody') || !lower.indexOf('<thead') || !lower.indexOf('<tfoot') ) el = document.createElement('table');
  else if( !lower.indexOf('<td') ) el = document.createElement('tr');
  else el = document.createElement('div');
  
  el.innerHTML = html;
  
  var children = (onlyelements === true) ? el.children : el.childNodes;
  if( children ) {
    for(var i=0; i < children.length; i++) {
      fragment.appendChild(children[i]);
    }
  }
  
  return fragment;
};

var computed = function(el, k) {
  var cs;
  if( window.getComputedStyle ) {
    cs = getComputedStyle(el);
  } else if ( el.currentStyle ) {
    cs = el.currentStyle;
  } else {
    return console.error('browser not support computed style');
  }

  return k ? cs[k] || (cs.getPropertyValue && cs.getPropertyValue(k)) : cs;
};

var matchesselectorfn;
['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
  if (typeof document.createElement('div')[fn] == 'function') {
    matchesselectorfn = fn;
    return true;
  }
  return false;
});

var matchesSelector = function(element, selector) {
  if( selector === '*' ) return true;
  if( !element ) return false;
  if( !selector ) return false;  
  if( matchesselectorfn ) return element[matchesselectorfn](selector);    
  var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
  var i = 0;
  while(matches[i] && matches[i] !== element) i++;
  return matches[i] ? true : false;
};

var closest = function(element, selector) {
  if( typeof element === 'string' ) {
    selector = element;
    element = document._currentScript || document.currentScript;
  }
  
  //console.log(element, element.parentNode, selector);
  //if( element.closest ) return element.closest(selector);
  
  // 현재 부모의 아래에서 제일 가까운 자식으로 먼저 찾고 없으면, document 에서 찾는다.
  var found, parent = element.parentNode, fn = selector;
  
  if( typeof selector === 'string' ) fn = function(current) {
    return current.querySelector(selector);
  }
  
  if( typeof fn !== 'function' ) return console.error('argument selector must be a string or function', selector);
  
  do {
    found = fn(parent);
    if( found ) return found;
  } while( (parent = parent.parentNode ) );
  
  return null;
};

var accessor = function(el) {
  var tag = el.tagName.toLowerCase();
  var id = el.id;
  var cls = el.className.split(' ').join('.');
  id = id ? ('#' + id) : '';
  cls = cls ? ('.' + cls) : '';

  return tag + id + cls;
};

var assemble = function(selector) {
  if( !selector || typeof(selector) !== 'string' ) return console.error('invalid selector', selector);
  
  var arr = selector.split(':');
  
  var accessor = arr[0];
  var pseudo = arr[1];
  
  arr = accessor.split('.');
  var tag = arr[0];
  var id;
  var classes = arr.splice(1).join(' ').trim();
  
  if( ~tag.indexOf('#') ) {
    var t = tag.split('#');
    tag = t[0];
    id = t[1];
  }
  
  return {
    selector: selector,
    accessor: accessor,
    tag: tag && tag.toLowerCase() || '',
    id: id || '',
    classes: classes || '',
    pseudo: pseudo || ''
  };
};

var stringify = function(el) {
  if( el.outerHTML ) {
    return el.outerHTML;
  } else {
    var p = el.parent();
    if( p ) {
      return p.html();
    } else {
      var html = '<' + el.tagName;
      
      if( el.style ) html += ' style="' + el.style + '"';
      if( el.className ) html += ' class="' + el.className + '"';
      
      var attrs = el.attributes;
      for(var k in attrs) {
        if( !attrs.hasOwnProperty(k) ) continue;
        if( k && attrs[k] ) {
          html += ' ' + k + '="' + attrs[k] + '"';
        }
      }
      
      html += '>';
      html += el.innerHTML;
      html += '</' + el.tagName + '>';
      
      return html;
    }
  }
};

var isShowing = function(el) {
  if( computed(el, 'visibillity') === 'hidden' ) return false;
  if( (el.scrollWidth || el.scrollHeight || el.offsetWidth || el.offsetHeight || el.clientWidth || el.clientHeight) ) return true;
  return false;
};

var boundary = function(el) {
  if( !el ) return console.error('invalid parameter', el);
  
  var abs = function(el) {
    var position = { x: el.offsetLeft, y: el.offsetTop };
    if (el.offsetParent) {
      var tmp = abs(el.offsetParent);
      position.x += tmp.x;
      position.y += tmp.y;
    }
    return position;
  };
  
  var boundary = {
    x: 0,
    y: 0,
    width: el.offsetWidth,
    height: el.offsetHeight,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
    clientWidth: el.clientWidth,
    clientHeight: el.clientHeight
  };

  if( el.parentNode ) {
    boundary.x = el.offsetLeft + el.clientLeft;
    boundary.y = el.offsetTop + el.clientTop;
    if( el.offsetParent ) {
      var parentpos = abs(el.offsetParent);
      boundary.x += parentpos.x;
      boundary.y += parentpos.y;
    }
  }
  return boundary;
};

var normalizeContentType = function(mimeType, url) {
  if( mimeType && typeof(mimeType) === 'string' ) {
    mimeType = mimeType.split(';')[0];
  
    if( ~mimeType.indexOf('javascript') ) return 'js';
    else if( ~mimeType.indexOf('html') ) return 'html';
    else if( ~mimeType.indexOf('json') ) return 'json';
    else if( ~mimeType.indexOf('xml') ) return 'xml';
    else if( ~mimeType.indexOf('css') ) return 'css';
    else return mimeType;
  } else if( url && typeof(url) === 'string' ) {
    var match = url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    var ext = ((match && match[1]) || '').toLowerCase();
    if( ext === 'htm') return 'html';
    else return ext;
  } else {
    return console.error('illegal parameter', mimeType, url);
  }
};

var wrappingstringevent = function(script) {
  return function(e) {
    return eval(script);
  };
};

var mixselector = function(baseAccessor, selector) {
  // base accessor : .app-x.application
  // selector : div#id.a.b.c[name="name"]
  // result = div#id.app-x.application.a.b.c[name="name"]
  selector = selector || '*';
  if( selector === '*' ) return baseAccessor;
  else if( !~selector.indexOf('.') ) return selector + baseAccessor;

  var h = selector.substring(0, selector.indexOf('.'));
  var t = selector.substring(selector.indexOf('.'));
  return h + baseAccessor + t;
};

var isNode = function(o){
  return (typeof(Node) === "object") ? o instanceof Node : 
    (o && typeof(o.nodeType) === 'number' && typeof(o.nodeName) === 'string');
};

var isElement = function(el) {
  if( typeof(el) !== 'object' ) return false;
  else if( !(window.attachEvent && !window.opera) ) return (el instanceof window.Element);
  else return (el.nodeType == 1 && el.tagName);
};

var isHtml = function(html) {
  return (typeof html === 'string' && html.match(/(<([^>]+)>)/ig) ) ? true : false;
};

var position = function(element, startelement) {
  var x = 0;
  var y = 0;
  
  //console.log(element.getBoundingClientRect(), element.getClientRects());
  while(element) {
    //console.debug('current', element, element.matches(':host::shadow *'));
    // 시작점이 있다면, 시작노드 하위에 있다면 계속, 현재 엘리먼트가 쉐도우노드 일때는 부모가 나올때까지 계속
    if( !element.matches(':host::shadow *') && (startelement && (element === startelement || !startelement.contains(element))) ) break;
    x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    y += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
    //console.log('pass', x,y,element);
  }
  
  return { x: x, y: y };
};

// visit
var visit = function(dom, fn, allnode) {
  if( dom ) {
    var nodes = allnode ? (dom.childNodes || dom.children) : dom.children;
    if( !allnode && dom.nodeType === 1 && fn.call(dom) === false ) return;
    else if( allnode && fn.call(dom) === false ) return;

    //console.log('nodes', nodes);
    if( nodes ) {
      slice.call(nodes).forEach(function(child) {
        visit(child, fn, allnode);
      });
    }
  }
};

var visitup = function(dom, fn) {
  if( fn.call(dom) === false ) return;
  
  var p = dom && dom.parentNode;
  if( p ) visitup(p, fn);
};

var visitoffset = function(dom, fn) {
  if( fn.call(dom) === false ) return;
  
  var p = dom && dom.offsetParent;
  if( p ) visitoffset(p, fn);
};

var create = function(element, accessor, arg) {
  if( typeof element === 'string' ) {
    arg = accessor;
    accessor = element;
    element = null;
  }
  
  if( !accessor || typeof(accessor) !== 'string' ) return console.error('invalid parameter', accessor);
  
  var o = assemble(accessor);
  var tag = o.tag;
  var classes = o.classes;
  var id = o.id;
  
  if( !tag ) return console.error('illegal accessor(missing tag)', accessor);
  
  var el = document.createElement(tag);
  if( id ) el.id = id;
  if( classes ) el.className = classes;
  
  if( arg ) data(el, 'arg', arg);
  if( element ) element.appendChild(el);
  
  return el;
};

var easing = {
  'ease-in': function(x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  'ease-out': function(x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  'ease-in-out': function(x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  }
};

var animate = function(element, properties, easing) {
  var start;
  var step = function(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start;
    element.style.left = Math.min(progress/10, 200) + "px";
    if (progress < 2000) {
      window.requestAnimationFrame(step);
    }
  };
  
  return {
    start: function(fn) {
      window.requestAnimationFrame(step);
    }
  }
};


module.exports = {
  markup: markup,
  computed: computed,
  matches: matchesSelector,
  closest: closest,
  accessor: accessor,
  assemble: assemble,
  create: create,
  boundary: boundary,
  isShowing: isShowing,
  stringify: stringify,
  normalizeContentType: normalizeContentType,
  wrappingstringevent: wrappingstringevent,
  mixselector: mixselector,
  isNode: isNode,
  isElement: isElement,
  isHtml: isHtml,
  position: position,
  visit: visit,
  visitup: visitup,
  visitoffset: visitoffset,
  easing: easing,
  animate: animate
};
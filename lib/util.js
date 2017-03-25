var matches = Element.prototype.matches || 
  Element.prototype.matchesSelector || 
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector || 
  Element.prototype.oMatchesSelector || 
  Element.prototype.webkitMatchesSelector ||
  function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
  };

module.exports = {
  isNull: function(value) {
    return value === null || value === undefined;
  },
  isArrayLike: function(o) {
    if( !o || typeof o != 'object' || o === window || typeof o.length != 'number' ) return false;
    if( o instanceof Array || (Array.isArray && Array.isArray(o)) ) return true;
    
    var type = Object.prototype.toString.call(o);
    return /^\[object (HTMLCollection|NodeList|Array|FileList|Arguments)\]$/.test(type);
  },
  create: function(html) {
    if( !html || typeof html != 'string' ) return null;
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    
    var arr = [];
    [].forEach.call(div.childNodes, function(node) {
      var p = node.parentNode;
      p && p.removeChild(node);
      arr.push(node);
    });
    
    return arr;
  },
  accessor: function(el) {
    var tag = el.tagName.toLowerCase();
    var id = el.id;
    var cls = el.className.split(' ').join('.');
    id = id ? ('#' + id) : '';
    cls = cls ? ('.' + cls) : '';
    
    return tag + id + cls;
  },
  assemble: function(selector) {
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
  },
  isHTML: function(html) {
    return (typeof html === 'string' && html.match(/(<([^>]+)>)/ig) ) ? true : false;
  },
  matches: function(el, selector) {
    try {
      if( typeof selector == 'function' )
        return !!selector.call(el);
      
      return !!(el && matches.call(el, selector));
    } catch(e) {
      return false;
    }
  },
  each: function(arr, fn) {
    var i = 0;
    [].every.call(arr, function(el) {
      i = i + 1;
      if( !el ) return true;
      return ( fn && fn.apply(el, [i, el]) === false ) ? false : true;
    });
    return arr;
  },
  offset: function(el, abs) {
    if( !el || typeof el.offsetTop != 'number' ) return {top:null,left:null};
    
    var top = el.offsetTop, left = el.offsetLeft;
    if( abs ) {
      while( el = el.offsetParent ) {
        top += el.offsetTop;
        left += el.offsetLeft;
      }
    }
    
    return {
      top: top,
      left: left
    };
  },
  isElement: function(o) {
    return (
      typeof HTMLElement === 'object' ? o instanceof HTMLElement : 
      o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string'
    );
  },
  isNode: function(o) {
    return (
      typeof Node === "object" ? o instanceof Node : 
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
  },
  computed: function(el, name) {
    return window.getComputedStyle(el, null);
  },
  number: function(o) {
    if( !o || typeof o == 'number' ) return o;
    
    o = o + '';
    (['px', 'em', 'pt', '%', 'in', 'deg'].every(function(c) {
      if( o.endsWith(c) ) {
        o = o.split(c).join('');
        return false;
      }
      return true;
    }));
    return +o;
  }
};
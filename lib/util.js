function isNull(value) {
  return value === null || value === undefined;
}

function isArrayLike(o) {
  return !!(o && typeof o == 'object' && typeof o.length == 'number');
  /*if( !o || typeof o != 'object' || o === window || typeof o.length != 'number' ) return false;
  if( o instanceof Array || (Array.isArray && Array.isArray(o)) ) return true;
  
  var type = Object.prototype.toString.call(o);
  return /^\[object (HTMLCollection|NodeList|Array|FileList|Arguments)\]$/.test(type);*/
}

function create(html) {
  if( !html || typeof html != 'string' ) return null;
  var div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.childNodes;
}

function isHTML(html) {
  return (typeof html === 'string' && html.match(/(<([^>]+)>)/ig) ) ? true : false;
}

function matches(el, selector) {
  try {
    if( typeof selector == 'function' )
      return !!selector.call(el);
    
    return !!(el && el.matches && el.matches(selector));
  } catch(e) {
    return false;
  }
}

function each(arr, fn) {
  var i = 0;
  [].every.call(arr, function(el) {
    i = i + 1;
    if( !el ) return true;
    return ( fn && fn.apply(el, [i, el]) === false ) ? false : true;
  });
  return arr;
}

function offset(el, abs) {
  if( !el || !el.offsetTop ) return null;
  
  var top = el.offsetTop, left = el.offsetLeft;
  if( abs !== false ) {
    while( el = el.offsetParent ) {
      top += el.offsetTop;
      left += el.offsetLeft;
    }
  }
  
  return {
    top: top,
    left: left
  };
}

function isElement(node) {
  return (
    typeof HTMLElement === 'object' ? node instanceof HTMLElement : node && typeof node === 'object' && node !== null && node.nodeType === 1 && typeof node.nodeName === 'string'
  );
}

module.exports = {
  isNull: isNull,
  isArrayLike: isArrayLike,
  create: create,
  isHTML: isHTML,
  matches: matches,
  each: each,
  offset: offset,
  isElement: isElement
};
function isNull(value) {
  return value === null || value === undefined;
}

function isArrayLike(o) {
  if( !o || typeof o != 'object' || o === window || typeof o.length != 'number' ) return false;
  if( o instanceof Array || (Array.isArray && Array.isArray(o)) ) return true;
  
  var type = Object.prototype.toString.call(o);
  return /^\[object (HTMLCollection|NodeList|Array|Arguments)\]$/.test(type);
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

module.exports = {
  isNull: isNull,
  isArrayLike: isArrayLike,
  create: create,
  isHTML: isHTML,
  matches: matches
};
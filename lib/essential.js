var isnull = function(value) {
  return value === null || value === undefined;
}

var isArrayLike = function(o) {
  if( !o ) return false;
  if( ~['[object Array]', '[object HTMLCollection]', '[object NodeList]', '[object Arguments]'].indexOf(Object.prototype.toString.call(o)) ) return true;
  if( o.constructor && o.constructor.prototype instanceof Array ) return true;
  if( Array.isArray(o) ) return true;
  return false;
}

module.exports = function($) {
  var fn = $.fn;
  
  fn.each = function(fn) {
    this.every(function(el) {
      if( !el ) return true;
      if( el.dom ) el = (typeof el.dom === 'function') ? el.dom() : el.dom;
      return ( fn.call(el) === false ) ? false : true;
    });
    return this;
  };
  
  fn.remove = function(item, once) {
    if( typeof item === 'number' ) item = this[item];
    for(var index;(index = this.indexOf(item)) >= 0;) {
      this.splice(index, 1);
      if( once ) break;
    }
    return this;
  };
  
  fn.reverse = function() {
    [].reverse.call(this);
    return this;
  };
  
  fn.clear = function() {
    var len = this.length;
    if( len > 0 ) {
      for(var i=0; i < len; i++) delete this[i];
      this.length = 0;
    }
    
    return this;
  };
  
  fn.get = function(index) {
    return this[index];
  };
  
  fn.find = function(selector) {
    var nodes = this.$();
    this.each(function() {
      if( !this.querySelectorAll ) return;
      [].forEach.call(this.querySelectorAll(selector), function(node) {
        if( !~nodes.indexOf(node) ) nodes.push(node);
      });
    });
    return nodes;
  };
  
  fn.empty = function() {
    return this.each(function() {
      this.innerHTML = null;
    });
  };
  
  fn.html = function(html) {
    return this.each(function() {
      this.innerHTML = html;
    });
  };
  
  fn.attr = function(key, value) {
    if( !artuments.length ) return null;
    if( arguments.length === 1 ) return this[0] && this[0].getAttribute && this[0].getAttribute(key);
    
    return this.each(function() {
      if( value === null || value === undefined ) this.removeAttribute(key);
      else this.setAttribute(key, value + '');
    });
  };
  
  fn.css = function(key, value) {
    if( !artuments.length ) return null;
    if( arguments.length === 1 ) return this[0] && this[0].style && this[0].style[key];
    
    return this.each(function() {
      if( isnull(value) ) this.style[key] = null;
      else this.style[key] = value;
    });
  };
  
  fn.addClass = fn.ac = function(cls) {
    if( typeof cls == 'string' ) cls = cls.split(' ');
    if( !isArrayLike(cls) || !cls.length ) return this;
    
    return this.each(function() {
      if( 'className' in this ) {
        var ocls = this.className.trim().split(' ');
        [].forEach.call(cls, function(cls) {
          if( isnull(cls) ) return;
          if( !~ocls.indexOf(cls) ) ocls.push(cls);
        });
        this.className = ocls.join(' ');
      }
    });
  };
  
  fn.removeClass = fn.rc = function(cls) {
    if( typeof cls == 'string' ) cls = cls.split(' ');
    if( !isArrayLike(cls) || !cls.length ) return this;
    
    return this.each(function() {
      if( 'className' in this ) {
        var ocls = this.className.trim().split(' ');
        [].forEach.call(cls, function(cls) {
          if( isnull(cls) ) return;
          var pos = ocls.indexOf(cls);
          if( ~pos ) ocls.splice(pos, 1);
        });
        this.className = ocls.join(' ');
      }
    });
  };
  
  fn.toggleClass = fn.tc = function(cls) {
    if( typeof cls == 'string' ) cls = cls.split(' ');
    if( !isArrayLike(cls) || !cls.length ) return this;
    
    return this.each(function() {
      if( 'className' in this ) {
        var ocls = this.className.trim().split(' ');
        [].forEach.call(cls, function(cls) {
          if( isnull(cls) ) return;
          var pos = ocls.indexOf(cls);
          if( !~pos ) ocls.push(cls);
          else ocls.splice(pos, 1);
        });
        this.className = ocls.join(' ');
      }
    });
  };
  
  fn.append = function(node) {
    if( !node ) return;
    if( !isArrayLike(node) ) node = [node];
    
    return this.each(function() {
      if( this.appendChild ) {
        [].forEach.call(node, function(node) {
          this.appendChild(node);
        });
      }
    });
  };
  
  fn.before = function(node, before) {
    if( !node ) return;
    if( !isArrayLike(node) ) node = [node];
    
    return this.each(function() {
      if( this.insertBefore ) {
        [].forEach.call(node, function(node) {
          this.insertBefore(node, before || this.childNodes[0]);
        });
      }
    });
  };
  
  fn.remove = function(node) {
    if( !arguments.length ) return this.each(function() {
      var p = this.parentNode;
      p && p.removeChild(this);
    });
    
    if( !node ) return;
    if( !isArrayLike(node) ) node = [node];
    
    return this.each(function() {
      if( this.removeChild ) {
        [].forEach.call(node, function(node) {
          this.removeChild(node);
        });
      }
    });
  };
};
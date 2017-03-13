var util = require('./util.js');

module.exports = function($) {
  var fn = $.fn;
  var isArrayLike = util.isArrayLike;
  var isNull = util.isNull;
  var matches = util.matches;
  
  fn.each = function(fn) {
    var i = 0;
    this.every(function(el) {
      i = i + 1;
      if( !el ) return true;
      return ( fn.apply(el, [i, el]) === false ) ? false : true;
    });
    return this;
  };
  
  fn.add = function(arr) {
    if( !arr ) return;
    if( !isArrayLike(arr) ) arr = [arr];
    
    var self = this;
    [].forEach.call(arr, function(item) {
      if( item ) self.push(item);
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
    if( !arguments.length ) return null;
    if( typeof key == 'object' ) {
      for(var k in key) this.attr(k, key[k]);
      return this;
    }
    if( arguments.length === 1 ) return this[0] && this[0].getAttribute && this[0].getAttribute(key);
    
    return this.each(function() {
      if( isNaN(value) || value === null || value === undefined ) this.removeAttribute(key);
      else this.setAttribute(key, value + '');
    });
  };
  
  fn.css = function(key, value) {
    if( !artuments.length ) return null;
    if( arguments.length === 1 ) return this[0] && this[0].style && this[0].style[key];
    
    return this.each(function() {
      if( isNull(value) ) this.style[key] = null;
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
          if( isNull(cls) ) return;
          if( !~ocls.indexOf(cls) ) ocls.push(cls);
        });
        this.className = ocls.join(' ').trim();
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
          if( isNull(cls) ) return;
          var pos = ocls.indexOf(cls);
          if( ~pos ) ocls.splice(pos, 1);
        });
        this.className = ocls.join(' ').trim();
      }
    });
  };
  
  fn.clearClass = fn.cc = function() {
    return this.each(function() {
      if( 'className' in this ) {
        this.className = '';
        this.removeAttribute('class');
      }
    });
  };
  
  fn.classes = fn.cls = function(cls) {
    if( !arguments.length ) return this[0] && this[0].className;
    if( !cls ) return this.cc();
    
    return this.each(function() {
      if( 'className' in this ) {
        this.className = cls;
      }
    });
  };
  
  fn.hasClass = fn.hc = function(cls) {
    if( typeof cls == 'string' ) cls = cls.split(' ');
    if( !isArrayLike(cls) || !cls.length ) return false;
    if( !this[0] || !this[0].className ) return false;
    
    var ocls = this[0].className.trim().split(' ');
    var exists = true;
    [].forEach.call(cls, function(cls) {
      if( isNull(cls) ) return;
      if( !~ocls.indexOf(cls) ) exists = false;
    });
    return exists;
  };
  
  fn.toggleClass = fn.tc = function(cls) {
    if( typeof cls == 'string' ) cls = cls.split(' ');
    if( !isArrayLike(cls) || !cls.length ) return this;
    
    return this.each(function() {
      if( 'className' in this ) {
        var ocls = this.className.trim().split(' ');
        [].forEach.call(cls, function(cls) {
          if( isNull(cls) ) return;
          var pos = ocls.indexOf(cls);
          if( !~pos ) ocls.push(cls);
          else ocls.splice(pos, 1);
        });
        this.className = ocls.join(' ').trim();
      }
    });
  };
  
  fn.append = function(node) {
    if( !node ) return this;
    if( !isArrayLike(node) ) node = [node];
    
    return this.each(function() {
      var el = this;
      if( el.appendChild ) {
        [].forEach.call(node, function(node) {
          el.appendChild(node);
        });
      }
    });
  };
  
  fn.appendTo = function(target) {
    if( !target ) return this;
    
    return this.each(function() {
      if( target.append ) {
        target.append(this);
      } else if( target.appendChild ) {
        target.appendChild(this);
      } 
    });
  };
  
  fn.insertBefore = function(ref) {
    if( typeof ref == 'string' ) ref = this.document.querySelector(ref);
    if( isArrayLike(ref) ) ref = ref[0];
    if( !ref ) return this;
    
    var parent = ref.parentNode;
    if( !parent ) return this;
    
    return this.each(function() {
      if( parent.insertBefore ) {
        parent.insertBefore(this, ref);
      }
    });
  };
  
  fn.insertAfter = function(ref) {
    if( typeof ref == 'string' ) ref = this.document.querySelector(ref);
    if( isArrayLike(ref) ) ref = ref[0];
    if( !ref ) return this;
    
    var parent = ref.parentNode;
    var sib = ref.nextSibling;
    if( !parent ) return this;
    
    return this.each(function() {
      if( !sib ) {
        parent.appendChild(this);
      } else if( parent.insertBefore ) {
        parent.insertBefore(this, sib);
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
  
  fn.on = function(type, fn, bubble) {
    if( typeof type !== 'string' ) return this;
    type = type.split(' ');
    
    var self = this;
    type.forEach(function(type) {
      self.each(function() {
        this.addEventListener(type, fn, bubble || false);
      });
    });
    
    return this;
  };
  
  fn.once = function(type, fn, bubble) {
    if( typeof type !== 'string' ) return this;
    type = type.split(' ');
    
    var self = this;
    type.forEach(function(type) {
      self.each(function() {
        var el = this;
        var listener = function() {
          el.removeEventListener(type, listener, bubble || false);
          fn.apply(this, arguments);
        };
        el.addEventListener(type, listener, bubble || false);
      });
    });
    
    return this;
  };
  
  fn.off = function(type, fn, bubble) {
    if( typeof type !== 'string' ) return this;
    type = type.split(' ');
    
    var self = this;
    type.forEach(function(type) {
      self.each(function() {
       this.removeEventListener(type, fn, bubble || false);
     });
    });
    
    return this;
  };
  
  fn.data = function(data) {
    if( !arguments.length ) return this[0]._data;
    
    return this.each(function() {
      this._data = data;
    });
  };
  
  fn.invoke = function(fn) {
    if( typeof fn !== 'function' ) return this;
    return this.each(function(i) {
      fn(this._data, i);
    });
  };
  
  fn.is = function(selector) {
    return matches(this[0], selector);
  };
  
  fn.parent = function(selector) {
    var arr = this.$();
    this.each(function() {
      if( !selector ) return arr.push(this.parentNode);
      
      var p = this;
      do {
        if( matches(p, selector) ) {
          arr.push(p);
          break;
        }
      } while(p = p.parentNode)
    });
    return arr;
  };
  
  fn.children = function(selector) {
    var arr = this.$();
    this.each(function() {
      var children = this.children;
      if( selector ) {
        [].forEach.call(children, function(el) {
          matches(el, selector) && arr.push(el);
        });
      }
      arr.add(children);
    });
    return arr;
  };
  
  fn.filter = function(fn) {
    if( typeof fn == 'string' ) {
      var selector = fn;
      fn = function() {
        return matches(this, selector);
      };
    }
    
    if( isArrayLike(fn) ) {
      var arr = [].slice.call(fn);
      fn = function() {
        return ~arr.indexOf(this);
      };
    }
    
    if( typeof fn != 'function' ) return this;
    
    var arr = this.$();
    this.each(function() {
      fn.apply(this, arguments) && arr.push(this);
    });
    return arr;
  };
  
  fn.contains = function(selector) {
    if( !selector ) return false;
    
    var contain = false;
    this.each(function() {
      var children = this.children;
      if( selector ) {
        [].forEach.call(children, function(el) {
          matches(el, selector) && arr.push(el);
        });
      }
      arr.add(children);
    });
    return arr;
  };
  
  fn.nodes = function() {
    var arr = this.$();
    this.each(function() {
      arr.add(this.childNodes);
    });
    return arr;
  };
};
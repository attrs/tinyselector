var util = require('./util.js');

module.exports = function(ctx) {
  var fn = ctx.fn;
  var create = util.create;
  var isHTML = util.isHTML;
  var isNode = util.isNode;
  var isElement = util.isElement;
  var isArrayLike = util.isArrayLike;
  var isNull = util.isNull;
  var matches = util.matches;
  var each = util.each;
  var async = util.async;
  var offset = util.offset;
  var computed = util.computed;
  var number = util.number;
  
  fn.ready = function(fn) {
    this.each(function() {
      if( this instanceof Document ) {
        if( this.body ) return fn.call(this, ctx(this));
        
        this.addEventListener('DOMContentLoaded', function() {
          fn.call(this, ctx(this));
        });
      }
    });
    return this;
  };
  
  fn.each = function(fn, force) {
    return each(this, fn, force);
  };
  
  fn.chunk = function(size) {
    return chunk(this, size);
  };
  
  fn.index = function(item) {
    return this.indexOf(item);
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
      this.innerHTML = '';
    });
  };
  
  fn.html = function(html) {
    if( !arguments.length ) return this[0] && this[0].innerHTML;
    
    return this.each(function() {
      this.innerHTML = html || '';
    });
  };
  
  fn.outer = function(html) {
    if( !arguments.length ) return this[0] && this[0].outerHTML;
    
    return this.each(function() {
      this.outerHTML = html || '';
    });
  };
  
  fn.text = function(text) {
    if( !arguments.length ) return (this[0] && (this[0].textContent || this[0].innerText)) || '';
    
    return this.each(function() {
      this.innerText = text || '';
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
      if( value === null || value === undefined ) this.removeAttribute(key);
      else this.setAttribute(key, value + '');
    });
  };
  
  fn.hasAttr = fn.ha = function(name) {
    return this[0] && this[0].hasAttribute(name);
  };
  
  fn.css = function(key, value) {
    if( !arguments.length ) return this;
    if( arguments.length === 1 ) {
      if( typeof key == 'string' ) return this[0] && this[0].style && this[0].style[key];
      for(var k in key) this.css(k, key[k]);
      return this;
    }
    
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
        
        ocls = ocls.join(' ').trim();
        if( ocls ) this.className = ocls;
        else this.removeAttribute('class');
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
  
  fn.toggleClass = fn.tc = function(cls, bool) {
    if( typeof cls == 'string' ) cls = cls.split(' ');
    if( !isArrayLike(cls) || !cls.length ) return this;
    if( arguments.length >= 2 ) {
      if( bool ) this.ac(cls);
      else this.rc(cls);
      return this;
    }
    
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
  
  fn.append = function(node, index) {
    if( !node && typeof node != 'string' ) return this;
    
    return this.each(function(i) {
      if( !isElement(this) ) return;
      
      var el = this;
      var ref = this.children[index];
      
      if( typeof node == 'function' ) node = node.call(this, i);
      if( isHTML(node) ) node = create(node);
      if( !isArrayLike(node) ) node = [node];
      
      if( ref && ref.nextSibling && el.insertBefore ) {
        [].forEach.call(node, function(node) {
          if( typeof node == 'string' ) node = document.createTextNode(node);
          if( !isNode(node) ) return;
          el.insertBefore(node, ref.nextSibling);
          ref = node;
        });
      } else if( el.appendChild ) {
        [].forEach.call(node, function(node) {
          if( typeof node == 'string' ) node = document.createTextNode(node);
          if( !isNode(node) ) return;
          el.appendChild(node);
        });
      }
    });
  };
  
  fn.appendTo = function(target, index) {
    if( target && typeof target === 'string' ) target = this.$(target);
    
    var $ = this.$;
    return this.each(function() {
      $(target).append(this, index);
    });
  };
  
  fn.insertBefore = function(ref) {
    if( typeof ref == 'string' ) ref = this.$(ref);
    if( !isNode(ref) ) return this;
    
    var parent = ref.parentNode;
    if( !parent ) return this;
    
    return this.each(function() {
      if( parent.insertBefore ) {
        parent.insertBefore(this, ref);
      }
    });
  };
  
  fn.insertAfter = function(ref) {
    if( typeof ref == 'string' ) ref = this.$(ref);
    if( !isNode(ref) ) return this;
    
    var parent = ref.parentNode;
    var sib = ref.nextSibling;
    if( !parent ) return this;
    
    return this.each(function() {
      if( !isNode(this) ) return;
      
      if( !sib ) {
        parent.appendChild(this);
      } else if( parent.insertBefore ) {
        parent.insertBefore(this, sib);
      }
    });
  };
  
  fn.before = function(node) {
    var $ = this.$;
    return this.each(function() {
      $(this).insertBefore(node);
    });
  };
  
  fn.after = function(node) {
    var $ = this.$;
    return this.each(function() {
      $(node).insertAfter(this);
    });
  };
  
  fn.remove = function(node) {
    if( !arguments.length ) return this.each(function() {
      var p = this.parentNode;
      p && p.removeChild(this);
    });
    
    if( !node ) return;
    if( !isArrayLike(node) ) node = [node];
    
    var $ = this.$;
    return this.each(function() {
      if( this.removeChild ) {
        var el = this;
        [].forEach.call(node, function(node) {
          if( typeof node == 'string' ) return $(el).find(node).remove();
          el.removeChild(node);
        });
      }
    });
  };
  
  fn.clone = function(deep) {
    deep = deep === false ? false : true;
    var arr = this.$();
    this.each(function() {
      if( !isNode(this) ) return;
      arr.push(this.cloneNode(deep));
    });
    return arr;
  };
  
  fn.on = function(type, fn, bubble) {
    if( typeof type !== 'string' ) return this;
    type = type.split(' ');
    
    return this.each(function(i, el) {
      el.addEventListener && type.forEach(function(type) {
        el.addEventListener(type, fn, bubble || false);
      });
    });
  };
  
  fn.once = function(type, fn, bubble) {
    var wrapper = function(e) {
      this.removeEventListener(type, wrapper, bubble || false);
      fn.call(this, e);
    };
    
    return this.on(type, wrapper, bubble);
  };
  
  fn.off = function(type, fn, bubble) {
    if( typeof type !== 'string' ) return this;
    type = type.split(' ');
    
    return this.each(function(i, el) {
      el.removeEventListener && type.forEach(function(type) {
        el.removeEventListener(type, fn, bubble || false);
      });
    });
  };
  
  fn.fire = function(type, detail, cancellable, bubbles) {
    if( !(type instanceof Event) ) {
      type = new CustomEvent(type, {
        detail: detail,
        bubbles: !!bubbles,
        cancelable: !!cancellable
      });
    }
    
    var passed = this.$();
    this.each(function(i,el) {
      if( !el.dispatchEvent ) return;
      if( el.dispatchEvent(type) ) passed.push(el);
    });
    
    return passed;
  };
  
  fn.click = function(fn) {
    var isclick;
    if( !arguments.length ) isclick = true;
    
    return this.each(function(i,el) {
      if( isElement(el) ) {
        if( isclick ) el.click();
        else el.onclick = fn;
      }
    });
  };
  
  fn.data = function(key, value) {
    if( !arguments.length ) return this[0]._data;
    
    var data = {};
    if( key && typeof key == 'object' ) data = key;
    else if( key === false ) data = false;
    else if( typeof key != 'string' ) return this;
    else data[key] = value;
    
    return this.each(function(i, el) {
      if( !isNode(el) ) return;
      if( data === false ) {
        delete el._data;
        return;
      }
      
      el._data = el._data || {};
      for( var k in data ) {
        el._data[k] = data[k];
      }
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
      } else {
        arr.add(children);
      }
    });
    return arr;
  };
  
  fn.wrap = function(html) {
    var $ = this.$;
    return this.each(function(i) {
      if( !isNode(this) ) return;
      
      var wrapper = html;
      if( typeof wrapper == 'function' )
        wrapper = wrapper.call(this, i);
      
      if( isHTML(wrapper) )
        wrapper = create(wrapper)[0];
      
      if( !isElement(wrapper) ) return;
      
      var parent = this.parentNode;
      var ref = this.nextSibling;
      wrapper = $(wrapper).append(this);
      
      if( ref ) wrapper.insertBefore(ref);
      else wrapper.appendTo(parent);
    });
  };
  
  fn.unwrap = function(selector) {
    var $ = this.$;
    return this.each(function() {
      if( !isNode(this) ) return;
      
      var p = selector ? $(this).parent(selector)[0] : this.parentNode;
      if( !p ) return;
      if( !p.parentNode ) return p.removeChild(this);
      
      var ref = p.nextSibling;
      if( ref ) p.parentNode.insertBefore(this, ref);
      else p.parentNode.appendChild(this);
      
      if( !p.childNodes.length ) p.parentNode.removeChild(p);
    });
  };
  
  fn.normalize = function() {
    return this.each(function() {
      if( isElement(this) ) this.normalize();
    })
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
  
  fn.has = function(selector) {
    if( !selector ) return false;
    
    var contains = false;
    this.each(function() {
      if( typeof selector == 'string' && this.querySelector && this.querySelector(selector) ) {
        contains = true;
      } else if( this.contains(selector) ) {
        selector = true;
      }
      
      if( contains ) return true;
    });
    return !!contains;
  };
  
  fn.nodes = function() {
    var arr = this.$();
    this.each(function() {
      arr.add(this.childNodes);
    });
    return arr;
  };
  
  fn.src = function(src) {
    return this.each(function() {
      if( 'src' in this ) this.src = src;
    });
  };
  
  fn.position = function(fn) {
    return offset(this[0]);
  };
  
  fn.offset = function(fn) {
    if( !arguments.length ) return offset(this[0], true);
    
    if( typeof fn == 'function' ) return this.each(function(i) {
      fn.call(this, i, offset(this, true));
    });
    
    var top = number(fn.top);
    var left = number(fn.left);
    if( !top && !left ) return this;
    
    return this.each(function() {
      var el = this;
      if( el.style ) {
        var position = computed(el).position;
        if( !position || position == 'static' ) el.style.position = 'relative';
        if( top ) el.style.top = top + 'px';
        if( left ) el.style.left = left + 'px';
      }
    });
  };
  
  fn.show = function() {
    return this.each(function() {
      var el = this;
      if( el.style ) {
        el.style.display = '';
        var display = computed(el).display;
        if( !display || display == 'none' ) el.style.display = 'block';
      }
    });
  };
  
  fn.hide = function() {
    return this.each(function() {
      if( this.style ) {
        this.style.display = 'none';
      }
    });
  };
  
  fn.async = function(iterator, done) {
    return async(this, iterator, done);
  };
};
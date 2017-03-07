var win = window;
var Extensions = function() {}
Extensions.prototype = new Array();
var extensions = new Extensions();

function isArraylike(o) {
  if( !o || ~['number', 'string', 'function'].indexOf(typeof o) || o === win || typeof o.length != 'number' ) return false;
  if( Array.isArray && Array.isArray(o) ) return true;
  return false;
}

var Context = function(document) {
  if( !document ) {
    var cs = (win.currentScript || win._currentScript);
    document = (cs && cs.ownerDocument) || win.document;
  }
  
  var Selection = function(selector, criteria) {
    if( typeof selector == 'string' ) selector = (criteria || document).querySelectorAll(selector);
    
    if( selector ) {
      if( isArraylike(selector) ) {
        var self = this;
        [].forEach.call(selector, function(el) {
          self.push(el);
        });
      } else {
        this.push(selector);
      }
    }
  };
  
  var Selector = function(selector) {
    return new Selection(selector);
  };
  
  Selector.ready = function(fn) {
    if( document.body ) return fn.call(this, $);
    
    document.addEventListener('DOMContentLoaded', function() {
      fn(Selector);
    });
  };
  
  Selector.fn = extensions;
  Selector.isArraylike = isArraylike;
  Selection.prototype = extensions;
  Selection.prototype.document = document;
  Selection.prototype.Selection = Selection;
  Selection.prototype.$ = Selector;
  
  return Selector;
}

Context.fn = extensions;

module.exports = Context;
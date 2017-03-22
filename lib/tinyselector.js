var Context = require('./context.js');

require('./essential.js')(Context);

var def = Context(document);
var lib = module.exports = function(doc) {
  if( doc instanceof Document ) {
    if( doc === document ) return def(doc);
    return doc.__tinyselector__ = doc.__tinyselector__ || Context(doc);
  }
  
  return def.apply(def, arguments);
};

lib.fn = Context.fn;
lib.util = Context.util;
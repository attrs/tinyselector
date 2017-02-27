var Context = require('./context.js');

require('./essential.js')(Context);

var def = Context(document);
module.exports = function(doc) {
  if( doc instanceof Document ) {
    if( doc === document ) return def;
    return doc.__tinyselector__ = doc.__tinyselector__ || Context(doc);
  }
  
  return def.apply(def, arguments);
};
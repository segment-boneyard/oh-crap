var crap = require('..')(__dirname, onerror);

// awesome data
var msg = new Message({
  type: 'track',
  event: 'order complete',
  properties:{
    products: { '0': { sku: 'xxx' } }
  }
});

// cause an error
setTimeout(function(){
  msg.properties.products.forEach(console.log);
}, 250);

// handle the error.
function onerror(err){
  console.error(err.stack);
  setTimeout(function(){
    console.error('exiting');
    process.exit(1);
  }, 1000);
}

// having a construtor makes debugging easier
function Message(obj){
  this.type = obj.type;
  this.event = obj.event;
  this.properties = obj.properties;
}
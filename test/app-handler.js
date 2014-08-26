var crap = require('..')(__dirname, onerror);

process.nextTick(function(){
  throw new Error('oops');
});

function onerror(err){
  console.log('bye!');
  process.exit(1);
}
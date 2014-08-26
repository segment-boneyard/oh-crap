var crap = require('..')(__dirname);

process.nextTick(function(){
  throw new Error('ahh');
});

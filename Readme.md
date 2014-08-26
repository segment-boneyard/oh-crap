
# crap

Dump a heap snapshot upon an uncaught exception. Inspired by [hapijs poop](https://github.com/hapijs/poop).

## Installation

    $ npm install crap

## Usage

This module exports a single function that when called, should be passed the directory where the heap snapshot should be written and also an optional error handler that will be passed the uncaught error after the heap snapshot is written.

It is recommended that you pass the optional error handler so that your application can log, cleanup and exit correctly. Otherwise the default error handler will simply exit the process.

    ```js
    var crap = require('oh-crap')(__dirname, onerror);

    // message instance
    var msg = new Message({
      name: 'yo',
      event: 'order complete',
      properties:{
        products: { '0': { sku: 'xxx' } }
      }
    });

    // cause an error
    setTimeout(function(){
      msg.properties.products.forEach(console.log);
    }, 250);

    // handle the error
    function onerror(err){
      console.error(err.stack);
      setTimeout(function(){
        console.error('exiting');
        process.exit(1);
      }, 1000);
    }

    // constructors make debugging life easier
    function Message(obj){
      this.type = obj.type;
      this.event = obj.event;
      this.properties = obj.properties;
    }
    ```

When running the example above, the uncaught exception `TypeError: Object #<Object> has no method 'forEach'` will be thrown. Since we have the snapshot written at the time of the uncaught exception, we can view the state of V8's heap using Google Chrome's heap profiler to answer the question you might thinking if this were production: *"That's strange, if products isn't an array, I wonder what got assigned to it?"*

![Heap Snapshot Profile](https://i.cloudup.com/SbLcyKu6y5.png)

## License

The MIT License

Copyright &copy; 2014, Segment.io &lt;friends@segment.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


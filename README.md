# NODEJS and something cool

### Test asynchronous in Nodejs (ThreadPool explaination)
1. Thread pool size
- Source code: `thread-pool.js`
- By default, threadpool size of Nodejs is 4. So, in this example we will see when running the code, only 4 function complete at a time.
- But when you change the default size by the command
> process.env.UV_THREADPOOL_SIZE = 5
- Now, you run the code and see the result. Amazing, all of request http commands finish first and after that hash commands also complete (the order is 1-2-3-4-5-6-7-8-9-10-11-12-13)
-> Changing thread pool size to 5 makes your Node process can run with 5 threads at a time.
- The next question is:
> Why all request http complete before hash with 5 threads? See the next section.

2. Nodejs IO
- Here we see all request commands finish first, and then all hash commands complete.
- So why???
- First you need to know how request http in Nodejs work:
    - When you call a request to network io in Nodejs, under the hood it make a call to low level to create a socket which is built-in to serve network io. Here, Nodejs use epoll or kqueue rely on Unix distribution (bring non-blocking network io).
    - Epoll help us not block the thread until data is readable (request completes). It has 2 phases:
        - Phase 1: Create a poll to get status of file descriptor (request status)
        - Phase 2: If data is readable -> execute read data (blocking operation), otherwise return Phase 1.
- Similar, File system io has two phase, first to get file descriptor (file stat) and then read the content of file.
- Return this situation, we can now explain what happens:
    - We has 5 threads in pool, first we run 1-2-3-4-5
    - With threads 1 -> 4, the hash command compute on cpu, suppose it takes ~500ms.
    - With thread 5, it makes a request and then poll to get file descriptors, now the request is incomplete so this thread is available to use.
    - And now in thread pool remain one thread and other request commands continues polling then detach.
    - When all of requests are made and system now are polling to see if response is readable.
    - And a request take ~200ms, so after 200ms we can read data response one by one, and because reading data response takes very little time so you will see all requests complete at a glance.
    - If you increase time in setTimeout in `server.js`, you can see some hash commands finish first.
- That all, you can now change the order of command and see what effects. Happy coding!

3. Macro tasks and micro tasks
- Macro tasks includes: setTimeout, event, ... can think these like phases in event loop
- Micro tasks includes promises in your code, all micro task will be executed before another macro task takes place
-> so no event or network data between microtasks.

4. Nodejs streams
- How stream work?
    - References:
        - https://blog.insiderattack.net/a-visual-guide-to-nodejs-streams-9d2d594a9bf5
        - https://medium.com/autodesk-tlv/streams-in-depth-in-node-js-c8cc7f1eb0d6
        - https://nodejs.org/en/docs/guides/backpressuring-in-streams/
        - https://nodejs.org/api/stream.html#stream_readable_iterator_options
    - [Wiki] Stream is a sequence of data elements made available over time. A stream can be thought of as items on a conveyor belt being processed one at a time rather than in large batches.

    - Flow:

    ```
      ________       ______       ________
     |Provider| ->- |Buffer| ->- |Consumer|
      --------       ------       --------
    ```
    - Buffer here to handle case consumer handles slower than provider, data has to temporarily be stored in buffer.
    - Example in `stream-example-constructor.js` and `stream-example-generator.js`

- Pipelining:
    - source: https://nodejs.org/en/docs/guides/backpressuring-in-streams/#lifecycle-of-pipe
```
                                                     +===================+
                         x-->  Piping functions   +-->   src.pipe(dest)  |
                         x     are set up during     |===================|
                         x     the .pipe method.     |  Event callbacks  |
  +===============+      x                           |-------------------|
  |   Your Data   |      x     They exist outside    | .on('close', cb)  |
  +=======+=======+      x     the data flow, but    | .on('data', cb)   |
          |              x     importantly attach    | .on('drain', cb)  |
          |              x     events, and their     | .on('unpipe', cb) |
+---------v---------+    x     respective callbacks. | .on('error', cb)  |
|  Readable Stream  +----+                           | .on('finish', cb) |
+-^-------^-------^-+    |                           | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Writable Stream  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       |       |                                                 |
  |       ^       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                |    Is this chunk too big?  |
  ^       |       |     emit .end();             |    Is the queue busy?      |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  No  |        |  Yes  |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            when queue is empty     +============+                         |
  ^------------^-----------------------<  Buffering |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Buffer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Buffer^  |                         |
                                       +------------+   add chunk to queue    |
                                       |            <---^---------------------<
                                       +============+
```

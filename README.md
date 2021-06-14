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


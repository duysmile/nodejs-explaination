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

2. Nodejs http module
- Now return the pool size to 4.
- We can change the order and see the different.
- The order now is

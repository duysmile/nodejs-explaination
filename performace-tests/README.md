### Load test Express - MongoDB with 100ccu

Ref: https://kipalog.com/posts/Chuyen-anh-tho-xay-P1--BUILD-a-write-heavy-application

---
#### 1. Setup environment
- My machine:
```
Intel Core i7-9750H - 6cores - 12threads
16GB RAM
```

- Install k6:
```
brew install k6
```

- Run k6 test script:
```
k6 run test-script/<script.js>
```

---
#### 2. Test framework

|#|Scenario|Script|Http time (s)|RPS|avg(ms)|min(ms)|max(ms)|p95(ms)|MongoCPU|
|-|--------|------|-------------|---|-------|-------|-------|-------|--------|
|1|Empty GET|empty_get.js|9.3s|10721|9.26|5.62|47.56|13.48| |
|2|Empty POST|empty_post.js|12.8|7828|12.7|6.81|43.24|16.97| |

- RPS in `Empty POST` is less than in `Empty GET` because of some reasons:
    - Network delay: POST needs to transfer data in body.
    - Parser: when receive data from client, server need to parse this raw data.

- #2 will the highest performance we can reach with any `POST` api, and now we try to do it.

---
#### 3. Test MongoDB

|#|Scenario|Script|Http time (s)|RPS|avg(ms)|min(ms)|max(ms)|p95(ms)|MongoCPU|
|-|--------|------|-------------|---|-------|-------|-------|-------|--------|
|3|Raw insert sync|raw_insert.js|15.1s|6622| | | | |50%|
|5|Raw insert group|raw_insert.js|6.4s|15523| | | | |144%|

- In #3, I use only 1 connection to insert to DB sequentially with native driver and throughput to do this is 6622 rps.
- In #4, I use 100 connection in pool to insert to DB so I see rps increase to 15523 but in exchange Mongo CPU increase to 157%. And now I see when I use async command and number of connection 100 times increase, RPS not increase in this way because of the limitation of CPU processing of library. So that is why `in default mongo driver only need to open 5 connections`. Increase connections pool only works when we have a very slow request.

#### 4. Server for insert messages

|#|Scenario|Script|Http time (s)|Additional time(s)|RPS|avg(ms)|min(ms)|max(ms)|p95(ms)|MongoCPU|
|-|--------|------|-------------|---|-------|-------|-------|-------|--------|
|5|Server insert sync api|insert_sync.js|28.5s| |3505|28.4|13.47|212.91|40.65|43%|
|6|Server insert async api|insert_async.js|21.18|4.3s|4700|21.18|14.6|172.24|30.15|157%|

- When we combine server and insert command, it likes we run #2 and #4 but the result we got is 28.5s and 3505rps. And now I think maybe synchronous is too slow.
- So in #6 I run in async and time decreases to 21.18s but when all requests were responded, server still handled adding to DB. At the same time, MongoDB must handle high load and it's CPU was up to 157%.

#### 5. Something new

|#|Scenario|Script|Http time (s)|Additional time(s)|RPS|avg(ms)|min(ms)|max(ms)|p95(ms)|MongoCPU|
|-|--------|------|-------------|---|-------|-------|-------|-------|--------|
|7|Server insert group api|insert_group.js|14.5s|5.6s|6901|14.41|9.41|75.96|22.45|142%|

- So I try to handle all requests first, after that I handle inserting to DB. This method makes whole process's handling time equal to #2 + #4 (when we run POST requests and insert DB separately).

**Conclusion**:
- Instead of receiving requests and handling insert to DB, we can receive all requests first and then insert to DB. It makes node process can focus CPU usage for handling 1 task, and performance of whole process is significantly improved.
- In Node, when full CPU usage, the faster tasks are processed, more resources will be saved (of course we will sacrifice some memory).


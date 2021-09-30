### Load test Express - MongoDB with 100ccu

---
#### 1. Setup environment
- My machine:
```
Intel Core i7-9750H - 6cores - 12threads
16GB RAM
```

---
#### 2. Test framework

|#|Scenario|Script|Http time (s)|RPS|avg(ms)|min(ms)|max(ms)|p95(ms)|MongoCPU|
|-|--------|------|-------------|---|-------|-------|-------|-------|--------|
|1|Empty GET|empty-get.js|9.3s|10721|9.26|5.62|47.56|13.48| |
|2|Empty POST|empty-post.js|12.8|7828|12.7|6.81|43.24|16.97| |

- RPS in `Empty POST` is less than in `Empty GET` because of some reasons:
    - Network delay: POST needs to transfer data in body.
    - Parser: when receive data from client, server need to parse this raw data.

- #2 will the highest performance we can reach with any `POST` api, and now we try to do it.

---
#### 3. Test MongoDB


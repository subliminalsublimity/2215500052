# 📊 Average Calculator Microservice

A REST API microservice that fetches and maintains a rolling window of numbers from a third-party API and computes the average.

## 🚀 Features

- Endpoint: `/numbers/:numberid` where `numberid` is one of:
  - `p` for prime
  - `f` for Fibonacci
  - `e` for even
  - `r` for random

- Maintains a fixed window of **10** unique numbers
- Discards any third-party API responses that:
  - Take more than **500ms**
  - Contain duplicate values
  - Fail with an error
- Calculates and returns the average of current window



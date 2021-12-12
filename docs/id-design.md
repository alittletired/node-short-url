### 设计思路

1. **发号器**

   发号器需要持久化，选用了 mongodb。$inc 是原子操作，可以确保并发安全

2. **子序列**

   为了降低发号器的压力，采用发号器加本地子序列一起来生成序号，序号 = 发号器序号\*子序列长度 + 当前子序列号。
   从发号器获取到值后，本地先递增本地子序列，当超过子序列长度后，再次获取新的发号器序号。

3. **排它锁**

   nodejs 虽然是单进程，但并发场景仍然会多次请求发号器。需要引入排它锁

4. **缓存**

   适当的使用缓存可以提升系统的吞吐量，在系统中，分别使用了一个读缓存和一个写缓存。

   请求获取短链接的接口，对于热点数据将大大提升性能

   生成短链接的接口，短期内请求两条一样的链接地址，不需要查库就可以直接返回

### 设计实现

#### 生成短域名流程图

[在线文档地址](https://www.processon.com/view/link/61b225167d9c0829fee9c903)

![generate-shorturl.png](./images/generate-shorturl.png)

### 获取长地址流程图

[在线文档地址](https://www.processon.com/view/link/61b220a61e08534ca6dde814)
![generate-shorturl.png](./images/get-origin-url.png)
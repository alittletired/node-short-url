## 短域名服务

### 问题分析

短链是通过某种算法，将比较长的源链接映射成较短的链接。f(源地址)->固定域名 + url 友好的字符串，生成的短链接算法一般有两种 **哈希算法**，**自增 id**

1. 哈希算法

   将源地址通过哈希算法生成唯一散列，如 [MurmurHash](https://github.com/perezd/node-murmurhash)，[nanoid](https://zelark.github.io/nano-id-cc/)。
   好处: 分布均匀，更安全
   缺点: 短链接地址一般较短，哈希算法存在着冲突概率，需要借助查库和[布隆过滤器](https://brilliant.org/wiki/bloom-filter/)等手段来检查，并重新生成 hash。

2. 自增 id
   通过定义 ID 生成器（下文均使用发号器来描述），将数字 id 映射到 url 友好的字符串。
   好处: 设计简单
   缺点: 序号连续，更可预测。需要请求发号器下发 id。

### 设计思路

本项目采用了自增 id 的算法
使用技术栈为 typescript+express,采用了 mongodb,redis 等中间件。以下对项目关键点进行说明

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

##### 表设计

- **Signal** 发号器

  | 字段  | 类型     | 说明       | 索引         |
  | ----- | -------- | ---------- | ------------ |
  | \_id  | objectid | 主键 id    | Primary key  |
  | name  | string   | 发号器名称 | Unique Index |
  | value | number   | 发号器值   |              |

- **UrlMapping** 长短链接映射

  | 字段      | 类型     | 说明    | 索引         |
  | --------- | -------- | ------- | ------------ |
  | \_id      | objectid | 主键 id | Primary key  |
  | originUrl | string   | 源链接  | Index        |
  | shortUrl  | string   | 短链接  | Unique Index |

  ##### 环境变量

  | 名称              | 类型   | 说明                 | 默认值 | 是否必填 |
  | ----------------- | ------ | -------------------- | ------ | -------- |
  | MONGODB_URL       | string | mongdb 链接字符串    |        | 是       |
  | MONGODB_NAME      | string | mongdb 数据库名      |        | 是       |
  | REDIS_URL         | string | redis 链接字符串     |        | 是       |
  | SHORT_URL_SITE    | string | 短链接域名           |        | 是       |
  | PORT              | number | 站点监听端口         | 3000   |          |
  | CACHE_EXPIRE_TIME | number | 缓存失效时间（秒）   | 3600   |          |
  | MAX_PATH_LENGTH   | string | 最大短链接 path 长度 | 8      |          |
  | STEP_SIZE         | number | 子序列长度           | 1000   |          |

#### 生成短域名流程图

[在线文档地址](https://www.processon.com/view/link/61b225167d9c0829fee9c903)

![generate-shorturl.png](./images/generate-shorturl.png)

### 获取源地址流程图

[在线文档地址](https://www.processon.com/view/link/61b220a61e08534ca6dde814)
![generate-shorturl.png](./images/get-origin-url.png)

### 单元测试覆盖率

[详细信息](../coverage/lcov-report/index.html)

![generate-shorturl.png](./images/coverage.png)

### 待完成

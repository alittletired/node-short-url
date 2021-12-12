## 短域名服务

### 问题分析

短链是通过某种算法，将比较长的源链接映射成较短的链接。f(源地址)->固定域名 + url 友好的字符串，生成的短链接算法一般有两种 **哈希算法**，**自增 id**

1. \**哈希算法*8

   将源地址通过哈希算法生成唯一散列，如 [MurmurHash](https://github.com/perezd/node-murmurhash)，[nanoid](https://zelark.github.io/nano-id-cc/)。
   好处: 短链接分布均匀，更安全
   缺点: 短链接地址一般较短，哈希算法存在着冲突概率，当冲突时需要重新生成

2. **自增 id**
   通过定义 ID 生成器（下文均使用发号器来描述），将数字 id 映射到 url 友好的字符串。
   好处: 设计简单
   缺点: 序号连续。需要请求发号器下发 id

本项目对**哈希算法**, **自增 id**均做了实现。

[**哈希算法实现设计**](./hash-design.md)

(**自增 id 实现设计**)(./id-design.md)

### 单元测试覆盖率

[详细信息](../coverage/lcov-report/index.html)

![generate-shorturl.png](./images/coverage.png)

##### 表设计

- **Signal** id 发号器

  当使用 id 算法时使用
  | 字段 | 类型 | 说明 | 索引 |
  | ----- | -------- | ---------- | ------------ |
  | \_id | objectid | 主键 id | Primary key |
  | name | string | 发号器名称 | Unique Index |
  | value | number | 发号器值 | |

- **UrlMapping** 长短链接映射

  | 字段    | 类型   | 说明       | 索引        |
  | ------- | ------ | ---------- | ----------- |
  | \_id    | string | 短链接 key | Primary key |
  | longUrl | string | 长链接     | Index       |

  ##### 环境变量

  | 名称              | 类型                                | 说明                                     | 默认值 | 是否必填 |
  | ----------------- | ----------------------------------- | ---------------------------------------- | ------ | -------- |
  | NODE_ENV          | 'development ｜ production ｜ test' | 当前环境                                 |        | 是       |
  | MONGODB_URL       | string                              | mongdb 链接字符串                        |        | 是       |
  | MONGODB_NAME      | string                              | mongdb 数据库名                          |        | 是       |
  | REDIS_URL         | string                              | redis 链接字符串                         |        | 是       |
  | BASE_DOMAIN       | string                              | 短链接域名                               |        | 是       |
  | PORT              | number                              | 站点监听端口                             | 3000   |          |
  | CACHE_EXPIRE_TIME | number                              | 缓存失效时间（秒）                       | 3600   |          |
  | KEY_LENGTH        | string                              | 最大短链接 path 长度                     | 8      |          |
  | USE_HASH          | string                              | 是否使用 hash 算法，不设置默认为 id 算法 |        |          |
  | STEP_SIZE         | number                              | 子序列长度,自增 id 算法时生效            | 1000   |          |

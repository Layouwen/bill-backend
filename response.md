## Response description

### 200

| statusCode | message        |
| ---------- | -------------- |
| 200        | Success        |
| 101        | 用户名不能为空 |
| 102        | 密码不能为空   |
| 103        | 账号或密码错误 |

### 400

| statusCode | message |
| ---------- | ------- |
| -          | error   |

### 401

| statusCode | message          |
| ---------- | ---------------- |
| 401        | token is require |
| 402        | token error      |
| 403        | Token expired    |

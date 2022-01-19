## Response description

### 200

| statusCode | message                     |
| ---------- | --------------------------- |
| 200        | Success                     |
| 101        | username can not be empty   |
| 102        | password can not be empty   |
| 103        | wrong user name or password |

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

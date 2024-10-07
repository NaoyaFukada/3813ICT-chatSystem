# Usage:

```bash
brew services run mongodb-community
```

1. Install socket.io for frontend

```bash
npm install socket.io-client --save
```

2. Install socket.io related for backend

```bash
npm install express --save
npm install socket.io --save
npm install cors --save
```

3. Install mongoDB

```bash
npm install mongodb
```

Use mongosh on terminal

```bash
use chatApp
db.channels.find();
db.channels.deleteMany({})
```

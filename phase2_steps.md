# Usage:

```bash
brew services run mongodb-community
brew services stop mongodb-community
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
npm install formidable
```

3. Install mongoDB

```bash
npm install mongodb
```

Use mongosh on terminal

```bash
mongosh
use chatApp
db.channels.find();
db.testChannels.find();
db.chatHistory.find();
db.channels.deleteMany({})
```

For chat

```bash
npm install peer --save
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```

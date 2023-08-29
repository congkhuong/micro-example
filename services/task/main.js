require('./connection');
const express = require('express');
const app = express();

app.use(express.json());
const restPort = 5002;

app.use((req, res, next) => {
    console.log(123);
    next();
});
app.use(require('./routes'));



app.listen(restPort, () => {
  console.log(`Task service API is listening on port ${restPort}`)
});

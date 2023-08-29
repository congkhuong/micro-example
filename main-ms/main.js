const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');

// const { createProxyMiddleware } = require('http-proxy-middleware');
// const tasksProxy = createProxyMiddleware('/tasks', {
//   target: 'http://127.0.0.1:5002',
//   changeOrigin: true,
//   pathRewrite: {
//     [`^/tasks`]: '/tasks',
//   },
//   logger: console,
//   on: {
//     proxyReq: (proxyReq, req, res) => {
//       console.log('res', res);

//       /* handle proxyReq */
//     },
//     proxyRes: (proxyRes, req, res) => {
//       console.log('res', res);

//       /* handle proxyRes */
//     },
//     error: (err, req, res) => {
//       console.log('err', err);
//       /* handle error */
//     },
//   }
// });

const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, '../protos/recipes.proto'));
const recipesProto = grpc.loadPackageDefinition(packageDefinitionReci);
const recipesStub = new recipesProto.Recipes('0.0.0.0:50051', grpc.credentials.createInsecure());

const packageDefinitionProc = protoLoader.loadSync(path.join(__dirname, '../protos/processing.proto'));
const processingProto = grpc.loadPackageDefinition(packageDefinitionProc);
const processingStub = new processingProto.Processing('0.0.0.0:50052', grpc.credentials.createInsecure());
     

const app = express();

const proxy = require('express-http-proxy');

app.use(proxy('http://localhost', {
  port: 5002
}));

// app.use('/tasks', proxy('http://localhost:5002/tasks'));

// app.use('/tasks/', proxy('http://localhost:5001/tasks'));
// app.use('/tasks/', proxy(function () {
//   return 'http://localhost'; 
// }, { port: 5001 }));

app.use(express.json());

const restPort = 5001;
let orders = {};

function processAsync(order) {
    recipesStub.find({ id: order.productId }, (err, recipe) => {
        if(err) return;

        orders[order.id].recipe = recipe;
        const call = processingStub.process({
            orderId: order.id,
            recipeId: recipe.id
        });
        call.on('data', (statusUpdate) => {
            orders[order.id].status = statusUpdate.status;
        });
    });
}

app.post('/orders', (req, res) => {
    if(!req.body.productId) {
        res.status(400).send('Product identifier is not set');
        return;
    }
    let orderId = Object.keys(orders).length + 1;
    let order = {
        id: orderId,
        status: 0,
        productId: req.body.productId,
        createdAt : new Date().toLocaleString()
    };
    orders[order.id] = order;
    processAsync(order);
    res.send(order);
});

app.get('/orders/:id', (req, res) => {
    if(!req.params.id || !orders[req.params.id]) {
        res.status(400).send('Order not found');

        return;
    }
    res.send(orders[req.params.id]);
});

app.use(require('../services/auth/routes'));
// app.use('/tasks', tasksProxy);


app.listen(restPort, () => {
  console.log(`API gateway is listening on port ${restPort}`)
});

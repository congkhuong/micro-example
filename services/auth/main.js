const path = require('path');
const grpc = require('@grpc/grpc-js');
const jwt = require('jsonwebtoken');

const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../../protos/auth.proto'));
const authProto = grpc.loadPackageDefinition(packageDefinition);

const secretKey = 'secret';

function IntrospectToken(call, callback) {
  const token = call.request.token;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      callback({
        message: 'Validation is failed',
        code: grpc.status.INVALID_ARGUMENT
      });
    }

    callback(null, {
      userId: decoded.id
    });
  });
}

// const server = new grpc.Server();
function getServer() {
  var server = new grpc.Server();
  server.addService(authProto.Auth.service, {
    IntrospectToken,
  });

  return server;
}

const server = getServer();

// server.addService(taskProto.Recipes.service, { 
//   IntrospectToken,
// });
server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

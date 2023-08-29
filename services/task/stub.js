const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

const packageDefinitionAuth = protoLoader.loadSync(path.join(__dirname, '../../protos/auth.proto'));
const authProto = grpc.loadPackageDefinition(packageDefinitionAuth);
const authStub = new authProto.Auth('0.0.0.0:50053', grpc.credentials.createInsecure());

module.exports = {
  authStub
}

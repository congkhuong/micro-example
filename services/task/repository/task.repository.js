
const dataSource = require('../connection');
const Task = require('../entity/task');

const taskRepo = dataSource.getRepository(Task);

module.exports = taskRepo;

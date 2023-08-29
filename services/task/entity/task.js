const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Task", // Will use table name `category` as default behaviour.
  tableName: "task", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: 'int',
      require: true,
      generated: 'increment',
    },
    user_id: {
      type: 'int',
    },
    name: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
  },
})

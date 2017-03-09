exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('assessments', (t) => {
      t.increments();
      t.string('conversation_id');
      t.json('assessment');
      t.timestamps();
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('assessments')
  ])
};

module.exports = function(app) {
  var todoList = require('../controllers/todoListController');

  app.route('/')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

};

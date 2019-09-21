require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5d83dc96f66479b9569e948c')
//   .then(task => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then(tasks => console.log(tasks))
//   .catch(error => console.log(error));

const deleteTaskAndCount = async (id, completed) => {
  const deletedTask = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed });

  return count;
};

deleteTaskAndCount('5d83f256bab4e1c1948f924b', false)
  .then(tasks => console.log(tasks))
  .catch(error => console.log(error));

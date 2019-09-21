require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5d84f2792b1634da57ee023c', { age: 27 })
//   .then(user => {
//     console.log(user);
//     return User.countDocuments({ age: 27 });
//   })
//   .then(count => console.log(count))
//   .catch(error => console.log(error));

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {
    age
  });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount('5d84f2792b1634da57ee023c', 26)
  .then(result => console.log(result))
  .catch(error => console.log(error));

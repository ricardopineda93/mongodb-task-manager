// CRUD Operations

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) return console.log('Unable to connect to db!');

    const db = client.db(databaseName);

    // CREATE
    //   db.collection('users').insertOne(
    //     {
    //       _id: id,
    //       name: 'Vanessa',
    //       age: 33
    //     },
    //     (error, result) => {
    //       if (error) return console.log('Unable to insert user.');

    //       console.log(result.ops);
    //     }
    //   );
    // }

    // db.collection('tasks').insertMany(
    //   [
    //     { description: 'Finish this challenge', completed: true },
    //     { description: 'Go back and press play', completed: false },
    //     { description: 'Go to the gym', completed: false }
    //   ],
    //   (error, result) => {
    //     if (error) return console.log('Could not add tasks.');
    //     console.log(result.ops);
    //   }
    // );

    // READ
    // db.collection('users').findOne(
    //   { _id: new ObjectID('5d83a433a5b867a36b63a93d') },
    //   (error, user) => {
    //     if (error || user === null) return console.log("Couldn't find user!");
    //     console.log(user);
    //   }
    // );

    // db.collection('users')
    //   .find({ age: 26 })
    //   .toArray((error, users) => {
    //     if (error || users === null) return console.log("Couldn't find users!");
    //     console.log(users);
    //   });

    // UPDATE
    // db.collection('users')
    //   .updateOne(
    //     { _id: new ObjectID('5d83a6bb7fab9ea49140adac') },
    //     {
    //       $inc: {
    //         age: 1
    //       }
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    // db.collection('tasks')
    //   .updateMany(
    //     { completed: false },
    //     {
    //       $set: {
    //         completed: true
    //       }
    //     }
    //   )
    //   .then(result => console.log(result.modifiedCount))
    //   .catch(error => console.log(error));

    // DELETE

    // db.collection('users')
    //   .deleteMany({ age: 26 })
    //   .then(result => console.log(result.deletedCount))
    // 	.catch(error => console.log(error));

  //   db.collection('tasks')
  //     .deleteOne({ description: 'Finish this challenge' })
  //     .then(result => console.log(result.result))
  //     .catch(error => console.log(error));
  // }
);

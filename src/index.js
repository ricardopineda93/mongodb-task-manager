const express = require('express');
require('./db/mongoose'); // Requiring like this ensure this file runs

const app = express();
const PORT = process.env.PORT;

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

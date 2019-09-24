const express = require('express');
require('./db/mongoose'); // Requiring like this ensure this file runs

const app = express();

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

module.exports = app;

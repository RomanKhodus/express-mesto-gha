const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { REG_EXP_URL } = require('./utils/constants');
const NotFoundError = require('./errors/not-found-errors');

process.on('uncaughtException', (err, origin) => {
  console.log(
    `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  );
});

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REG_EXP_URL),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth);

app.use('/', routerUsers);

app.use('/', routerCards);

app.use(errors()); // Обработчик ошибок celebrate

// Обработчик несуществующих роутов
app.use('/', (req, res, next) => {
  next(new NotFoundError('Сервер не может найти запрошенный ресурс'));
});

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});

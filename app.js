const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const process = require("process");
const { celebrate, Joi } = require("celebrate");
const { errors } = require("celebrate");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

process.on("uncaughtException", (err, origin) => {
  console.log(
    `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  );
});

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }),
}), auth);

app.use("/", routerUsers);

app.use("/", routerCards);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});
app.use((req, res) => {
  res.status(500).send("сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос");
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});

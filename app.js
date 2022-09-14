const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const process = require("process");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");

process.on("uncaughtException", (err, origin) => {
  console.log(
    `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  );
});

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: "63193fb8b501026749c32f77",
  };

  next();
});

app.use(bodyParser.json());
app.use("/", routerUsers);
app.use("/", routerCards);
app.use("/", (req, res) => {
  res.status(404).send({ message: "Сервер не может найти запрошенный ресурс" });
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});

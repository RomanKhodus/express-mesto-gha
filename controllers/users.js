const User = require("../models/user");
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require("../app");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err === "ValidationError") {
        res.status(ERROR_CODE_400).send({ message: "Некорректные данные" });
      } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_404).send().send({ message: "Сервер не может найти запрошенный ресурс" });
      } else res.status(200).send({ message: user });
    })
    .catch((err) => {
      if (err === "CastError") {
        res.status(ERROR_CODE_400).send({ message: "Некорректные данные" });
      } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

module.exports.setProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err === "ValidationError") {
        res.status(ERROR_CODE_400).send({ message: "Некорректные данные" });
      } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

module.exports.setAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err === "ValidationError") {
        res.status(ERROR_CODE_400).send({ message: "Некорректные данные" });
      } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

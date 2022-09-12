const card = require("../models/card");
const User = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(404).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((users) => res.send(users))
    .catch((err) => res.status(404).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => res.status(400).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  card
    .findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => res.status(400).send({ message: `Произошла ошибка: ${err.message}` }));
};

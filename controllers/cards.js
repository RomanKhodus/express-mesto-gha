const Card = require("../models/card");
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require("../app");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err === "ValidationError") {
        res.status(ERROR_CODE_400).send({ message: "Некорректные данные" });
      } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((data) => res.status(200).send({ data }))
    .catch((err) => {
      if (err === "CastError") {
        res.status(ERROR_CODE_400).send({ message: "Сервер не может найти запрошенный ресурс" });
      } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((user) => {
    if (!user) {
      res.status(ERROR_CODE_404).send().send({ message: "Сервер не может найти запрошенный ресурс" });
    } else res.status(200).send({ message: user });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      res.status(ERROR_CODE_400).send({ message: "Невалидный id" });
    } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((user) => {
    if (!user) {
      res.status(ERROR_CODE_404).send().send({ message: "Сервер не может найти запрошенный ресурс" });
    } else res.status(200).send({ message: user });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      res.status(ERROR_CODE_400).send({ message: "Невалидный id" });
    } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
  });

const Card = require("../models/card");
const ForbiddenError = require("../errors/forbidden-errors");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-errors");
const { ERROR_CODE_500 } = require("../utils/constants");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("некорректные данные"));
      } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" }));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("такой карточки нет");
      }
      if (card.owner.toString() !== ownerId) {
        throw new ForbiddenError();
      }
      return res.status(200).send({ data: card, message: "карточа успешно удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("некорректные данные"));
        return;
      }
      next((err));
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError("такой карточки нет");
    } else res.status(200).send({ message: card });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      next(new BadRequestError("некорректные данные"));
    } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((user) => {
    if (!user) {
      throw new NotFoundError("такой карточки нет");
    } else res.status(200).send({ message: user });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      next(new BadRequestError("некорректные данные"));
    } else res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
  });

const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-errors');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-errors');
const InternalServerError = require('../errors/Internal-server-errors');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('некорректные данные'));
      }
      return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.status(200).send(cards))
    .catch(() => next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос')));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('такой карточки нет'));
      }
      if (card.owner.toString() !== ownerId) {
        return next(new ForbiddenError('недостаточно прав'));
      }
      return Card.findByIdAndDelete(cardId)
        .then((data) => {
          res.status(200).send({ data, message: 'карточа успешно удалена' });
        })
        .catch(() => {
          next(new InternalServerError());
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('некорректные данные'));
      }
      return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('такой карточки нет'));
    }
    return res.status(200).send({ message: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('некорректные данные'));
    }
    return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('такой карточки нет'));
    }
    return res.status(200).send({ message: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('некорректные данные'));
    }
    return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
  });

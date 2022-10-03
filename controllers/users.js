const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-errors');
const UnauthorizedError = require('../errors/unauthorized-errors');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/Internal-server-errors');
const ConflictError = require('../errors/сonflict-errors');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Не авторизованный пользователь'));
    });
};

module.exports.getProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.status(200).send({ message: user });
    })
    .catch(() => {
      next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(200).send(user.toObject()))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Такой пользователь уже существует'));
        }
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Некорректные данные'));
        }
        return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
      });
  });
};

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch(() => next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос')));
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
    });
};

module.exports.setProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
    });
};

module.exports.setAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(new InternalServerError('Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос'));
    });
};

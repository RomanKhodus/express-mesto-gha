const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-errors");
const UnauthorizedError = require("../errors/unauthorized-errors");
const ForbiddenError = require("../errors/forbidden-errors");
const BadRequestError = require("../errors/bad-request-error");
const { ERROR_CODE_500 } = require("../utils/constants");

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Некорректные данные"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Не авторизованный пользователь"));
    });
};

module.exports.getProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      return res.status(200).send({ message: user });
    })
    .catch((err) => {
      next((err));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(req.body.email)) {
    return next(new BadRequestError("Некорректные данные"));
  }
  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(200).send({ data: user }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ForbiddenError("Такой пользователь уже существует"));
        }
        if (err.name === "ValidationError") {
          next(new BadRequestError("Некорректные данные"));
        }
        return res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
      });
  });
};

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" }));
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Некорректные данные"));
      }
      return next(err);
    });
};

module.exports.setProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные"));
      }
      return res.status(ERROR_CODE_500).send({ message: "Сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос" });
    });
};

module.exports.setAvatar = (req, res, next) => {
  const regexp = /^(https?:\/\/)?([\w].+)\.([a-z]{2,6}\.?)(\/[\w].*)*\/?$/;

  const userId = req.user._id;
  const { avatar } = req.body;
  if (!regexp.test(req.body.avatar)) {
    throw new BadRequestError("Некорректные данные");
  }
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Некорректные данные"));
      }
      return res.status(500).send("ошибка");
    });
};

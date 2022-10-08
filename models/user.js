const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
// const { REG_EXP_URL } = require('../utils/constants'); // Регулярное выражение для проверки URL

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'некорректные данные Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'некорректные данные',
    },
  },
}, {
  toObject: {
    useProjection: true,
    versionKey: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

// Проверка поля avatar c помощью регулярки
// userSchema.path('avatar').validate((val) => {
//   const linkRegex = REG_EXP_URL;
//   return linkRegex.test(val);
// }, 'Не корректные данные');

module.exports = mongoose.model('user', userSchema);

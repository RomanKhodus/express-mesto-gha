const mongoose = require('mongoose');
const validator = require('validator');
// const { REG_EXP_URL } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'некорректные данные',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Проверка ссылки на валидность с помощью регулярки
// cardSchema.path('link').validate((val) => {
//   REG_EXP_URL.test(val);
// }, 'Неправильная ссылка');

module.exports = mongoose.model('card', cardSchema);

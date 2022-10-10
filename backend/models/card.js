const mongoose = require('mongoose');

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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: Array,
    likesBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.path('link').validate((val) => {
  const linkRegex = /^(https?:\/\/)?([\w].+)\.([a-z]{2,6}\.?)(\/[\w].*)*\/?$/;
  return linkRegex.test(val);
}, 'Неправильная ссылка');

module.exports = mongoose.model('card', cardSchema);

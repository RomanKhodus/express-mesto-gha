const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REG_EXP_URL } = require('../utils/constants');

const {
  getProfile,
  getUsers,
  getUserById,
  setProfile,
  setAvatar,
} = require('../controllers/users');

router.get('/users/me', getProfile);

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), setProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REG_EXP_URL),
  }),
}), setAvatar);

module.exports = router;

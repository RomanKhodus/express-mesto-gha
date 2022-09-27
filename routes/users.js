const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getProfile,
  getUsers,
  getUserById,
  setProfile,
  setAvatar,
} = require("../controllers/users");

router.get("/users/me", getProfile);

router.get("/users", getUsers);

router.get("/users/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch("/users/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), setProfile);

router.patch("/users/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), setAvatar);

module.exports = router;

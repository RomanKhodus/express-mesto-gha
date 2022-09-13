const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserById,
  setProfile,
  setAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);

router.post("/users", createUser);

router.patch("/users/me", setProfile);
router.patch("/users/me/avatar", setAvatar);

module.exports = router;

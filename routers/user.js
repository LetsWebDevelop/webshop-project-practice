const { Router } = require("express");
const User = require("../models").user;
const bcrypt = require("bcrypt");

const router = new Router();

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.send(allUsers);
  } catch (error) {
    next(error);
  }
});

// router.get("/me", async (req, res, next) => {
//   try {
//     const me = req.params.me;
//     const user = await User.findByPk({ userId: me });
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/new", async (req, res, next) => {
  try {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !phone || !address || !password) {
      res.status(400).send("Must provide correct parameters");
    } else {
      const newUser = await User.create({
        name,
        email,
        phone,
        address,
        password: bcrypt.hashSync(password, 10),
      });
      res.send(newUser);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

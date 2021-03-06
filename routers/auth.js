const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const User = require("../models").user;

const router = new Router();

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Please supply a valid email and password");
    } else {
      // 1. look for the user by email
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        res.status(400).send({
          message: "User with that email does not exist",
        });
      }
      // 2. use bcrypt.compareSync to check the password against the stored hash
      else if (bcrypt.compareSync(password, user.password)) {
        // 3. if the password is correct, return a JWT with the userId of the user (user.id)
        const jwt = toJWT({ userId: user.id });
        res.send({
          jwt,
        });
      } else {
        res.status(400).send({
          message: "Password was incorrect",
        });
      }
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;

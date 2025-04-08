const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sign up successfull
 */
// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashpassword = bcrypt.hashSync(password); // hash the password
    const user = new User({ email, username, password: hashpassword });
    await user.save().then(() =>
      res.status(200).json({ message: "Sign up successfull" })
    );
  } catch (error) {
    res.status(400).json({ message: "User already exist" });
  }
});
/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in with token
 */
// Login route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Please sign up" });

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Password invalid" });

    // generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password, ...others } = user._doc; // exclude password
    res.status(200).json({ token, user: others });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});
module.exports = router;

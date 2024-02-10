import express from "express";
import { connectToDb } from "./utils/db";
import User from "./models/User";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createToken, validateToken } from "./JWT";
import { logger } from "./utils/logger";

const app = express();
const port = 8081;
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res, next) => {
  const { email, password } = await req.body;
  const user = await User.findOne({ email })
    .then((user) => user)
    .catch((err) => next(err));
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({
      email: email,
      password: hashedPassword,
    })
      .then(() => {
        return res.status(201).json("Registered successfully.");
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return res.status(400).json("User already exist.");
  }
});
app.post("/login", async (req, res, next) => {
  let userPasswordInDb = "";
  const reqBodyLength = Object.keys(req.body).length;

  if (reqBodyLength > 0) {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
      .then((user) => user)
      .catch((err) => {
        next(err);
      });

    if (user) {
      userPasswordInDb = user.password;
    }
    const passwordMatchesHash = await bcrypt
      .compare(password, userPasswordInDb)
      .then((match) => match)
      .catch((err) => {
        next(err);
      });
    if (user && passwordMatchesHash) {
      const accessToken = createToken(user);
      const maxAge = 30 * 24 * 60 * 60 * 1000;
      return res
        .cookie("access-token", accessToken, {
          maxAge: maxAge,
          expires: new Date(Date.now() + maxAge),
          httpOnly: true,
        })
        .status(200)
        .json("Logged in successfully.");
    } else {
      return res
        .status(400)
        .json("Please provide a valid email address and password.");
    }
  } else {
    return res.status(400).json("Request body connot be empty.");
  }
});
app.get("/profile", validateToken, (req, res) => {
  res.json("Profile");
});
app.get("/", (req, res) => {
  return res.status(200).json("Welcome to my user authentication app.");
});

connectToDb().then(() => {
  app.listen(port, () => {
    // console.log("accessToken: ", createToken("djamal"));
    logger.debug(`Server listening at http://localhost:${port}`);
  });
});

import express from "express";
import { connectToDb } from "./utils/db";
import User from "./models/User";
import bcrypt from "bcrypt";

const app = express();
const port = 8081;
app.use(express.json());

app.post("/register", async (req, res) => {
  const { email, password } = await req.body;
  const userExist = await User.findOne({ email });
  //   res.json(userExist);
  if (userExist) {
    res.status(400).json("User already exist.");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({
      email: email,
      password: hashedPassword,
    })
      .then(() => res.status(201).json("Registered successfully."))
      .catch((err) => res.status(400).json({ error: err }));
  }
});
11;
app.post("/login", async (req, res) => {
  let userPasswordInDb = "";
  if (req.body) {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      userPasswordInDb = userExist.password;
    }
    const passwordMatchesHash = await bcrypt.compare(
      password,
      userPasswordInDb
    );
    if (userExist && passwordMatchesHash) {
      res.status(200).json("Logged in successfully.");
    } else {
      res
        .status(404)
        .json("Please provide a valid email address and password.");
    }
  } else {
    res.status(400).json("Request body connot be empty.");
  }
});
app.get("/pofile", (req, res) => {
  res.json("Profile");
});
app.get("/", (req, res) => {
  res.status(200).json("Welcome to my user authentication app.");
});

connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});

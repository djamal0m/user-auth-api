import { sign, verify } from "jsonwebtoken";

const createToken = (user) => {
  const payload = { userName: user.email, userId: user._id };
  const accessToken = sign(payload, process.env.SECRCET_KEY);
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken)
    return res.status(400).json({ error: "User not authenticated." });
  try {
    const validToken = verify(accessToken, process.env.SECRCET_KEY);
    if (validToken) {
      req.authenticated = true;
    }
    return next();
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

export { createToken, validateToken };

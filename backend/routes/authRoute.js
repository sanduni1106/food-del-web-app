import express from 'express';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

// In-memory storage for refresh tokens (use a database in production)
let refreshTokens = [];

authRouter.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ message: 'Refresh Token not found, login again' });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Refresh Token' });

    const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  });
});

// Route to login and get tokens (example)
authRouter.post('/login', (req, res) => {
  const { username } = req.body;
  const user = { username };

  const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

export default authRouter;
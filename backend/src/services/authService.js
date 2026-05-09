const jwt = require('jsonwebtoken');
const { User } = require('../models/mysql');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
  }

  async register(userData) {
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create({
      username: userData.username,
      email: userData.email,
      password_hash: userData.password,
      role: userData.role || 'customer',
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number
    });

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email, is_active: true } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    await user.update({ last_login: new Date() });

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token,
      refreshToken
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.user_id);

      if (!user || !user.is_active) {
        throw new Error('User not found');
      }

      const newToken = this.generateToken(user);
      return { token: newToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new AuthService();

// Made with Bob

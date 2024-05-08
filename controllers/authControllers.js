const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const generateToken = require("../utils/generateToken");
const dotenv=require("dotenv");
const sendMail = require("../utils/sendMail");
dotenv.config();

exports.getAll = async = (req, res) => {
  try {
    res.send("hello Welcome")
  } catch (error) {
    res.json("Not Found!!")
  }
}

// signup
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ error: 'Email already exists' }); 
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });

    sendMail(newUser._id,newUser.email);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// sign in
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!validUser.verified) {
      return res.status(400).json({ message: 'Please verify your email. check your E-mail for verification link.' });
    }

    // check verified is true 
    const validatePassword = bcrypt.compareSync(password, validUser.password);
    if (!validatePassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    generateToken(res, validUser._id);
    const { password: hashedPassword, ...rest } = validUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// E-maii verification

exports.mailVerification = async (req, res) => {
  try {
    const { _id } = req.body;
    const validUser = await User.findOne({ _id, verified: true });
    if (validUser) {
      return res.status(404).json({ message: 'User already signed up this link is expired' });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    await res.clearCookie('token').status(200).json('Signout success!');
  } catch (error) {
    console.error('Error occurred during logout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
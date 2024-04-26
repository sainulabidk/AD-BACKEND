const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const generateToken = require("../utils/generateToken");

exports.getAll = async = (req,res)=>{
    try {
        res.send("hello Welcome")
    } catch (error) {
        res.json("Not Found!!")
    }
}

// signup
exports.signup = async (req, res) => {
    const { firstName,lastName, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email }); 
      if (existingUser) {
        return res.status(404).json({ error: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ firstName,lastName, email, password: hashedPassword });
  
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
  
  // logout

  exports.logout = (req, res) => {
    try {
      res.clearCookie('token').status(200).json('Signout success!');
    } catch (error) {
      console.error('Error occurred during logout:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  
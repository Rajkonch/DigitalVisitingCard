
const User = require('./model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
exports.register = async (req, res) => {
  console.log(req.body);
  const { name, email, password, mobile, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if(userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, mobile, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch(err) {
    console.log(err); // 👈 ADD THIS
  res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(user && (await user.matchPassword(password))) {
      if (user.permission_active === 0) {
        return res.status(403).json({ message: 'please contact to our Admin IT Department Rajkumar 6387718208' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        permission_active: user.permission_active,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/getUser', protect, getUser);
router.get('/getLoginStatus', getLoginStatus);
router.patch('/updateUser', protect, updateUser);
router.patch('/updatePhoto', protect, updatePhoto);

module.exports = router;

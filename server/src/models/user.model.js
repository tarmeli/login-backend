const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function hashPassword(next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    user.passwordConf = hash;
    next();
    return null;
  });
});

const User = mongoose.model('User', UserSchema);

UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return callback(err);
    } if (!user) {
      const userErr = new Error('User not found.');
      userErr.status = 401;
      return callback(userErr);
    }
    bcrypt.compare(password, user.password, (result) => {
      if (result === true) {
        return callback(null, user);
      }
      return callback();
    });
    return null;
  });
};

module.exports = User;

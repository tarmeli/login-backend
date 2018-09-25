/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const User = require('../models/user.model');

const createUser = (req, res) => {
  console.log(req.body);

  if (!req.body.userName) {
    res.status(400).send({ message: 'User must have a userName' });
  } else if (!req.body.email) {
    res.status(400).send({ message: 'User must have a email' });
  } else if (!req.body.password) {
    res.status(400).send({ message: 'User must have a password' });
  } else if (req.body.password !== req.body.passwordConf) {
    res.status(400).send({ message: 'passwords do not match' });
  }

  const userData = {
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
    passwordConf: req.body.passwordConf,
  };

  User.create(userData, (err) => {
    console.log(err);
    if (err) {
      res
        .status(500)
        .send({ message: 'something went wrong in creating a user' });
    } else {
      return res.redirect('/profile');
    }
    return null;
  });
};

const loginUser = (req, res) => {
  const { password, email } = req.body;
  console.log(email, 'tried to log in');

  if (email && password) {
    console.log('user', User);
    User.authenticate(email, password, (error, user) => {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return null;
      }
      req.session.userId = user._id;
      return res.redirect('/profile');
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return null;
  }
  return null;
};

const logoutUser = (req, res) => {
  res.send('logout');
};

const findAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      res
        .status(500)
        .send({ message: 'Some error occured while retrieving users' });
    } else {
      res.send(users);
    }
    return null;
  });
};

const findOneUser = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `User not found with id ${req.params.userId}`,
        });
      }

      return res.status(500).send({
        message: `Error retrieving user with id ${req.params.userId}`,
      });
    }

    if (!user) {
      return res
        .status(404)
        .send({ message: `User not found with id ${req.params.userId}` });
    }

    res.send(user);
    return null;
  });
};

const updateUser = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `User not found with id ${req.params.userId}`,
        });
      }

      return res.status(500).send({
        message: `Error retrieving user with id ${req.params.userId}`,
      });
    }
    if (!user) {
      return res
        .status(404)
        .send({ message: `User not found with id ${req.params.userId}` });
    }

    user.save(() => {
      if (err) {
        res.status(500).send({
          message: `Could not update user with id ${req.params.userId}`,
        });
      } else {
        User.find((users) => {
          if (err) {
            res
              .status(500)
              .send({ message: 'Some error occured while retrieving users' });
          } else {
            res.send(users);
          }
          return null;
        });
      }
    });
    return null;
  });
};

const deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.userId, (err, user) => {
    if (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `User not found with id ${req.params.userId}`,
        });
      }

      return res.status(500).send({
        message: `Error retrieving user with id ${req.params.userId}`,
      });
    }
    if (!user) {
      return res
        .status(404)
        .send({ message: `User not found with id ${req.params.userId}` });
    }

    User.find((users) => {
      if (err) {
        res
          .status(500)
          .send({ message: 'Some error occured while retrieving users' });
      } else {
        res.send(users);
      }
      return null;
    });
    return null;
  });
};

module.exports = {
  createUser,
  findAllUsers,
  findOneUser,
  deleteUser,
  updateUser,
  loginUser,
  logoutUser,
};

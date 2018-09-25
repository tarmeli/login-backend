const {
  createUser,
  findAllUsers,
  findOneUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} = require('../controllers/user.controller');

const UserRoutes = (app) => {
  app.post('/register', (req, res) => {
    createUser(req, res);
  });

  app.post('/login', (req, res) => {
    loginUser(req, res);
  });

  app.post('/logout', (req, res) => {
    logoutUser(req, res);
  });

  app.get('/profile', (req, res) => {
    res.send('GET Profile');
  });

  app.get('/users', (req, res) => {
    findAllUsers(req, res);
  });

  app.get('/user/:userId', (req, res) => {
    findOneUser(req, res);
  });

  app.put('/update/:userId', (req, res) => {
    updateUser(req, res);
  });

  app.delete('/delete/:userId', (req, res) => {
    deleteUser(req, res);
  });
};

module.exports = UserRoutes;

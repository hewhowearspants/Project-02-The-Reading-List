const express = require('express');
const userRoutes = express.Router();
const usersController = require('../controllers/users-controller');
const authHelpers = require('../services/auth/auth-helpers');

userRoutes.get('/', authHelpers.loginRequired, usersController.index);
userRoutes.get('/edit', authHelpers.loginRequired, usersController.edit);

userRoutes.put('/', authHelpers.loginRequired, usersController.update);
userRoutes.put('/change-password', authHelpers.loginRequired, usersController.updatePassword);

module.exports = userRoutes;
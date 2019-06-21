var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post('/create', function(req, res) {
  User
    .create({
      username: req.body.user.username,
      password: bcrypt.hashSync(req.body.user.password, 10)
    }).then(
      function success(user) {
        var token = jwt.sign({id: req.body.user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
        res.json({
          user: user,
          message: 'created',
          sessionToken: token
        });
      },
      function error(err) {
        res.send(500, err.message);
      }
    );
});

router.post('/login', function(req, res) {
  User.findOne({where: {username: req.body.user.username}}).then(
    (user) => {
      if (user) {
        bcrypt.compare(req.body.user.password, user.password, (err, matches) => {
          if (matches) {
            var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
            res.json({
              user: req.body.user,
              message: 'logged in',
              sessionToken: token
            });
          } else {
            res.status(500).send({error: 'failed to authenticate nerd'});
          }
        });
      } else {
        res.status(500).send({error: 'failed to authenticate'});
      }
    },
    (err) => {
      res.status(501).send({error: 'could not log in'});
    }
  );
});

module.exports = router;
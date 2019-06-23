var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Animal = sequelize.import('../models/animal');

router.post('/create', (req, res) => {
  Animal
    .create({
      name: req.body.animal.name,
      legNumber: req.body.animal.legNumber,
      predator: req.body.animal.predator
    }).then(
      function success(animal) {
        res.json({
          animal: animal,
          message: 'animal created'
        });
      },
      function error(err) {
        res.status(500).send(err.message);
      }
    );
});

router.delete('/delete/:id', (req, res) => {
  Animal
    .destroy({where: {id: req.params.id}}).then(
      function success(data) {
        res.send('animal successfully removed');
      },
      function error(err) {
        res.send(500, err.message);
      }
    )
});

router.put('/update/:id', (req, res) => {
  Animal
    .update({
      name: req.body.animal.name,
      legNumber: req.body.animal.legNumber,
      predator: req.body.animal.predator
    },
    {where: {id: req.params.id}}).then(
      (animal) => {
        res.json({
          animal: animal,
          message: 'animal updated!'
        });
      },
      (err) => {
        res.status(500).send(err.message);
      }
    )
});

module.exports = router;
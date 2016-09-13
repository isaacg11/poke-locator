// import modules
import express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// Model
let Pokemon = mongoose.model('Pokemon', {
	name: String,
  level: Number,
	location: Object,
	date: Date,
  trainer: String
});

// POST - add new pokemon sighting
router.post('/pokemon', function(req, res) {

  let newPokemon = new Pokemon({
    name: req.body.name,
    level: req.body.level,
  	location: req.body.location,
  	date: req.body.date,
    trainer: req.body.trainer
  });

  newPokemon.save((err, pokemon) => {
    if(err) {
      console.log(err);
      res.end();
    } else {
      console.log(pokemon);
      res.end();
    }
  })
});

// GET - get all trainer sightings
router.get('/pokemon/:id', function(req, res) {
  Pokemon.find({trainer: req.params['id']}).then((pokemon) => {
		console.log(pokemon);
    res.send(pokemon);
  })
});


// export module
export = router;

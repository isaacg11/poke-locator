// import modules
import express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let geo = require('mapjam-geo-providers');

// Model
let Pokemon = mongoose.model('Pokemon', {
	name: String,
  level: Number,
	location: Object,
	date: Date,
  trainer: String
});

// POST - add a new pokemon sighting
router.post('/pokemon', function(req, res) {
	console.log(req.body);
	if(req.body.latitude) {
		let newPokemon = new Pokemon({
			name: req.body.name,
			level: req.body.level,
			location: {
				lat: req.body.latitude,
				lng: req.body.longitude
			},
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
	} else {
		geo.geocode('mapzen',req.body.address, {"api_key":"search-cwUEoYW"}, function(err, info){
			let newPokemon = new Pokemon({
				name: req.body.name,
				level: req.body.level,
				location: {
					lat: info.geometry.latitude,
					lng: info.geometry.longitude
				},
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
	}
});

// GET - get all trainer sightings
router.get('/pokemon/:id', function(req, res) {
  Pokemon.find({trainer: req.params['id']}).then((pokemon) => {
    res.send(pokemon);
  })
});

// export module
export = router;

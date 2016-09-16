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
	address: String,
	date: Date,
  trainer: String,
	teamTag: String
});

// POST - add a new pokemon sighting
router.post('/pokemon', function(req, res) {
	if(req.body.latitude) {
		geo.geocode('mapzen',[req.body.latitude, req.body.longitude], {"api_key":"search-cwUEoYW"}, function(err, info){

			let newPokemon = new Pokemon({
				name: req.body.name,
				level: req.body.level,
				location: {
					lat: req.body.latitude,
					lng: req.body.longitude
				},
				address: info.feature.properties.pretty,
				date: req.body.date,
				trainer: req.body.trainer,
				teamTag: req.body.teamTag
			});

			newPokemon.save((err, pokemon) => {
				if(err) {
					console.log(err);
					res.end();
				} else {
					console.log(pokemon);
					res.send(pokemon);
				}
			})
		});
	} else {
		geo.geocode('mapzen',req.body.address, {"api_key":"search-cwUEoYW"}, function(err, info){
			console.log(info);
			let newPokemon = new Pokemon({
				name: req.body.name,
				level: req.body.level,
				location: {
					lat: info.geometry.latitude,
					lng: info.geometry.longitude
				},
				address: info.address.pretty,
				date: req.body.date,
				trainer: req.body.trainer,
				teamTag: req.body.teamTag
			});

			newPokemon.save((err, pokemon) => {
				if(err) {
					console.log(err);
					res.end();
				} else {
					console.log(pokemon);
					res.send(pokemon);
				}
			})
		});
	}
});

// GET - trainer sightings
router.get('/pokemon/trainer/:username', function(req, res) {
  Pokemon.find({trainer: req.params['username']}).then((pokemon) => {
    res.send(pokemon);
  })
});

// GET - team sightings
router.get('/pokemon/team/:type', function(req, res) {
  Pokemon.find({teamTag: req.params['type']}).then((pokemon) => {
    res.send(pokemon);
  })
});


// export module
export = router;

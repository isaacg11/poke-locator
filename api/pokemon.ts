// import modules
import express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// Model
let Pokemon = mongoose.model('Pokemon', {
	name: String,
  level: Number,
	location: Object,
	date: Date
});

// POST - new pokemon sighting



// export module
export = router;

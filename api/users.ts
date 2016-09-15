// import modules
import express = require('express');
import passport = require('passport');
let router = express.Router();
let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require("jsonwebtoken");

// Model
let User = mongoose.model('User', {
	username: {
		type: String,
		unique: true
	},
	team: String,
	password: String,
	salt: String
});

// POST - Register
router.post('/users/register', function(req, res){
  let salt = crypto.randomBytes(16).toString('hex');
  let hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64).toString('hex');

  let newUser = new User({
    username: req.body.username,
		team: req.body.team,
  	password: hash,
  	salt: salt
  });

  newUser.save((err, user) => {
    if(err) {
      console.log(err);
      res.end();
    } else {
      console.log(user);
			let today:any = new Date();
			let exp:any = new Date(today);
			exp.setDate(today.getDate() + 36500);
			let token = jwt.sign({
				id: user._id,
				username: user.username,
				team: user.team,
				exp: exp.getTime() / 1000
			}, 'SecretKey');
      res.send({jwt: token});
    }
  })
});

// POST - Login
router.post('/users/login', function(req, res, next) {
  User.find({username: req.body.username}, function(err, user) {
    if(user.length < 1) {
      res.send({message: 'Incorrect username'});
    }
    else {
      let hash = crypto.pbkdf2Sync(req.body.password, user[0].salt, 1000, 64).toString('hex');
      if(user[0].password === hash) {
        let today:any = new Date();
        let exp:any = new Date(today);
        exp.setDate(today.getDate() + 36500);
        let token = jwt.sign({
          id: user[0]._id,
          username: user[0].username,
					team: user[0].team,
          exp: exp.getTime() / 1000
        }, 'SecretKey');

        res.send({message: 'Correct', jwt: token});
      }
      else {
        res.send({message: 'Incorrect password'});
      }
    }
  })
});

// export module
export = router;

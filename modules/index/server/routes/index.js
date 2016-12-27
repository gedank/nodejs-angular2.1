'use strict';

var session_store;
var urlpublic;
var urlserver;

module.exports = function (app, config) {
	/* GET home page. */
	app.route('/').get(function(req, res, next) {
		res.render('index');
	});

	app.route('/index').get(function(req, res, next) {
		session_store = req.session;
		session_store.server = urlserver = 'index';
		session_store.public = urlpublic = 'users';
		res.render('index2', {
		  	title	: config.app.title, 
		  	app		: 'User', 
		  	module	: 'user', 
		  	js		: 'user.js', 
		  	url 	: {
		  		server: urlserver, 
		  		public: urlpublic
		  	}
		});
	});

	app.route('/home').get(function(req, res, next) {
		res.redirect('/index');
	});

	app.route('/beranda').get(function(req, res, next) {
		res.redirect('/index');
	});

	app.route('/serror').get(function(req, res, next) {
		res.render('serror');
	});
};

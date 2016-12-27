'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');

var formidable = require('formidable');
var fs = require('fs');
var pagination = require('pagination');

var session_store;

module.exports = function (app) {
  app.route('/api-user/users').get(function(req, res, next) {
    session_store = req.session;
    var page = 1;
    var offset = 0;
    var no = 0;
    var limit = 3;

    if (req.query.hasOwnProperty('limit')){
      limit = req.query.limit;
      session_store.limit = limit;
    }else if(req.session.limit){
      limit = req.session.limit;
    }
    if (req.query.hasOwnProperty('page')){
      page = req.query.page;
      offset = (req.query.page - 1)*limit;
      no = offset;
    }

    User.find({}, function(err, user){
      User.count({}, function(err, count){
        var bootstrapPaginator = new pagination.TemplatePaginator({
          prelink:'#/users', current: page, rowsPerPage: limit,
          totalResult: count,
          template: function(result) {
            var i, len, prelink;
            var html = '<ul class="pagination">';
            if(result.pageCount < 2) {
              html += '</ul></div>';
              return html;
            }
            prelink = this.preparePreLink(result.prelink);
            if(result.previous) {
              html += '<li><a href="' + prelink + result.previous + '">Sebelumnya</a></li>';
            }
            if(result.range.length) {
              for( i = 0, len = result.range.length; i < len; i++) {
                if(result.range[i] === result.current) {
                  html += '<li class="active"><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                } else {
                  html += '<li><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                }
              }
            }
            if(result.next) {
              html += '<li><a href="' + prelink + result.next + '" class="paginator-next">Berikutnya</a></li>';
            }
            html += '</ul>';
            return html;
          }
        });

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.json({
          data:user,
          paginator:bootstrapPaginator.render(),
          offset:offset,
          count:count,
          no:no,
          limit:limit
        });
      });
    }).skip(offset).limit(eval(limit));
  });

  app.route('/api-user/users/add').post(function (req, res, next){
    req.assert('username', 'Nama diperlukan').isAlpha().withMessage('Username harus terdiri dari angka dan huruf').notEmpty();
    req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
    req.assert('name', 'Nama harus terdiri dari huruf').isAlpha();
    var errors = req.validationErrors();
    // console.log(errors);
    if (!errors)
    {
      var v_username = req.sanitize( 'username' ).escape().trim();
      var v_email = req.sanitize( 'email' ).escape().trim();
      var v_name = req.sanitize( 'name' ).escape().trim();

      User.find({username:req.params.username}, function (err, user){
        if (user.length == 0)
        {
          var admin = new User({
            username: v_username,
            email: v_email,
            name: v_name,
          });

          admin.save(function(err) {
            if (err)
            {
              // console.log(err);
              res.json({
                status: 'danger',
                message: 'Punten, sepertinya ada masalah dengan sistem kami...',
                redirect: false
              });
            }
            else
            {
              res.json({
                status: 'info',
                message: 'User berhasil dibuat...',
                redirect: true,
                server: req.session.server
              });
            }
          });
        }
        else
        {
          res.json({
            status: 'danger',
            message: 'Punten, username sudah digunakan...',
            redirect: false,
            data: {
              username: req.params.username,
              email: req.params.email,
              name: req.params.name,
            }
          });
        }
      });
    }
    else
    {
      errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";
      for (i in errors)
      {
        error = errors[i];
        errors_detail += '<li>'+error.msg+'</li>';
      }
      errors_detail += "</ul>";
      res.json({
        status: 'danger',
        message: errors_detail,
        data: {
          username: req.params.username,
          email: req.params.email,
          name: req.params.name,
        }
      });
    }
  });

  app.route('/api-user/users/edit/(:id)').get(function(req, res, next) {
    User.findOne({_id:req.params.id}, function (err, user){
      if (user)
      {
        // console.log(user);
        res.json({
          data:user,
          redirect: false
        });
      }
      else
      {
        res.json({
          redirect: true,
          server: req.session.server
        });
      }
    });
  });

  app.route('/api-user/users/edit/(:id)').put(function (req, res, next){
    req.assert('username', 'Nama diperlukan').isAlpha().withMessage('Username harus terdiri dari angka dan huruf').notEmpty();
    req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
    req.assert('name', 'Nama harus terdiri dari huruf').isAlpha();
    var errors = req.validationErrors();
    // console.log(errors);
    if (!errors)
    {
      var v_username = req.sanitize( 'username' ).escape().trim();
      var v_email = req.sanitize( 'email' ).escape().trim();
      var v_name = req.sanitize( 'name' ).escape().trim();

      User.findById(req.params.id, function(err, user){
        user.username = v_username;
        user.email = v_email;
        user.name = v_name;
        user.save(function(err, user){
          if (err)
          {
            res.json({
              status: 'danger',
              message: 'Punten, sepertinya ada masalah dengan sistem kami...',
              redirect: false
            });
          }
          else
          {
            res.json({
              status: 'info',
              message: 'Edit user berhasil!',
              redirect: true,
              server: req.session.server
            });
          }
        });
      });
    }
    else
    {
      errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";
      for (i in errors)
      {
        error = errors[i];
        errors_detail += '<li>'+error.msg+'</li>';
      }
      errors_detail += "</ul>";
      res.json({
        status: 'danger',
        message: errors_detail,
        data: {
          username: req.params.username,
          email: req.params.email,
          name: req.params.name,
        }
      });
    }
  });

  app.route('/api-user/users/delete/(:id)').delete(function (req, res, next){
    User.findById(req.params.id, function(err, user){
      user.remove(function(err, user){
        if (err)
        {
          res.json({
            status: 'danger',
            message: 'Punten, sepertinya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D',
            redirect: false
          });
        }
        else
        {
          res.json({
            status: 'info',
            message: 'Hapus user berhasil!',
            redirect: true,
            server: req.session.server
          });
        }
      });
    });
  });
};

var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var jwt = require('jsonwebtoken');
var User = require('../models/user');


router.get('/', function (req, res, next) {
    Message.find()
        .populate('user', 'firstName')
        .exec(function (err, docs) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: docs
            });

        });
});

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Authentication failed',
                error: err
            });
        }
        next();
    });
});


router.post('/', function (req, res, next) {

    var decoded = jwt.decode(req.query.token); // decode method will return user object.JWT has verified the token in above middleware.
    User.findById(decoded.user._id, function (err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'User not found',
                error: err
            });
        }
        var message = new Message({
            content: req.body.content,
            user: doc
        });
        message.save(function (err, result) { // save is moongoose function to insert object into Mongo db.
            if (err) {
                return res.status(404).json({
                    title: 'An error occured',
                    error: err
                });
            }
            doc.message.push(result);
            doc.save(); 
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });

    });

});


router.patch('/:id', function (req, res, next) {

    var decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function (err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error Occoured',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No Message Found',
                error: { message: 'Message could not be found' }
            });
        }
        if(doc.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Message created by other user'}
            });
        }
        doc.content = req.body.content;
        console.log("Inside patch backend");
        doc.save(function (err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'An error Occoured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Patched',
                obj: result
            });
        });
    });
});


router.delete('/:id', function (req, res, next) {

    var decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function (err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error Occoured',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No Message Found',
                error: { message: 'Message could not be found' }
            });
        }
        if(doc.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Message created by other user'}
            });
        }
        doc.remove(function (err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'An error Occoured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Message Deleted',
                obj: result
            });
        });
    });
});

module.exports = router;
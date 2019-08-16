const express = require("express");
const router = express.Router();
const User = require("../models/User");
var createError = require('http-errors');


router.post("/signup", (req, res, next)=> {   
    User.create(req.body)
        .then((user)=> {
            let {username, email, password} = user;
            let sessionData = {username, email, password};
            req.session.user = sessionData;
            res.status(200).json(sessionData);
        })
        .catch((error)=> {
            if(error.name === "ValidationError") next(createError(400, error.message))
            else next(createError(500));
        })
})

router.post("/login", (req, res, next)=> {
    User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]})
        .then((user)=> {
            if(!user) next(createError(401), "Invalid credentials.");
            else {
            return user.comparePasswords(req.body.password)
                .then((match)=> {
                    if(match) {
                        let {username, email, password} = user;
                        let sessionData = {username, email, password};
                        req.session.user = sessionData;
                        res.status(200).json(sessionData);
                    } else {
                        next(createError(401, "Invalid credentials."));
                    }
                })
            }
        })
        .catch((error)=> {
            next(createError(500));
        })
})

router.get("/logout", (req, res, next)=> {
    req.session.destroy(); //! session of current user must be destroyed
    res.clearCookie('connect.sid')
    res.status(205).end();
})

module.exports = router;
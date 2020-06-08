const passsport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const DB = require('../database');
const helpers = require('../lib/helpers');

passsport.use('local.signup', new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
    passReqToCallback: true
}, async (req, Username, Password, done)=> {
    const { Fullname } = req.body;
    const newUser = {
        Fullname,
        Username,
        Password,
    };

    newUser.Password = await helpers.encryptPassword(Password);
    const result = await DB.query('INSERT INTO Users SET ? ', [newUser]);
    // console.log(result);
    newUser.Id = result.insertId;
    return done(null, newUser);
}));

passsport.use('local.signin', new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
    passReqToCallback: true
}, async (req, Username, Password, done) => {
    const result = await DB.query('SELECT * FROM Users WHERE username = ?', [Username]);

    if(result.length > 0 ){
        const user = result[0];
        const validPassword = await helpers.matchPassword(Password, user.Password);

        if(validPassword) {
            done(null, user, req.flash('success','Welcome' + user.Username));
        } else {
            done(null, false, req.flash('failure','Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('failure','The Username does not exits'));
    }
}));

passsport.serializeUser((user, done) => {
    done(null, user.Id);
});

passsport.deserializeUser( async (id, done ) => {
    const users = await DB.query('SELECT * FROM Users WHERE id = ?', [id]);

    done(null, users[0]);
});
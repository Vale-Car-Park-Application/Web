const passport = require('passport')
const passportStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user_model')
const bcrypt = require('bcrypt')
const env = require('../env')

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(new passportStrategy({
        clientID: env.CLIENT_ID,
        clientSecret: env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
        //console.log(profile);
        User.findOne({ email: profile.emails[0].value })
            .then(async(currentUser) => {
                //console.log(currentUser);
                if (currentUser) {
                    if (currentUser.googleId) {
                        bcrypt.compare(profile.id, currentUser.googleId, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else if (!result) {
                                console.log("hatalı bilgi");
                            } else if (result) {
                                done(null, currentUser)
                            }
                        })
                    } else {
                        console.log('mail password ile kaydolmuş')
                    }
                } else {
                    const hashedGoogleId = await bcrypt.hash(profile.id, 10);
                    new User({
                            name: profile.name.givenName,
                            email: profile.emails[0].value,
                            googleId: hashedGoogleId
                        }).save()
                        .then(newUser => done(null, newUser));
                }
            })
    }
));
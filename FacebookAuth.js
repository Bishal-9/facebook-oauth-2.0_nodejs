const FacebookStrategy = require('passport-facebook').Strategy
const User = require('./User')

module.exports = (passport, PORT) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `http://localhost:${PORT}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        async function (accessToken, refreshToken, profile, done) {

            // * User data to be saved
            const newUser = {
                facebookId: profile.id,
                displayName: profile.displayName,
                image: profile.photos[0].value
            }
            
            try {
                let user = await User.findOne({ facebookId: profile.id })

                if (user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (error) {
                console.log(error)
            }
        }
    ))

    // * Session data handling by Passport
    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })
}
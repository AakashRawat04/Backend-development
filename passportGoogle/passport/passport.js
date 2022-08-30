const passport = require("passport");
const User = require("../model/user");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.client_id,
			clientSecret: process.env.client_secret,
			callbackURL: "http://localhost:4000/auth/google/callback",
		},
		(accessToken, refreshToken, profile, next) => {
			console.log("MY PROFILE", profile._json.email);

			User.findOne({ email: profile._json.email }).then((user) => {
				if (user) {
					console.log("user already exists in DB", user);
					//cookietoken()
					next(null, user);
				} else {
					User.create({
						name: profile.displayName,
						googleId: profile.id,
						email: profile._json.email,
					})
						.then((user) => {
							console.log("New User", user);
							//cookietoken()
							next(null, user);
						})
						.catch((err) => console.log(err));
				}
			});
			// next();
		}
	)
);

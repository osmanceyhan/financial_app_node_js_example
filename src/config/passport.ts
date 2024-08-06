import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/auth/user';

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (_id: string, done) => {
    try {
        const user = await User.findById(_id).exec();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;

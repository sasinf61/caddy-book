import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma.js';

// Google OAuth Strategy Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
      passReqToCallback: true
    },
    async (req: any, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists (using googleId)
        const existingUser = await prisma.user.findUnique({
          where: { googleId: profile.id }
        });

        // If user exists, log them in
        if (existingUser) {
          // Clear session role if present
          if (req.session.role) {
            delete req.session.role;
          }
          return done(null, existingUser);
        }

        // If user does NOT exist, create them
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || '',
            role: req.session.role || 'GOLFER',
            // Password remains null
          }
        });

        // Clear session role after creating user
        if (req.session.role) {
          delete req.session.role;
        }

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Serialize user (save user ID in session)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user (retrieve user from session)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        caddyProfile: true,    // Include the CaddyProfile data
        favoriteCaddies: true  // Include the list of favorite caddies
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

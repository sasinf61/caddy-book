import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from './config/passport.js';
import { registerStart, registerComplete, getCurrentUser, logoutUser, loginUser } from './controllers/auth.controller.js';
import { updateCaddyProfile, updateGolferProfile } from './controllers/profile.controller.js';
import { createReview } from './controllers/review.controller.js';
import { toggleFavorite } from './controllers/favorite.controller.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow Next.js frontend
  credentials: true // Allow credentials (cookies, sessions)
}));
app.use(bodyParser.json());
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Root route
app.get('/', (req, res) => {
  res.json({ message: "Caddy Booking API is running!" });
});

// Auth routes
app.post('/api/auth/register/start', registerStart);
app.post('/api/auth/register/complete', registerComplete);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/me', getCurrentUser);
app.post('/api/auth/logout', logoutUser);

// Profile routes
app.post('/api/profile/caddy', updateCaddyProfile);
app.post('/api/profile/golfer', updateGolferProfile);

// Review routes
app.post('/api/reviews', createReview);

// Favorite routes
app.post('/api/favorites/toggle', toggleFavorite);

// Pre-auth route to capture role in session
app.get('/api/auth/start', (req, res) => {
  // Get the 'role' from the query parameter (e.g., ?role=CADDY)
  const role = req.query.role === 'CADDY' ? 'CADDY' : 'GOLFER';

  // Save the selected role into the session
  (req.session as any).role = role;

  // Now, redirect the user to the actual Google auth route
  res.redirect('/api/auth/google');
});

// Google OAuth trigger route
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {
    // Successful authentication!
    // 'req.user' now contains the user object from our database (found or created).
    // Redirect them to their frontend profile page (which we will create later).
    res.redirect('/profile');
  }
);

// Controllers will be imported here

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

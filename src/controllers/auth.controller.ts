import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { UserRole } from '@prisma/client';
import { createEtherealTransport, getTestMessageUrl } from '../config/mailer.js';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to generate a unique slug
async function generateUniqueSlug(name: string): Promise<string> {
  let slug = generateSlug(name);
  let counter = 1;
  
  // Check if slug exists, if so, append a number
  while (await prisma.caddyProfile.findUnique({ where: { slug } })) {
    slug = `${generateSlug(name)}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Start registration - create user with name/phone/email (no password yet)
 */
export const registerStart = async (req: Request, res: Response) => {
  try {
    // Get data from request body
    const { name, phone, email, role } = req.body;
    const userRole: UserRole = role === 'CADDY' ? 'CADDY' : 'GOLFER'; // Default to GOLFER

    // Validation - Check required fields
    if (!name || !phone || !email || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, phone, email, role' 
      });
    }

    // Validation - Check if user already exists (by phone OR email)
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { phone: phone },
          { email: email }
        ] 
      }
    });

    if (existingUser) {
      return res.status(409).json({
        message: existingUser.phone === phone 
          ? 'Phone number already registered' 
          : 'Email already registered'
      });
    }

    // Create new user (no password yet)
    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        role: userRole,
        // Password is now 'null' by default
      }
    });

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');
    const verificationToken = await prisma.user.update({
      where: { id: newUser.id },
      data: { verificationToken: token },
    });

    // Create the verification URL (Deep Link for Mobile App)
    const verificationUrl = `caddybooking://verify?token=${token}&phone=${encodeURIComponent(newUser.phone)}&email=${encodeURIComponent(newUser.email)}&name=${encodeURIComponent(newUser.name)}`;

    // Send the email (using Ethereal)
    const transporter = await createEtherealTransport();
    const mailOptions = {
      from: '"Caddy Booking App" <noreply@caddybooking.com>',
      to: newUser.email,
      subject: 'Welcome! Please Verify Your Email',
      html: `<b>Welcome to Caddy Booking!</b><br>Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // Log the *fake inbox* URL to the terminal
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL (Ethereal Inbox): %s', getTestMessageUrl(info));

    // If user is a CADDY, create an empty CaddyProfile
    if (userRole === 'CADDY') {
      const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + newUser.id.slice(0, 6);
      await prisma.caddyProfile.create({
        data: {
          userId: newUser.id,
          slug: slug, // Generate slug from name instead of username
          tier: 'C', // Default tier
          status: 'AVAILABLE' // Default status
        }
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    // Return success
    return res.status(201).json({
      message: 'User registered successfully. Please check your email to verify.',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get the current logged-in user
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // 'req.user' is populated by 'passport.deserializeUser'
  // We must remove the password before sending
  const user = req.user as any;
  // Create a copy to avoid modifying the session object directly
  const userResponse = { ...user };
  delete userResponse.password;
  res.status(200).json(userResponse);
};

/**
 * Logout the current user
 */
export const logoutUser = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error destroying session', error: err });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

/**
 * Login user with phone/email and password
 */
export const loginUser = async (req: Request, res: Response, next: any) => {
  const { loginIdentifier, password } = req.body;

  // Validation
  if (!loginIdentifier || !password) {
    return res.status(400).json({ message: 'Missing loginIdentifier or password' });
  }

  try {
    // a. Find the user by phone OR email
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { phone: loginIdentifier },
          { email: loginIdentifier }
        ] 
      },
      include: {
        caddyProfile: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone/email or password' });
    }

    // b. Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    // c. Check if they have a local password
    if (!user.password) {
      return res.status(401).json({ message: 'Password not set. Please complete registration.' });
    }

    // d. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone/email or password' });
    }

    // e. Log the user in (using Passport's 'req.logIn' function)
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Complete registration - verify email and set password/phone
 */
export const registerComplete = async (req: Request, res: Response, next: any) => {
  // a. Get data from body
  const { token, password, phone } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and Password are required' });
  }

  try {
    // b. Find the user by this token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token as string }
    });

    // c. If token is invalid or user not found
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    // d. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // e. (Success) Update the user: Set password, verify, and optionally update phone
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        phone: phone || user.phone, // Keep existing phone or update if provided
        isEmailVerified: true,
        verificationToken: null // (Crucial: Burn the token after use)
      }
    });

    // f. (NEW) Log the user in automatically
    req.logIn(updatedUser, (err) => {
      if (err) { return next(err); }
      // Remove password from response
      const userResponse = { ...updatedUser };
      delete userResponse.password;
      return res.status(200).json({ message: 'Registration complete!', user: userResponse });
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error completing registration' });
  }
};

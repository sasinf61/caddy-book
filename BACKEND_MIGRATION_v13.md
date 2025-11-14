# Schema v13 Migration - Backend Changes Needed

## ✅ FRONTEND COMPLETED
- Schema updated: `username` → `name`, `phone?` → `phone` (required)
- Migration applied successfully
- All components updated to use `user.name`

---

## 🔧 BACKEND CHANGES NEEDED

### 1. Update `src/controllers/auth.controller.ts`

#### A. **registerStart** function (around line 36):

**BEFORE:**
```typescript
const { username, email, role } = req.body;

// Validation - Check if user already exists (by username OR email)
const existingUser = await prisma.user.findFirst({
  where: { OR: [{ username }, { email }] }
});

if (existingUser) {
  return res.status(400).json({
    message: 'Username or email already in use.'
  });
}

// Create user (no password yet - will be set later)
const newUser = await prisma.user.create({
  data: {
    username,
    email,
    role,
    isEmailVerified: false
  }
});

// If CADDY: Create CaddyProfile with slug from username
if (role === 'CADDY') {
  await prisma.caddyProfile.create({
    data: {
      userId: newUser.id,
      slug: await generateUniqueSlug(newUser.username), // Use username for slug
      // ... other fields
    }
  });
}
```

**AFTER:**
```typescript
const { name, phone, email, role } = req.body;

// Validation
if (!name || !phone || !email || !role) {
  return res.status(400).json({ 
    message: 'Missing required fields: name, phone, email, role' 
  });
}

// Check existing by phone OR email
const existingUser = await prisma.user.findFirst({
  where: {
    OR: [
      { phone: phone },
      { email: email }
    ]
  }
});

if (existingUser) {
  return res.status(400).json({ 
    message: existingUser.phone === phone 
      ? 'Phone number already registered' 
      : 'Email already registered' 
  });
}

// Create user with name
const newUser = await prisma.user.create({
  data: {
    name,      // Changed from username
    phone,     // Now required
    email,
    role,
    isEmailVerified: false
  }
});

// If CADDY: Create CaddyProfile with slug from name
if (role === 'CADDY') {
  const slug = name.toLowerCase().replace(/\\s+/g, '-') + '-' + newUser.id.slice(0, 6);
  await prisma.caddyProfile.create({
    data: {
      userId: newUser.id,
      slug: slug,  // Generate from name instead
      // ... other fields
    }
  });
}
```

---

#### B. **loginUser** function (around line 150):

**BEFORE:**
```typescript
const { email, password } = req.body;

const user = await prisma.user.findUnique({
  where: { email }
});

if (!user) {
  return res.status(401).json({ message: 'Invalid email or password' });
}
```

**AFTER:**
```typescript
const { loginIdentifier, password } = req.body;

if (!loginIdentifier || !password) {
  return res.status(400).json({ message: 'Missing loginIdentifier or password' });
}

// Find by phone OR email
const user = await prisma.user.findFirst({
  where: {
    OR: [
      { phone: loginIdentifier },
      { email: loginIdentifier }
    ]
  },
  include: {
    caddyProfile: true,
    golferProfile: true
  }
});

if (!user) {
  return res.status(401).json({ message: 'Invalid phone/email or password' });
}

// Continue with password verification (same as before)
if (!user.password) {
  return res.status(401).json({ message: 'Password not set' });
}

const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  return res.status(401).json({ message: 'Invalid phone/email or password' });
}

// Rest of login logic (session, cookies) stays the same
```

---

#### C. **registerComplete** function (around line 100):

**BEFORE:**
```typescript
// Update user password
await prisma.user.update({
  where: { id: user.id },
  data: {
    password: hashedPassword,
    isEmailVerified: true,
    verificationToken: null
  }
});
```

**AFTER:**
```typescript
// Update user password (phone is now required, handle it)
await prisma.user.update({
  where: { id: user.id },
  data: {
    password: hashedPassword,
    phone: phone || user.phone, // Keep existing or update
    isEmailVerified: true,
    verificationToken: null
  }
});
```

---

### 2. Update Frontend Registration Forms

#### A. **src/app/register/golfer-signup/page.tsx**

**BEFORE:**
```typescript
const [username, setUsername] = useState('');

// In handleSubmit:
const response = await fetch('http://localhost:3001/api/auth/register/start', {
  method: 'POST',
  body: JSON.stringify({
    username,
    email,
    role: 'GOLFER'
  })
});
```

**AFTER:**
```typescript
const [name, setName] = useState('');
const [phone, setPhone] = useState('');

// In handleSubmit:
const response = await fetch('http://localhost:3001/api/auth/register/start', {
  method: 'POST',
  body: JSON.stringify({
    name,
    phone,
    email,
    role: 'GOLFER'
  })
});

// In JSX:
<input 
  type="text" 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
  required 
  placeholder="ชื่อ-นามสกุล" 
/>
<input 
  type="tel" 
  value={phone} 
  onChange={(e) => setPhone(e.target.value)} 
  required 
  placeholder="เบอร์โทรศัพท์" 
/>
```

#### B. **src/app/register/caddy-signup/page.tsx**

Same changes as golfer-signup (change `username` → `name`, add `phone`)

---

### 3. Update Login Form

#### **src/app/login/page.tsx**

**BEFORE:**
```typescript
const [email, setEmail] = useState('');

const response = await fetch('http://localhost:3001/api/auth/login', {
  body: JSON.stringify({ email, password })
});
```

**AFTER:**
```typescript
const [loginIdentifier, setLoginIdentifier] = useState('');

const response = await fetch('http://localhost:3001/api/auth/login', {
  body: JSON.stringify({ loginIdentifier, password })
});

// In JSX:
<input 
  type="text" 
  value={loginIdentifier} 
  onChange={(e) => setLoginIdentifier(e.target.value)} 
  placeholder="เบอร์โทร หรือ อีเมล" 
/>
```

---

### 4. Update Seed Script (prisma/seed.ts)

**BEFORE:**
```typescript
await prisma.user.create({
  data: {
    username: 'caddy_john',
    email: 'john@example.com',
    role: 'CADDY',
    // ...
  }
});
```

**AFTER:**
```typescript
await prisma.user.create({
  data: {
    name: 'John Smith',
    phone: '0812345678',
    email: 'john@example.com',
    role: 'CADDY',
    // ...
  }
});
```

---

## 📝 SUMMARY

### Database Changes:
- ✅ `User.username` (unique) → `User.name` (not unique)
- ✅ `User.phone` optional → required + unique

### API Changes:
- ✅ **Register**: Accepts `{ name, phone, email, role }` instead of `{ username, email, role }`
- ✅ **Login**: Accepts `{ loginIdentifier, password }` where `loginIdentifier` can be phone OR email
- ✅ **Validation**: Check for duplicate phone/email (not username)

### Frontend Changes:
- ✅ All components now use `user.name` instead of `user.username`
- 🔧 Registration forms need to add phone input field
- 🔧 Login form should accept phone/email (not just email)

---

## 🚀 NEXT STEPS

1. Copy code above to Backend project
2. Run Backend: `npm run dev`
3. Test registration flow with phone + name
4. Test login with phone number
5. Test login with email
6. Verify profile displays show name correctly

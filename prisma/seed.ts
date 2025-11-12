import { PrismaClient, UserRole, Gender, CaddyTier, CaddyStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding (v5 - Phone Optional)...');

  // Clear existing data
  console.log('Deleting old data...');
  await prisma.favoriteCaddy.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.caddyProfile.deleteMany();
  await prisma.user.deleteMany();

  // Hash a common password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // Helper function for unique phone
  const generateUniquePhone = (role: 'CADDY' | 'GOLFER') => {
    const prefix = role === 'CADDY' ? '08' : '06';
    return prefix + faker.string.numeric(8);
  };

  // Helper function for unique slug - copy from auth.controller.ts
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };
  const generateUniqueSlug = async (name: string): Promise<string> => {
    let slug = generateSlug(name);
    let counter = 1;
    while (await prisma.caddyProfile.findUnique({ where: { slug } })) {
      slug = `${generateSlug(name)}-${counter}`;
      counter++;
    }
    return slug;
  };

  // Create 10 Caddies (with username/phone/email)
  console.log('Creating 10 Caddies...');
  for (let i = 0; i < 10; i++) {
    const fakeName = faker.person.fullName();
    const fakeUsername = faker.internet.username({ firstName: fakeName });
    const fakePhone = generateUniquePhone('CADDY');

    const user = await prisma.user.create({
      data: {
        username: fakeUsername,
        phone: fakePhone, // (Keep phone for seed data)
        email: faker.internet.email().toLowerCase(), // (Keep email required for seed)
        password: hashedPassword, // (Set password, as they are "verified")
        isEmailVerified: true, // (Set as verified for testing)
        role: UserRole.CADDY,
        handicap: faker.number.float({ min: 0, max: 36, fractionDigits: 1 }),
        playingStyle: faker.helpers.arrayElement(['Competitive', 'Casual', 'Social']),
      },
    });

    await prisma.caddyProfile.create({
      data: {
        userId: user.id,
        slug: await generateUniqueSlug(fakeName), // Use fakeName for slug
        // All other CaddyProfile fields
        caddyIdNumber: `C${faker.string.alphanumeric(8).toUpperCase()}`,
        isVerified: faker.datatype.boolean(0.7),
        totalRounds: faker.number.int({ min: 50, max: 1000 }),
        homeCourses: faker.helpers.arrayElements(['Phoenix Gold', 'Siam Country Club', 'Chee Chan'], { min: 1, max: 2 }),
        experienceYears: faker.number.int({ min: 1, max: 10 }),
        languages: faker.helpers.arrayElements(['Thai', 'English', 'Japanese'], { min: 1, max: 2 }),
        specialties: faker.helpers.arrayElements(['Accurate Green Reading', 'Swing Advice', 'Beginner Friendly', 'Entertaining'], { min: 1, max: 3 }),
        certifications: faker.helpers.arrayElements(['First Aid Certified', 'Caddy of the Month'], { min: 0, max: 1 }),
        age: faker.number.int({ min: 18, max: 45 }),
        gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
        tier: faker.helpers.arrayElement([CaddyTier.A, CaddyTier.B, CaddyTier.C]),
        status: CaddyStatus.AVAILABLE,
        profileViews: faker.number.int({ min: 0, max: 1500 }),
        description: faker.lorem.paragraph(),
        profileImageUrl: faker.image.avatar(),
      },
    });

    console.log(`Created caddy ${i + 1}: ${fakeUsername} (${fakeName})`);
  }

  // Create 5 Golfers (with username/phone/email)
  console.log('Creating 5 Golfers...');
  for (let i = 0; i < 5; i++) {
    const fakeUsername = faker.internet.username();
    const fakePhone = generateUniquePhone('GOLFER');

    await prisma.user.create({
      data: {
        username: fakeUsername,
        phone: fakePhone, // (Keep phone for seed data)
        email: faker.internet.email().toLowerCase(), // (Keep email required for seed)
        password: hashedPassword, // (Set password, as they are "verified")
        isEmailVerified: true, // (Set as verified for testing)
        role: UserRole.GOLFER,
        handicap: faker.number.float({ min: 0, max: 36, fractionDigits: 1 }),
        playingStyle: faker.helpers.arrayElement(['Competitive', 'Casual', 'Social']),
      },
    });

    console.log(`Created golfer ${i + 1}: ${fakeUsername}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


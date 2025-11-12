-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GOLFER', 'CADDY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "CaddyTier" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "CaddyStatus" AS ENUM ('AVAILABLE', 'ON_DUTY', 'OFF_DUTY');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "facebookId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'GOLFER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "handicap" DOUBLE PRECISION,
    "playingStyle" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaddyProfile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "CaddyTier" NOT NULL,
    "status" "CaddyStatus" NOT NULL,
    "age" INTEGER,
    "gender" "Gender",
    "description" TEXT,
    "profileImageUrl" TEXT,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "caddyIdNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "totalRounds" INTEGER NOT NULL DEFAULT 0,
    "homeCourses" TEXT[],
    "experienceYears" INTEGER,
    "languages" TEXT[],
    "specialties" TEXT[],
    "certifications" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "CaddyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "caddyProfileId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "authorId" TEXT NOT NULL,
    "caddyProfileId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteCaddy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "caddyProfileId" TEXT NOT NULL,

    CONSTRAINT "FavoriteCaddy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "CaddyProfile_slug_key" ON "CaddyProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaddyProfile_caddyIdNumber_key" ON "CaddyProfile"("caddyIdNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CaddyProfile_userId_key" ON "CaddyProfile"("userId");

-- CreateIndex
CREATE INDEX "Booking_caddyProfileId_startTime_endTime_idx" ON "Booking"("caddyProfileId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteCaddy_userId_caddyProfileId_key" ON "FavoriteCaddy"("userId", "caddyProfileId");

-- AddForeignKey
ALTER TABLE "CaddyProfile" ADD CONSTRAINT "CaddyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_caddyProfileId_fkey" FOREIGN KEY ("caddyProfileId") REFERENCES "CaddyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_caddyProfileId_fkey" FOREIGN KEY ("caddyProfileId") REFERENCES "CaddyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteCaddy" ADD CONSTRAINT "FavoriteCaddy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteCaddy" ADD CONSTRAINT "FavoriteCaddy_caddyProfileId_fkey" FOREIGN KEY ("caddyProfileId") REFERENCES "CaddyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

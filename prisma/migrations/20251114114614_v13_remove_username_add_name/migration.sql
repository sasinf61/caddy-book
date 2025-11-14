-- Step 1: Add 'name' column as nullable first (to avoid errors with existing data)
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- Step 2: Copy data from 'username' to 'name'
UPDATE "User" SET "name" = "username";

-- Step 3: Make 'name' required (NOT NULL)
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- Step 4: Update NULL phone values to a placeholder (or you can delete these users)
-- Option A: Set placeholder phone numbers for users without phone
UPDATE "User" SET "phone" = 'PLACEHOLDER-' || "id" WHERE "phone" IS NULL;

-- Step 5: Make 'phone' required (NOT NULL)
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;

-- Step 6: Drop the old 'username' column
ALTER TABLE "User" DROP COLUMN "username";

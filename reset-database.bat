@echo off
echo Starting database reset...

echo Step 1: Removing problematic migration...
rmdir /s /q "prisma\migrations\20250721064909_init" 2>nul

echo Step 2: Resetting database schema...
npx prisma db push --force-reset

echo Step 3: Generating Prisma client...
npx prisma generate

echo.
echo Database reset completed!
echo The database is now clean and ready for use.
pause

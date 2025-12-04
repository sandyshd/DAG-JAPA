import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('Starting database reset...');

  try {
    // Delete records in order of dependencies (reverse of creation order)
    
    // 1. Delete AdminActivity (references User as adminId)
    await prisma.adminActivity.deleteMany({});
    console.log('✓ Deleted all AdminActivity records');

    // 2. Delete PasswordResetToken (references User)
    await prisma.passwordResetToken.deleteMany({});
    console.log('✓ Deleted all PasswordResetToken records');

    // 3. Delete Payment (references User)
    await prisma.payment.deleteMany({});
    console.log('✓ Deleted all Payment records');

    // 4. Delete EnglishTest (references User)
    await prisma.englishTest.deleteMany({});
    console.log('✓ Deleted all EnglishTest records');

    // 5. Delete Application (references User and Module)
    await prisma.application.deleteMany({});
    console.log('✓ Deleted all Application records');

    // 6. Delete Session (references User)
    await prisma.session.deleteMany({});
    console.log('✓ Deleted all Session records');

    // 7. Delete Account (references User)
    await prisma.account.deleteMany({});
    console.log('✓ Deleted all Account records');

    // 8. Delete User
    await prisma.user.deleteMany({});
    console.log('✓ Deleted all User records');

    // 9. Delete Module
    await prisma.module.deleteMany({});
    console.log('✓ Deleted all Module records');

    // 10. Delete VerificationToken (no dependencies)
    await prisma.verificationToken.deleteMany({});
    console.log('✓ Deleted all VerificationToken records');

    console.log('\n✅ Database reset completed successfully!');
    console.log('All tables are now empty and ready for new data.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();

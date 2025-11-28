/**
 * Script pour initialiser la base de données avec des données de test
 * Usage: npm run seed
 */

import { createProfile } from '../lib/database';

const sampleProfiles = [
  // Product Managers
  { position: 'Product Manager', yearsOfExperience: 3, location: 'Paris', teamSize: 2, salary: 55000 },
  { position: 'Product Manager', yearsOfExperience: 5, location: 'Paris', teamSize: 3, salary: 65000 },
  { position: 'Product Manager', yearsOfExperience: 4, location: 'Paris', teamSize: 2, salary: 60000 },
  { position: 'Product Manager', yearsOfExperience: 6, location: 'Lyon', teamSize: 4, salary: 58000 },
  { position: 'Product Manager', yearsOfExperience: 7, location: 'Paris', teamSize: 5, salary: 72000 },

  // Senior Product Managers
  { position: 'Senior Product Manager', yearsOfExperience: 8, location: 'Paris', teamSize: 6, salary: 85000 },
  { position: 'Senior Product Manager', yearsOfExperience: 10, location: 'Paris', teamSize: 8, salary: 95000 },
  { position: 'Senior Product Manager', yearsOfExperience: 9, location: 'Lyon', teamSize: 5, salary: 80000 },
  { position: 'Senior Product Manager', yearsOfExperience: 12, location: 'Paris', teamSize: 10, salary: 105000 },
  { position: 'Senior Product Manager', yearsOfExperience: 11, location: 'Toulouse', teamSize: 7, salary: 88000 },

  // Lead Product Managers
  { position: 'Lead Product Manager', yearsOfExperience: 12, location: 'Paris', teamSize: 12, salary: 110000 },
  { position: 'Lead Product Manager', yearsOfExperience: 14, location: 'Paris', teamSize: 15, salary: 125000 },
  { position: 'Lead Product Manager', yearsOfExperience: 13, location: 'Lyon', teamSize: 10, salary: 105000 },
  { position: 'Lead Product Manager', yearsOfExperience: 15, location: 'Paris', teamSize: 18, salary: 135000 },

  // Head of Product
  { position: 'Head of Product', yearsOfExperience: 15, location: 'Paris', teamSize: 20, salary: 140000 },
  { position: 'Head of Product', yearsOfExperience: 18, location: 'Paris', teamSize: 25, salary: 165000 },
  { position: 'Head of Product', yearsOfExperience: 16, location: 'Lyon', teamSize: 18, salary: 135000 },
  { position: 'Head of Product', yearsOfExperience: 20, location: 'Paris', teamSize: 30, salary: 180000 },

  // CPO (Chief Product Officer)
  { position: 'CPO', yearsOfExperience: 20, location: 'Paris', teamSize: 40, salary: 200000 },
  { position: 'CPO', yearsOfExperience: 22, location: 'Paris', teamSize: 50, salary: 230000 },

  // Variété de localisations
  { position: 'Product Manager', yearsOfExperience: 4, location: 'Marseille', teamSize: 2, salary: 52000 },
  { position: 'Product Manager', yearsOfExperience: 5, location: 'Nantes', teamSize: 3, salary: 54000 },
  { position: 'Product Manager', yearsOfExperience: 6, location: 'Bordeaux', teamSize: 4, salary: 57000 },
  { position: 'Senior Product Manager', yearsOfExperience: 9, location: 'Marseille', teamSize: 6, salary: 75000 },
  { position: 'Senior Product Manager', yearsOfExperience: 10, location: 'Nantes', teamSize: 7, salary: 78000 },
  { position: 'Senior Product Manager', yearsOfExperience: 11, location: 'Bordeaux', teamSize: 8, salary: 82000 },

  // Junior profiles
  { position: 'Junior Product Manager', yearsOfExperience: 1, location: 'Paris', teamSize: 0, salary: 42000 },
  { position: 'Junior Product Manager', yearsOfExperience: 2, location: 'Paris', teamSize: 0, salary: 48000 },
  { position: 'Junior Product Manager', yearsOfExperience: 1, location: 'Lyon', teamSize: 0, salary: 40000 },
  { position: 'Junior Product Manager', yearsOfExperience: 2, location: 'Toulouse', teamSize: 1, salary: 45000 },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  let successCount = 0;
  let errorCount = 0;

  for (const profile of sampleProfiles) {
    try {
      const created = createProfile(profile);
      console.log(`✅ Created profile: ${created.position} (${created.location}) - ${created.salary}€`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating profile:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Seeding completed:');
  console.log(`  ✅ Success: ${successCount} profiles`);
  console.log(`  ❌ Errors: ${errorCount} profiles`);
  console.log(`  📦 Total: ${sampleProfiles.length} profiles`);
}

seedDatabase()
  .then(() => {
    console.log('\n✨ Database seeding finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error during seeding:', error);
    process.exit(1);
  });

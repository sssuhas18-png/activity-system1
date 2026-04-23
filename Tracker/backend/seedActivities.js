const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ActivityType = require('./models/ActivityType');
const Criteria = require('./models/Criteria');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  // Clear existing activities and criteria
  await ActivityType.deleteMany({});
  await Criteria.deleteMany({});
  console.log('Cleared existing activities and criteria');

  // Seed Data: 
  const sportsActivity = await ActivityType.create({ name: 'Sports', description: 'Physical sports and athletics' });
  const culturalActivity = await ActivityType.create({ name: 'Cultural', description: 'Arts, tech and cultural events' });
  const technicalActivity = await ActivityType.create({ name: 'Technical', description: 'Hackathons, coding challenges' });

  const criteriaList = [
    { title: 'State Level Winner', points: 30, activityType: sportsActivity._id },
    { title: 'National Participation', points: 40, activityType: sportsActivity._id },
    { title: 'College Fest Organizer', points: 20, activityType: culturalActivity._id },
    { title: 'Dance Competition Winner', points: 25, activityType: culturalActivity._id },
    { title: 'Hackathon Winner', points: 50, activityType: technicalActivity._id },
    { title: 'Paper Presentation', points: 30, activityType: technicalActivity._id },
  ];

  await Criteria.insertMany(criteriaList);
  console.log('Successfully seeded ActivityTypes and Criteria');

  process.exit(0);
}).catch((err) => {
  console.error('Failed to seed:', err);
  process.exit(1);
});

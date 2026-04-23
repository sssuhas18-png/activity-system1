const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PointsRule = require('./models/PointsRule');

dotenv.config();

const rules = [
  {
    activity_type: 'NSS',
    criteria: 'Blood donation',
    points: 20,
    description: 'Donated blood at an NSS camp'
  },
  {
    activity_type: 'NSS',
    criteria: 'Plantation',
    points: 15,
    description: 'Participated in tree plantation drive'
  },
  {
    activity_type: 'IEEE',
    criteria: 'Paper Presentation',
    points: 30,
    description: 'Presented a technical paper at an IEEE conference'
  },
  {
    activity_type: 'IEEE',
    criteria: 'Event Participation',
    points: 10,
    description: 'Participated in an IEEE workshop or event'
  },
  {
    activity_type: 'SPORTS',
    criteria: 'University Level Participation',
    points: 10,
    description: 'Represented college at University level sports'
  },
  {
    activity_type: 'SPORTS',
    criteria: 'University Level Winner',
    points: 30,
    description: 'Secured a winning position at University level sports'
  },
  {
    activity_type: 'CULTURAL',
    criteria: 'College Fest Participation',
    points: 10,
    description: 'Participated in college cultural activities'
  },
  {
    activity_type: 'CULTURAL',
    criteria: 'State Level Winner',
    points: 40,
    description: 'Secured a winning position at a state-level cultural fest'
  }
];

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Clear existing rules
  await PointsRule.deleteMany({});
  console.log('Cleared existing points rules');

  // Insert new rules
  await PointsRule.insertMany(rules);
  console.log('Successfully seeded points rules database');

  process.exit(0);
})
.catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});

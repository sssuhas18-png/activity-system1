const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PointsRule = require('./models/PointsRule');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  await PointsRule.deleteMany({});
  console.log('Cleared existing PointsRules');

  const rules = [
    // 🔹 CLUBS
    { activity_type: "Clubs", criteria: "Participant", points: 5 },
    { activity_type: "Clubs", criteria: "Club Member", points: 10 },
    { activity_type: "Clubs", criteria: "Club Coordinator", points: 15 },

    // 🔹 NSS & CLUB ACTIVITIES
    { activity_type: "NSS", criteria: "Blood Donation - Once", points: 10 },
    { activity_type: "NSS", criteria: "Blood Donation - Multiple", points: 20 },
    { activity_type: "NSS", criteria: "Book Collection - Coordinator", points: 5 },
    { activity_type: "NSS", criteria: "Book Collection - Senior Coordinator", points: 20 },
    { activity_type: "INDEC", criteria: "Participation", points: 20 },

    // 🔹 PROFESSIONAL BODIES (IEEE, ACM)
    { activity_type: "Professional Body", criteria: "Chairman / Secretary / Treasurer", points: 20 },
    { activity_type: "Professional Body", criteria: "Joint Secretary / Vice Chairman", points: 20 },
    { activity_type: "Professional Body", criteria: "EC Member", points: 10 },

    // 🔹 FESTS (UTSAV / PHASESHIFT)
    { activity_type: "UTSAV", criteria: "Core Committee", points: 20 },
    { activity_type: "UTSAV", criteria: "Senior Coordinator", points: 18 },
    { activity_type: "UTSAV", criteria: "Junior Coordinator", points: 14 },
    { activity_type: "UTSAV", criteria: "Volunteer", points: 10 },

    { activity_type: "PHASESHIFT", criteria: "Core Committee", points: 20 },
    { activity_type: "PHASESHIFT", criteria: "Senior Coordinator", points: 18 },
    { activity_type: "PHASESHIFT", criteria: "Junior Coordinator", points: 14 },
    { activity_type: "PHASESHIFT", criteria: "Volunteer", points: 10 },

    // 🔹 NATIONAL EVENTS
    { activity_type: "National Event", criteria: "Participation", points: 10 },
    { activity_type: "National Event", criteria: "Winner", points: 20 },

    // 🔹 PUBLICATIONS
    { activity_type: "Publication", criteria: "Journal Submitted", points: 10 },
    { activity_type: "Publication", criteria: "Journal Published", points: 20 },
    { activity_type: "Publication", criteria: "Conference Submitted", points: 10 },
    { activity_type: "Publication", criteria: "Conference Published", points: 15 },
    { activity_type: "Publication", criteria: "Other Publication", points: 5 },
    { activity_type: "Publication", criteria: "Project to Paper", points: 20 },

    // 🔹 PATENTS
    { activity_type: "Patent", criteria: "Filed", points: 10 },
    { activity_type: "Patent", criteria: "Granted", points: 20 },

    // 🔹 EXAMS
    { activity_type: "Exam", criteria: "Appeared", points: 5 },
    { activity_type: "Exam", criteria: "Qualified", points: 10 },
    { activity_type: "Exam", criteria: "Top Rank", points: 20 },
    { activity_type: "Exam", criteria: "Cleared Govt Exam", points: 20 },

    // 🔹 HEALTH ACTIVITIES
    { activity_type: "Health", criteria: "Walkathon 10 days", points: 20 },
    { activity_type: "Health", criteria: "Daily Steps Activity", points: 2 },

    // 🔹 VALUE ADDED COURSES
    { activity_type: "Course", criteria: "1 Week Course", points: 10 },
    { activity_type: "Course", criteria: "2+ Weeks Course", points: 20 },

    // 🔹 CLASS ROLE
    { activity_type: "Class Role", criteria: "Class Representative", points: 5 },

    // 🔹 DPC
    { activity_type: "DPC", criteria: "Department Placement Coordinator", points: 20 },

    // 🔹 SEMINARS
    { activity_type: "Seminar", criteria: "Organized Seminar", points: 5 }
  ];

  await PointsRule.insertMany(rules);
  console.log('Successfully seeded points rules!');

  process.exit(0);
}).catch((err) => {
  console.error('Failed to seed rules:', err);
  process.exit(1);
});

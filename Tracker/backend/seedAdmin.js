const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Student.findOne({ role: 'admin', email: 'admin@university.edu' });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    // Create admin
    const admin = new Student({
      usn: 'ADMIN001',
      name: 'Main Admin',
      email: 'admin@university.edu',
      password: 'admin123#password', // standard default, can be changed
      role: 'admin'
    });

    await admin.save();
    console.log('Successfully seeded Main Admin account!');
    console.log('Email: admin@university.edu');
    console.log('Password: admin123#password');

    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to seed admin:', err);
    process.exit(1);
  });

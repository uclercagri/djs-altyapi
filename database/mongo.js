const mongoose = require('mongoose');

// 'strictQuery' fix
mongoose.set('strictQuery', true);

const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectToDatabase;
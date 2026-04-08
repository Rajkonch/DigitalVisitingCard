// // server.js
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const app = require('./app');

// async function startServer() {
//   try {
//     // Memory MongoDB start karo
//     const mongod = await MongoMemoryServer.create();
//     const uri = mongod.getUri();

//     // Connect Mongoose
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('In-memory MongoDB connected');

//     // Start Express server
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   } catch (err) {
//     console.error('Error starting server:', err);
//     process.exit(1);
//   }
// }

// startServer();
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected ✅');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error('Error starting server:', err);
  }
}

startServer();
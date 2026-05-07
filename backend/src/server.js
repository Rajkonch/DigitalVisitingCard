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
let MongoMemoryServer;
if (process.env.NODE_ENV !== 'production') {
  try {
    MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
  } catch (e) {
    console.log('MongoMemoryServer not found, skipping in-memory DB fallback.');
  }
}
const app = require('./app');

async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Optional: If we want to force memory server in development when no URI is provided or if local mongo is down
    if ((!mongoUri || process.env.USE_MEMORY_DB === 'true') && MongoMemoryServer) {
      console.log('Starting In-Memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('In-memory MongoDB ready ✅');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected ✅');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error('Error starting server:', err);
    // Fallback if main connection fails
    if (process.env.NODE_ENV !== 'production' && MongoMemoryServer) {
        console.log('Attempting fallback to In-Memory MongoDB...');
        try {
            const mongod = await MongoMemoryServer.create();
            await mongoose.connect(mongod.getUri());
            console.log('Fallback In-Memory MongoDB Connected ✅');
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        } catch (fallbackErr) {
            console.error('Critical failure: Could not start even with fallback.', fallbackErr);
        }
    }
  }
}

startServer();
// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             //useNewUrlParser: true,
//             //useUnifiedTopology: true,
            
//         });
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (err) {
//         console.error(err);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;

const mongoose = require("mongoose");

let isConnected;

const connectDB = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("=> new database connection");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    throw err;
  }
};

module.exports = connectDB;

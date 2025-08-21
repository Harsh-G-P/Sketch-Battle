import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

//connection
import { connectDB } from './config/db.js';


//routes
import authRoute from './routes/authRoute.js';
import themeRoute from './routes/themeRoute.js';
import userRoute from './routes/userRoute.js';
import battleRoute from './routes/battleRoute.js';
import galleryRoute from './routes/galleryRoute.js';
import { cleanupStaleBattles } from './jobs/cleanupBattles.js';
import { cleanupUnsubmittedBattles } from './jobs/cleanupUnsubmittedBattles.js';
import adminRoute from './routes/adminRoute.js';

dotenv.config()

const app = express();

connectDB().then(() => {
  if (mongoose.connection.readyState === 1) {
    setInterval(cleanupStaleBattles, 60 * 1000);
    setInterval(cleanupUnsubmittedBattles, 60 * 1000);
  } else {
    console.warn("MongoDB not connected — skipping cleanup jobs.");
  }
});



const PORT = process.env.PORT || 3001

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const allowedOrigins = [process.env.CLIENT_URL,process.env.ADMIN_URL]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.get('/', (_, res) => {
  res.send('SketchBattle backend is running! :)');
});

//routes
app.use('/api/auth',authRoute)
app.use('/api/themes',themeRoute)
app.use('/api/users',userRoute)
app.use('/api/battles',battleRoute)
app.use('/api/gallery',galleryRoute)
app.use('/api/admin',adminRoute)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';
import activityRoutes from './routes/activityRoutes';
import {sequelize} from './models/index';

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/trips', tripRoutes);
app.use('/activities', activityRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres Connected");
    await sequelize.sync();
    console.log('Models synced');
    app.listen(PORT, () => {
      console.log(`Server listening on http://127.0.0.1:${PORT}`);
    });

  } catch (error) {
    console.error('Connection failed', error);
  }
})();


import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  APP_SECRET: process.env.APP_SECRET,
  SERVER_PORT: process.env.SERVER_PORT
}

export default CONFIG;
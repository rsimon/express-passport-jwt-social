import dotenv from 'dotenv';

dotenv.config();

const CONFIG = { ...process.env }

export default CONFIG;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.ts';
import userRoutes from './routes/user.route.ts';
import clinicRoutes from './routes/clinic.route.ts';
import patientRoutes from './routes/patient.route.ts';
import employeeRoutes from './routes/employee.route.ts';
dotenv.config();

const app = express();
const port = 8080;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/employee', employeeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

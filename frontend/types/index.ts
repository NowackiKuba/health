enum Role {
  ADMIN,
  DOCTOR,
  RECEPTIONIST,
}

// Definiowanie aliasów typów
type TEmployee = Employee;
type TClinic = Clinic;
type TSpecialization = Specialization;
type TAppointment = Appointment;
type TPatient = Patient;
type TPrescription = Prescription;
type TVacation = Vacation;
type TTask = Task;

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  logoUrl?: string | null;
  email: string;
  website?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  appointments: TAppointment[];
  employees: TEmployee[];
  patients: TPatient[];
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  clinic: TClinic;
  password: string;
  clinicId: string;
  imgUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  specialization: TSpecialization[];
  appointments: TAppointment[];
  room?: string | null;
  vacation?: TVacation | null;
  vacationId?: string | null;
  prescriptions: TPrescription[];
  hideDock: boolean;
}

interface Specialization {
  id: string;
  name: string;
  employee: TEmployee;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Appointment {
  id: string;
  date: Date;
  note: string;
  employee: TEmployee;
  employeeId: string;
  patient: TPatient;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
  clinic: TClinic;
  clinicId: string;
  appointmentType: string;
  appointmentReason: string;
  appointmentReport: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  pesel: string;
  createdAt: Date;
  updatedAt: Date;
  appointments: TAppointment[];
  prescriptions: TPrescription[];
}

interface Prescription {
  id: string;
  date: Date;
  note: string;
  patient: TPatient;
  patientId: string;
  employee: TEmployee;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Vacation {
  id: string;
  startDate: Date;
  endDate: Date;
  employee?: TEmployee | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
  deadLine: Date;
  priority: number;
  assignedTo: Employee;
  assignedToId: string;
  clinic: Clinic;
  clinicId: string;
}

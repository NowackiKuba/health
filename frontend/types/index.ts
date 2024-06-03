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
type TDocument = Document;
type TService = Service;
type TMedicine = Medicine;
type TChronicDisease = ChronicDisease;

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
  services: TService[];
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
  price: number;
  hour: string;
  isNFZ: boolean;
  service: TService;
  serviceId: string;
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
  dateOfBirth: Date;
  chronicDiseases: TChronicDisease[];
}

interface Prescription {
  id: string;
  date: Date;
  patient: TPatient;
  patientId: string;
  employee: TEmployee;
  employeeId: string;
  pdfLinkUrl: string;
  clinic: TClinic;
  clinicId: string;
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

interface Document {
  id: string;
  title: string;
  linkUrl: string;
  createdAt: Date;
  updatedAt: Date;
  clinic: TClinic;
  clinicId: string;
  patient: TPatient;
  patientId?: string;
  fileSize: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  clinic: TClinic;
  clinicId: string;
  employees: TEmployee[];
}

interface Medicine {
  name: string;
  quantity: number;
  dose: string;
  frequency: string;
  duration: string;
  seed: string;
  discount: number;
}

interface ChronicDisease {
  id: string;
  name: string;
  diagnosis: string;
  diagnosedBy: Employee;
  diagnosedById: string;
  patient: Patient;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
}

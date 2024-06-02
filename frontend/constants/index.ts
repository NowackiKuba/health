import {
  FcAutomatic,
  FcCalendar,
  FcCollaboration,
  FcDocument,
  FcHome,
  FcManager,
  FcOvertime,
  FcParallelTasks,
  FcServices,
  FcSettings,
  FcSurvey,
} from 'react-icons/fc';

export const dockLinks = [
  { id: 1, name: 'Home', path: '/dashboard', icon: FcHome },
  {
    id: 2,
    name: 'Patients',
    path: '/dashboard/patients',
    icon: FcCollaboration,
  },
  { id: 3, name: 'Calendar', path: '/dashboard/calendar', icon: FcCalendar },
  {
    id: 4,
    name: 'Appointments',
    path: '/dashboard/appointments',
    icon: FcOvertime,
  },
  { id: 5, name: 'Employees', path: '/dashboard/employees', icon: FcManager },
  {
    id: 6,
    name: 'Prescriptions',
    path: '/dashboard/prescriptions',
    icon: FcSurvey,
  },
  { id: 7, name: 'Tasks', path: '/dashboard/tasks', icon: FcParallelTasks },
  { id: 8, name: 'Documents', path: '/dashboard/documents', icon: FcDocument },
  { id: 10, name: 'Services', path: '/dashboard/services', icon: FcServices },
  { id: 9, name: 'Settings', path: '/dashboard/settings', icon: FcSettings },
];

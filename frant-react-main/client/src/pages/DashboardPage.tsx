import React, { useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
// ... autres imports

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Déplacer les sélecteurs ici
  const pendingLeaves = useSelector((state: RootState) => 
    state.leave.leaves.filter(leave => leave.status === 'pending').length
  );
  
  const activeMissions = useSelector((state: RootState) => 
    state.mission.missions.filter(mission => !mission.completed).length
  );
  
  const newApplications = useSelector((state: RootState) => 
    state.jobApplication.jobApplications.filter(app => app.status === 'pending').length
  );
  
  const totalEmployees = useSelector((state: RootState) => 
    state.employee.employees.length
  );

  // ... reste du code

  return (
    {/* ... */}
    <p className="text-2xl font-bold text-primary-700">{pendingLeaves}</p>
    <p className="text-2xl font-bold text-amber-700">{activeMissions}</p>
    <p className="text-2xl font-bold text-green-700">{newApplications}</p>
    <p className="text-2xl font-bold text-blue-700">{totalEmployees}</p>
    {/* ... */}
  );
};

export default DashboardPage;
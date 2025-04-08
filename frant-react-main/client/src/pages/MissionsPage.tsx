import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import MissionTable from '../components/missions/MissionTable';
import MissionForm from '../components/missions/MissionForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  fetchMissions, 
  createMission, 
  completeMission,
  fetchMissionById,
} from '../store/missionSlice';
import { fetchEmployees } from '../store/employeeSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Check, Calendar, Clock } from 'lucide-react';

const MissionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { missions, selectedMission, loading, error } = useSelector((state: RootState) => state.mission);
  const { employees } = useSelector((state: RootState) => state.employee);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchMissions() as any);
    dispatch(fetchEmployees() as any);
  }, [dispatch]);
  
  const handleCreateMission = () => {
    setCreateModalOpen(true);
  };
  
  const handleSubmitMission = async (data: any) => {
    try {
      await dispatch(createMission(data) as any);
      setCreateModalOpen(false);
      toast({
        title: 'Success',
        description: 'Mission created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create mission',
        variant: 'destructive',
      });
    }
  };
  
  const handleCompleteMission = async (id: number) => {
    try {
      await dispatch(completeMission(id) as any);
      toast({
        title: 'Success',
        description: 'Mission marked as completed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete mission',
        variant: 'destructive',
      });
    }
  };
  
  const handleViewMission = (id: number) => {
    dispatch(fetchMissionById(id) as any);
    setViewModalOpen(true);
  };

  return (
    <MainLayout title="Missions">
      {/* Mission Table */}
      <MissionTable 
        missions={missions}
        onCreateMission={handleCreateMission}
        onCompleteMission={handleCompleteMission}
        onViewMission={handleViewMission}
      />
      
      {/* Mission Creation Modal */}
      <MissionForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleSubmitMission}
        employees={employees}
      />
      
      {/* Mission Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Mission Details</DialogTitle>
          </DialogHeader>
          
          {selectedMission ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">{selectedMission.title}</h2>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${selectedMission.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {selectedMission.completed ? 'Completed' : 'Active'}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-700">{selectedMission.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Assignment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex items-center">
                        <dt className="w-1/2 text-sm font-medium text-gray-500">Assigned to:</dt>
                        <dd className="w-1/2 text-sm">{selectedMission.assigned_to_name}</dd>
                      </div>
                      <div className="flex items-center">
                        <dt className="w-1/2 text-sm font-medium text-gray-500">Supervised by:</dt>
                        <dd className="w-1/2 text-sm">{selectedMission.supervisor_name}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <dt className="w-1/3 text-sm font-medium text-gray-500">Created:</dt>
                        <dd className="w-2/3 text-sm">{format(new Date(selectedMission.created_at), 'MMM dd, yyyy')}</dd>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <dt className="w-1/3 text-sm font-medium text-gray-500">Deadline:</dt>
                        <dd className="w-2/3 text-sm">{format(new Date(selectedMission.deadline), 'MMM dd, yyyy')}</dd>
                      </div>
                      {selectedMission.completed && (
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <dt className="w-1/3 text-sm font-medium text-gray-500">Completed:</dt>
                          <dd className="w-2/3 text-sm">Yes</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading mission details...</div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MissionsPage;

import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchEmployees, fetchEmployeeById } from '../store/employeeSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';
import axios from 'axios';

const EmployeesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { employees, selectedEmployee, loading, error } = useSelector((state: RootState) => state.employee);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchEmployees() as any);
  }, [dispatch]);
  
  const handleViewEmployee = (id: number) => {
    dispatch(fetchEmployeeById(id) as any);
    setViewModalOpen(true);
  };
  
  const handleAddEmployee = () => {
    setCreateModalOpen(true);
  };
  
  const handleCreateEmployee = async (data: Omit<User, 'id'>) => {
    try {
      await axios.post('/api/users/', data);
      dispatch(fetchEmployees() as any);
      setCreateModalOpen(false);
      toast({
        title: 'Success',
        description: 'Employee created successfully',
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to create employee',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout title="Employees">
      <EmployeeTable 
        employees={employees}
        onViewEmployee={handleViewEmployee}
        onAddEmployee={handleAddEmployee}
      />
      
      {/* Employee Creation Modal */}
      <EmployeeForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateEmployee}
      />
      
      {/* Employee Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee ? (
            <div className="grid gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-medium text-primary-700">
                    {selectedEmployee.first_name.charAt(0)}{selectedEmployee.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}</h2>
                  <p className="text-gray-500">@{selectedEmployee.username}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Email:</dt>
                        <dd className="text-sm text-gray-900">{selectedEmployee.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Role:</dt>
                        <dd className="text-sm capitalize text-gray-900">{selectedEmployee.user_type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Leave Balance:</dt>
                        <dd className="text-sm text-gray-900">{selectedEmployee.leave_balance} days</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Status:</dt>
                        <dd className="text-sm text-green-600">Active</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Missions:</dt>
                        <dd className="text-sm text-gray-900">
                          {useSelector((state: RootState) => 
                            state.mission.missions.filter(
                              m => m.assigned_to === selectedEmployee.id || m.supervisor === selectedEmployee.id
                            ).length
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Leave Requests:</dt>
                        <dd className="text-sm text-gray-900">
                          {useSelector((state: RootState) => 
                            state.leave.leaves.filter(l => l.user === selectedEmployee.id).length
                          )}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading employee details...</div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EmployeesPage;

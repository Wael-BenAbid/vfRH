import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import InternshipTable from '../components/internships/InternshipTable';
import InternshipForm from '../components/internships/InternshipForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  fetchInternships, 
  createInternship, 
  changeInternshipStatus,
  fetchInternshipById
} from '../store/internshipSlice';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { GraduationCap, User, Calendar } from 'lucide-react';

const InternshipsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { internships, selectedInternship, loading, error } = useSelector((state: RootState) => state.internship);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchInternships() as any);
    dispatch(fetchEmployees() as any);
  }, [dispatch]);
  
  const handleCreateInternship = () => {
    setCreateModalOpen(true);
  };
  
  const handleSubmitInternship = async (data: any) => {
    try {
      await dispatch(createInternship(data) as any);
      setCreateModalOpen(false);
      toast({
        title: 'Success',
        description: 'Internship created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create internship',
        variant: 'destructive',
      });
    }
  };
  
  const handleChangeStatus = async (id: number, status: string) => {
    try {
      await dispatch(changeInternshipStatus({ id, status }) as any);
      toast({
        title: 'Success',
        description: `Internship status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change internship status',
        variant: 'destructive',
      });
    }
  };
  
  const handleViewInternship = (id: number) => {
    dispatch(fetchInternshipById(id) as any);
    setViewModalOpen(true);
  };
  
  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Terminated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout title="Internships">
      {/* Internship Table */}
      <InternshipTable 
        internships={internships}
        onCreateInternship={handleCreateInternship}
        onViewInternship={handleViewInternship}
        onChangeStatus={handleChangeStatus}
      />
      
      {/* Internship Creation Modal */}
      <InternshipForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleSubmitInternship}
        employees={employees}
      />
      
      {/* Internship Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Internship Details</DialogTitle>
          </DialogHeader>
          
          {selectedInternship ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                    <GraduationCap className="h-5 w-5 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Internship Program</h2>
                    <p className="text-sm text-gray-500">
                      {format(new Date(selectedInternship.start_date), 'MMM yyyy')} - 
                      {format(new Date(selectedInternship.end_date), 'MMM yyyy')}
                    </p>
                  </div>
                </div>
                {getStatusBadge(selectedInternship.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Intern</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-primary-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{selectedInternship.intern_name}</p>
                        <p className="text-xs text-gray-500">Intern</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Supervisor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{selectedInternship.supervisor_name}</p>
                        <p className="text-xs text-gray-500">Supervisor</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Internship Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm">{format(new Date(selectedInternship.start_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">End Date</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm">{format(new Date(selectedInternship.end_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-sm mt-1">
                      {Math.ceil(
                        (new Date(selectedInternship.end_date).getTime() - new Date(selectedInternship.start_date).getTime()) / 
                        (1000 * 60 * 60 * 24 * 30)
                      )} months
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Created On</p>
                <p className="text-sm mt-1">{format(new Date(selectedInternship.created_at), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading internship details...</div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default InternshipsPage;

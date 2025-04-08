import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import LeaveStats from '../components/leave/LeaveStats';
import LeaveTable from '../components/leave/LeaveTable';
import LeaveRequestForm from '../components/leave/LeaveRequestForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  fetchLeaves, 
  createLeave, 
  approveLeave, 
  rejectLeave,
  fetchLeaveById,
} from '../store/leaveSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const LeavePage: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { leaves, selectedLeave, loading, error } = useSelector((state: RootState) => state.leave);
  
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchLeaves() as any);
  }, [dispatch]);
  
  const handleRequestLeave = () => {
    setRequestModalOpen(true);
  };
  
  const handleCreateLeave = async (data: any) => {
    try {
      await dispatch(createLeave(data) as any);
      setRequestModalOpen(false);
      toast({
        title: 'Success',
        description: 'Leave request submitted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit leave request',
        variant: 'destructive',
      });
    }
  };
  
  const handleApproveLeave = async (id: number) => {
    try {
      await dispatch(approveLeave(id) as any);
      toast({
        title: 'Success',
        description: 'Leave request approved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve leave request',
        variant: 'destructive',
      });
    }
  };
  
  const handleRejectLeave = async (id: number) => {
    try {
      await dispatch(rejectLeave(id) as any);
      toast({
        title: 'Success',
        description: 'Leave request rejected',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject leave request',
        variant: 'destructive',
      });
    }
  };
  
  const handleViewLeave = (id: number) => {
    dispatch(fetchLeaveById(id) as any);
    setViewModalOpen(true);
  };
  
  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <MainLayout title="Leave Management">
      {/* Leave Statistics */}
      <LeaveStats />
      
      {/* Leave Requests Table */}
      <LeaveTable 
        leaves={leaves}
        onRequestLeave={handleRequestLeave}
        onApproveLeave={handleApproveLeave}
        onRejectLeave={handleRejectLeave}
        onViewLeave={handleViewLeave}
      />
      
      {/* Leave Request Modal */}
      <LeaveRequestForm
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSubmit={handleCreateLeave}
      />
      
      {/* Leave Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedLeave ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employee</h3>
                  <p className="mt-1 text-sm">{selectedLeave.user_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${selectedLeave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        selectedLeave.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-amber-100 text-amber-800'}`}>
                      {formatStatus(selectedLeave.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="mt-1 text-sm">{format(new Date(selectedLeave.start_date), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                  <p className="mt-1 text-sm">{format(new Date(selectedLeave.end_date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="mt-1 text-sm">
                  {Math.ceil(
                    (new Date(selectedLeave.end_date).getTime() - new Date(selectedLeave.start_date).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  ) + 1} days
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reason</h3>
                <p className="mt-1 text-sm">{selectedLeave.reason}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Submitted On</h3>
                <p className="mt-1 text-sm">{format(new Date(selectedLeave.created_at), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading leave details...</div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LeavePage;

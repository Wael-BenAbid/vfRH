import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchEmployees, fetchEmployeeById, updateEmployee, deleteEmployee } from '../store/employeeSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const employeeSchema = z.object({
  first_name: z.string().min(2, 'Minimum 2 characters'),
  last_name: z.string().min(2, 'Minimum 2 characters'),
  email: z.string().email('Invalid email'),
  position: z.string().min(2, 'Minimum 2 characters'),
  user_type: z.enum(['admin', 'employee', 'intern']),
  leave_balance: z.number().min(0, 'Must be positive'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EmployeesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { employees } = useSelector((state: RootState) => state.employee);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { 
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<EmployeeFormData>({ resolver: zodResolver(employeeSchema) });

  useEffect(() => {
    dispatch(fetchEmployees() as any);
  }, [dispatch]);

  const handleEditEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    reset({
      ...employee,
      leave_balance: employee.leave_balance
    });
    setEditModalOpen(true);
  };

  const handleUpdateEmployee = async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;

    try {
      await dispatch(updateEmployee({
        id: selectedEmployee.id,
        employeeData: data
      }) as any).unwrap();

      toast({ title: 'Success', description: 'Employee updated' });
      setEditModalOpen(false);
      dispatch(fetchEmployees() as any);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update employee',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await dispatch(deleteEmployee(id) as any).unwrap();
      toast({ title: 'Success', description: 'Employee deleted' });
      dispatch(fetchEmployees() as any);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete employee',
        variant: 'destructive'
      });
    }
  };

  return (
    <MainLayout title="Employees">
      <EmployeeTable
        employees={employees}
        onAddEmployee={() => setCreateModalOpen(true)}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />

      <EmployeeForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={() => {}}
      />

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateEmployee)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  {...register('first_name')}
                  placeholder="First Name"
                />
                {errors.first_name?.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  {...register('last_name')}
                  placeholder="Last Name"
                />
                {errors.last_name?.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                {...register('email')}
                placeholder="Email"
                type="email"
              />
              {errors.email?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <Input
                {...register('position')}
                placeholder="Position"
              />
              {errors.position?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EmployeesPage;
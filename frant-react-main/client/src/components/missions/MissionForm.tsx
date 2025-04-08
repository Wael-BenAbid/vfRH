import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User } from '../../types';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Please provide a detailed description'),
  assigned_to: z.number({
    required_error: "Please select an employee",
    invalid_type_error: "Please select an employee",
  }),
  supervisor: z.number({
    required_error: "Please select a supervisor",
    invalid_type_error: "Please select a supervisor",
  }),
  deadline: z.string().min(1, 'Deadline is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface MissionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  employees: User[];
}

const MissionForm: React.FC<MissionFormProps> = ({ 
  open, 
  onClose, 
  onSubmit,
  employees 
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [assignees, setAssignees] = useState<User[]>([]);
  
  useEffect(() => {
    // Filter employees based on user type for supervisors (admin/employee)
    setSupervisors(employees.filter(emp => emp.user_type === 'admin' || emp.user_type === 'employee'));
    
    // All users can be assigned to a mission
    setAssignees(employees);
  }, [employees]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      assigned_to: 0,
      supervisor: user?.id || 0,
      deadline: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Default to 1 week from now
    },
  });

  useEffect(() => {
    // Set the supervisor field to the current user if they're admin or employee
    if (user && (user.user_type === 'admin' || user.user_type === 'employee')) {
      form.setValue('supervisor', user.id);
    }
  }, [user, form]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Mission</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mission title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the mission and its objectives..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.first_name} {emp.last_name} ({emp.user_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="supervisor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a supervisor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supervisors.map((sup) => (
                          <SelectItem key={sup.id} value={sup.id.toString()}>
                            {sup.first_name} {sup.last_name} ({sup.user_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Mission</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MissionForm;

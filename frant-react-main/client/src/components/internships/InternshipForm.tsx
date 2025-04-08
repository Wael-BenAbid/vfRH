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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addMonths, format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User } from '../../types';

const formSchema = z.object({
  intern: z.number({
    required_error: "Please select an intern",
    invalid_type_error: "Please select an intern",
  }),
  supervisor: z.number({
    required_error: "Please select a supervisor",
    invalid_type_error: "Please select a supervisor",
  }),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type FormValues = z.infer<typeof formSchema>;

interface InternshipFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  employees: User[];
}

const InternshipForm: React.FC<InternshipFormProps> = ({ 
  open, 
  onClose, 
  onSubmit,
  employees 
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [interns, setInterns] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  
  // Set default dates (start: today, end: 3 months from now)
  const today = format(new Date(), 'yyyy-MM-dd');
  const threeMonthsLater = format(addMonths(new Date(), 3), 'yyyy-MM-dd');
  
  useEffect(() => {
    // Filter interns and supervisors from employees list
    setInterns(employees.filter(emp => emp.user_type === 'intern'));
    setSupervisors(employees.filter(emp => emp.user_type === 'admin' || emp.user_type === 'employee'));
  }, [employees]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intern: 0,
      supervisor: user?.id || 0,
      start_date: today,
      end_date: threeMonthsLater,
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
    form.reset({
      intern: 0,
      supervisor: user?.id || 0,
      start_date: today,
      end_date: threeMonthsLater,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Internship</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="intern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intern</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value ? field.value.toString() : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an intern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {interns.length > 0 ? (
                        interns.map((intern) => (
                          <SelectItem key={intern.id} value={intern.id.toString()}>
                            {intern.first_name} {intern.last_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>No interns available</SelectItem>
                      )}
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
                      {supervisors.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                          {supervisor.first_name} {supervisor.last_name} ({supervisor.user_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Internship</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InternshipForm;

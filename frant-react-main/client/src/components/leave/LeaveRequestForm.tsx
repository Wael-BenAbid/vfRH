import React, { useState, useEffect } from 'react';
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
import { differenceInDays, format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const formSchema = z.object({
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  reason: z.string().min(3, 'Please provide a reason for your leave request'),
  leave_type: z.string().min(1, 'Please select a leave type'),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate >= startDate;
}, {
  message: "End date cannot be earlier than start date",
  path: ["end_date"],
});

type FormValues = z.infer<typeof formSchema>;

interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [leaveDuration, setLeaveDuration] = useState(1);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
      leave_type: 'annual',
    },
  });

  // Calculate leave duration when dates change
  useEffect(() => {
    const startDate = new Date(form.watch('start_date'));
    const endDate = new Date(form.watch('end_date'));
    
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const days = differenceInDays(endDate, startDate) + 1;
      setLeaveDuration(days > 0 ? days : 1);
    }
  }, [form.watch('start_date'), form.watch('end_date')]);

  const handleSubmit = (data: FormValues) => {
    // Extract only the fields needed for the API
    const leaveData = {
      start_date: data.start_date,
      end_date: data.end_date,
      reason: `${data.leave_type}: ${data.reason}`,
    };
    
    onSubmit(leaveData);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Leave Type */}
            <FormField
              control={form.control}
              name="leave_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date Range */}
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
            
            {/* Duration (calculated) */}
            <div>
              <p className="text-sm text-gray-600">
                Duration: <span className="font-medium">{leaveDuration} {leaveDuration === 1 ? 'day' : 'days'}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Your current leave balance: <span className="font-medium">{user?.leave_balance} days</span>
              </p>
              {leaveDuration > (user?.leave_balance || 0) && (
                <p className="text-xs text-red-500 mt-1">
                  Warning: This leave request exceeds your available balance.
                </p>
              )}
            </div>
            
            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide a reason for your leave request..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;

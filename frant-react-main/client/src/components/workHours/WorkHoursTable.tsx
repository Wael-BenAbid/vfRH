import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { WorkHours } from '../../types';
import { Clock, PlusCircle, Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface WorkHoursTableProps {
  workHours: WorkHours[];
  onLogHours: () => void;
}

const WorkHoursTable: React.FC<WorkHoursTableProps> = ({
  workHours,
  onLogHours,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const itemsPerPage = 10;
  
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.user_type === 'admin';
  
  // Filter and paginate work hours
  const filteredWorkHours = workHours.filter(hours => {
    // Filter by search term (user name)
    const matchesSearch = hours.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected date if admin is viewing
    const matchesDate = isAdmin 
      ? true 
      : selectedDate === '' || hours.date === selectedDate;
    
    return matchesSearch && matchesDate;
  });
  
  const totalPages = Math.ceil(filteredWorkHours.length / itemsPerPage);
  const paginatedWorkHours = filteredWorkHours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate total hours worked in the selected period
  const totalHoursWorked = filteredWorkHours.reduce((total, hours) => {
    return total + parseFloat(hours.hours_worked.toString());
  }, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle>Work Hours</CardTitle>
          <Button onClick={onLogHours}>
            <Clock className="h-4 w-4 mr-2" />
            Log Hours
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search by employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-60"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Date Filter (only for non-admin users) */}
          {!isAdmin && (
            <div className="relative w-full sm:w-auto flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
          )}
          
          {/* Total Hours Display */}
          <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-md flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Total Hours: {totalHoursWorked.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Logged On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedWorkHours.length > 0 ? (
                paginatedWorkHours.map((workHour) => (
                  <TableRow key={workHour.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                          <span className="font-medium text-primary-700 text-xs">
                            {workHour.user_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span>{workHour.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(workHour.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="font-medium">{workHour.hours_worked} hours</div>
                    </TableCell>
                    <TableCell>{format(new Date(workHour.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No work hours records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} 
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkHoursTable;

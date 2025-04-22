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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Internship } from '../../types';
import { GraduationCap, Search, PlusCircle, MoreHorizontal, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface InternshipTableProps {
  internships: Internship[];
  onCreateInternship: () => void;
  onViewInternship: (id: number) => void;
  onChangeStatus: (id: number, status: string) => void;
}

const InternshipTable: React.FC<InternshipTableProps> = ({
  internships,
  onCreateInternship,
  onViewInternship,
  onChangeStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.user_type === 'admin';
  
  // Filter and paginate internships
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.intern_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        internship.supervisor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || internship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);
  const paginatedInternships = filteredInternships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Function to format status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">Pending</span>;
      case 'active':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Completed</span>;
      case 'terminated':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Terminated</span>;
      default:
        return <span>{status}</span>;
    }
  };
  
  // Check if user is supervisor for an internship
  const isSupervisor = (internship: Internship) => {
    return internship.supervisor === user?.id;
  };

  // Status change options based on current status
  const getStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return [
          { value: 'active', label: 'Activate Internship' },
          { value: 'terminated', label: 'Terminate Internship' }
        ];
      case 'active':
        return [
          { value: 'completed', label: 'Mark as Completed' },
          { value: 'terminated', label: 'Terminate Internship' }
        ];
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle>Internships</CardTitle>
          {isAdmin && (
            <Button onClick={onCreateInternship}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Internship
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-80"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intern</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInternships.length > 0 ? (
                paginatedInternships.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">
                            {internship.intern_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{internship.intern_name}</div>
                          <div className="flex items-center text-xs text-gray-500">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            <span>Intern</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{internship.supervisor_name}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {format(new Date(internship.start_date), 'MMM dd, yyyy')} - 
                        {format(new Date(internship.end_date), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(internship.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onViewInternship(internship.id)}
                        >
                          <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </Button>
                        
                        {(isAdmin || isSupervisor(internship)) && 
                         (internship.status === 'pending' || internship.status === 'active') && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {getStatusOptions(internship.status).map(option => (
                                <DropdownMenuItem 
                                  key={option.value}
                                  onClick={() => onChangeStatus(internship.id, option.value)}
                                >
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No internships found
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

export default InternshipTable;

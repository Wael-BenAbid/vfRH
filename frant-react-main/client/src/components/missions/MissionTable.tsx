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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Mission } from '../../types';
import { Eye, CheckCircle, PlusCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface MissionTableProps {
  missions: Mission[];
  onCreateMission: () => void;
  onCompleteMission: (id: number) => void;
  onViewMission: (id: number) => void;
}

const MissionTable: React.FC<MissionTableProps> = ({
  missions,
  onCreateMission,
  onCompleteMission,
  onViewMission,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.user_type === 'admin';
  
  // Filter and paginate missions
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && mission.completed) ||
                         (statusFilter === 'active' && !mission.completed);
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredMissions.length / itemsPerPage);
  const paginatedMissions = filteredMissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Check if user is assigned to or supervising a mission
  const isAssignedOrSupervisor = (mission: Mission) => {
    return mission.assigned_to === user?.id || mission.supervisor === user?.id;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle>Missions</CardTitle>
          {(isAdmin || user?.user_type === 'employee') && (
            <Button onClick={onCreateMission}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Mission
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search missions..."
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
              <SelectItem value="all">All Missions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMissions.length > 0 ? (
                paginatedMissions.map((mission) => (
                  <TableRow key={mission.id}>
                    <TableCell>
                      <div className="font-medium">{mission.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {mission.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                          <span className="font-medium text-primary-700 text-xs">
                            {mission.assigned_to_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span>{mission.assigned_to_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{mission.supervisor_name}</TableCell>
                    <TableCell>{format(new Date(mission.deadline), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {mission.completed ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onViewMission(mission.id)}
                        >
                          <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </Button>
                        
                        {!mission.completed && isAssignedOrSupervisor(mission) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <CheckCircle className="h-4 w-4 text-green-600 hover:text-green-800" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Complete Mission</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to mark this mission as completed?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onCompleteMission(mission.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Complete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No missions found
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

export default MissionTable;

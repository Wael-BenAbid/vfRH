import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
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
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const formSchema = z.object({
  application_type: z.enum(['employee', 'intern'], {
    required_error: "Please select application type",
  }),
  position: z.string().min(3, 'Position name is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  education: z.string().min(10, 'Please provide your educational background'),
  experience: z.string().min(10, 'Please provide your work experience'),
  motivation: z.string().min(20, 'Please explain your motivation for applying'),
  cv_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `File size must be less than 5MB`)
    .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), `Only PDF and Word documents are accepted`),
});

type FormValues = z.infer<typeof formSchema>;

interface JobApplicationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const fetchJobApplications = async (token: string) => {
  try {
    const response = await axios.get('http://localhost:8000/api/job-applications/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw new Error('Failed to fetch job applications');
  }
};

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      application_type: 'employee',
      position: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      education: '',
      experience: '',
      motivation: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PDF and Word documents are accepted",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue('cv_file', file);
    setFileName(file.name);
  };

  const handleSubmit = (data: FormValues) => {
    const formData = new FormData();
    
    // Append all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'cv_file') {
        formData.append(key, value as File);
      } else {
        formData.append(key, value as string);
      }
    });
    
    onSubmit(formData);
    form.reset();
    setFileName('');
  };

  interface JobApplication {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    created_at: string;
    cv_file: string;
  }

  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');

  const handleApplicationAction = (id: string, action: 'approve' | 'reject') => {
    // Handle application action logic here
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Application</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="application_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select application type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your educational background, degrees, certifications, etc."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your previous work experience, roles, responsibilities, etc."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivation</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Why are you interested in this position? What motivates you to apply?"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cv_file"
                render={() => (
                  <FormItem>
                    <FormLabel>Resume/CV</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="cv-upload"
                          onChange={handleFileChange}
                        />
                        <label 
                          htmlFor="cv-upload" 
                          className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                        >
                          Choose File
                        </label>
                        <span className="ml-2 text-sm text-gray-500">
                          {fileName || 'No file chosen (PDF, DOC, DOCX, max 5MB)'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Submit Application</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Pending Job Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Job Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationsLoading ? (
            <p>Loading applications...</p>
          ) : applicationsError ? (
            <p className="text-red-500">{applicationsError}</p>
          ) : jobApplications.length === 0 ? (
            <p className="text-gray-600">No job applications found</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobApplications.map((application) => (
                <div
                  key={application.id}
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {application.first_name} {application.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{application.email}</p>
                    <p className="text-sm text-gray-500">Position: {application.position}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on: {new Date(application.created_at).toLocaleDateString()}
                    </p>
                    <a
                      href={application.cv_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View CV
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => handleApplicationAction(application.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApplicationAction(application.id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const JobApplicationsPage: React.FC = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupérez le token depuis le stockage local
    if (token) {
      fetchJobApplications(token)
        .then((data) => {
          setJobApplications(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch job applications');
          setLoading(false);
        });
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h1>Job Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>
          {jobApplications.map((application: any) => (
            <li key={application.id}>
              {application.first_name} {application.last_name} - {application.position}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplicationsPage;

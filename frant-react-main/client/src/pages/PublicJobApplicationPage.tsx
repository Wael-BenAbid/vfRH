import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { WaveyBackground } from '@/components/ui/wavey-background';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { FloatingShapes } from '@/components/ui/floating-shapes';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const formSchema = z.object({
  application_type: z.enum(['employee', 'intern'], {
    required_error: "Veuillez sélectionner un type de candidature",
  }),
  position: z.string().min(3, 'Le poste est requis'),
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(10, 'Veuillez entrer un numéro de téléphone valide'),
  education: z.string().min(10, 'Veuillez fournir vos antécédents éducatifs'),
  experience: z.string().min(10, 'Veuillez fournir votre expérience professionnelle'),
  motivation: z.string().min(20, 'Veuillez expliquer votre motivation pour ce poste'),
  cv_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `La taille du fichier doit être inférieure à 5MB`)
    .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), `Seuls les documents PDF et Word sont acceptés`),
});

type FormValues = z.infer<typeof formSchema>;

const PublicJobApplicationPage: React.FC = () => {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        title: "Fichier trop volumineux",
        description: "La taille du fichier doit être inférieure à 5MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Type de fichier invalide",
        description: "Seuls les documents PDF et Word sont acceptés",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue('cv_file', file);
    setFileName(file.name);
  };

  const handleSubmit = async (data: FormValues) => {
    const formData = new FormData();

    // Ajoutez toutes les données du formulaire à FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'cv_file') {
        formData.append(key, value as File); // Ajoutez le fichier CV
      } else {
        formData.append(key, value as string); // Ajoutez les autres champs
      }
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/job-applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Application submitted successfully:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting application:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <FloatingShapes count={15} shapeColors={["primary", "secondary"]} minSize={40} maxSize={100} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="border-primary/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto rounded-full p-3 bg-green-100 text-green-600 w-fit mb-2">
                <CheckCircle2 size={32} />
              </div>
              <CardTitle className="text-xl font-bold">Candidature envoyée !</CardTitle>
              <CardDescription>
                Votre candidature a été soumise avec succès et sera examinée par notre équipe RH.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center pt-4 pb-6">
              <p className="text-muted-foreground mb-6">
                Nous vous contacterons prochainement concernant le statut de votre candidature.
                Merci de votre intérêt pour notre entreprise !
              </p>
              
              <Button asChild>
                <Link to="/" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la page d'accueil
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <FloatingShapes count={15} shapeColors={["primary", "secondary"]} minSize={40} maxSize={100} />
      
      {/* En-tête */}
      <WaveyBackground className="py-12 px-4" waveOpacity={0.1}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-4">
            <Button asChild variant="outline" size="sm" className="mb-6">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
              </Link>
            </Button>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "mirror" 
              }}
            >
              Postuler à un emploi
            </motion.h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Remplissez ce formulaire pour soumettre votre candidature.
              Notre équipe examinera votre dossier et vous contactera prochainement.
            </p>
          </div>
        </div>
      </WaveyBackground>
      
      {/* Formulaire de candidature */}
      <AnimatedGradient 
        className="py-8"
        animationSpeed={15}
        gradientSize="sm"
      >
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Formulaire de candidature</CardTitle>
              <CardDescription>
                Tous les champs marqués * sont obligatoires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="application_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de candidature *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type de candidature" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employee">Employé</SelectItem>
                            <SelectItem value="intern">Stagiaire</SelectItem>
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
                        <FormLabel>Poste souhaité *</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. Développeur Web" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean" {...field} />
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
                          <FormLabel>Nom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Dupont" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jean.dupont@exemple.com" {...field} />
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
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+33612345678" {...field} />
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
                        <FormLabel>Formation *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre parcours éducatif, diplômes, certifications, etc."
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
                        <FormLabel>Expérience professionnelle *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez vos expériences professionnelles, rôles, responsabilités, etc."
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
                        <FormLabel>Lettre de motivation *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Pourquoi êtes-vous intéressé par ce poste ? Quelles sont vos motivations ?"
                            className="resize-none"
                            rows={4}
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
                        <FormLabel>CV / Résumé *</FormLabel>
                        <FormControl>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              id="cv-upload"
                              onChange={handleFileChange}
                            />
                            <label 
                              htmlFor="cv-upload" 
                              className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium"
                            >
                              Choisir un fichier
                            </label>
                            <span className="text-sm text-muted-foreground flex-1 truncate">
                              {fileName || 'Aucun fichier choisi (PDF, DOC, DOCX, max 5MB)'}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <CardFooter className="px-0 pt-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={submitting}
                    >
                      {submitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </AnimatedGradient>
    </div>
  );
};

export default PublicJobApplicationPage;
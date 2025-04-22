
import React, { useState } from 'react';
import JobApplicationForm from '../components/jobApplications/JobApplicationForm';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecruitmentPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmitApplication = async (formData: FormData) => {
    try {
      await axios.post('/api/job-applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({
        title: "Candidature envoyée",
        description: "Votre candidature a été soumise avec succès et est en attente d'approbation.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre candidature.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Postuler chez nous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <JobApplicationForm
            open={true}
            onClose={() => {}}
            onSubmit={handleSubmitApplication}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentPage;

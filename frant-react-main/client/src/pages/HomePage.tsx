import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { WaveyBackground } from '@/components/ui/wavey-background';
import { ArrowRight, Briefcase, Clock, BarChart, Users, BookOpen, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingShapes count={20} shapeColors={["primary", "secondary"]} minSize={20} maxSize={80} />
      
      {/* Hero section */}
      <WaveyBackground className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600">
                Système de Gestion RH
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Plateforme complète pour la gestion des ressources humaines, 
              le suivi des congés, des missions, et des candidatures
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" asChild>
                <Link to="/login">
                  Se connecter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/postuler">
                  Postuler maintenant <Briefcase className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </WaveyBackground>
      
      {/* Features section */}
      <AnimatedGradient 
        className="py-16 px-4"
        animationSpeed={20}
        gradientSize="lg"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre système offre une gamme complète d'outils pour gérer efficacement
              toutes les fonctions RH de votre entreprise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Clock className="h-6 w-6" />}
              title="Gestion des congés"
              description="Suivi des demandes de congés, approbations automatisées et gestion des soldes de congés pour tous les employés."
            />
            
            <FeatureCard 
              icon={<Briefcase className="h-6 w-6" />}
              title="Suivi des missions"
              description="Attribution et suivi des missions, rapports d'avancement et gestion des échéances pour améliorer la productivité."
            />
            
            <FeatureCard 
              icon={<BarChart className="h-6 w-6" />}
              title="Heures de travail"
              description="Enregistrement précis des heures travaillées, analyses de productivité et rapports détaillés par employé."
            />
            
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Gestion des employés"
              description="Base de données complète des employés avec informations détaillées, historique et évaluations de performance."
            />
            
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6" />}
              title="Programme de stages"
              description="Gestion des stagiaires, suivi des missions, évaluations et conversion en employés permanents."
            />
            
            <FeatureCard 
              icon={<Shield className="h-6 w-6" />}
              title="Recrutement"
              description="Processus de candidature simplifié, évaluation des candidats et gestion efficace du recrutement."
            />
          </div>
        </div>
      </AnimatedGradient>
      
      {/* CTA Section */}
      <section className="bg-primary/5 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-card border rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Rejoignez notre équipe</h2>
                <p className="text-muted-foreground mb-0">
                  Nous recherchons des talents motivés pour rejoindre notre entreprise en pleine croissance.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/postuler">
                  Voir les offres d'emploi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">Système de Gestion RH</h3>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Tous droits réservés
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                Se connecter
              </Link>
              <Link to="/postuler" className="text-sm text-muted-foreground hover:text-primary">
                Postuler
              </Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="bg-primary/10 rounded-full p-3 w-fit mb-4">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HomePage;
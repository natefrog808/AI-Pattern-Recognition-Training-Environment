import React from 'react';
import TrainingEnvironment from '../components/TrainingEnvironment';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold">AI Pattern Recognition Training</h1>
          <p className="text-muted-foreground mt-2">
            Train and improve pattern recognition skills through interactive challenges
          </p>
        </header>
        
        <TrainingEnvironment />
        
        <footer className="text-center text-sm text-muted-foreground py-8">
          <p>Built with Next.js and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

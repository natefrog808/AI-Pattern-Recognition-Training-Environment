npx create-next-app@latest my-app
cd my-app
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ text: 'Hello' });
}
NEXT_PUBLIC_API_KEY=your_api_key_here
DB_URL=your_db_connection_string
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Brain, Trophy, Users, LineChart, Star, Target, Book, Map, 
  AlertCircle, CheckCircle2, Loader 
} from 'lucide-react';
import LearningPath from '../classes/LearningPath';
import MLSystem from '../classes/MLSystem';
import { LEARNING_TRACKS, PATTERN_TYPES } from '../types/types';
import ProgressView from './ProgressView';

const TrainingEnvironment = () => {
  // State
  const [learningPath] = useState(() => new LearningPath(LEARNING_TRACKS.PATTERN_RECOGNITION));
  const [mlSystem] = useState(() => new MLSystem());
  const [showProgress, setShowProgress] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [aiThoughts, setAiThoughts] = useState([]);
  const [isAISolving, setIsAISolving] = useState(false);

  // Computed values
  const progressReport = useMemo(() => 
    learningPath.getProgressReport(), 
    [learningPath, currentChallenge]
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      mlSystem.cleanup();
    };
  }, [mlSystem]);

  // Helper functions
  const handleChallengeComplete = (result) => {
    learningPath.updateProgress({
      ...result,
      success: true,
      pattern: currentChallenge?.data?.pattern || { type: 'unknown' }
    });
    setCurrentChallenge(null);
    setUserAnswer('');
    setFeedback({
      status: 'success',
      message: `Challenge completed! Earned ${result.score} XP`
    });
  };

  const generateNewChallenge = () => {
    const challenge = learningPath.generateChallenge();
    setCurrentChallenge(challenge);
    setUserAnswer('');
    setFeedback(null);
    setAiThoughts([]);
  };

  const handleAISolve = async () => {
    if (!currentChallenge || isAISolving) return;

    setIsAISolving(true);
    setAiThoughts([]);
    
    try {
      setAiThoughts(prev => [...prev, "Analyzing sequence pattern..."]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const prediction = mlSystem.predict(currentChallenge.data.sequence);
      setAiThoughts(prev => [...prev, 
        `Detected ${prediction.type} pattern with ${(prediction.confidence * 100).toFixed(1)}% confidence`
      ]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nextValue = currentChallenge.data.sequence[currentChallenge.data.sequence.length - 1] * 2;
      setAiThoughts(prev => [...prev, `Predicted next value: ${nextValue.toFixed(2)}`]);
      setUserAnswer(nextValue.toFixed(2));
    } catch (error) {
      setFeedback({
        status: 'error',
        message: 'AI solving failed: ' + error.message
      });
    } finally {
      setIsAISolving(false);
    }
  };

  const submitAnswer = () => {
    if (!currentChallenge) return;

    try {
      const numAnswer = Number(userAnswer);
      if (!Number.isFinite(numAnswer)) {
        throw new Error('Please enter a valid number');
      }

      const isCorrect = Math.abs(numAnswer - currentChallenge.data.nextNumber) < 0.001;
      
      mlSystem.learn(
        currentChallenge.data.sequence,
        currentChallenge.data.pattern,
        isCorrect
      );

      if (isCorrect) {
        const timeTaken = (Date.now() - currentChallenge.startTime) / 1000;
        const score = Math.max(0, 100 - timeTaken / 10);
        handleChallengeComplete({ score });
      } else {
        setFeedback({
          status: 'error',
          message: 'Not quite right. Try again!'
        });
      }
    } catch (error) {
      setFeedback({
        status: 'error',
        message: error.message
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <span>AI Training Environment</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProgress(!showProgress)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              {showProgress ? 'Return to Training' : 'View Progress'}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">{progressReport.experiencePoints} XP</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Challenge Area */}
          {currentChallenge && !showProgress && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Pattern Challenge</h3>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(currentChallenge.data.sequence, null, 2)}
                </pre>
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your answer..."
                  disabled={isAISolving}
                />
                <button
                  onClick={submitAnswer}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  disabled={isAISolving}
                >
                  Submit
                </button>
                <button
                  onClick={handleAISolve}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                  disabled={isAISolving}
                >
                  {isAISolving && <Loader className="w-4 h-4 animate-spin" />}
                  Let AI Solve
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {aiThoughts.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <h4 className="font-medium text-gray-700">AI Analysis:</h4>
              {aiThoughts.map((thought, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-1 text-blue-500" />
                  <p className="text-sm text-gray-600">{thought}</p>
                </div>
              ))}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`flex items-center gap-2 p-4 rounded-lg ${
              feedback.status === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {feedback.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <p className="text-sm">{feedback.message}</p>
            </div>
          )}

          {/* Progress View or Start Button */}
          {!currentChallenge && !showProgress ? (
            <div className="text-center py-8">
              <button
                onClick={generateNewChallenge}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start New Challenge
              </button>
            </div>
          ) : (
            <ProgressView progressReport={progressReport} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingEnvironment;



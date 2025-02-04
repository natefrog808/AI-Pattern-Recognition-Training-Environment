import React from 'react';
import { Star, AlertCircle } from 'lucide-react';

const ProgressView = ({ progressReport }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Current Level</div>
          <div className="text-xl font-bold mt-1">{progressReport.currentLevel}</div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${progressReport.levelProgress * 100}%` }}
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Success Rate</div>
          <div className="text-xl font-bold mt-1">
            {(progressReport.successRate * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Recent Challenges</h3>
        {progressReport.recentHistory.map((challenge, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded flex justify-between items-center">
            <div className="flex items-center gap-2">
              {challenge.success ? (
                <Star className="w-5 h-5 text-yellow-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">{challenge.pattern?.type || 'Unknown'} Pattern</span>
            </div>
            <span className="text-sm font-medium">{challenge.score} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressView;

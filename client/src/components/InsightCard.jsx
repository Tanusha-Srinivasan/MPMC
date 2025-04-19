import React from 'react';
import { LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';

const InsightCard = ({ text, isRecommendation = false }) => {
  return (
    <div className={`p-4 rounded-lg flex items-start gap-3 ${
      isRecommendation ? 'bg-amber-50 border border-amber-100' : 'bg-indigo-50 border border-indigo-100'
    }`}>
      {isRecommendation ? (
        <SparklesIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      ) : (
        <LightBulbIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
      )}
      <p className="text-gray-700">{text}</p>
    </div>
  );
};

export default InsightCard;
// src/utils/helpers.js
export const getScoreInfo = (score) => {
    if (score === null) {
      return { // Default state before loading
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        ringColor: 'ring-gray-400',
        message: 'Loading score...'
      };
    }
    if (score >= 80) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        ringColor: 'ring-green-400',
        message: 'Outstanding consistency! Keep up the great work!',
        level: 'Advanced',
        splitColor: 'green'
      };
    } else if (score >= 40) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        ringColor: 'ring-yellow-400',
        message: 'Good consistency! You\'re building solid habits.',
        level: 'Intermediate',
        splitColor: 'yellow'
      };
    } else {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        ringColor: 'ring-red-400',
        message: 'Starting your fitness journey! Let\'s build consistency together.',
        level: 'Beginner',
        splitColor: 'red'
      };
    }
  };
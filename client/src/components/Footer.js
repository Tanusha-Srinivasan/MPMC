import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-600 py-6 mt-16 border-t border-gray-300"> {/* Darker bg, top border */}
      <div className="container mx-auto px-4 text-center text-sm"> {/* Smaller text */}
        <p>© {new Date().getFullYear()} FitSplit. All rights reserved.</p>
        <p className="mt-1">
          Workout splits tailored to your consistency. Built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
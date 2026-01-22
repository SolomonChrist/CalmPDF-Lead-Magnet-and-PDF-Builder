
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full px-6 py-8 border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <a 
          href="https://solomonchristai.substack.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-indigo-600 transition-colors font-medium"
        >
          Join My Newsletter
        </a>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline">•</span>
          <p>© {new Date().getFullYear()} Solomon Christ. Created with intent.</p>
        </div>
        <a 
          href="https://www.solomonchrist.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-indigo-600 transition-colors font-medium"
        >
          Solomon Christ AI Website
        </a>
      </div>
    </footer>
  );
};

export default Footer;

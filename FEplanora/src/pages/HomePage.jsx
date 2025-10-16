import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/admin/login"); // <-- route to admin login page
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('G:/ProjectPlanora/FEplanora/src/assets/image5.jpg')] bg-cover bg-center bg-fixed opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/80 to-slate-900/85"></div>

      {/* Glow Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
            Planora
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 font-light">
            Event Management Platform
          </p>
        </div>

        {/* Description */}
        <div className="mb-10 max-w-3xl">
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            An Event Management System with Task Coordination <br />
            Plan events, assign responsibilities, and keep your committee organized - all in one platform.
          </p>
        </div>

        {/* Get Started Button */}
        <div className="mt-6">
          <button
            onClick={handleGetStarted}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition duration-300"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10">
          <p className="text-gray-400 text-sm">
            Empowering seamless event management experiences
          </p>
        </div>
      </div>
    </div>
  );
}

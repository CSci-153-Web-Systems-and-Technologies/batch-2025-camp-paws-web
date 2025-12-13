"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeSwitcher";

export default function Home() {
  const [showFullContent, setShowFullContent] = useState(false);

  // Handle scroll to show content
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Show content if user scrolls down more than 300px (much more responsive)
      if (scrollPosition > 300) {
        setShowFullContent(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle "Learn More" click
  const handleLearnMore = () => {
    setShowFullContent(true);
    // Wait for content to render, then scroll to features section
    setTimeout(() => {
      const featuresSection = document.getElementById('features-section');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Small delay to allow content to render
  };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-4 sm:px-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg mt-4 mx-4 transition-colors">
        <div className="flex items-center">
          <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">CAMP-PAWS</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <Link 
            href="/signup"
            className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
          >
            Sign-Up
          </Link>
          <Link 
            href="/login"
            className="text-sm sm:text-base bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md font-medium transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      <div className="flex justify-center px-4 sm:px-6 mt-4 sm:mt-8"> 
        <Image 
          src="/Cat and dog-pana.svg" 
          alt="Cat and Dog-1" 
          width={500} 
          height={500}
          className="w-full max-w-md sm:max-w-lg"
        />
      </div>
      <div className="flex flex-col items-center mt-6 sm:mt-8 px-4 sm:px-6 text-center"> 
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100">
          Campus Animal Monitoring Platform
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mt-3 sm:mt-4">
          Pets and Welfare System
        </h2>
        <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 max-w-4xl">
          &quot;Where every report becomes a step toward safer, cared for campus animals.&quot;
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
          <Link 
            href="/signup"
            className="bg-green-600 dark:bg-green-500 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-center"
          >
            Get Started
          </Link>
          <button 
            onClick={handleLearnMore}
            className="border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-50 dark:hover:bg-gray-800 transition-colors text-center"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Features Section and below - content visibility controlled */}
      <div>
          {/* Features Section */}
          <div id="features-section" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-700 delay-200 ${
          showFullContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Why CAMP-PAWS?</h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">Making campus animal welfare everyone&apos;s responsibility</p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className={`text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-700 delay-300 ${
            showFullContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Geospatial Tracking</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Report animal sightings with precise location data using interactive maps</p>
          </div>
          
          <div className={`text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-700 delay-500 ${
            showFullContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Community Driven</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Campus community members work together to monitor and care for animals</p>
          </div>
          
          <div className={`text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-700 delay-700 ${
            showFullContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Data-Driven Decisions</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Verified reports help university administrators make informed welfare decisions</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-green-50 dark:bg-gray-800 py-12 sm:py-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-8 sm:mb-12 transition-all duration-700 delay-900 ${
            showFullContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">Simple steps to help campus animals</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className={`text-center transition-all duration-700 delay-1000 ${
              showFullContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}>
              <div className="bg-green-600 dark:bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform hover:scale-110">1</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Report Sighting</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Spot an animal? Submit a report with location, photos, and condition details</p>
            </div>
            
            <div className={`text-center transition-all duration-700 delay-1200 ${
              showFullContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}>
              <div className="bg-green-600 dark:bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform hover:scale-110">2</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Verification</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Veterinary students and staff verify and analyze the reported data</p>
            </div>
            
            <div className={`text-center transition-all duration-700 delay-1400 ${
              showFullContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}>
              <div className="bg-green-600 dark:bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform hover:scale-110">3</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Track & Care</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitor animal populations and coordinate care efforts across campus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 dark:bg-gray-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">Making a Difference</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Community Members</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Reports Submitted</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Animals Tracked</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-green-600 dark:bg-green-700 py-12 sm:py-16 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to Help Campus Animals?</h2>
          <p className="text-lg sm:text-xl text-green-100 dark:text-green-200 mb-6 sm:mb-8">Join the CAMP-PAWS community today and make a difference</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="bg-white text-green-600 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-50 dark:bg-gray-100 dark:hover:bg-gray-200 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link 
              href="/login"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 sm:py-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-3 sm:mb-4">CAMP-PAWS</h3>
              <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400">Campus Animal Monitoring Platform - Pets and Welfare System</p>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Platform</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-300 dark:text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Report Sighting</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Animal Records</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-300 dark:text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">University</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-300 dark:text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Visayas State University</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Veterinary Medicine</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Campus Safety</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
            <p>&copy; 2025 CAMP-PAWS. All rights reserved. | Developed by Xyryll Taneo</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

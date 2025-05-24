import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FallbackPage from './components/FallbackPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import FitnessPlannerPage from './pages/FitnessPlannerPage';

// Lazy load components
const HeroSection = lazy(() => import('./components/HeroSection'));
const ProductsSection = lazy(() => import('./components/ProductsSection'));
const WhyUsSection = lazy(() => import('./components/WhyUsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const FaqSection = lazy(() => import('./components/FaqSection'));
const TrainersPage = lazy(() => import('./pages/TrainersPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const VideoCallPage = lazy(() => import('./pages/VideoCallPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#178582]"></div>
  </div>
);

function HomePage() {
  return (
    <main className="w-full">
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        <ProductsSection />
        <WhyUsSection />
        <FaqSection />
        <ContactSection />
      </Suspense>
    </main>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-grow w-full">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/trainers" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TrainersPage />
                </Suspense>
              } />
              <Route path="/booking/:trainerId" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <BookingPage />
                </Suspense>
              } />
              <Route path="/video-call/:sessionId" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <VideoCallPage />
                </Suspense>
              } />
              <Route path="/fitness-planner" element={<FitnessPlannerPage />} />
              <Route path="*" element={<FallbackPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}
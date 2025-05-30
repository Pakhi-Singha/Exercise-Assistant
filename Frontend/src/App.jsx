import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FallbackPage from './components/FallbackPage';
import ErrorBoundary from './components/ErrorBoundary';
import PlannerTabs from './components/PlannerTabs';
import './App.css';
import FitnessPlannerPage from './pages/FitnessPlannerPage';
import { ClerkProvider } from '@clerk/clerk-react';

// Lazy load components
const HeroSection = lazy(() => import('./components/HeroSection'));
const ProductsSection = lazy(() => import('./components/ProductsSection'));
const WhyUsSection = lazy(() => import('./components/WhyUsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const FaqSection = lazy(() => import('./components/FaqSection'));
const WorkoutPlannerPage = lazy(() => import('./pages/WorkoutPlannerPage'));
const MealPlannerPage = lazy(() => import('./pages/MealPlannerPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#178582]"></div>
  </div>
);

// Replace the environment variable with direct key
const clerkPubKey = "pk_test_dmFsdWVkLXNoZXBoZXJkLTkuY2xlcmsuYWNjb3VudHMuZGV2JA";

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

function PlannerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlannerTabs />
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ErrorBoundary>
        <div className="min-h-screen w-full flex flex-col">
          <Navbar />
          <div className="flex-grow w-full">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/workout-planner" element={
                  <PlannerLayout>
                    <WorkoutPlannerPage />
                  </PlannerLayout>
                } />
                <Route path="/meal-planner" element={
                  <PlannerLayout>
                    <MealPlannerPage />
                  </PlannerLayout>
                } />
                <Route path="/fitness-planner" element={<FitnessPlannerPage />} />
                <Route path="*" element={<FallbackPage />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    </ClerkProvider>
  );
}
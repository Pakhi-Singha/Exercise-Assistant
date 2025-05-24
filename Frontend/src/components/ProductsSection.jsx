import { Link } from 'react-router-dom';
import productImage1 from '../assets/product-1.svg';
import productImage2 from '../assets/product-2.svg';
import productImage3 from '../assets/product-3.svg';

const ProductsSection = () => {
  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Innovative fitness solutions designed to transform your health journey with cutting-edge technology.
          </p>
        </div>
        
        {/* pose correction section */}
        <div className="flex flex-col md:flex-row items-center mb-20">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Correct Your Pose</h3>
            <p className="text-lg text-gray-600 mb-6">
              Our AI-powered posture correction tool analyzes your movements in real-time and provides instant feedback to improve your form during workouts.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#E7473C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Real-time posture analysis</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#E7473C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Injury prevention guidance</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#E7473C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Performance tracking over time</span>
              </li>
            </ul>
            <button className="bg-[#E7473C] hover:bg-red-600 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300">
              Try It Now
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src={productImage1} 
              alt="AI Posture Correction" 
              className="rounded-lg shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x400?text=Posture+Correction';
              }}
            />
          </div>
        </div>
        
       {/* Appointment booking section */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-20">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Book an Appointment with Professionals</h3>
            <p className="text-lg text-gray-600 mb-6">
              Connect with certified trainers, nutritionists, and physiotherapists to get personalized guidance for your fitness journey.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#178582] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy scheduling system</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#178582] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Video consultations available</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#178582] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Verified fitness professionals</span>
              </li>
            </ul>
            <Link to="/trainers" className="inline-block bg-[#178582] hover:bg-teal-700 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300">
              Book Now
            </Link>
          </div>
          <div className="md:w-1/2">
            <img 
              src={productImage2} 
              alt="Professional Appointment Booking" 
              className="rounded-lg shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x400?text=Appointment+Booking';
              }}
            />
          </div>
        </div>
        
        {/* meal planner and workout planner section */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Meal Planner and Workout Planner</h3>
            <p className="text-lg text-gray-600 mb-6">
              Generate personalized meal and workout plans based on your goals, preferences, and schedule for maximum results.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Customized nutrition plans</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Progressive workout routines</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Grocery lists and meal prep guides</span>
              </li>
            </ul>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300">
              Create Your Plan
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src={productImage3} 
              alt="Meal and Workout Planner" 
              className="rounded-lg shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x400?text=Meal+and+Workout+Planner';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FitnessPlannerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    workoutType: 'Gym',
    injury: 'None',
    fitnessLevel: 'Intermediate',
    dietaryPreference: 'Vegetarian (Plant based + dairy)',
    gymAccess: 'Yes'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api-lr.agent.ai/v1/agent/ra9wpwngar25h2ol/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_input: `Please select a workout you're interested in getting a personalized plan for: ${formData.workoutType}. 
          Do you have any current or past injury: ${formData.injury}. 
          What is your current fitness level: ${formData.fitnessLevel}. 
          Nutrition & Recovery: What is your dietary preference: ${formData.dietaryPreference}. 
          Equipment & Accessibility: Do you have access to a gym, fitness facility, or will you be working out at home: ${formData.gymAccess}.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      setPlan(data);
      toast.success('Your fitness plan has been generated!', {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
        className: 'bg-[#00334D] text-white'
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate fitness plan. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
        className: 'bg-[#00334D] text-white'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        backgroundImage: 'url("/Night5.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#001022",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Your Fitness Plan</h1>
        
        <div className="max-w-2xl mx-auto bg-[#001022]/80 p-6 rounded-lg shadow-lg">
          <div className="space-y-6">
            {/* Workout Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What type of workout are you interested in?
              </label>
              <select
                name="workoutType"
                value={formData.workoutType}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-white/10 border border-gray-600 text-white"
              >
                <option value="Gym">Gym</option>
                <option value="Home">Home</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            {/* Injury Status */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Do you have any current or past injuries?
              </label>
              <select
                name="injury"
                value={formData.injury}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-white/10 border border-gray-600 text-white"
              >
                <option value="None">None</option>
                <option value="Knee">Knee</option>
                <option value="Back">Back</option>
                <option value="Shoulder">Shoulder</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Fitness Level */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What is your current fitness level?
              </label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-white/10 border border-gray-600 text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What is your dietary preference?
              </label>
              <select
                name="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-white/10 border border-gray-600 text-white"
              >
                <option value="Vegetarian (Plant based + dairy)">Vegetarian (Plant based + dairy)</option>
                <option value="Vegan">Vegan</option>
                <option value="Omnivore">Omnivore</option>
                <option value="Keto">Keto</option>
                <option value="Paleo">Paleo</option>
              </select>
            </div>

            {/* Gym Access */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Do you have access to a gym or fitness facility?
              </label>
              <select
                name="gymAccess"
                value={formData.gymAccess}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-white/10 border border-gray-600 text-white"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={generatePlan}
                disabled={isLoading}
                className="bg-white text-[#00334D] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Generating Plan...' : 'Generate My Fitness Plan'}
              </button>
            </div>
          </div>

          {/* Display the generated plan */}
          {plan && (
            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Your Personalized Fitness Plan</h2>
              <div className="whitespace-pre-wrap">
                {plan.response || plan.message || JSON.stringify(plan)}
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default FitnessPlannerPage; 
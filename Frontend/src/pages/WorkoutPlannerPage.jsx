import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlannerTabs from '../components/PlannerTabs';
import WorkoutPlanResults from '../components/WorkoutPlanResults';

const WorkoutPlannerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [formData, setFormData] = useState({
    medical_conditions: '',
    medications: '',
    fitness_level: '',
    past_activities: '',
    fitness_goals: [],
    goal_deadline: '',
    exercise_likes: [],
    exercise_dislikes: [],
    workout_days: '',
    session_duration: '',
    workout_location: '',
    equipment_list: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Flexibility',
    'Endurance',
    'Strength',
    'General Fitness'
  ];

  const exerciseTypes = [
    'Yoga',
    'Weightlifting',
    'Cardio',
    'HIIT',
    'Pilates',
    'Swimming',
    'Running',
    'Cycling',
    'Dancing',
    'Boxing'
  ];

  const equipmentOptions = [
    'Yoga Mat',
    'Dumbbells',
    'Resistance Bands',
    'Jump Rope',
    'Exercise Ball',
    'Pull-up Bar',
    'Kettlebells',
    'Foam Roller'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      const response = await fetch('http://localhost:5000/workout-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate workout plan');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setWorkoutPlan(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate workout plan. Please try again.');
      
      // If we have detailed error information from the backend, display it
      if (error.response) {
        const errorData = await error.response.json();
        setErrorDetails(errorData.details);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setWorkoutPlan(null);
    setError(null);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep > index + 1 ? 'bg-[#178582] text-white' : 
                  currentStep === index + 1 ? 'bg-[#178582] text-white ring-4 ring-[#178582]/20' : 
                  'bg-gray-200 text-gray-600'}
              `}>
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div className={`
                  w-full h-1 mx-2
                  ${currentStep > index + 1 ? 'bg-[#178582]' : 'bg-gray-200'}
                `} />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Health Info</span>
        <span>Fitness Goals</span>
        <span>Preferences</span>
        <span>Schedule</span>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions (Optional)
              </label>
              <textarea
                name="medical_conditions"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.medical_conditions}
                onChange={handleInputChange}
                placeholder="List any medical conditions that might affect your workout"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medications (Optional)
              </label>
              <textarea
                name="medications"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="List any medications you're currently taking"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Fitness Level *
              </label>
              <select
                name="fitness_level"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.fitness_level}
                onChange={handleInputChange}
              >
                <option value="">Select your fitness level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recent Activities (Optional)
              </label>
              <textarea
                name="past_activities"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.past_activities}
                onChange={handleInputChange}
                placeholder="Describe your recent physical activities or exercise history"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Primary Fitness Goals *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {fitnessGoals.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleMultiSelect('fitness_goals', goal.toLowerCase())}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all
                      ${formData.fitness_goals.includes(goal.toLowerCase())
                        ? 'border-[#178582] bg-[#178582]/5'
                        : 'border-gray-200 hover:border-[#178582]/50 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                        ${formData.fitness_goals.includes(goal.toLowerCase())
                          ? 'border-[#178582] bg-[#178582]'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.fitness_goals.includes(goal.toLowerCase()) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{goal}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Select one or more goals that match your fitness objectives</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Deadline (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['1 month', '2 months', '3 months', '6 months'].map(deadline => (
                  <button
                    key={deadline}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, goal_deadline: deadline }))}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${formData.goal_deadline === deadline
                        ? 'border-[#178582] bg-[#178582]/5'
                        : 'border-gray-200 hover:border-[#178582]/50 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="font-medium text-gray-900">{deadline}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Exercise Preferences
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {exerciseTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleMultiSelect('exercise_likes', type.toLowerCase())}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${formData.exercise_likes.includes(type.toLowerCase())
                        ? 'border-[#178582] bg-[#178582]/5'
                        : 'border-gray-200 hover:border-[#178582]/50 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2
                        ${formData.exercise_likes.includes(type.toLowerCase())
                          ? 'border-[#178582] bg-[#178582]'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.exercise_likes.includes(type.toLowerCase()) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Select exercises you enjoy or would like to try</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Exercise Dislikes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {exerciseTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleMultiSelect('exercise_dislikes', type.toLowerCase())}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${formData.exercise_dislikes.includes(type.toLowerCase())
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2
                        ${formData.exercise_dislikes.includes(type.toLowerCase())
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.exercise_dislikes.includes(type.toLowerCase()) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Select exercises you prefer to avoid</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Equipment Available
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {equipmentOptions.map(equipment => (
                  <button
                    key={equipment}
                    type="button"
                    onClick={() => handleMultiSelect('equipment_list', equipment.toLowerCase())}
                    className={`
                      p-3 rounded-lg border-2 text-center transition-all
                      ${formData.equipment_list.includes(equipment.toLowerCase())
                        ? 'border-[#178582] bg-[#178582]/5'
                        : 'border-gray-200 hover:border-[#178582]/50 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2
                        ${formData.equipment_list.includes(equipment.toLowerCase())
                          ? 'border-[#178582] bg-[#178582]'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.equipment_list.includes(equipment.toLowerCase()) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{equipment}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Select the equipment you have access to</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Days per Week *
              </label>
              <select
                name="workout_days"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.workout_days}
                onChange={handleInputChange}
              >
                <option value="">Select days per week</option>
                {[1,2,3,4,5,6,7].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'day' : 'days'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typical Session Duration *
              </label>
              <select
                name="session_duration"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.session_duration}
                onChange={handleInputChange}
              >
                <option value="">Select duration</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Workout Location *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer transition-all
                  ${formData.workout_location === 'home' 
                    ? 'border-[#178582] bg-[#178582]/5' 
                    : 'border-gray-300 hover:border-[#178582]'}
                `}>
                  <input
                    type="radio"
                    name="workout_location"
                    value="home"
                    required
                    className="form-radio text-[#178582]"
                    checked={formData.workout_location === 'home'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">Home</span>
                    <span className="block text-sm text-gray-500">Workout at home</span>
                  </span>
                </label>

                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer transition-all
                  ${formData.workout_location === 'gym' 
                    ? 'border-[#178582] bg-[#178582]/5' 
                    : 'border-gray-300 hover:border-[#178582]'}
                `}>
                  <input
                    type="radio"
                    name="workout_location"
                    value="gym"
                    required
                    className="form-radio text-[#178582]"
                    checked={formData.workout_location === 'gym'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">Gym</span>
                    <span className="block text-sm text-gray-500">Access to gym equipment</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (workoutPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlannerTabs />
          <div className="mt-8">
            <WorkoutPlanResults plan={workoutPlan} onBack={handleBackToForm} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PlannerTabs />
        <div className="mt-8 bg-white shadow rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Workout Plan</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                    {errorDetails && (
                      <div className="mt-2">
                        <p className="font-medium">Details:</p>
                        <p className="mt-1">{errorDetails}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setErrorDetails(null);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#178582]"
                >
                  Previous
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 bg-[#178582] text-white rounded-md text-sm font-medium hover:bg-[#178582]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#178582]"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    ml-auto px-6 py-2 bg-[#178582] text-white rounded-md text-sm font-medium
                    hover:bg-[#178582]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#178582]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center
                  `}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Plan...
                    </>
                  ) : (
                    'Generate Workout Plan'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlannerPage; 
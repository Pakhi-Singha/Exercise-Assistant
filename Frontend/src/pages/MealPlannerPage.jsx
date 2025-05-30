import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MealPlanResults from '../components/MealPlanResults';
import PlannerTabs from '../components/PlannerTabs';

const MealPlannerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activity_level: '',
    health_goal: '',
    dietary_preference: '',
    allergies: '',
    meals_per_day: '',
    preferred_meal_types: [],
    cooking_setup: '',
    available_ingredients: [],
    disliked_foods: [],
    preferred_cuisine: [],
    calorie_target: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const activityLevels = [
    'Sedentary',
    'Light',
    'Moderate',
    'Active',
    'Very Active'
  ];

  const healthGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Maintenance'
  ];

  const dietaryPreferences = [
    'Vegetarian',
    'Non-Vegetarian',
    'Vegan',
    'Jain',
    'Eggetarian'
  ];

  const mealTypes = [
    'South Indian',
    'North Indian',
    'Low Carb',
    'High Protein',
    'Mediterranean',
    'Asian',
    'Mexican',
    'Italian'
  ];

  const cookingSetups = [
    'Full Kitchen',
    'Limited Cooking',
    'No Cooking'
  ];

  const commonIngredients = [
    'Rice',
    'Wheat',
    'Toor Dal',
    'Moong Dal',
    'Paneer',
    'Curd',
    'Chicken',
    'Fish',
    'Eggs',
    'Vegetables',
    'Fruits',
    'Nuts',
    'Seeds',
    'Oil',
    'Spices'
  ];

  const cuisineRegions = [
    'South Indian',
    'North Indian',
    'Bengali',
    'Gujarati',
    'Maharashtrian',
    'Punjabi',
    'Rajasthani',
    'Chinese',
    'Italian',
    'Mexican',
    'Mediterranean'
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
      const response = await fetch('http://localhost:5000/meal-plan', {
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
        throw new Error(data.error || 'Failed to generate meal plan');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMealPlan(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate meal plan. Please try again.');
      
      if (error.response) {
        const errorData = await error.response.json();
        setErrorDetails(errorData.details);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setMealPlan(null);
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
        <span>Basic Info</span>
        <span>Dietary Info</span>
        <span>Preferences</span>
        <span>Meal Setup</span>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  required
                  min="100"
                  max="250"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="Enter height in cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  required
                  min="20"
                  max="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Enter weight in kg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level *
              </label>
              <select
                name="activity_level"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.activity_level}
                onChange={handleInputChange}
              >
                <option value="">Select activity level</option>
                {activityLevels.map(level => (
                  <option key={level} value={level.toLowerCase()}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Goal *
              </label>
              <select
                name="health_goal"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.health_goal}
                onChange={handleInputChange}
              >
                <option value="">Select health goal</option>
                {healthGoals.map(goal => (
                  <option key={goal} value={goal.toLowerCase()}>{goal}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preference *
              </label>
              <select
                name="dietary_preference"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.dietary_preference}
                onChange={handleInputChange}
              >
                <option value="">Select dietary preference</option>
                {dietaryPreferences.map(pref => (
                  <option key={pref} value={pref.toLowerCase()}>{pref}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies or Restrictions (Optional)
              </label>
              <textarea
                name="allergies"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="List any food allergies or dietary restrictions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calorie Target (Optional)
              </label>
              <input
                type="number"
                name="calorie_target"
                min="1000"
                max="5000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.calorie_target}
                onChange={handleInputChange}
                placeholder="Enter daily calorie target (e.g., 2000)"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Preferred Meal Types
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mealTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleMultiSelect('preferred_meal_types', type.toLowerCase())}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${formData.preferred_meal_types.includes(type.toLowerCase())
                        ? 'border-[#178582] bg-[#178582]/5'
                        : 'border-gray-200 hover:border-[#178582]/50 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2
                        ${formData.preferred_meal_types.includes(type.toLowerCase())
                          ? 'border-[#178582] bg-[#178582]'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.preferred_meal_types.includes(type.toLowerCase()) && (
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Preferred Cuisine Regions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {cuisineRegions.map(cuisine => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => handleMultiSelect('preferred_cuisine', cuisine.toLowerCase())}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${formData.preferred_cuisine.includes(cuisine.toLowerCase())
                        ? 'border-[#178582] bg-[#178582]/5'
                        : 'border-gray-200 hover:border-[#178582]/50 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2
                        ${formData.preferred_cuisine.includes(cuisine.toLowerCase())
                          ? 'border-[#178582] bg-[#178582]'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.preferred_cuisine.includes(cuisine.toLowerCase()) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{cuisine}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Disliked Foods
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {commonIngredients.map(food => (
                  <button
                    key={food}
                    type="button"
                    onClick={() => handleMultiSelect('disliked_foods', food.toLowerCase())}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${formData.disliked_foods.includes(food.toLowerCase())
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2
                        ${formData.disliked_foods.includes(food.toLowerCase())
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.disliked_foods.includes(food.toLowerCase()) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{food}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meals per Day *
              </label>
              <select
                name="meals_per_day"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.meals_per_day}
                onChange={handleInputChange}
              >
                <option value="">Select meals per day</option>
                <option value="3">3 meals</option>
                <option value="3+2">3 meals + 2 snacks</option>
                <option value="4">4 meals</option>
                <option value="5">5 meals</option>
                <option value="6">6 meals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Cooking Setup *
              </label>
              <select
                name="cooking_setup"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#178582] focus:border-[#178582]"
                value={formData.cooking_setup}
                onChange={handleInputChange}
              >
                <option value="">Select cooking setup</option>
                {cookingSetups.map(setup => (
                  <option key={setup} value={setup.toLowerCase()}>{setup}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Available Ingredients *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {commonIngredients.map(ingredient => (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() => handleMultiSelect('available_ingredients', ingredient.toLowerCase())}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${formData.available_ingredients.includes(ingredient.toLowerCase())
                        ? 'border-[#178582] bg-[#178582]/5'
                        : 'border-gray-200 hover:border-[#178582]/50 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2
                        ${formData.available_ingredients.includes(ingredient.toLowerCase())
                          ? 'border-[#178582] bg-[#178582]'
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.available_ingredients.includes(ingredient.toLowerCase()) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{ingredient}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (mealPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlannerTabs />
          <div className="mt-8">
            <MealPlanResults plan={mealPlan} onBack={handleBackToForm} />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Meal Plan</h2>
          
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
                    'Generate Meal Plan'
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

export default MealPlannerPage; 
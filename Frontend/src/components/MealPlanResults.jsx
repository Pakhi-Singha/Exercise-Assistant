import React from 'react';

const MealPlanResults = ({ plan, onBack }) => {
  const { plan: mealPlan, user_data } = plan;

  const renderUserProfile = () => (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Age</p>
          <p className="font-medium text-gray-900">{user_data.age} years</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Gender</p>
          <p className="font-medium text-gray-900 capitalize">{user_data.gender}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Height</p>
          <p className="font-medium text-gray-900">{user_data.height} cm</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Weight</p>
          <p className="font-medium text-gray-900">{user_data.weight} kg</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Activity Level</p>
          <p className="font-medium text-gray-900 capitalize">{user_data.activity_level}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Health Goal</p>
          <p className="font-medium text-gray-900 capitalize">{user_data.health_goal}</p>
        </div>
      </div>
    </div>
  );

  const renderDietaryInfo = () => (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Information</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Dietary Preference</p>
          <p className="font-medium text-gray-900 capitalize">{user_data.dietary_preference}</p>
        </div>
        {user_data.allergies && (
          <div>
            <p className="text-sm text-gray-500">Allergies/Restrictions</p>
            <p className="font-medium text-gray-900">{user_data.allergies}</p>
          </div>
        )}
        {user_data.calorie_target && (
          <div>
            <p className="text-sm text-gray-500">Calorie Target</p>
            <p className="font-medium text-gray-900">{user_data.calorie_target} kcal/day</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
      <div className="space-y-6">
        {user_data.preferred_meal_types.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Preferred Meal Types</p>
            <div className="flex flex-wrap gap-2">
              {user_data.preferred_meal_types.map(type => (
                <span
                  key={type}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {user_data.preferred_cuisine.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Preferred Cuisine</p>
            <div className="flex flex-wrap gap-2">
              {user_data.preferred_cuisine.map(cuisine => (
                <span
                  key={cuisine}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {user_data.disliked_foods.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Disliked Foods</p>
            <div className="flex flex-wrap gap-2">
              {user_data.disliked_foods.map(food => (
                <span
                  key={food}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMealSetup = () => (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Setup</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Meals per Day</p>
          <p className="font-medium text-gray-900">{user_data.meals_per_day}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cooking Setup</p>
          <p className="font-medium text-gray-900 capitalize">{user_data.cooking_setup}</p>
        </div>
        {user_data.available_ingredients.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Available Ingredients</p>
            <div className="flex flex-wrap gap-2">
              {user_data.available_ingredients.map(ingredient => (
                <span
                  key={ingredient}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMealPlan = () => {
    if (!mealPlan || !mealPlan.days) {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center text-gray-500">
            No meal plan data available
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Main Meal Plan */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Your 7-Day Meal Plan</h3>
              <button
                onClick={onBack}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#178582]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Form
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {mealPlan.days.map((day, dayIndex) => (
              <div key={dayIndex} className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-[#178582]/10">
                    <svg className="w-5 h-5 text-[#178582]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="ml-3 text-xl font-semibold text-[#178582]">{day.title}</h4>
                </div>

                {/* Daily Summary */}
                {(day.total_calories || day.macros) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.total_calories && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Daily Calories</h5>
                          <p className="text-lg font-medium text-gray-900">{day.total_calories}</p>
                        </div>
                      )}
                      {day.macros && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Macronutrients</h5>
                          <p className="text-lg font-medium text-gray-900">{day.macros}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Meals */}
                <div className="space-y-6">
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">{meal.title}</h5>
                          
                          {/* Meal Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ingredients */}
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-3">Ingredients</h6>
                              <ul className="space-y-2">
                                {meal.ingredients.map((ingredient, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#178582]"></span>
                                    <span className="ml-3 text-sm text-gray-700">{ingredient}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Instructions */}
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-3">Instructions</h6>
                              <ol className="space-y-2">
                                {meal.instructions.map((instruction, index) => (
                                  <li key={index} className="text-sm text-gray-700">
                                    {instruction}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>

                          {/* Nutrition and Timing */}
                          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {meal.prep_time && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-500">Prep Time</h6>
                                <p className="text-sm text-gray-900">{meal.prep_time}</p>
                              </div>
                            )}
                            {meal.cook_time && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-500">Cook Time</h6>
                                <p className="text-sm text-gray-900">{meal.cook_time}</p>
                              </div>
                            )}
                            {meal.nutrition?.calories && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-500">Calories</h6>
                                <p className="text-sm text-gray-900">{meal.nutrition.calories}</p>
                              </div>
                            )}
                            {meal.nutrition?.protein && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-500">Protein</h6>
                                <p className="text-sm text-gray-900">{meal.nutrition.protein}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day Notes */}
                {day.notes && day.notes.length > 0 && (
                  <div className="mt-6 p-4 bg-[#178582]/5 rounded-lg">
                    <h6 className="text-sm font-medium text-[#178582] mb-2">Additional Notes</h6>
                    <ul className="space-y-1">
                      {day.notes.map((note, index) => (
                        <li key={index} className="text-sm text-gray-700">{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shopping List */}
        {mealPlan.shopping_list && mealPlan.shopping_list.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping List</h3>
            <div className="prose max-w-none">
              {mealPlan.shopping_list.map((item, index) => (
                <p key={index} className="text-gray-700 mb-1">{item}</p>
              ))}
            </div>
          </div>
        )}

        {/* Meal Prep Tips */}
        {mealPlan.meal_prep_tips && mealPlan.meal_prep_tips.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Prep Tips</h3>
            <ul className="space-y-2">
              {mealPlan.meal_prep_tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#178582]"></span>
                  <span className="ml-3 text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Generated At */}
        {mealPlan.generated_at && (
          <div className="text-center text-sm text-gray-500">
            Plan generated on {new Date(mealPlan.generated_at).toLocaleString()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderUserProfile()}
      {renderDietaryInfo()}
      {renderPreferences()}
      {renderMealSetup()}
      {renderMealPlan()}
    </div>
  );
};

export default MealPlanResults; 
import React from 'react';

const WorkoutPlanResults = ({ plan, onBack }) => {
  if (!plan) return null;

  const getIntensityColor = (intensity) => {
    switch (intensity?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Personalized Workout Plan</h2>
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

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Fitness Level</h4>
            <p className="text-gray-900 capitalize">{plan.fitness_level || 'Not specified'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
            <p className="text-gray-900 capitalize">{plan.location || 'Not specified'}</p>
          </div>
          {plan.medical_conditions && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Medical Conditions</h4>
              <p className="text-gray-900">{plan.medical_conditions}</p>
            </div>
          )}
          {plan.medications && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Medications</h4>
              <p className="text-gray-900">{plan.medications}</p>
            </div>
          )}
        </div>
      </div>

      {/* Goals and Preferences Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals and Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Primary Goals</h4>
            <div className="flex flex-wrap gap-2">
              {plan.goals?.map((goal, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#178582]/10 text-[#178582]"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
          {plan.goal_deadline && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Goal Deadline</h4>
              <p className="text-gray-900">{plan.goal_deadline}</p>
            </div>
          )}
          {plan.exercise_likes?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Exercise Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {plan.exercise_likes.map((exercise, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {exercise}
                  </span>
                ))}
              </div>
            </div>
          )}
          {plan.exercise_dislikes?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Exercise Dislikes</h4>
              <div className="flex flex-wrap gap-2">
                {plan.exercise_dislikes.map((exercise, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                  >
                    {exercise}
                  </span>
                ))}
              </div>
            </div>
          )}
          {plan.equipment_list?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Available Equipment</h4>
              <div className="flex flex-wrap gap-2">
                {plan.equipment_list.map((equipment, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {equipment}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Weekly Schedule</h3>
          <p className="mt-1 text-sm text-gray-500">{plan.schedule}</p>
        </div>
        <div className="divide-y divide-gray-100">
          {plan.weekly_schedule?.map((day, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-[#178582]/10">
                  <svg className="w-5 h-5 text-[#178582]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="ml-3 text-lg font-medium text-[#178582]">{day.day}</h4>
              </div>
              <div className="space-y-4">
                {day.workouts?.map((workout, wIndex) => (
                  <div key={wIndex} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h5 className="text-lg font-medium text-gray-900">{workout.name}</h5>
                          <span className={`ml-3 px-3 py-1 text-sm font-medium rounded-full ${getIntensityColor(workout.intensity)}`}>
                            {workout.intensity}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {workout.duration}
                        </div>
                      </div>
                    </div>
                    {workout.exercises && (
                      <div className="mt-4 space-y-3">
                        <h6 className="text-sm font-medium text-gray-700">Exercises:</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {workout.exercises.map((exercise, eIndex) => (
                            <div key={eIndex} className="flex items-start bg-white p-3 rounded-md border border-gray-100">
                              <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#178582]"></span>
                              <span className="ml-3 text-sm text-gray-700">{exercise}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {plan.recommendations && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-[#178582]/10">
                <svg className="w-5 h-5 text-[#178582]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-xl font-semibold text-gray-900">Additional Recommendations</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-[#178582]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated At */}
      {plan.generated_at && (
        <div className="text-center text-sm text-gray-500">
          Plan generated on {new Date(plan.generated_at).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanResults; 
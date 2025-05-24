// Use a data URL for the hero image to avoid loading issues
const heroImageData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHJlY3QgeD0iNTAiIHk9IjUwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgcng9IjEwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIvPgogIAogIDwhLS0gQXBwIFVJIGVsZW1lbnRzIC0tPgogIDxyZWN0IHg9IjcwIiB5PSI4MCIgd2lkdGg9IjQ2MCIgaGVpZ2h0PSI2MCIgcng9IjUiIGZpbGw9IiNmOGY4ZjgiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMTAiIHI9IjE1IiBmaWxsPSIjMTc4NTgyIi8+CiAgPHJlY3QgeD0iMTMwIiB5PSIxMDAiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjMzMzIi8+CiAgPHJlY3QgeD0iMTMwIiB5PSIxMjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiM3NzciLz4KICAKICA8cmVjdCB4PSI3MCIgeT0iMTYwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjE3MCIgcng9IjUiIGZpbGw9IiNmOGY4ZjgiLz4KICA8cmVjdCB4PSIzMTAiIHk9IjE2MCIgd2lkdGg9IjIyMCIgaGVpZ2h0PSIxNzAiIHJ4PSI1IiBmaWxsPSIjZjhmOGY4Ii8+CiAgCiAgPCEtLSBGaXRuZXNzIGdyYXBoIC0tPgogIDxwb2x5bGluZSBwb2ludHM9IjkwLDI4MCAxMzAsMjQwIDE3MCwyNjAgMjEwLDIwMCAyNTAsMjIwIiBzdHJva2U9IiNFNzQ3M0MiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgogIDxjaXJjbGUgY3g9IjkwIiBjeT0iMjgwIiByPSI0IiBmaWxsPSIjRTc0NzNDIi8+CiAgPGNpcmNsZSBjeD0iMTMwIiBjeT0iMjQwIiByPSI0IiBmaWxsPSIjRTc0NzNDIi8+CiAgPGNpcmNsZSBjeD0iMTcwIiBjeT0iMjYwIiByPSI0IiBmaWxsPSIjRTc0NzNDIi8+CiAgPGNpcmNsZSBjeD0iMjEwIiBjeT0iMjAwIiByPSI0IiBmaWxsPSIjRTc0NzNDIi8+CiAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iMjIwIiByPSI0IiBmaWxsPSIjRTc0NzNDIi8+CiAgCiAgPCEtLSBXb3Jrb3V0IGljb25zIC0tPgogIDxjaXJjbGUgY3g9IjM0MCIgY3k9IjIwMCIgcj0iMjAiIGZpbGw9IiMxNzg1ODIiLz4KICA8Y2lyY2xlIGN4PSIzOTAiIGN5PSIyMDAiIHI9IjIwIiBmaWxsPSIjRTc0NzNDIi8+CiAgPGNpcmNsZSBjeD0iNDQwIiBjeT0iMjAwIiByPSIyMCIgZmlsbD0iIzE3ODU4MiIvPgogIDxjaXJjbGUgY3g9IjQ5MCIgY3k9IjIwMCIgcj0iMjAiIGZpbGw9IiNFNzQ3M0MiLz4KICAKICA8cmVjdCB4PSIzMzAiIHk9IjI0MCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIxMCIgcng9IjIiIGZpbGw9IiMzMzMiLz4KICA8cmVjdCB4PSIzMzAiIHk9IjI2MCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgcng9IjIiIGZpbGw9IiMzMzMiLz4KICA8cmVjdCB4PSIzMzAiIHk9IjI4MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgcng9IjIiIGZpbGw9IiMzMzMiLz4KICAKICA8IS0tIEZpdEJybyBsb2dvIC0tPgogIDx0ZXh0IHg9IjMwMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNzg1ODIiPkZpdEJybzwvdGV4dD4KPC9zdmc+';

// Use the data URL directly to avoid any loading issues
const heroImage = heroImageData;

const HeroSection = () => {
  return (
    <section id="home" className="pt-24 pb-12 bg-gradient-to-br from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Achieve Your Fitness Goals with Ease!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Innovative tools to transform your workouts, nutrition, and posture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#E7473C] hover:bg-red-600 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300">
                Try Now
              </button>
              <button className="border-2 border-[#178582] text-[#178582] hover:bg-[#178582] hover:text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              {/* Using the local image with fallback */}
              <img
                src={heroImage}
                alt="Fitness tracking app interface"
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImageData;
                }}
              />
              
              {/* Feature highlights */}
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="bg-[#E7473C] p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">AI Posture Correction</span>
                </div>
              </div>
              
              <div className="absolute -top-5 -right-5 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="bg-[#178582] p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Pro Appointments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E7473C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Correct Your Pose</h3>
            <p className="text-gray-600">
              AI-powered posture correction tool that provides real-time feedback to improve your form during workouts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#178582]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Book an Appointment</h3>
            <p className="text-gray-600">
              Easy scheduling for personal trainers or physiotherapists to get professional guidance for your fitness journey.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Meal & Workout Planner</h3>
            <p className="text-gray-600">
              Personalized plans tailored to your fitness goals, dietary preferences, and schedule for maximum results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
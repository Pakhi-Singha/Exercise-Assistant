const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose FitBro</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with fitness expertise to deliver an unmatched experience.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-[#E7473C] p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Innovative Technology</h3>
            <p className="text-gray-600">
              Our AI-powered tools use advanced computer vision and machine learning to provide accurate, real-time feedback on your form and performance.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-[#178582] p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
            <p className="text-gray-600">
              Connect with certified fitness professionals who can provide personalized advice and support tailored to your specific needs and goals.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-green-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
            <p className="text-gray-600">
              Our users report significant improvements in their form, strength, and overall fitness levels within just a few weeks of consistent use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
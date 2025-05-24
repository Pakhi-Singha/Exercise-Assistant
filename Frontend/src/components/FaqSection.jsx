import { useState } from 'react';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const faqs = [
    {
      question: "How does the posture correction feature work?",
      answer: "Our posture correction feature uses computer vision technology to analyze your movements in real-time through your device's camera. It compares your form against ideal postures for various exercises and provides instant feedback to help you make adjustments. This helps prevent injuries and ensures you get the maximum benefit from your workouts."
    },
    {
      question: "Can I use FitBro without an internet connection?",
      answer: "Some features of FitBro require an internet connection, such as booking appointments with professionals and syncing your data across devices. However, basic workout tracking and saved meal plans can be accessed offline. The posture correction feature requires an internet connection for the initial AI model loading but can work offline for short periods afterward."
    },
    {
      question: "Are the fitness professionals on the platform certified?",
      answer: "Yes, all fitness professionals on our platform undergo a thorough verification process. We verify their certifications, qualifications, and experience before they can offer services through FitBro. You can view their credentials, specializations, and client reviews on their profile pages."
    },
    {
      question: "How personalized are the meal and workout plans?",
      answer: "Our meal and workout plans are highly personalized based on your goals, fitness level, dietary preferences, allergies, available equipment, and schedule. The system uses advanced algorithms to create plans that are both effective and sustainable for your specific situation. You can also make manual adjustments to any plan."
    },
    {
      question: "Is my personal data secure on FitBro?",
      answer: "Absolutely. We take data security very seriously. All personal information and fitness data are encrypted and stored securely. We never share your information with third parties without your explicit consent. You can review our comprehensive privacy policy for more details on how we protect your data."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time through your account settings. If you cancel before the end of your current billing cycle, you'll still have access to premium features until that cycle ends. We don't charge any cancellation fees, and you can always reactivate your subscription later if you wish."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about FitBro and our services.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`h-6 w-6 text-gray-500 transform ${openIndex === index ? 'rotate-180' : ''} transition-transform duration-200`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a 
            href="#contact" 
            className="inline-flex items-center text-[#E7473C] hover:text-red-700 font-medium"
          >
            Contact our support team
            <svg 
              className="ml-2 h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
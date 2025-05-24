import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrainers } from '../services/api';

// Fallback trainers data in case API fails
const fallbackTrainers = [
  {
    id: 1,
    name: "John Smith",
    specialty: "Strength & Conditioning",
    experience: "8 years",
    bio: "John is a certified strength and conditioning specialist with expertise in powerlifting and functional training. He focuses on helping clients build strength while maintaining proper form to prevent injuries.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    availability: ["Monday", "Wednesday", "Friday"],
    rating: 4.8
  },
  {
    id: 2,
    name: "Sarah Johnson",
    specialty: "Yoga & Flexibility",
    experience: "10 years",
    bio: "Sarah is a 500-hour certified yoga instructor specializing in vinyasa and restorative yoga. She helps clients improve flexibility, reduce stress, and enhance mind-body connection through personalized yoga sessions.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    availability: ["Tuesday", "Thursday", "Saturday"],
    rating: 4.9
  }
];

const TrainersPage = () => {
  const [trainers, setTrainers] = useState(fallbackTrainers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await getTrainers();
        if (data && data.length > 0) {
          setTrainers(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setError('Failed to load trainers. Using default data instead.');
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#178582]"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Professional Trainers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book a session with one of our certified fitness professionals to get personalized guidance for your fitness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img 
                    className="h-48 w-full object-cover md:w-48" 
                    src={trainer.image} 
                    alt={trainer.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${trainer.name.replace(' ', '+')}&background=178582&color=fff&size=256`;
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">{trainer.name}</div>
                    <div className="ml-2 flex items-center">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-600 ml-1">{trainer.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-lg text-[#178582] font-semibold">{trainer.specialty}</div>
                  <div className="text-sm text-gray-500">{trainer.experience} experience</div>
                  <p className="mt-3 text-gray-600">{trainer.bio}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700">Available on:</h4>
                    <div className="flex flex-wrap mt-1">
                      {trainer.availability.map((day) => (
                        <span key={day} className="mr-2 mb-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link 
                      to={`/booking/${trainer.id}`} 
                      className="inline-block bg-[#178582] hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium transition duration-300"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersPage;
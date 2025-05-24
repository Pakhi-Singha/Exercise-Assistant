import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Mock trainers data (in a real app, this would come from an API)
const trainers = [
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

const BookingPage = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const ticketRef = useRef(null);
  
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isBooked, setIsBooked] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    const selectedTrainer = trainers.find(t => t.id === parseInt(trainerId));
    setTrainer(selectedTrainer);
    setLoading(false);
  }, [trainerId]);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/i.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }
    if (!timeSlot) newErrors.timeSlot = 'Please select a time slot';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateJoinCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Generate session ID and join code
      const newSessionId = generateSessionId();
      const newJoinCode = generateJoinCode();
      
      setSessionId(newSessionId);
      setJoinCode(newJoinCode);
      
      // In a real app, this would be an API call to save the booking
      // For now, we'll simulate a successful booking
      const bookingData = {
        trainerId: parseInt(trainerId),
        trainerName: trainer.name,
        userId: 'user123', // In a real app, this would be the logged-in user's ID
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        date: bookingDate,
        timeSlot: timeSlot,
        sessionId: newSessionId,
        joinCode: newJoinCode,
        status: 'booked',
        createdAt: new Date()
      };
      
      console.log('Booking data:', bookingData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsBooked(true);
      setLoading(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setLoading(false);
      // Handle error state
    }
  };

  const downloadTicket = () => {
    if (ticketRef.current) {
      html2canvas(ticketRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`FitBro_Appointment_${formData.name.replace(/\s+/g, '_')}.pdf`);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#178582]"></div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">Trainer not found</h2>
        <p className="mt-4">The trainer you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isBooked ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Book an Appointment with {trainer.name}</h1>
              <p className="text-lg text-gray-600">
                Fill out the form below to schedule your one-on-one session with our professional trainer.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row mb-8">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-[#178582]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${trainer.name.replace(' ', '+')}&background=178582&color=fff&size=128`;
                    }}
                  />
                </div>
                <div className="md:w-3/4 md:pl-6">
                  <h2 className="text-xl font-bold text-gray-900">{trainer.name}</h2>
                  <p className="text-[#178582] font-medium">{trainer.specialty}</p>
                  <p className="text-gray-600 mt-2">{trainer.bio}</p>
                  <div className="mt-3">
                    <span className="text-gray-700 font-medium">Available on: </span>
                    {trainer.availability.join(', ')}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#178582] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#178582] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#178582] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Select Date</label>
                    <DatePicker
                      selected={bookingDate}
                      onChange={date => setBookingDate(date)}
                      minDate={new Date()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#178582]"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Select Time</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#178582] ${errors.timeSlot ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {errors.timeSlot && <p className="mt-1 text-red-500 text-sm">{errors.timeSlot}</p>}
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-[#178582] hover:bg-teal-700 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block p-3 rounded-full bg-green-100 text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked Successfully!</h2>
              <p className="text-lg text-gray-600">
                Your appointment with {trainer.name} has been confirmed.
              </p>
            </div>
            
            <div ref={ticketRef} className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 max-w-2xl mx-auto">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-center text-[#178582]">FitBro Appointment Ticket</h3>
              </div>
              
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#178582]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${trainer.name.replace(' ', '+')}&background=178582&color=fff&size=96`;
                    }}
                  />
                </div>
                <div className="md:w-2/3">
                  <h4 className="text-lg font-semibold">{trainer.name}</h4>
                  <p className="text-[#178582]">{trainer.specialty}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Date:</p>
                      <p>{bookingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Time:</p>
                      <p>{timeSlot}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Client:</p>
                      <p>{formData.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Contact:</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="text-center mb-2">
                  <p className="font-medium text-gray-700">Video Call Join Code</p>
                  <p className="text-2xl font-bold tracking-wide">{joinCode}</p>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Use this code to join your video call session at the scheduled time.
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-1"><strong>Note:</strong> This is a one-time appointment. Please arrive 5 minutes before your scheduled time.</p>
                <p>For any changes or cancellations, please contact us at least 24 hours in advance.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={downloadTicket}
                className="bg-[#178582] hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium transition duration-300"
              >
                Download Ticket
              </button>
              
              <button
                onClick={() => navigate(`/video-call/${sessionId}`)}
                className="bg-[#E7473C] hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition duration-300"
              >
                Join Video Call
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingPage;
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#E7473C]">FitBro</span>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-[#E7473C] px-3 py-2 text-sm font-medium">
              Home
            </a>
            <a href="#products" className="text-gray-700 hover:text-[#E7473C] px-3 py-2 text-sm font-medium">
              Our Products
            </a>
            <a href="#why-us" className="text-gray-700 hover:text-[#E7473C] px-3 py-2 text-sm font-medium">
              Why Us
            </a>
            <a href="#contact" className="text-gray-700 hover:text-[#E7473C] px-3 py-2 text-sm font-medium">
              Contact Us
            </a>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-[#E7473C] px-3 py-2 text-sm font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-[#E7473C] hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#E7473C] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block text-gray-700 hover:text-[#E7473C] px-3 py-2 text-base font-medium">
              Home
            </a>
            <a href="#products" className="block text-gray-700 hover:text-[#E7473C] px-3 py-2 text-base font-medium">
              Our Products
            </a>
            <a href="#why-us" className="block text-gray-700 hover:text-[#E7473C] px-3 py-2 text-base font-medium">
              Why Us
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-[#E7473C] px-3 py-2 text-base font-medium">
              Contact Us
            </a>
            <SignedIn>
              <div className="px-3 py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="space-y-2 px-3 py-2">
                <SignInButton mode="modal">
                  <button className="w-full text-left text-gray-700 hover:text-[#E7473C] px-3 py-2 text-base font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full bg-[#E7473C] hover:bg-red-600 text-white px-4 py-2 rounded-md text-base font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-[#293042] text-xs p-4 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
         <img src="logoWhite.png"
           className=" h-12"/>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 hover:underline text-blue-600"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-white outline-none undeerline:none">Admin</span>
            <ChevronDown size={16} className="text-white" />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <div className="py-2">
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:underline text-blue-600">
                  My Account
                </a>
                <a href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:underline text-blue-600">
                  Log Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

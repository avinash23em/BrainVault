import { useState, useEffect, useRef } from "react";
import { UserIcon } from "../icons/UserIcon";
import { LogOutIcon } from "../icons/LogoutIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface UserProfileProps {
  onSignout: () => void;
}

export function UserProfile({ onSignout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserProfile();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUsername("Unknown User");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsername(response.data.username || "Unknown User");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUsername("Unknown User");
    } finally {
      setLoading(false);
    }
  };

  const handleSignout = () => {
    localStorage.removeItem("token");
    onSignout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors" title="User Profile">
        <UserIcon />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-semibold text-base">{loading ? "..." : username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{loading ? "Loading..." : username}</p>
                <p className="text-xs text-gray-500">Signed in</p>
              </div>
            </div>
          </div>

          {/* Sign Out Option */}
          <button onClick={handleSignout} className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
            <LogOutIcon />
            <span className="ml-3">Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}

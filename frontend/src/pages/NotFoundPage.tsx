import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";
import { Button } from "../components/Button";

export function NotFoundPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <div className="text-purple-600">
                <Logo />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">BrainVault</span>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Button variant="primary" size="md" text="Dashboard" onClick={() => navigate("/dashboard")} />
              ) : (
                <>
                  <Button variant="secondary" size="md" text="Sign In" onClick={() => navigate("/signin")} />
                  <Button variant="primary" size="md" text="Sign Up" onClick={() => navigate("/signup")} />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Content */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Oops! Memory Not Found</h2>
            <p className="text-lg text-gray-600 mb-2">The page you're looking for seems to have slipped out of our digital memory.</p>
            <p className="text-gray-500 mb-8">Don't worry, let's help you find your way back to organizing your digital content!</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="primary" size="lg" text={isLoggedIn ? "Return to Dashboard" : "Go to Homepage"} onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")} />
            <Button variant="secondary" size="lg" text="Go Back" onClick={() => window.history.back()} />
          </div>

          {/* Helpful Links */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Looking for something specific?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <button onClick={() => navigate("/")} className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                🏠 Homepage
              </button>
              {!isLoggedIn ? (
                <>
                  <button onClick={() => navigate("/signin")} className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                    🔐 Sign In
                  </button>
                  <button onClick={() => navigate("/signup")} className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                    ✨ Create Account
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("/dashboard")} className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                    📚 Your Memory
                  </button>
                  <span className="text-gray-400">🎯 Organize Content</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-purple-400">
                <Logo />
              </div>
              <span className="ml-2 text-xl font-bold">BrainVault</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>
                &copy; BrainVault. 
                ,Your Digital Memory
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

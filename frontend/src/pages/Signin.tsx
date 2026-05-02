import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "../icons/Logo";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({
    username: undefined,
    password: undefined,
    general: undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear any existing token when accessing signin page
    localStorage.removeItem("token");
  }, []);

  async function handleSignin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    // Clear previous errors
    setErrors({
      username: undefined,
      password: undefined,
      general: undefined,
    });
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, { username, password });
      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      // redirect to dashboard
      navigate("/dashboard", { replace: true });
      console.log("Signin successful:", response.data);
    } catch (error: unknown) {
      console.error("Signin failed:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data;

        if (errorData.field) {
          // Field-specific validation error
          setErrors({
            [errorData.field]: errorData.message,
          });
        } else if (errorData.error === "Invalid username or password") {
          setErrors({
            general: "Invalid username or password. Please check your credentials and try again.",
          });
        } else {
          setErrors({
            general: errorData.error || errorData.message || "Signin failed",
          });
        }
      } else {
        setErrors({
          general: "Network error. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-purple-600">
                <Logo />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">BrainVault</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="md" text="Sign Up" onClick={() => navigate("/signup")} />
              <Button variant="secondary" size="md" text="Home" onClick={() => navigate("/")} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center py-12 px-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your digital memory</p>
          </div>

          {errors.general && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 break-words leading-relaxed">{errors.general}</div>}

          <div className="space-y-4">
            <Input placeholder="Username" ref={usernameRef} error={errors.username} />
            <PasswordInput placeholder="Password" ref={passwordRef} error={errors.password} />

            <Button loading={loading} variant="primary" size="md" text={loading ? "Signing In..." : "Sign In"} onClick={handleSignin} fullWidth />

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-600 hover:text-purple-500 font-medium transition-colors">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
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

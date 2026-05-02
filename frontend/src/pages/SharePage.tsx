import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Logo } from "../icons/Logo";
import { useSharedContent } from "../hooks/useSharedContent";

export function SharePage() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const { sharedData, loading, error } = useSharedContent(hash);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-purple-600 animate-spin">
              <Logo />
            </div>
          </div>
          <div className="text-lg font-medium text-gray-700 mb-2">Loading memory...</div>
          <div className="text-sm text-gray-500">Please wait while we fetch the shared content</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Memory Not Found</h2>
          <p className="text-gray-600 mb-6">The shared memory link you're looking for doesn't exist or has been removed.</p>
          <Button variant="primary" size="md" text={isLoggedIn ? "Return to Dashboard" : "Sign In"} onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signin")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-purple-600">
                <Logo />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">BrainVault</span>
            </div>
            <Button variant="primary" size="md" text={isLoggedIn ? "Return to Your Memory" : "Sign In"} onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signin")} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shared Memory</h1>
          <p className="text-lg text-gray-600">
            Viewing shared memory of <span className="font-semibold text-purple-600">{sharedData?.username}</span>
          </p>
        </div>

        {/* Content Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {sharedData?.content && sharedData.content.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Content Collection</h2>
                <p className="text-gray-600">
                  {sharedData.content.length} {sharedData.content.length === 1 ? "item" : "items"} in this memory
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sharedData.content.map(({ _id, title, link, type, description }) => (
                  <Card
                    key={_id}
                    _id={_id}
                    title={title}
                    link={link}
                    type={type}
                    description={description}
                    onDelete={() => {}} // No delete functionality for shared content
                    onEdit={() => {}} // No edit functionality for shared content
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Content Shared</h3>
              <p className="text-gray-600">This memory collection is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

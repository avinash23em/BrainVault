import { useState, useRef } from "react";
import { Button } from "./Button";
import { CrossIcon } from "../icons/CrossIcon";
import { QueryIcon } from "../icons/QueryIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface QueryModalProps {
  open: boolean;
  onClose: () => void;
}

export function QueryModal({ open, onClose }: QueryModalProps) {
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [hasQueried, setHasQueried] = useState(false);
  const [queryInfo, setQueryInfo] = useState<{
    query: string;
    sourceCount: number;
  } | null>(null);

  const handleQuery = async () => {
    const query = queryRef.current?.value?.trim();

    if (!query) {
      alert("Please enter a query");
      return;
    }

    setIsLoading(true);
    setHasQueried(true);
    setResponse("");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/query`,
        { query },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResponse(response.data.response);
      setQueryInfo({
        query: response.data.query,
        sourceCount: response.data.sourceCount,
      });
    } catch (error) {
      console.error("Error processing query:", error);
      setResponse("Sorry, I encountered an error while processing your query. Please try again. Make sure to have at least 3 non-empty description notes in your memory with type as document.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResponse("");
    setHasQueried(false);
    setQueryInfo(null);
    setIsLoading(false);
    if (queryRef.current) {
      queryRef.current.value = "";
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="w-screen h-screen bg-white/20 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="text-purple-600 mr-3">
              <QueryIcon />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Query Your Memory</h3>
              <p className="text-sm text-gray-500">Powered by AI</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <CrossIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Query Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ask AI about your saved content</label>
            <textarea ref={queryRef} placeholder="What are the health benefits of eating fruits?" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical" rows={3} maxLength={1000} />
            <p className="text-xs text-gray-500 mt-1">Maximum 1000 characters</p>
            <p className="text-sm text-gray-500 mt-2"> Any saved content with a description can be queried by AI.</p>
          </div>

          {/* Send Button */}
          <div className="flex justify-center">
            <Button variant="primary" size="md" text={isLoading ? "Processing..." : "Send Query"} onClick={handleQuery} loading={isLoading} startIcon={<QueryIcon />} />
          </div>

          {/* Response Box */}
          <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="text-purple-600 mr-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-700">AI Response</h4>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-purple-200"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-gray-700">Processing your query...</p>
                  <p className="text-xs text-gray-500 mt-1">Analyzing your saved content with AI</p>
                </div>
                <div className="mt-3 flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            )}

            {/* Default State */}
            {!hasQueried && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-gray-400 mb-3">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium mb-1">AI is waiting to respond</p>
                <p className="text-sm text-gray-500">Ask a question about your saved content and get intelligent insights</p>
              </div>
            )}

            {/* Response State */}
            {response && !isLoading && (
              <div className="space-y-4">
                {queryInfo && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-purple-800">
                      <span className="font-medium">Query:</span> {queryInfo.query}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Found insights from {queryInfo.sourceCount} of your saved items</p>
                  </div>
                )}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{response}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

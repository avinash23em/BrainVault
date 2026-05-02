import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface openProps {
  open: boolean;
  onClose: () => void;
}

type ContentType = "youtube" | "twitter" | "pinterest" | "linkedin" | "document" | "link" | "instagram";

export function CreateContentModel({ open, onClose }: openProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<ContentType>("document");
  const [isLoading, setIsLoading] = useState(false);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title) {
      alert("Title is required");
      return;
    }

    // For document type, link is optional
    if (type !== "document" && !link) {
      alert("Link is required for this content type");
      return;
    }

    const content = {
      title,
      link: link || "",
      type,
      description: description || "",
    };

    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/v1/content`, content, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Content added:", content);
      onClose();
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-white/20 backdrop-blur-sm fixed top-0 left-0 flex justify-center z-50" onClick={onClose}>
          <div className="flex flex-col justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-4">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer" disabled={isLoading}>
                  <CrossIcon />
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-4">Add Content</h2>

              <div className="space-y-4">
                <Input ref={titleRef} placeholder="Enter content title" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as ContentType)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" disabled={isLoading}>
                    <option value="document">Document</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="link">Link</option>
                  </select>
                </div>

                <div>
                  <input ref={linkRef} type="text" placeholder={type === "document" ? "Enter link (optional)" : "Enter content link"} className={`border rounded px-4 py-2 m-2 w-full border-gray-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isLoading} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea ref={descriptionRef} placeholder="Enter content description..." className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} rows={4} maxLength={1000} disabled={isLoading} />
                  <p className="text-xs text-gray-500 mt-1">Maximum 1000 characters</p>
                </div>

                {type === "document" && <p className="text-sm text-gray-500">For documents, you can leave the link empty if you just want to store text content.</p>}
              </div>

              {/* Loading feedback */}
              {isLoading && (
                <div className="flex items-center justify-center mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                  <span className="text-purple-700 font-medium">Adding your content...</span>
                </div>
              )}

              <div className="flex justify-center mt-6">
                <Button variant="primary" size="md" text={isLoading ? "Adding Content..." : "Add Content"} onClick={addContent} loading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

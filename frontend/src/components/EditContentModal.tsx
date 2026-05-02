import { useRef, useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface EditContentModalProps {
  open: boolean;
  onClose: () => void;
  content: {
    _id: string;
    title: string;
    link: string;
    type: string;
    description?: string;
  } | null;
}

type ContentType = "youtube" | "twitter" | "pinterest" | "linkedin" | "document" | "link" | "instagram";

export function EditContentModal({ open, onClose, content }: EditContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<ContentType>("document");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    link?: string;
    general?: string;
  }>({});

  // Populate form when content changes
  useEffect(() => {
    if (content && open) {
      if (titleRef.current) titleRef.current.value = content.title;
      if (linkRef.current) linkRef.current.value = content.link;
      if (descriptionRef.current) descriptionRef.current.value = content.description || "";
      setType(content.type as ContentType);
    }
  }, [content, open]);

  async function updateContent() {
    if (!content) return;

    const title = titleRef.current?.value?.trim();
    const link = linkRef.current?.value?.trim();
    const description = descriptionRef.current?.value;

    // Clear previous errors
    setErrors({});

    // Validation
    const newErrors: { title?: string; link?: string } = {};

    if (!title) {
      newErrors.title = "Title is required";
    }

    // For document type, link is optional
    if (type !== "document" && !link) {
      newErrors.link = "Link is required for this content type";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedContent = {
      contentId: content._id,
      title,
      link: link || "",
      type,
      description: description || "",
    };

    setIsLoading(true);
    try {
      await axios.put(`${BACKEND_URL}/api/v1/content`, updatedContent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Content updated:", updatedContent);
      onClose();
    } catch (error) {
      console.error("Error updating content:", error);
      setErrors({ general: "Failed to update content. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  if (!open || !content) return null;

  return (
    <div className="w-screen h-screen bg-white/20 backdrop-blur-sm fixed top-0 left-0 flex justify-center z-50" onClick={onClose}>
      <div className="flex flex-col justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end mb-4">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer" disabled={isLoading}>
              <CrossIcon />
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">Edit Content</h2>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input ref={titleRef} type="text" placeholder="Enter content title" className={`border rounded px-4 py-2 m-2 w-full ${errors.title ? "border-red-500" : "border-gray-300"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isLoading} />
              {errors.title && <p className="text-red-500 text-sm mx-2 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as ContentType)} className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isLoading}>
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
              <input ref={linkRef} type="text" placeholder={type === "document" ? "Enter link (optional)" : "Enter content link"} className={`border rounded px-4 py-2 m-2 w-full ${errors.link ? "border-red-500" : "border-gray-300"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isLoading} />
              {errors.link && <p className="text-red-500 text-sm mx-2 mt-1">{errors.link}</p>}
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
              <span className="text-purple-700 font-medium">Updating your content...</span>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button variant="primary" size="md" text={isLoading ? "Updating Content..." : "Update Content"} onClick={updateContent} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

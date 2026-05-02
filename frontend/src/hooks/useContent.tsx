import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

interface ContentItem {
  _id: string;
  type: string;
  link: string;
  title: string;
  description?: string;
}

export function useContent(contentType?: string) {
  const [content, setContent] = useState<ContentItem[]>([]);
  async function fetchContent() {
    try {
      // Build URL with optional query parameter for content type
      const url = contentType && contentType !== "home" ? `${BACKEND_URL}/api/v1/content?type=${contentType}` : `${BACKEND_URL}/api/v1/content`;

      console.log("Fetching content with URL:", url); // Debug log
      console.log("Content type:", contentType); // Debug log

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched content:", data); // Debug log
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }
  useEffect(() => {
    fetchContent();
    const intervalId = setInterval(() => {
      fetchContent();
    }, 5000); // Fetch content every 5 seconds
    return () => clearInterval(intervalId);
  }, [contentType]); // Re-fetch when contentType changes

  return { content, fetchContent };
}

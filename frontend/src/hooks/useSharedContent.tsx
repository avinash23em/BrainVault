import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

interface SharedContent {
  _id: string;
  title: string;
  link: string;
  type: string;
  description?: string;
}

interface SharedData {
  username: string;
  content: SharedContent[];
}

export function useSharedContent(hash: string | undefined) {
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!hash) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchSharedContent = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/brain/${hash}`);
        if (!response.ok) {
          throw new Error("Failed to fetch shared content");
        }
        const data = await response.json();
        setSharedData(data);
      } catch (err) {
        console.error("Error fetching shared content:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [hash]);

  return { sharedData, loading, error };
}

import { useState, useEffect } from "react";
import axios from "axios";
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

export function useSharedContent(hash?: string) {
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) {
      setLoading(false);
      setError("No hash provided");
      return;
    }

    const fetchSharedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Updated to use the correct route path
        const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
        setSharedData(response.data);
      } catch (error: unknown) {
        console.error("Error fetching shared content:", error);

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError("Shared memory not found");
        } else {
          setError("Failed to load shared content");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [hash]);

  return { sharedData, loading, error };
}

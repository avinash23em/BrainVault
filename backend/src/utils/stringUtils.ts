import { v4 as uuidv4 } from "uuid";

export const generateRandomString = (length?: number): string => {
  const uuid = uuidv4().replace(/-/g, "");

  if (length && length > 0) {
    return uuid.substring(0, Math.min(length, uuid.length));
  }

  return uuid;
};

// Keep the old function name for backward compatibility
export const random = generateRandomString;

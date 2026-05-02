import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
}

export function DeleteConfirmationModal({ open, onClose, onConfirm, title }: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Delete operation failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="w-screen h-screen bg-white/20 backdrop-blur-sm fixed top-0 left-0 flex justify-center z-50" onClick={!isDeleting ? onClose : undefined}>
      <div className="flex flex-col justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg min-w-96" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end mb-4">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer" disabled={isDeleting}>
              <CrossIcon />
            </button>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Delete Content</h2>
            <p className="text-gray-600">Are you sure you want to delete "{title}"?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
          </div>

          {/* Loading feedback */}
          {isDeleting && (
            <div className="flex items-center justify-center mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-3"></div>
              <span className="text-red-700 font-medium">Deleting content...</span>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="md" text="No, Keep it" onClick={onClose} loading={isDeleting} />
            <Button variant="danger" size="md" text={isDeleting ? "Deleting..." : "Yes, Delete"} onClick={handleConfirm} loading={isDeleting} />
          </div>
        </div>
      </div>
    </div>
  );
}

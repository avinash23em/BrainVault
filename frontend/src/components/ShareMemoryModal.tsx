import { useState } from "react";
import { Button } from "./Button";
import { CrossIcon } from "../icons/CrossIcon";
import { CopyIcon } from "../icons/CopyIcon";

interface ShareMemoryModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string | null;
  onEnableSharing: () => Promise<void>;
  onDisableSharing: () => Promise<void>;
  isLoading: boolean;
  isModalLoading?: boolean;
}

export function ShareMemoryModal({ open, onClose, shareUrl, onEnableSharing, onDisableSharing, isLoading, isModalLoading = false }: ShareMemoryModalProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="w-screen h-screen bg-white/20 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Share your memory</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <CrossIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isModalLoading ? (
            // Loading state while checking sharing status
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
              <p className="text-center text-gray-600 text-sm">Checking sharing status...</p>
            </div>
          ) : !shareUrl ? (
            // Not shared yet
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">Enable sharing to generate a link that allows others to access your brain.</p>
              <Button variant="primary" size="md" text={isLoading ? "Enabling..." : "Enable Sharing"} onClick={onEnableSharing} />
            </div>
          ) : (
            // Already shared
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Sharing link:</p>
                    <p className="text-sm font-mono text-gray-800 truncate">{shareUrl}</p>
                  </div>
                  <button onClick={handleCopyLink} className="ml-3 p-2 text-gray-500 hover:text-gray-700 transition-colors" title="Copy link">
                    <CopyIcon />
                  </button>
                </div>
              </div>

              {copyFeedback && <div className="text-green-600 text-sm font-medium">Link copied to clipboard!</div>}

              <Button variant="secondary" size="md" text={isLoading ? "Disabling..." : "Disable Sharing"} onClick={onDisableSharing} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

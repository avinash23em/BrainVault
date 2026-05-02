import { CrossIcon } from "../icons/CrossIcon";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  if (!open) return null;

  // Convert Google Drive link to embeddable format
  const embedUrl = "https://drive.google.com/file/d/1_gjrs7tXEi1I-pbtBHYh7F-0YF6kwXLN/preview";

  return (
    <div className="w-screen h-screen bg-black/70 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">BrainVault Demo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <CrossIcon />
          </button>
        </div>

        {/* Video Content */}
        <div className="p-4">
          <div className="relative w-full h-96">
            <iframe src={embedUrl} className="w-full h-full rounded-lg" allow="autoplay" allowFullScreen title="BrainVault Demo Video" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">Watch how BrainVault helps you organize and query your digital content with AI.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { CrossIcon } from "../icons/CrossIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { PinterestIcon } from "../icons/PinterestIcon";
import { LinkedInIcon } from "../icons/LinkedInIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { useEffect } from "react";

interface ContentDetailsModalProps {
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

export function ContentDetailsModal({ open, onClose, content }: ContentDetailsModalProps) {
  // Add useEffect to handle Twitter widget rendering in modal
  useEffect(() => {
    if (open && content?.type === "twitter" && content?.link && window.twttr) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        window.twttr.widgets.load();
      }, 100);
    }
  }, [open, content]);

  if (!open || !content) return null;

  const getTypeIcon = () => {
    switch (content.type) {
      case "youtube":
        return <YoutubeIcon />;
      case "twitter":
        return <TwitterIcon />;
      case "pinterest":
        return <PinterestIcon />;
      case "linkedin":
        return <LinkedInIcon />;
      case "instagram":
        return <InstagramIcon />;
      case "link":
        return <LinkIcon />;
      case "document":
      default:
        return <DocumentIcon />;
    }
  };

  const getTypeName = () => {
    switch (content.type) {
      case "youtube":
        return "YouTube";
      case "twitter":
        return "Twitter";
      case "pinterest":
        return "Pinterest";
      case "linkedin":
        return "LinkedIn";
      case "instagram":
        return "Instagram";
      case "link":
        return "Link";
      case "document":
      default:
        return "Document";
    }
  };

  return (
    <div className="w-screen h-screen bg-white/20 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 pr-4 flex-1">{content.title}</h3>
          <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors flex-shrink-0">
            <CrossIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Content Type */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <span className="mr-2">{getTypeIcon()}</span>
              {getTypeName()}
            </span>
          </div>

          {/* Link - Only show for specific types, not for LinkedIn, Instagram, Pinterest, and Link */}
          {content.link && !["linkedin", "instagram", "pinterest", "link"].includes(content.type) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Link:</h4>
              <div className="flex items-center">
                <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm break-all flex items-center">
                  <LinkIcon />
                  <span className="ml-2">{content.link}</span>
                </a>
              </div>
            </div>
          )}

          {/* Embedded Content */}
          <div className="mb-6">
            {content.type === "youtube" && content.link && (
  <iframe
    className="w-full aspect-video rounded-lg"
    src={
      content.link.includes("youtu.be/")
        ? content.link.replace("youtu.be/", "www.youtube.com/embed/")
        : content.link.includes("shorts/")
          ? content.link.replace("shorts/", "embed/")
          : content.link.replace("watch?v=", "embed/")
    }
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  />
)}

            {content.type === "twitter" && content.link && (
              <div className="twitter-embed-container">
                <blockquote className="twitter-tweet" data-theme="light" data-width="100%">
                  <a href={content.link.replace("x.com", "twitter.com")}></a>
                </blockquote>
              </div>
            )}

            {content.type === "document" && !content.link && <div className="bg-gray-50 p-4 rounded-lg border text-gray-600">Text document without external link</div>}

            {/* LinkedIn, Instagram, Pinterest, and Link - Show embedded-style display with single link */}
            {(content.type === "linkedin" || content.type === "instagram" || content.type === "pinterest" || content.type === "link") && content.link && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-3">
                  <span className="text-blue-600 mr-2">{getTypeIcon()}</span>
                  <span className="font-medium text-gray-700 capitalize">{content.type === "link" ? "External Link" : `${content.type} Content`}</span>
                </div>
                <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  {content.type === "linkedin" ? "View on LinkedIn" : content.type === "instagram" ? "View on Instagram" : content.type === "pinterest" ? "View on Pinterest" : "Visit Link"} &rarr;
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {content.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-700 whitespace-pre-wrap">{content.description}</p>
              </div>
            </div>
          )}

          {!content.description && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No description provided</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { PinterestIcon } from "../icons/PinterestIcon";
import { LinkedInIcon } from "../icons/LinkedInIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { ContentDetailsModal } from "./ContentDetailsModal";
import { EditIcon } from "../icons/EditIcon";

interface CardProps {
  _id: string;
  title: string;
  link: string;
  type: string;
  description?: string;
  onDelete: (id: string, title: string) => void;
  onEdit: (content: { _id: string; title: string; link: string; type: string; description?: string }) => void;
}

export function Card({ _id, title, link, type, description = "", onDelete, onEdit }: CardProps) {
  const isDeleteDisabled = !onDelete || onDelete.toString() === "() => {}";
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Add useEffect to handle Twitter widget rendering
  useEffect(() => {
    if (type === "twitter" && link && window.twttr) {
      // Force Twitter widgets to render
      window.twttr.widgets.load();
    }
  }, [type, link]);

  const getTypeIcon = () => {
    switch (type) {
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
    switch (type) {
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

  // Truncate description to show only first 2-3 lines (approximately 120 characters)
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const shouldShowReadMore = description && description.length > 120;

  return (
    <div>
      <div className="bg-white rounded-md border border-gray-300 p-4 w-full min-h-48">
        <div className="flex justify-between mb-4">
          <div className="flex items-center flex-1 min-w-0">
            <div className="text-gray-500 pr-2 flex-shrink-0 cursor-pointer hover:text-purple-600 transition-colors" onClick={() => onEdit({ _id, title, link, type, description })} title="Edit content">
              <EditIcon />
            </div>
            <span className="truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {link && (
              <div className="text-gray-500 pr-2">
                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                  <LinkIcon />
                </a>
              </div>
            )}
            {!isDeleteDisabled && (
              <div className="text-gray-500 pr-2 hover:text-red-500 cursor-pointer" onClick={() => onDelete(_id, title)}>
                <DeleteIcon />
              </div>
            )}
          </div>
        </div>

        {/* Content Type Display */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-purple-100 hover:text-purple-800 transition-colors" onClick={() => setShowDetailsModal(true)} title="View details">
            <span className="mr-1">{getTypeIcon()}</span>
            {getTypeName()}
          </span>
        </div>

        <div className="mb-4">
         {type === "youtube" && link && (
  <iframe
    className="w-full aspect-video"
    src={
      link.includes("youtu.be/") 
        ? link.replace("youtu.be/", "www.youtube.com/embed/") 
        : link.includes("shorts/") 
          ? link.replace("shorts/", "embed/") 
          : link.replace("watch?v=", "embed/")
    }
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  />
)}

          {type === "twitter" && link && (
            <div className="twitter-embed-container">
              <blockquote className="twitter-tweet" data-theme="light">
                <a href={link.replace("x.com", "twitter.com")}></a>
              </blockquote>
            </div>
          )}

          {type === "document" && !link && <div className="bg-gray-50 p-3 rounded border text-gray-600 text-sm">Text document without external link</div>}

          {(type === "pinterest" || type === "linkedin" || type === "instagram" || type === "link") && link && (
            <div className="bg-blue-50 p-3 rounded border">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm break-all">
                {link}
              </a>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="mt-3 p-3 bg-gray-50 rounded border">
            <p className="text-sm text-gray-700 leading-relaxed">{truncateDescription(description)}</p>
            {shouldShowReadMore && (
              <button onClick={() => setShowDetailsModal(true)} className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2 transition-colors">
                Read more
              </button>
            )}
          </div>
        )}

        {/* View Details Button for cards without description or short description */}
        {(!description || description.length <= 120) && (
          <div className="mt-3 text-center">
            <button onClick={() => setShowDetailsModal(true)} className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
              View Details
            </button>
          </div>
        )}
      </div>

      {/* Content Details Modal */}
      <ContentDetailsModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        content={{
          _id,
          title,
          link,
          type,
          description,
        }}
      />
    </div>
  );
}

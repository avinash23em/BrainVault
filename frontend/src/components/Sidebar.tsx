import { HomeIcon } from "../icons/HomeIcon";
import { Logo } from "../icons/Logo";
import { LogOutIcon } from "../icons/LogoutIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { CrossIcon } from "../icons/CrossIcon";
import { SideBarItem } from "./SidebarItem";
import { LinkedInIcon } from "../icons/LinkedInIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { PinterestIcon } from "../icons/PinterestIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";

interface SidebarProps {
  onContentTypeChange: (contentType: string) => void;
  selectedType: string;
  onClose?: () => void;
}

export function Sidebar({ onContentTypeChange, selectedType, onClose }: SidebarProps) {
  return (
    <div className="h-screen bg-white border-r-4 border-purple-200 shadow-lg w-72 left-0 top-0 pl-6 flex flex-col justify-between relative rounded-r-2xl overflow-hidden">
      {/* Decorative border accent */}
      <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 rounded-full"></div>

      <div>
        <div className="flex items-center justify-between text-2xl pt-8">
          <div className="flex items-center">
            <div className="text-purple-600">
              <Logo />
            </div>
            <span className="ml-2">BrainVault</span>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 mr-6">
              <CrossIcon />
            </button>
          )}
        </div>
        <div className="pt-8 pl-4">
          <SideBarItem text="Home" icon={<HomeIcon />} onClick={() => onContentTypeChange("home")} isSelected={selectedType === "home"} />
          <SideBarItem text="Documents" icon={<DocumentIcon />} onClick={() => onContentTypeChange("document")} isSelected={selectedType === "document"} />
          <SideBarItem text="Youtube" icon={<YoutubeIcon />} onClick={() => onContentTypeChange("youtube")} isSelected={selectedType === "youtube"} />
          <SideBarItem text="Twitter" icon={<TwitterIcon />} onClick={() => onContentTypeChange("twitter")} isSelected={selectedType === "twitter"} />
          <SideBarItem text="Pinterest" icon={<PinterestIcon />} onClick={() => onContentTypeChange("pinterest")} isSelected={selectedType === "pinterest"} />
          <SideBarItem text="LinkedIn" icon={<LinkedInIcon />} onClick={() => onContentTypeChange("linkedin")} isSelected={selectedType === "linkedin"} />
          <SideBarItem text="Instagram" icon={<InstagramIcon />} onClick={() => onContentTypeChange("instagram")} isSelected={selectedType === "instagram"} />
          <SideBarItem text="Links" icon={<LinkIcon />} onClick={() => onContentTypeChange("link")} isSelected={selectedType === "link"} />
        </div>
      </div>
      <div className="pl-4 mb-4">
        <SideBarItem
          text="Logout"
          icon={<LogOutIcon />}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }}
        />
      </div>
    </div>
  );
}

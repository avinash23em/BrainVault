import type { ReactElement } from "react";

interface SideBarItemProps {
  text: string;
  icon: ReactElement;
  onClick?: () => void;
  isSelected?: boolean;
}

export function SideBarItem({ text, icon, onClick, isSelected }: SideBarItemProps) {
  return (
    <div className={`flex items-center py-4 cursor-pointer transition-all duration-200 rounded pl-4 ${isSelected ? "bg-purple-100 text-purple-600 border-r-2 border-purple-600" : "hover:bg-gray-100 text-gray-700"}`} onClick={onClick}>
      {icon}
      <span className="ml-2">{text}</span>
    </div>
  );
}

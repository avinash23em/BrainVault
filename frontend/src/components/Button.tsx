import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  text: string;
  onClick?: () => void;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  fullWidth?: boolean;
  loading?: boolean;
}
const variantStyles = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-purple-200 text-purple-600 hover:bg-purple-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-md",
  lg: "px-6 py-3 text-lg",
};

const defaultStyles = "m-2 rounded-md flex items-center transition-colors duration-200";

export const Button = (props: ButtonProps) => {
  return (
    <button className={`${variantStyles[props.variant]} ${sizeStyles[props.size]} ${defaultStyles} ${props.fullWidth ? "w-full flex items-center justify-center" : ""} ${props.loading ? "opacity-45" : ""} whitespace-nowrap`} onClick={props.onClick} disabled={props.loading}>
      {props.startIcon}
      <div className="px-2">{props.text}</div>
      {props.endIcon}
    </button>
  );
};

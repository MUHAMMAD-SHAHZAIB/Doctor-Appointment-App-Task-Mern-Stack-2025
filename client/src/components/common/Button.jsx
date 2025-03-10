
import React from "react";

const Button = ({
  text,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  icon = null,
}) => {
  const getButtonClass = () => {
    let className = "btn";

    // Add variant
    className += ` btn-${variant}`;

    // Add size
    className += ` btn-${size}`;

    // Add full width
    if (fullWidth) className += " btn-block";

    // Add disabled
    if (disabled) className += " btn-disabled";

    return className;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={getButtonClass()}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;

import React from 'react';

const FormButton = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...rest
}) => {
  
  const variants = {
    success: 'bg-[#00b67a] hover:bg-[#00a36c]',
    primary: 'bg-[#7c5cfc] hover:bg-[#6b4ae6]',
    secondary: 'bg-[#64748b] hover:bg-[#526175]',
  };

  return (
    <button
      type={type}
      className={`px-5 py-1.5 text-white rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-xs min-w-[76px] ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default FormButton;
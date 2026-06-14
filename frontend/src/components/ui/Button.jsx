function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full bg-indigo-900 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-950 focus:ring-4 focus:ring-indigo-100 transition duration-200 shadow-md shadow-indigo-950/10 text-sm disabled:bg-indigo-300 disabled:cursor-not-allowed cursor-pointer"
    >
      {children}
    </button>
  );
}

export default Button;
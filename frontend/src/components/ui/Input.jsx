import React from "react";

const Input = React.forwardRef(function Input(
  {
    label,
    icon: Icon,
    type = "text",
    name,
    placeholder,
    disabled = false,
    ...rest
  },
  ref
) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-slate-400 text-lg" />
          </div>
        )}

        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-950 outline-none transition duration-200 text-sm"
        />
      </div>
    </div>
  );
});

export default Input;
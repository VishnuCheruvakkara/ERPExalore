import React from "react";

const FormInput = React.forwardRef(function FormInput(
  {
    label,
    type = "text",
    name,
    placeholder,
    disabled = false,
    required = false,
    className = "", // For grid layouts like md:col-span-2
    ...rest
  },
  ref
) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[11px] font-semibold text-slate-600 block">
          {label} {required && <span className="text-red-500 font-bold">* *</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
        className={`w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50/40 rounded focus:outline-hidden focus:border-slate-400 text-slate-700 placeholder-slate-400 transition-colors
          ${disabled ? "bg-slate-100 cursor-not-allowed opacity-60" : ""}
        `}
      />
    </div>
  );
});

export default FormInput;
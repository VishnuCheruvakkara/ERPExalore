// FormSelect.jsx
import React from 'react';

const FormSelect = React.forwardRef(function FormSelect(
    {
        label,
        name,
        disabled = false,
        required = false,
        className = '',
        children,
        ...rest
    },
    ref,
) {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="text-[11px] font-semibold text-slate-600 block">
                    {label}{' '}
                    {required && (
                        <span className="text-red-500 font-bold">* *</span>
                    )}
                </label>
            )}

            <select
                ref={ref}
                name={name}
                disabled={disabled}
                {...rest}
                className={`w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50/40 rounded focus:outline-hidden focus:border-slate-400 text-slate-700 cursor-pointer transition-colors
          ${disabled ? 'bg-slate-50/70 text-slate-400 cursor-not-allowed opacity-60' : ''}
        `}
            >
                {children}
            </select>
        </div>
    );
});

export default FormSelect;

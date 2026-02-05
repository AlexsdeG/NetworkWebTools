import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, type, ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`w-full px-3 py-2 bg-surface border border-slate-700 rounded-md shadow-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${error ? 'border-red-500 focus:ring-red-500' : ''} ${isPassword ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
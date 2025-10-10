import { forwardRef } from 'react';

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const variants = {
      primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-600',
      outline:
        'border border-black text-black bg-white hover:bg-black hover:text-white focus:ring-black',
      ghost: 'text-black hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };

    const sizes = {
      small: 'px-3 py-2 text-sm rounded-md',
      medium: 'px-6 py-3 text-sm rounded-lg',
      large: 'px-8 py-4 text-base rounded-lg',
    };

    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={buttonClasses}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;

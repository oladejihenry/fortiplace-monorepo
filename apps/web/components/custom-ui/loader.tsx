import { cn } from "@workspace/ui/lib/utils";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text,
  ...props
}: LoaderProps) {
  // Size mappings
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  // Variant mappings
  const variantMap = {
    default: 'text-muted-foreground',
    primary: 'text-emerald-500',
    secondary: 'text-primary'
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-2",
        className
      )} 
      {...props}
    >
      <svg
        className={cn(
          "animate-spin",
          sizeMap[size],
          variantMap[variant]
        )}
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
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className={cn(
          "text-sm font-medium",
          variantMap[variant]
        )}>
          {text}
        </span>
      )}
    </div>
  );
}

// Usage example for buttons
export function ButtonLoader({
  size = 'sm',
  variant = 'default',
  className
}: Omit<LoaderProps, 'text'>) {
  return (
    <LoadingSpinner
      size={size}
      variant={variant}
      className={cn("mr-2", className)}
    />
  );
}
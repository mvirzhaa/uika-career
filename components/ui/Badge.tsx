import { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'accent' | 'neutral' | 'info' | 'warning' | 'error' | 'success';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  );
};

import React from 'react';

export function Dialog({ children, open, onOpenChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">
        {React.Children.map(children, child => {
          if (child.type === DialogContent) {
            return React.cloneElement(child, { onClose: () => onOpenChange(false) });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = '', onClose, ...props }) {
  return (
    <div
      className={`relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}
      {...props}
    >
      {React.Children.map(children, child => {
        if (child.type === DialogHeader || child.type === DialogTitle || child.type === DialogDescription || child.type === DialogFooter) {
          return child;
        }
        return child;
      })}
    </div>
  );
}

export function DialogHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '', ...props }) {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = '', ...props }) {
  return (
    <p
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function DialogFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
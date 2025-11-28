import React, { useState } from 'react';

export function Select({ children, value, onValueChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            children: React.Children.map(child.props.children, c => {
              if (c.type === SelectValue) {
                return React.cloneElement(c, { value });
              }
              return c;
            })
          });
        }
        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, {
            onSelect: (val) => {
              onValueChange(val);
              setIsOpen(false);
            }
          }) : null;
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ children, className = '', ...props }) {
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 9l5 5 5-5" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder, value }) {
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ children, onSelect, className = '' }) {
  return (
    <div className={`absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`}>
      {React.Children.map(children, child => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, { onSelect });
        }
        return child;
      })}
    </div>
  );
}

export function SelectItem({ children, value, onSelect, className = '' }) {
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}
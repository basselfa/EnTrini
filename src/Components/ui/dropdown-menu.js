import React, { useState, useEffect, useRef } from 'react';

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen)
          });
        }
        if (child.type === DropdownMenuContent) {
          return isOpen ? React.cloneElement(child, {
            onClose: () => setIsOpen(false)
          }) : null;
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ children, onClick, asChild, ...props }) {
  const handleClick = (e) => {
    onClick && onClick(e);
    children.props.onClick && children.props.onClick(e);
  };
  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick, ...props });
  }
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
} // updated

export function DropdownMenuContent({ children, align = 'start', onClose, className = '', ...props }) {
  return (
    <div
      className={`absolute z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${align === 'end' ? 'right-0' : 'left-0'} ${className}`}
      {...props}
    >
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuItem) {
          return React.cloneElement(child, { onClose });
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, onClose, className = '', ...props }) {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={() => {
        onClick && onClick();
        onClose && onClose();
      }}
      {...props}
    >
      {children}
    </div>
  );
}
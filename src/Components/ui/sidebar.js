import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className = '', ...props }) {
  return (
    <div
      className={`flex h-full w-64 flex-col border-r bg-background ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`flex flex-col gap-2 p-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({ children, className = '', ...props }) {
  return (
    <div
      className={`flex-1 overflow-auto p-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`flex flex-col gap-2 p-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroup({ children, className = '', ...props }) {
  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, className = '', ...props }) {
  return (
    <div
      className={`flex flex-col gap-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarMenu({ children, className = '', ...props }) {
  return (
    <ul
      className={`flex flex-col gap-1 ${className}`}
      {...props}
    >
      {children}
    </ul>
  );
}

export function SidebarMenuItem({ children, className = '', ...props }) {
  return (
    <li
      className={`flex ${className}`}
      {...props}
    >
      {children}
    </li>
  );
}

export function SidebarMenuButton({ children, asChild, className = '', ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${children.props.className || ''} ${className}`,
      ...props
    });
  }

  return (
    <button
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarTrigger({ children, className = '', ...props }) {
  const { open, setOpen } = useContext(SidebarContext);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
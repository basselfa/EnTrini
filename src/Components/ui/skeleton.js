import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`rounded-md bg-muted ${className}`}
      {...props}
    />
  );
}
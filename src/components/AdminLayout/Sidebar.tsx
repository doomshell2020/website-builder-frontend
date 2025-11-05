'use client';

import React from 'react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button onClick={onToggle}>
        {collapsed ? 'Expand' : 'Collapse'}
      </button>
      {/* Your sidebar content here */}
    </div>
  );
};

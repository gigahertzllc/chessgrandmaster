/**
 * Mobile Navigation Components
 * 
 * - MobileNavBar: Bottom navigation for mobile
 * - MobileHeader: Top header for mobile
 * - ResponsiveLayout: Wrapper that handles layout changes
 */

import React, { useState } from "react";
import { useResponsive } from "../hooks/useResponsive.js";

// Navigation items
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "♟️" },
  { id: "play", label: "Play", icon: "⚔️" },
  { id: "learn", label: "Learn", icon: "📖" },
  { id: "masters", label: "Masters", icon: "👑" },
  { id: "settings", label: "Settings", icon: "⚙️" }
];

/**
 * Mobile Bottom Navigation Bar
 */
export function MobileNavBar({ activeTab, onTabChange }) {
  const responsive = useResponsive();
  
  if (!responsive.isMobile) return null;

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 64,
      background: "#1a1a1a",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 1000,
      paddingBottom: "env(safe-area-inset-bottom, 0)"
    }}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            color: activeTab === item.id ? "#4CAF50" : "rgba(255,255,255,0.5)",
            cursor: "pointer",
            padding: "8px 12px",
            minWidth: 60,
            transition: "color 0.2s"
          }}
        >
          <span style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/**
 * Mobile Header
 */
export function MobileHeader({ title, onMenuClick, rightAction }) {
  const responsive = useResponsive();
  
  if (!responsive.isMobile) return null;

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      background: "#1a1a1a",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      zIndex: 1000,
      paddingTop: "env(safe-area-inset-top, 0)"
    }}>
      {onMenuClick ? (
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
            padding: 8
          }}
        >
          ☰
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      
      <h1 style={{
        fontSize: 18,
        fontWeight: 600,
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        {title}
      </h1>
      
      {rightAction || <div style={{ width: 40 }} />}
    </header>
  );
}

/**
 * Responsive Layout Wrapper
 * 
 * Handles padding for mobile header/nav and provides consistent layout
 */
export function ResponsiveLayout({ children, header, showNav = true, activeTab, onTabChange }) {
  const responsive = useResponsive();

  // Calculate padding based on screen size and UI elements
  const paddingTop = responsive.isMobile ? 56 + 16 : 0; // Header + spacing
  const paddingBottom = responsive.isMobile && showNav ? 64 + 16 : 0; // Nav + spacing

  return (
    <div style={{
      minHeight: "100vh",
      minHeight: "100dvh",
      background: "#121212",
      color: "#fff"
    }}>
      {responsive.isMobile && header}
      
      <main style={{
        paddingTop: responsive.isMobile ? paddingTop : 0,
        paddingBottom: responsive.isMobile ? paddingBottom : 0,
        paddingLeft: responsive.isMobile ? 12 : 0,
        paddingRight: responsive.isMobile ? 12 : 0,
        minHeight: "100vh",
        minHeight: "100dvh"
      }}>
        {children}
      </main>

      {showNav && responsive.isMobile && (
        <MobileNavBar activeTab={activeTab} onTabChange={onTabChange} />
      )}
    </div>
  );
}

/**
 * Responsive Container - constrains width on large screens
 */
export function ResponsiveContainer({ children, maxWidth = 1200, padding }) {
  const responsive = useResponsive();
  
  const defaultPadding = responsive.isMobile ? 0 : responsive.isTablet ? 24 : 32;
  
  return (
    <div style={{
      width: "100%",
      maxWidth: maxWidth,
      margin: "0 auto",
      padding: padding !== undefined ? padding : defaultPadding
    }}>
      {children}
    </div>
  );
}

/**
 * Responsive Grid - adapts columns based on screen size
 */
export function ResponsiveGrid({ children, minItemWidth = 280, gap, style }) {
  const responsive = useResponsive();
  
  const gridGap = gap || (responsive.isMobile ? 12 : responsive.isTablet ? 16 : 20);
  
  // On mobile, single column. Otherwise auto-fit
  const gridTemplate = responsive.isMobile 
    ? "1fr" 
    : `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`;
  
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: gridTemplate,
      gap: gridGap,
      ...style
    }}>
      {children}
    </div>
  );
}

/**
 * Responsive Flex Row - stacks on mobile
 */
export function ResponsiveRow({ children, gap, align = "start", justify = "start", mobileReverse = false }) {
  const responsive = useResponsive();
  
  const flexGap = gap || (responsive.isMobile ? 16 : 24);
  
  return (
    <div style={{
      display: "flex",
      flexDirection: responsive.isMobile 
        ? (mobileReverse ? "column-reverse" : "column") 
        : "row",
      alignItems: responsive.isMobile ? "stretch" : align,
      justifyContent: justify,
      gap: flexGap
    }}>
      {children}
    </div>
  );
}

/**
 * Back Button - responsive sizing
 */
export function BackButton({ onClick, label = "Back" }) {
  const responsive = useResponsive();
  
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: responsive.isMobile ? "10px 16px" : "8px 16px",
        background: "rgba(255,255,255,0.1)",
        border: "none",
        borderRadius: 8,
        color: "#fff",
        fontSize: responsive.isMobile ? 14 : 14,
        cursor: "pointer",
        minHeight: responsive.isMobile ? 44 : 36
      }}
    >
      ← {!responsive.isMobile && label}
    </button>
  );
}

/**
 * Page Header - responsive title and back button
 */
export function PageHeader({ title, subtitle, onBack, rightContent }) {
  const responsive = useResponsive();
  
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: responsive.isMobile ? 16 : 24,
      flexWrap: "wrap",
      gap: 12
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        {onBack && <BackButton onClick={onBack} />}
        <div>
          <h1 style={{
            fontSize: responsive.isMobile ? 20 : responsive.isTablet ? 28 : 32,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.2
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: responsive.isMobile ? 13 : 14,
              color: "rgba(255,255,255,0.6)",
              margin: "4px 0 0 0"
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightContent && (
        <div style={{ display: "flex", gap: 8 }}>
          {rightContent}
        </div>
      )}
    </div>
  );
}

export default ResponsiveLayout;

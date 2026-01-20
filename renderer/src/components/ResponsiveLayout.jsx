/**
 * ResponsiveLayout - Mobile-first layout wrapper
 * 
 * Provides:
 * - Mobile bottom navigation
 * - Responsive header
 * - Proper spacing for safe areas
 * - Adaptive layouts
 */

import React, { useState, useEffect } from "react";
import useResponsive from "../hooks/useResponsive.js";

// Icons as simple components
const Icons = {
  library: () => <span style={{ fontSize: 22 }}>📚</span>,
  play: () => <span style={{ fontSize: 22 }}>♟️</span>,
  coach: () => <span style={{ fontSize: 22 }}>🎓</span>,
  zone: () => <span style={{ fontSize: 22 }}>🎯</span>,
  settings: () => <span style={{ fontSize: 22 }}>⚙️</span>,
  menu: () => <span style={{ fontSize: 24 }}>☰</span>,
  back: () => <span style={{ fontSize: 20 }}>←</span>,
  close: () => <span style={{ fontSize: 24 }}>×</span>,
};

/**
 * Mobile Bottom Navigation
 */
export function MobileNav({ activeTab, onTabChange, theme }) {
  const tabs = [
    { id: "library", label: "Library", icon: Icons.library },
    { id: "play", label: "Play", icon: Icons.play },
    { id: "coach", label: "Coach", icon: Icons.coach },
    { id: "zone", label: "Zone", icon: Icons.zone },
  ];

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "rgba(26, 26, 26, 0.98)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "8px 8px",
      paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0))",
      display: "flex",
      justifyContent: "space-around",
      zIndex: 1000,
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px 16px",
              background: "none",
              border: "none",
              color: isActive ? "#4CAF50" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
          >
            <IconComponent />
            <span style={{ 
              fontSize: 10, 
              fontWeight: isActive ? 600 : 500,
              letterSpacing: "0.02em"
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * Mobile Header
 */
export function MobileHeader({ 
  title = "ChessGrandmaster", 
  showBack = false, 
  onBack, 
  rightAction,
  theme 
}) {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      background: "rgba(26, 26, 26, 0.95)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: "12px 16px",
      paddingTop: "calc(12px + env(safe-area-inset-top, 0))",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 90,
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        {showBack ? (
          <button 
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: 8,
              marginLeft: -8,
            }}
          >
            <Icons.back />
          </button>
        ) : (
          <span style={{ fontSize: 24 }}>♛</span>
        )}
        <span style={{ 
          fontWeight: 600, 
          fontSize: showBack ? 16 : 18,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {title}
        </span>
      </div>
      
      {rightAction && (
        <div style={{ marginLeft: 12 }}>
          {rightAction}
        </div>
      )}
    </header>
  );
}

/**
 * Desktop Header (existing style, slightly refined)
 */
export function DesktopHeader({ 
  activeTab, 
  onTabChange, 
  theme, 
  fonts,
  rightContent 
}) {
  const tabs = [
    { id: "library", label: "Library" },
    { id: "play", label: "Play" },
    { id: "coach", label: "Coach" },
    { id: "training", label: "Zone" },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: `linear-gradient(to bottom, ${theme.bg} 0%, ${theme.bg}ee 100%)`,
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <div style={{ 
        maxWidth: 1400, 
        margin: "0 auto", 
        padding: "16px 32px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 32 }}>♛</span>
          <span style={{ fontFamily: fonts?.display, fontSize: 22, fontWeight: 500 }}>
            ChessGrandmaster
          </span>
        </div>

        <nav style={{ display: "flex", gap: 32 }}>
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => onTabChange(tab.id)}
              style={{
                background: "none",
                border: "none",
                fontFamily: fonts?.body,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: theme.ink,
                opacity: activeTab === tab.id ? 1 : 0.5,
                cursor: "pointer",
                padding: "8px 0",
                position: "relative",
                transition: "opacity 0.2s",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div style={{ 
                  position: "absolute", 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: 2, 
                  background: theme.accent, 
                  borderRadius: 1 
                }} />
              )}
            </button>
          ))}
        </nav>

        {rightContent}
      </div>
    </header>
  );
}

/**
 * Main ResponsiveLayout Component
 */
export default function ResponsiveLayout({ 
  children, 
  activeTab,
  onTabChange,
  title,
  showBack,
  onBack,
  headerRightAction,
  headerRightContent,
  theme,
  fonts,
  hideNavigation = false
}) {
  const viewport = useResponsive();
  const { isMobile, isTablet } = viewport;

  // Content padding for mobile nav
  const contentStyle = isMobile && !hideNavigation ? {
    paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0))",
    minHeight: "100vh",
  } : {
    minHeight: "100vh",
  };

  return (
    <div style={{ 
      background: theme?.bg || "#121212", 
      color: theme?.ink || "#fff",
      minHeight: "100vh",
    }}>
      {/* Header - different for mobile vs desktop */}
      {isMobile ? (
        <MobileHeader 
          title={title}
          showBack={showBack}
          onBack={onBack}
          rightAction={headerRightAction}
          theme={theme}
        />
      ) : (
        <DesktopHeader
          activeTab={activeTab}
          onTabChange={onTabChange}
          theme={theme}
          fonts={fonts}
          rightContent={headerRightContent}
        />
      )}

      {/* Main Content */}
      <main style={contentStyle}>
        {children}
      </main>

      {/* Mobile Navigation */}
      {isMobile && !hideNavigation && (
        <MobileNav 
          activeTab={activeTab}
          onTabChange={onTabChange}
          theme={theme}
        />
      )}
    </div>
  );
}

/**
 * Responsive Container - auto-adjusts padding and max-width
 */
export function ResponsiveContainer({ children, style = {} }) {
  const viewport = useResponsive();
  
  return (
    <div style={{
      width: "100%",
      maxWidth: viewport.isMobile ? "100%" : viewport.isTablet ? 900 : 1400,
      margin: "0 auto",
      padding: viewport.isMobile ? "16px" : viewport.isTablet ? "24px" : "32px",
      ...style
    }}>
      {children}
    </div>
  );
}

/**
 * Responsive Grid - adapts columns based on viewport
 */
export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 12, tablet: 16, desktop: 20 },
  style = {}
}) {
  const viewport = useResponsive();
  
  const columns = viewport.isMobile 
    ? cols.mobile 
    : viewport.isTablet 
      ? cols.tablet 
      : cols.desktop;
      
  const gapSize = viewport.isMobile 
    ? gap.mobile 
    : viewport.isTablet 
      ? gap.tablet 
      : gap.desktop;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gapSize,
      ...style
    }}>
      {children}
    </div>
  );
}

/**
 * Responsive Card - consistent styling across breakpoints
 */
export function ResponsiveCard({ children, onClick, highlight = false, style = {} }) {
  const viewport = useResponsive();
  
  return (
    <div 
      onClick={onClick}
      style={{
        background: highlight 
          ? "linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(33,150,243,0.15) 100%)"
          : "rgba(255,255,255,0.05)",
        borderRadius: viewport.isMobile ? 12 : 16,
        padding: viewport.isMobile ? 16 : viewport.isTablet ? 20 : 24,
        border: highlight 
          ? "1px solid rgba(76,175,80,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Export viewport hook for use in other components
export { useResponsive };

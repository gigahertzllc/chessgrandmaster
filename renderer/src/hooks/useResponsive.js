/**
 * Responsive Utilities for ChessGrandmaster
 * 
 * Breakpoints:
 * - Mobile: < 768px (phones)
 * - Tablet: 768px - 1023px (tablets, small laptops)
 * - Desktop: >= 1024px (laptops, desktops)
 */

import { useState, useEffect, useCallback } from "react";

// Breakpoint constants
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

/**
 * Hook to get current window size and device type
 */
export function useResponsive() {
  const [state, setState] = useState(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1200;
    const height = typeof window !== "undefined" ? window.innerHeight : 800;
    return {
      width,
      height,
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
      isDesktop: width >= BREAKPOINTS.tablet,
      isLandscape: width > height,
    };
  });

  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setState({
          width,
          height,
          isMobile: width < BREAKPOINTS.mobile,
          isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
          isDesktop: width >= BREAKPOINTS.tablet,
          isLandscape: width > height,
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return state;
}

/**
 * Get optimal board size based on viewport
 */
export function getBoardSize(viewport, options = {}) {
  const { padding = 32, maxSize = 600, minSize = 280 } = options;
  const { width, height, isMobile, isTablet } = viewport;

  if (isMobile) {
    // On mobile, board takes full width minus padding
    const availableWidth = width - (padding * 2);
    // Account for move list and other UI below
    const availableHeight = height - 280;
    return Math.max(minSize, Math.min(availableWidth, availableHeight, 400));
  }
  
  if (isTablet) {
    const availableWidth = width - (padding * 2);
    const availableHeight = height - 200;
    return Math.max(minSize, Math.min(availableWidth * 0.65, availableHeight * 0.7, 480));
  }

  // Desktop - board alongside side panel
  const availableHeight = height - 180;
  return Math.max(minSize, Math.min(maxSize, availableHeight));
}

/**
 * Responsive spacing utility
 */
export function getSpacing(viewport) {
  if (viewport.isMobile) {
    return { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
  }
  if (viewport.isTablet) {
    return { xs: 6, sm: 10, md: 16, lg: 20, xl: 32 };
  }
  return { xs: 8, sm: 12, md: 20, lg: 28, xl: 40 };
}

/**
 * Responsive font sizes
 */
export function getFontSizes(viewport) {
  if (viewport.isMobile) {
    return {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 20,
      xxl: 24,
      hero: 32,
    };
  }
  if (viewport.isTablet) {
    return {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
      hero: 40,
    };
  }
  return {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 26,
    xxl: 36,
    hero: 56,
  };
}

/**
 * Common responsive styles
 */
export const responsiveStyles = {
  // Container that adapts to screen size
  container: (viewport) => ({
    width: "100%",
    maxWidth: viewport.isMobile ? "100%" : viewport.isTablet ? 900 : 1200,
    margin: "0 auto",
    padding: viewport.isMobile ? "0 16px" : viewport.isTablet ? "0 24px" : "0 32px",
  }),

  // Flex row that stacks on mobile
  flexRowStack: (viewport) => ({
    display: "flex",
    flexDirection: viewport.isMobile ? "column" : "row",
    gap: viewport.isMobile ? 16 : 24,
  }),

  // Grid that adapts columns
  adaptiveGrid: (viewport, desktopCols = 3, tabletCols = 2) => ({
    display: "grid",
    gridTemplateColumns: viewport.isMobile 
      ? "1fr" 
      : viewport.isTablet 
        ? `repeat(${tabletCols}, 1fr)` 
        : `repeat(${desktopCols}, 1fr)`,
    gap: viewport.isMobile ? 12 : viewport.isTablet ? 16 : 20,
  }),

  // Card styling
  card: (viewport) => ({
    background: "rgba(255,255,255,0.05)",
    borderRadius: viewport.isMobile ? 12 : 16,
    padding: viewport.isMobile ? 16 : viewport.isTablet ? 20 : 24,
    border: "1px solid rgba(255,255,255,0.08)",
  }),

  // Button styling
  button: (viewport, variant = "primary") => {
    const base = {
      padding: viewport.isMobile ? "12px 20px" : "14px 28px",
      borderRadius: 8,
      fontSize: viewport.isMobile ? 14 : 15,
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s ease",
      width: viewport.isMobile ? "100%" : "auto",
    };
    
    if (variant === "primary") {
      return { ...base, background: "#4CAF50", color: "#fff" };
    }
    if (variant === "secondary") {
      return { ...base, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" };
    }
    if (variant === "ghost") {
      return { ...base, background: "transparent", color: "rgba(255,255,255,0.7)" };
    }
    return base;
  },

  // Section header
  sectionHeader: (viewport) => ({
    fontSize: viewport.isMobile ? 12 : 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    opacity: 0.6,
    marginBottom: viewport.isMobile ? 12 : 16,
  }),

  // Page title
  pageTitle: (viewport) => ({
    fontSize: viewport.isMobile ? 24 : viewport.isTablet ? 32 : 40,
    fontWeight: 700,
    marginBottom: viewport.isMobile ? 8 : 12,
  }),

  // Hide on mobile
  hideOnMobile: (viewport) => ({
    display: viewport.isMobile ? "none" : "block",
  }),

  // Show only on mobile
  showOnMobile: (viewport) => ({
    display: viewport.isMobile ? "block" : "none",
  }),
};

export default useResponsive;

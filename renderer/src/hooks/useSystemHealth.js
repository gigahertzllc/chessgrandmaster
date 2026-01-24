/**
 * useSystemHealth Hook
 * Verifies all backend services are working properly
 * - Supabase connection
 * - Wikipedia API
 * - Lichess API
 * - Chess.com API
 */

import { useState, useCallback } from 'react';
import { supabase } from '../supabase.js';
import { testImageLoads } from '../services/wikipediaService.js';
import { testLichessConnection, testChessComConnection } from '../services/chessServices.js';

const SERVICE_TIMEOUT = 10000; // 10 seconds

export function useSystemHealth() {
  const [status, setStatus] = useState({
    supabase: { checked: false, ok: false, message: '' },
    wikipedia: { checked: false, ok: false, message: '' },
    lichess: { checked: false, ok: false, message: '' },
    chesscom: { checked: false, ok: false, message: '' }
  });
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Test Supabase connection
  const checkSupabase = async () => {
    const start = Date.now();
    try {
      if (!supabase) {
        return { ok: false, message: 'Supabase not configured', latency: 0 };
      }
      
      // Try a simple query
      const { error } = await supabase
        .from('master_games')
        .select('id')
        .limit(1);
      
      const latency = Date.now() - start;
      
      if (error) {
        // Check if it's just empty table (that's OK)
        if (error.code === 'PGRST116') {
          return { ok: true, message: `Connected (${latency}ms)`, latency };
        }
        return { ok: false, message: error.message, latency };
      }
      
      return { ok: true, message: `Connected (${latency}ms)`, latency };
    } catch (e) {
      return { ok: false, message: e.message, latency: Date.now() - start };
    }
  };

  // Test Wikipedia API with actual image load
  const checkWikipedia = async () => {
    const start = Date.now();
    try {
      // Test the API endpoint
      const res = await fetch(
        'https://en.wikipedia.org/w/api.php?action=query&titles=Magnus_Carlsen&prop=pageimages&format=json&origin=*&pithumbsize=100'
      );
      
      if (!res.ok) {
        return { ok: false, message: `API error: ${res.status}`, latency: Date.now() - start };
      }
      
      const data = await res.json();
      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0];
      const imageUrl = page?.thumbnail?.source;
      
      if (!imageUrl) {
        return { ok: false, message: 'No image returned', latency: Date.now() - start };
      }
      
      // Actually test if image loads
      const loadResult = await testImageLoads(imageUrl, 5000);
      const latency = Date.now() - start;
      
      if (!loadResult.success) {
        return { ok: false, message: 'Image failed to load', latency };
      }
      
      return { ok: true, message: `Working (${latency}ms)`, latency };
    } catch (e) {
      return { ok: false, message: e.message, latency: Date.now() - start };
    }
  };

  // Test Lichess API
  const checkLichess = async () => {
    const start = Date.now();
    try {
      const res = await fetch('https://lichess.org/api/user/DrNykterstein', {
        headers: { Accept: 'application/json' }
      });
      
      const latency = Date.now() - start;
      
      if (!res.ok) {
        return { ok: false, message: `API error: ${res.status}`, latency };
      }
      
      return { ok: true, message: `Working (${latency}ms)`, latency };
    } catch (e) {
      return { ok: false, message: e.message, latency: Date.now() - start };
    }
  };

  // Test Chess.com API
  const checkChessCom = async () => {
    const start = Date.now();
    try {
      const res = await fetch('https://api.chess.com/pub/player/magnuscarlsen');
      
      const latency = Date.now() - start;
      
      if (!res.ok) {
        return { ok: false, message: `API error: ${res.status}`, latency };
      }
      
      return { ok: true, message: `Working (${latency}ms)`, latency };
    } catch (e) {
      return { ok: false, message: e.message, latency: Date.now() - start };
    }
  };

  // Run all health checks
  const checkAll = useCallback(async () => {
    setChecking(true);
    
    const newStatus = { ...status };
    
    // Check all services in parallel
    const [supabaseResult, wikipediaResult, lichessResult, chesscomResult] = await Promise.all([
      checkSupabase(),
      checkWikipedia(),
      checkLichess(),
      checkChessCom()
    ]);
    
    newStatus.supabase = { checked: true, ...supabaseResult };
    newStatus.wikipedia = { checked: true, ...wikipediaResult };
    newStatus.lichess = { checked: true, ...lichessResult };
    newStatus.chesscom = { checked: true, ...chesscomResult };
    
    setStatus(newStatus);
    setLastChecked(new Date());
    setChecking(false);
    
    // Return summary
    const allOk = Object.values(newStatus).every(s => s.ok);
    const failedServices = Object.entries(newStatus)
      .filter(([_, s]) => !s.ok)
      .map(([name]) => name);
    
    return {
      allOk,
      failedServices,
      status: newStatus
    };
  }, []);

  // Check a single service
  const checkService = useCallback(async (service) => {
    const checkers = {
      supabase: checkSupabase,
      wikipedia: checkWikipedia,
      lichess: checkLichess,
      chesscom: checkChessCom
    };
    
    if (!checkers[service]) return null;
    
    const result = await checkers[service]();
    setStatus(prev => ({
      ...prev,
      [service]: { checked: true, ...result }
    }));
    
    return result;
  }, []);

  // Get overall health status
  const isHealthy = Object.values(status).every(s => !s.checked || s.ok);
  const checkedCount = Object.values(status).filter(s => s.checked).length;
  const healthyCount = Object.values(status).filter(s => s.checked && s.ok).length;

  return {
    status,
    checking,
    lastChecked,
    isHealthy,
    checkedCount,
    healthyCount,
    checkAll,
    checkService
  };
}

export default useSystemHealth;

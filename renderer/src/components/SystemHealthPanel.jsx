/**
 * SystemHealthPanel Component
 * Displays health status of all backend services
 */

import React from 'react';
import { useSystemHealth } from '../hooks/useSystemHealth.js';

const SERVICE_LABELS = {
  supabase: { name: 'Database', icon: '🗄️' },
  wikipedia: { name: 'Wikipedia Images', icon: '📷' },
  lichess: { name: 'Lichess API', icon: '♟️' },
  chesscom: { name: 'Chess.com API', icon: '♞' }
};

export function SystemHealthPanel({ theme }) {
  const { status, checking, lastChecked, checkAll, isHealthy, checkedCount, healthyCount } = useSystemHealth();

  return (
    <div style={{
      padding: 20,
      backgroundColor: theme.card,
      borderRadius: 12,
      border: `1px solid ${theme.border}`
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.ink }}>
            System Health
          </h3>
          {lastChecked && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: theme.inkMuted }}>
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <button
          onClick={checkAll}
          disabled={checking}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: theme.accent,
            color: '#fff',
            fontSize: 13,
            fontWeight: 500,
            cursor: checking ? 'wait' : 'pointer',
            opacity: checking ? 0.7 : 1
          }}
        >
          {checking ? 'Checking...' : 'Run Health Check'}
        </button>
      </div>

      {/* Overall Status */}
      {checkedCount > 0 && (
        <div style={{
          padding: 12,
          marginBottom: 16,
          borderRadius: 8,
          background: isHealthy ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
          border: `1px solid ${isHealthy ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 20 }}>
              {isHealthy ? '✅' : '⚠️'}
            </span>
            <span style={{
              fontWeight: 600,
              color: isHealthy ? '#4caf50' : '#f44336'
            }}>
              {isHealthy ? 'All Systems Operational' : `${checkedCount - healthyCount} Service(s) Down`}
            </span>
          </div>
        </div>
      )}

      {/* Service List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(SERVICE_LABELS).map(([key, { name, icon }]) => {
          const service = status[key];
          
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 8,
                background: theme.bgAlt,
                border: `1px solid ${theme.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontWeight: 500, color: theme.ink }}>{name}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!service.checked ? (
                  <span style={{ fontSize: 12, color: theme.inkMuted }}>Not checked</span>
                ) : service.ok ? (
                  <>
                    <span style={{ fontSize: 12, color: '#4caf50' }}>{service.message}</span>
                    <span style={{ color: '#4caf50' }}>●</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 12, color: '#f44336' }}>{service.message}</span>
                    <span style={{ color: '#f44336' }}>●</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <p style={{
        marginTop: 16,
        fontSize: 12,
        color: theme.inkMuted,
        lineHeight: 1.5
      }}>
        Health checks verify that all external services (database, image APIs, chess platforms) 
        are reachable and responding correctly. Images are tested by actually loading them, 
        not just checking if the API returns a URL.
      </p>
    </div>
  );
}

export default SystemHealthPanel;

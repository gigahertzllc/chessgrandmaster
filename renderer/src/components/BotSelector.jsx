import React from "react";
import { personalities, legendIds, gmBotIds } from "../engine/personalities.js";

/**
 * Bot Selection Component
 * 
 * Displays available chess opponents in a grid layout with
 * detailed information about each one.
 */

function BotCard({ profile, selected, onSelect }) {
  const isLegend = legendIds.includes(profile.id);
  
  return (
    <div
      onClick={() => onSelect(profile.id)}
      style={{
        padding: 16,
        borderRadius: 12,
        border: selected ? "2px solid #4CAF50" : "2px solid transparent",
        background: selected ? "rgba(76,175,80,0.15)" : "rgba(255,255,255,0.05)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 36 }}>{profile.avatar}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.label}</div>
          {profile.subtitle && (
            <div style={{ fontSize: 12, opacity: 0.6 }}>{profile.subtitle}</div>
          )}
        </div>
      </div>
      
      <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.5 }}>
        {profile.description}
      </div>
      
      <div style={{ 
        display: "flex", 
        gap: 8, 
        marginTop: 4,
        flexWrap: "wrap"
      }}>
        <span style={{
          fontSize: 11,
          padding: "3px 10px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 12
        }}>
          Skill {profile.skillLevel}/20
        </span>
        <span style={{
          fontSize: 11,
          padding: "3px 10px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 12
        }}>
          {profile.style}
        </span>
        {profile.rating && (
          <span style={{
            fontSize: 11,
            padding: "3px 10px",
            background: isLegend ? "rgba(255,193,7,0.2)" : "rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: isLegend ? "#ffc107" : "inherit"
          }}>
            {profile.rating}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BotSelector({ selectedBotId, onSelect, onPlay }) {
  const legends = legendIds.map(id => personalities[id]);
  const gmBots = gmBotIds.map(id => personalities[id]);
  const selectedProfile = personalities[selectedBotId];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          🏆 Choose Your Opponent
        </div>
        <div style={{ opacity: 0.6, fontSize: 14 }}>
          Challenge chess legends and grandmaster-level AI opponents
        </div>
      </div>

      {/* Legends Section */}
      <div>
        <div style={{ 
          fontSize: 16, 
          fontWeight: 600, 
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: 0.8
        }}>
          <span>👑</span>
          <span>CHESS LEGENDS</span>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 14 
        }}>
          {legends.map(profile => (
            <BotCard
              key={profile.id}
              profile={profile}
              selected={selectedBotId === profile.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {/* GM Bots Section */}
      <div>
        <div style={{ 
          fontSize: 16, 
          fontWeight: 600, 
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: 0.8
        }}>
          <span>🤖</span>
          <span>GM-LEVEL OPPONENTS</span>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 14 
        }}>
          {gmBots.map(profile => (
            <BotCard
              key={profile.id}
              profile={profile}
              selected={selectedBotId === profile.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {/* Play Button */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center",
        marginTop: 12
      }}>
        <button
          onClick={onPlay}
          disabled={!selectedProfile}
          style={{
            padding: "16px 56px",
            background: selectedProfile ? "#4CAF50" : "#555",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            cursor: selectedProfile ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "all 0.2s"
          }}
        >
          {selectedProfile && <span style={{ fontSize: 24 }}>{selectedProfile.avatar}</span>}
          <span>Play vs {selectedProfile?.label ?? "..."}</span>
        </button>
      </div>

      {/* Legend bio panel */}
      {selectedProfile && legendIds.includes(selectedProfile.id) && (
        <div style={{
          background: "rgba(0,0,0,0.2)",
          borderRadius: 12,
          padding: 20,
          marginTop: 12
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 14,
            marginBottom: 14
          }}>
            <span style={{ fontSize: 48 }}>{selectedProfile.avatar}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>
                {selectedProfile.label}
              </div>
              <div style={{ fontSize: 14, opacity: 0.6 }}>
                {selectedProfile.era}
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
            {selectedProfile.description}
          </div>
          
          {selectedProfile.quote && (
            <div style={{ 
              fontStyle: "italic", 
              opacity: 0.7, 
              borderLeft: "3px solid #4CAF50",
              paddingLeft: 14,
              marginBottom: 14,
              fontSize: 14
            }}>
              "{selectedProfile.quote}"
            </div>
          )}
          
          {selectedProfile.famousGames && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, opacity: 0.8 }}>
                FAMOUS GAMES
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, opacity: 0.75 }}>
                {selectedProfile.famousGames.map((g, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

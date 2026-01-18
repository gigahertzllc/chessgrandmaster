import React, { useState } from "react";
import { 
  personalities, 
  legendIds, 
  modernEliteIds, 
  botIds,
  getLegends,
  getModernElite,
  getBots
} from "../engine/personalities.js";

/**
 * Bot Selection Component
 * 
 * Displays chess opponents organized by category:
 * - World Champions & Legends
 * - Modern Elite Players
 * - Difficulty Bots (for practice)
 */

function BotCard({ profile, selected, onSelect, compact = false }) {
  const isLegend = legendIds.includes(profile.id);
  const isModern = modernEliteIds.includes(profile.id);
  const isBot = botIds.includes(profile.id);
  
  // Difficulty color coding
  const getDifficultyColor = (skill) => {
    if (skill <= 5) return "#4CAF50"; // Green - easy
    if (skill <= 10) return "#FFC107"; // Yellow - medium
    if (skill <= 15) return "#FF9800"; // Orange - hard
    return "#f44336"; // Red - extreme
  };

  return (
    <div
      onClick={() => onSelect(profile.id)}
      style={{
        padding: compact ? 12 : 16,
        borderRadius: 12,
        border: selected ? "2px solid #4CAF50" : "2px solid transparent",
        background: selected ? "rgba(76,175,80,0.15)" : "rgba(255,255,255,0.05)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 6 : 10
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: compact ? 28 : 36 }}>{profile.avatar}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: compact ? 14 : 16 }}>{profile.label}</div>
          {profile.subtitle && (
            <div style={{ fontSize: 11, opacity: 0.6 }}>{profile.subtitle}</div>
          )}
        </div>
        {/* Skill indicator */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `${getDifficultyColor(profile.skillLevel)}22`,
          border: `2px solid ${getDifficultyColor(profile.skillLevel)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 12,
          color: getDifficultyColor(profile.skillLevel)
        }}>
          {profile.skillLevel}
        </div>
      </div>
      
      {!compact && (
        <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>
          {profile.description?.slice(0, 120)}{profile.description?.length > 120 ? "..." : ""}
        </div>
      )}
      
      <div style={{ 
        display: "flex", 
        gap: 6, 
        flexWrap: "wrap"
      }}>
        {profile.peakRating && (
          <span style={{
            fontSize: 10,
            padding: "2px 8px",
            background: (isLegend || isModern) ? "rgba(255,193,7,0.2)" : "rgba(255,255,255,0.1)",
            borderRadius: 10,
            color: (isLegend || isModern) ? "#ffc107" : "inherit"
          }}>
            {profile.peakRating}
          </span>
        )}
        <span style={{
          fontSize: 10,
          padding: "2px 8px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 10
        }}>
          {profile.style}
        </span>
      </div>
    </div>
  );
}

function CategoryHeader({ icon, title, count }) {
  return (
    <div style={{ 
      fontSize: 15, 
      fontWeight: 600, 
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
      opacity: 0.85
    }}>
      <span>{icon}</span>
      <span>{title}</span>
      <span style={{ 
        fontSize: 11, 
        opacity: 0.5, 
        marginLeft: 4,
        fontWeight: 400
      }}>
        ({count})
      </span>
    </div>
  );
}

export default function BotSelector({ selectedBotId, onSelect, onPlay }) {
  const [activeTab, setActiveTab] = useState("legends");
  
  const legends = getLegends();
  const modern = getModernElite();
  const bots = getBots();
  const selectedProfile = personalities[selectedBotId];

  const tabs = [
    { id: "legends", label: "World Champions", icon: "👑", count: legends.length },
    { id: "modern", label: "Modern Elite", icon: "⚡", count: modern.length },
    { id: "bots", label: "Practice Bots", icon: "🤖", count: bots.length }
  ];

  const getActiveOpponents = () => {
    switch (activeTab) {
      case "legends": return legends;
      case "modern": return modern;
      case "bots": return bots;
      default: return legends;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          Choose Your Opponent
        </div>
        <div style={{ opacity: 0.6, fontSize: 13 }}>
          Challenge chess legends or practice against bots of any skill level
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 12 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 18px",
              background: activeTab === tab.id ? "rgba(76,175,80,0.2)" : "transparent",
              border: activeTab === tab.id ? "1px solid #4CAF50" : "1px solid transparent",
              borderRadius: 8,
              color: activeTab === tab.id ? "#4CAF50" : "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span style={{ 
              fontSize: 11, 
              opacity: 0.6,
              background: "rgba(255,255,255,0.1)",
              padding: "2px 6px",
              borderRadius: 6
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Opponent Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: activeTab === "bots" ? "repeat(3, 1fr)" : "repeat(2, 1fr)", 
        gap: 12,
        maxHeight: 420,
        overflowY: "auto",
        paddingRight: 8
      }}>
        {getActiveOpponents().map(profile => (
          <BotCard
            key={profile.id}
            profile={profile}
            selected={selectedBotId === profile.id}
            onSelect={onSelect}
            compact={activeTab === "bots"}
          />
        ))}
      </div>

      {/* Play Button */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center",
        marginTop: 8
      }}>
        <button
          onClick={onPlay}
          disabled={!selectedProfile}
          style={{
            padding: "14px 48px",
            background: selectedProfile ? "#4CAF50" : "#555",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: selectedProfile ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.2s"
          }}
        >
          {selectedProfile && <span style={{ fontSize: 22 }}>{selectedProfile.avatar}</span>}
          <span>Play vs {selectedProfile?.label ?? "..."}</span>
        </button>
      </div>

      {/* Selected Profile Detail Panel */}
      {selectedProfile && (
        <div style={{
          background: "rgba(0,0,0,0.2)",
          borderRadius: 12,
          padding: 18
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 14,
            marginBottom: 12
          }}>
            <span style={{ fontSize: 44 }}>{selectedProfile.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {selectedProfile.label}
              </div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>
                {selectedProfile.subtitle} • {selectedProfile.era}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selectedProfile.peakRating && (
                  <span style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    background: "rgba(255,193,7,0.2)",
                    borderRadius: 10,
                    color: "#ffc107"
                  }}>
                    Peak: {selectedProfile.peakRating}
                  </span>
                )}
                <span style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 10
                }}>
                  Skill Level: {selectedProfile.skillLevel}/20
                </span>
                <span style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 10
                }}>
                  Style: {selectedProfile.style}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12, opacity: 0.9 }}>
            {selectedProfile.description}
          </div>

          {/* Traits */}
          {selectedProfile.traits && selectedProfile.traits.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, opacity: 0.7 }}>
                STRENGTHS
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selectedProfile.traits.map((trait, i) => (
                  <span key={i} style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    background: "rgba(76,175,80,0.15)",
                    borderRadius: 8,
                    color: "#81c784"
                  }}>
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {selectedProfile.weaknesses && selectedProfile.weaknesses.length > 0 && !botIds.includes(selectedProfile.id) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, opacity: 0.7 }}>
                WEAKNESSES
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selectedProfile.weaknesses.map((weak, i) => (
                  <span key={i} style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    background: "rgba(244,67,54,0.15)",
                    borderRadius: 8,
                    color: "#e57373"
                  }}>
                    {weak}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {selectedProfile.quote && (
            <div style={{ 
              fontStyle: "italic", 
              opacity: 0.75, 
              borderLeft: "3px solid #4CAF50",
              paddingLeft: 12,
              marginBottom: 12,
              fontSize: 13
            }}>
              "{selectedProfile.quote}"
            </div>
          )}
          
          {selectedProfile.famousGames && selectedProfile.famousGames.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, opacity: 0.7 }}>
                FAMOUS GAMES
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, opacity: 0.7 }}>
                {selectedProfile.famousGames.map((g, i) => (
                  <li key={i} style={{ marginBottom: 3 }}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

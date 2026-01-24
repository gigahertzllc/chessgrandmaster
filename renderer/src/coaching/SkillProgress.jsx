import React, { useState } from "react";
import { skillCategories, getAllSkills, skillLevelToRating } from "./data/skillDefinitions.js";
import { coachingModules, calculateModuleProgress } from "./data/curriculum.js";

/**
 * Skill Progress Component
 * 
 * Visualizes the player's progress across all skill categories
 * with detailed breakdowns and training recommendations.
 */

export default function SkillProgress({ skills, completedSessions, estimatedRating, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = Object.values(skillCategories);

  // Calculate overall progress
  const allModules = Object.values(coachingModules);
  const totalSessions = allModules.reduce((sum, m) => sum + m.sessions.length, 0);
  const completedCount = completedSessions?.length || 0;
  const overallProgress = Math.round((completedCount / totalSessions) * 100);

  // Calculate category averages
  const getCategoryAverage = (category) => {
    const categorySkills = Object.keys(category.skills);
    const levels = categorySkills.map(s => skills[s]?.level || 1);
    return levels.reduce((a, b) => a + b, 0) / levels.length;
  };

  // Get weakest skills for recommendations
  const getWeakestSkills = () => {
    const allSkillsList = getAllSkills();
    return allSkillsList
      .map(s => ({
        ...s,
        level: skills[s.id]?.level || 1
      }))
      .sort((a, b) => a.level - b.level)
      .slice(0, 5);
  };

  // Get strongest skills
  const getStrongestSkills = () => {
    const allSkillsList = getAllSkills();
    return allSkillsList
      .map(s => ({
        ...s,
        level: skills[s.id]?.level || 1
      }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 5);
  };

  const weakest = getWeakestSkills();
  const strongest = getStrongestSkills();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            padding: "8px 16px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0 }}>📊 Progress Dashboard</h2>
      </div>

      {/* Overview cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: 16,
        marginBottom: 24
      }}>
        <OverviewCard
          title="Estimated Rating"
          value={estimatedRating || "?"}
          subtitle="Based on assessment"
          icon="📈"
          color="#4CAF50"
        />
        <OverviewCard
          title="Sessions Completed"
          value={completedCount}
          subtitle={`of ${totalSessions} total`}
          icon="📚"
          color="#2196F3"
        />
        <OverviewCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          subtitle="Curriculum completion"
          icon="🎯"
          color="#FF9800"
        />
        <OverviewCard
          title="Skills Leveled"
          value={Object.keys(skills).length}
          subtitle={`of ${getAllSkills().length} total`}
          icon="⭐"
          color="#9C27B0"
        />
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Category overview */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 16,
            padding: 20
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Skill Categories</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {categories.map(category => {
                const avg = getCategoryAverage(category);
                const isSelected = selectedCategory?.id === category.id;
                
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(isSelected ? null : category)}
                    style={{
                      padding: 16,
                      background: isSelected 
                        ? `${category.color}20` 
                        : "rgba(255,255,255,0.03)",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: isSelected 
                        ? `1px solid ${category.color}` 
                        : "1px solid transparent",
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      marginBottom: 8
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{category.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{category.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.6 }}>
                            {Object.keys(category.skills).length} skills
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: 24, 
                        fontWeight: 700,
                        color: category.color
                      }}>
                        {avg.toFixed(1)}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div style={{
                      height: 8,
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 4,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${(avg / 5) * 100}%`,
                        background: category.color,
                        borderRadius: 4,
                        transition: "width 0.3s"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1 }}>
          {selectedCategory ? (
            <CategoryDetail 
              category={selectedCategory} 
              skills={skills} 
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Weakest skills */}
              <div style={{
                background: "rgba(0,0,0,0.2)",
                borderRadius: 16,
                padding: 20
              }}>
                <h3 style={{ marginTop: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>🎯</span>
                  <span>Focus Areas</span>
                </h3>
                <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
                  These skills need the most work. Focus your training here!
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {weakest.map(skill => (
                    <SkillBar 
                      key={skill.id} 
                      skill={skill} 
                      color={skill.categoryColor}
                    />
                  ))}
                </div>
              </div>

              {/* Strongest skills */}
              <div style={{
                background: "rgba(0,0,0,0.2)",
                borderRadius: 16,
                padding: 20
              }}>
                <h3 style={{ marginTop: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>💪</span>
                  <span>Strengths</span>
                </h3>
                <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
                  Your best-developed skills. Keep building on these!
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {strongest.map(skill => (
                    <SkillBar 
                      key={skill.id} 
                      skill={skill} 
                      color={skill.categoryColor}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating projection */}
      <div style={{
        marginTop: 24,
        background: "linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(33,150,243,0.1) 100%)",
        borderRadius: 16,
        padding: 24
      }}>
        <h3 style={{ marginTop: 0 }}>Rating Projection</h3>
        <p style={{ opacity: 0.8, marginBottom: 20 }}>
          Based on your skill levels, here's how you compare to typical players:
        </p>
        
        <RatingProjection skills={skills} estimatedRating={estimatedRating} />
      </div>
    </div>
  );
}

// Helper components
function OverviewCard({ title, value, subtitle, icon, color }) {
  return (
    <div style={{
      background: "rgba(0,0,0,0.2)",
      borderRadius: 12,
      padding: 20,
      textAlign: "center"
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>{title}</div>
      <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>{subtitle}</div>
    </div>
  );
}

function CategoryDetail({ category, skills }) {
  const categorySkills = Object.values(category.skills);
  
  return (
    <div style={{
      background: `${category.color}10`,
      borderRadius: 16,
      padding: 20,
      border: `1px solid ${category.color}30`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 32 }}>{category.icon}</span>
        <div>
          <h3 style={{ margin: 0 }}>{category.name}</h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.7 }}>
            {category.description}
          </p>
        </div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {categorySkills.map(skill => {
          const level = skills[skill.id]?.level || 1;
          const xp = skills[skill.id]?.xp || 0;
          const levelInfo = skill.levels[level - 1];
          
          return (
            <div
              key={skill.id}
              style={{
                padding: 16,
                background: "rgba(0,0,0,0.2)",
                borderRadius: 12
              }}
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8
              }}>
                <div style={{ fontWeight: 600 }}>{skill.name}</div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8 
                }}>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>Level</span>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: 18,
                    color: category.color
                  }}>
                    {level}
                  </span>
                </div>
              </div>
              
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
                {levelInfo?.name}: {levelInfo?.description}
              </div>
              
              {/* XP progress bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  flex: 1,
                  height: 6,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${xp}%`,
                    background: category.color,
                    borderRadius: 3
                  }} />
                </div>
                <span style={{ fontSize: 11, opacity: 0.5 }}>{xp}/100 XP</span>
              </div>
              
              {level < 5 && (
                <div style={{ fontSize: 11, opacity: 0.5, marginTop: 8 }}>
                  Next: {skill.levels[level]?.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillBar({ skill, color }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 12px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: 8
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, marginBottom: 4 }}>{skill.name}</div>
        <div style={{
          height: 6,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 3,
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            width: `${(skill.level / 5) * 100}%`,
            background: color,
            borderRadius: 3
          }} />
        </div>
      </div>
      <div style={{ 
        fontSize: 16, 
        fontWeight: 700,
        color,
        minWidth: 24,
        textAlign: "right"
      }}>
        {skill.level}
      </div>
    </div>
  );
}

function RatingProjection({ skills, estimatedRating }) {
  // Calculate average skill level
  const allSkills = getAllSkills();
  const levels = allSkills.map(s => skills[s.id]?.level || 1);
  const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
  
  // Project rating based on average level
  const projectedRating = skillLevelToRating(Math.round(avgLevel));
  
  const ratings = [
    { label: "Beginner", min: 0, max: 800, color: "#4CAF50" },
    { label: "Casual", min: 800, max: 1200, color: "#8BC34A" },
    { label: "Club Player", min: 1200, max: 1600, color: "#FFC107" },
    { label: "Advanced", min: 1600, max: 2000, color: "#FF9800" },
    { label: "Expert", min: 2000, max: 2400, color: "#f44336" }
  ];
  
  const currentRating = estimatedRating || projectedRating;
  const position = Math.min(100, (currentRating / 2400) * 100);
  
  return (
    <div>
      {/* Rating scale */}
      <div style={{
        display: "flex",
        height: 40,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8
      }}>
        {ratings.map(r => (
          <div
            key={r.label}
            style={{
              flex: r.max - r.min,
              background: r.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: r.color === "#FFC107" ? "#000" : "#fff"
            }}
          >
            {r.label}
          </div>
        ))}
      </div>
      
      {/* Position marker */}
      <div style={{ position: "relative", height: 24 }}>
        <div style={{
          position: "absolute",
          left: `${position}%`,
          transform: "translateX(-50%)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 16 }}>▲</div>
          <div style={{ 
            fontSize: 14, 
            fontWeight: 700,
            background: "rgba(0,0,0,0.3)",
            padding: "4px 12px",
            borderRadius: 12
          }}>
            ~{currentRating}
          </div>
        </div>
      </div>
      
      {/* Rating labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, opacity: 0.5 }}>
        <span>0</span>
        <span>800</span>
        <span>1200</span>
        <span>1600</span>
        <span>2000</span>
        <span>2400</span>
      </div>
    </div>
  );
}

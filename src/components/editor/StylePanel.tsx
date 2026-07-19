import React from "react";
import { type CVSettings } from "@/types/cv";

interface StylePanelProps {
  settings: CVSettings;
  onChange: (settings: CVSettings) => void;
}

const FONTS = [
  { name: "Outfit / Inter (Modern)", value: "Outfit" },
  { name: "Inter Only (Clean Sans)", value: "Inter" },
  { name: "Playfair Display (Elegant Serif)", value: "Playfair Display" },
  { name: "System Sans", value: "system-ui" },
];

const PRESET_COLORS = [
  { name: "Carbon Ink", value: "#111111" },
  { name: "Royal Blue", value: "#2563eb" },
  { name: "Emerald Green", value: "#059669" },
  { name: "Deep Crimson", value: "#dc2626" },
  { name: "Slate Charcoal", value: "#475569" },
  { name: "Plum Purple", value: "#7c3aed" },
];

export default function StylePanel({ settings, onChange }: StylePanelProps) {
  const updateSetting = <K extends keyof CVSettings>(key: K, value: CVSettings[K]) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.panelTitle}>Design Customization</h3>

      {/* Font Family Selection */}
      <div style={styles.section}>
        <label style={styles.label}>Typography Style</label>
        <select
          value={settings.fontFamily}
          onChange={(e) => updateSetting("fontFamily", e.target.value)}
          style={styles.select}
        >
          {FONTS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* Theme/Primary Color */}
      <div style={styles.section}>
        <label style={styles.label}>Primary Brand Color</label>
        <div style={styles.colorGrid}>
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => updateSetting("themeColor", color.value)}
              style={{
                ...styles.colorCircle,
                backgroundColor: color.value,
                border: settings.themeColor === color.value 
                  ? "2px solid var(--accent)" 
                  : "1px solid var(--border-subtle)",
              }}
              title={color.name}
            />
          ))}
          <div style={styles.customColorInputWrapper}>
            <input
              type="color"
              value={settings.themeColor}
              onChange={(e) => updateSetting("themeColor", e.target.value)}
              style={styles.colorPicker}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--muted-text)" }}>Custom</span>
          </div>
        </div>
      </div>

      {/* Profile Photo Shape */}
      <div style={styles.section}>
        <label style={styles.label}>Profile Image Shape</label>
        <div style={styles.toggleGroup}>
          {(["circle", "square", "rounded"] as const).map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => updateSetting("photoShape", shape)}
              style={{
                ...styles.toggleBtn,
                backgroundColor: settings.photoShape === shape ? "var(--primary)" : "#ffffff",
                color: settings.photoShape === shape ? "#ffffff" : "var(--primary)",
                border: settings.photoShape === shape 
                  ? "1px solid var(--primary)" 
                  : "1px solid var(--border-subtle)",
              }}
            >
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Section Divider Style */}
      <div style={styles.section}>
        <label style={styles.label}>Section Dividers</label>
        <div style={styles.toggleGroup}>
          {(["line", "dots", "none"] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => updateSetting("dividerStyle", style)}
              style={{
                ...styles.toggleBtn,
                backgroundColor: settings.dividerStyle === style ? "var(--primary)" : "#ffffff",
                color: settings.dividerStyle === style ? "#ffffff" : "var(--primary)",
                border: settings.dividerStyle === style 
                  ? "1px solid var(--primary)" 
                  : "1px solid var(--border-subtle)",
              }}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    padding: "24px",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid var(--border-subtle)",
    width: "280px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    overflowY: "auto",
    height: "100%",
  },
  panelTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "4px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--primary)",
  },
  select: {
    padding: "8px 12px",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.85rem",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  colorGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  colorCircle: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "transform var(--transition-fast)",
  },
  customColorInputWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  colorPicker: {
    border: "none",
    width: "24px",
    height: "24px",
    padding: 0,
    background: "none",
    cursor: "pointer",
  },
  toggleGroup: {
    display: "flex",
    gap: "6px",
  },
  toggleBtn: {
    flex: 1,
    padding: "6px 0",
    fontSize: "0.75rem",
    fontWeight: 600,
    borderRadius: "var(--radius-sm)",
    textAlign: "center",
    transition: "all var(--transition-fast)",
  },
};

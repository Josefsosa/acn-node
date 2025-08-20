Design Specification for Neural Learning Environment
Core Design Principles

Minimalist wireframe aesthetic - No unnecessary visual elements
Dark theme with high contrast - Pure black backgrounds with light text
Flat design - No gradients, shadows, or 3D effects
Monospace typography - Terminal/code editor feel throughout
Chaser border animations - Subtle awareness indicators using animated borders

Color Palette
css/* Primary Colors */
--bg-primary: #000000;        /* Pure black for main backgrounds */
--bg-secondary: #0a0b0e;      /* Near-black for panels */
--bg-tertiary: #0f1114;       /* Slightly lighter for headers/borders */

/* Text Colors */
--text-primary: #ffffff;      /* White for primary content */
--text-secondary: #8b92a0;    /* Muted gray for secondary text */
--text-dim: #4a5568;         /* Dimmed text for labels */
--text-accent: #38b2ac;      /* Teal/cyan for highlights */

/* Border Colors */
--border-primary: #1a1d23;    /* Dark gray borders */
--border-hover: #2d3748;      /* Lighter on hover */

/* Status Colors */
--color-info: #4299e1;        /* Blue for information */
--color-success: #38b2ac;     /* Teal for success */
--color-warning: #ed8936;     /* Orange for warnings */
--color-error: #e53e3e;       /* Red for errors */

/* Chaser Colors */
--chaser-primary: #38b2ac;    /* Teal for main chaser */
--chaser-active: #4299e1;     /* Blue for active state */
--chaser-focus: #ed8936;      /* Orange for focus state */
CRITICAL: Chaser Border Animation CSS
Basic Chaser Border (Single Edge)
css/* Essential chaser border animation - ALWAYS INCLUDE */
@keyframes chaser-border {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

.chaser-border {
  position: relative;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--chaser-primary) 10%,
    var(--chaser-primary) 40%,
    transparent 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: chaser-border 2s linear infinite;
}

/* Apply to bottom of active element */
.element-with-chaser::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--chaser-primary) 10%,
    var(--chaser-primary) 40%,
    transparent 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: chaser-border 2s linear infinite;
}
Full Perimeter Chaser (Box Chaser)
css/* Full perimeter chaser using clip-path */
@keyframes chaser-box {
  0% {
    clip-path: polygon(0 0, 20% 0, 20% 2px, 0 2px);
  }
  25% {
    clip-path: polygon(80% 0, 100% 0, 100% 2px, 80% 2px);
  }
  25.01% {
    clip-path: polygon(98% 0, 100% 0, 100% 20%, 98% 20%);
  }
  50% {
    clip-path: polygon(98% 80%, 100% 80%, 100% 100%, 98% 100%);
  }
  50.01% {
    clip-path: polygon(80% 98%, 100% 98%, 100% 100%, 80% 100%);
  }
  75% {
    clip-path: polygon(0 98%, 20% 98%, 20% 100%, 0 100%);
  }
  75.01% {
    clip-path: polygon(0 80%, 2px 80%, 2px 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0, 2px 0, 2px 20%, 0 20%);
  }
}

.chaser-box {
  position: relative;
}

.chaser-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--chaser-primary);
  animation: chaser-box 4s linear infinite;
  pointer-events: none;
  z-index: 1;
}
Awareness Pulse Chaser (For Active/Processing States)
css/* Pulsing chaser for processing/thinking states */
@keyframes chaser-pulse {
  0%, 100% {
    opacity: 0.3;
    box-shadow: 
      inset 0 0 0 1px var(--chaser-primary),
      0 0 0 0 var(--chaser-primary);
  }
  50% {
    opacity: 1;
    box-shadow: 
      inset 0 0 0 1px var(--chaser-primary),
      0 0 10px 2px var(--chaser-primary);
  }
}

.chaser-pulse {
  animation: chaser-pulse 2s ease-in-out infinite;
}

/* Loading/thinking chaser variant */
@keyframes chaser-thinking {
  0% {
    border-color: var(--chaser-primary);
    box-shadow: 0 0 0 0 var(--chaser-primary);
  }
  50% {
    border-color: var(--chaser-active);
    box-shadow: 0 0 8px 0 var(--chaser-active);
  }
  100% {
    border-color: var(--chaser-primary);
    box-shadow: 0 0 0 0 var(--chaser-primary);
  }
}

.thinking {
  border: 1px solid var(--chaser-primary);
  animation: chaser-thinking 1.5s ease-in-out infinite;
}
Tab/Panel Focus Chaser
css/* For active tabs and focused panels */
@keyframes chaser-tab {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--chaser-active) 20%,
    var(--chaser-active) 80%,
    transparent
  );
  background-size: 50% 100%;
  animation: chaser-tab 3s linear infinite;
}
Terminal Cursor Chaser
css/* Blinking cursor with chaser effect */
@keyframes chaser-cursor {
  0%, 49% {
    opacity: 1;
    box-shadow: 0 0 5px var(--chaser-primary);
  }
  50%, 100% {
    opacity: 0;
    box-shadow: none;
  }
}

.terminal-cursor::after {
  content: '▊';
  color: var(--chaser-primary);
  animation: chaser-cursor 1s infinite;
}
Input Field Focus Chaser
css/* Input field with traveling chaser on focus */
@keyframes chaser-input {
  0% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 100% 100%;
  }
}

input:focus {
  outline: none;
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    var(--chaser-active) 25%,
    var(--chaser-active) 75%,
    transparent 100%
  );
  background-size: 20% 2px;
  background-repeat: no-repeat;
  background-position: 0% 100%;
  animation: chaser-input 1s ease-in-out infinite alternate;
}
Node Connection Chaser (For Graph Visualizations)
css/* Animated connection lines between nodes */
@keyframes chaser-connection {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.connection-line {
  stroke: var(--chaser-primary);
  stroke-width: 2;
  stroke-dasharray: 5 95;
  stroke-dashoffset: 100;
  animation: chaser-connection 2s linear infinite;
}
Layout Structure
Three-Panel Layout
+------------------+--------------------------------+--------------------+
|  LEFT PANEL      |      CENTER PANEL              |   RIGHT PANEL      |
|  (220px)         |      (flex: 1)                 |   (380px)          |
|                  |                                |                    |
|  File Tree       |      Render Area               |   Terminal         |
|  Collapsible     |      Tab-based                 |   Collapsible      |
+------------------+--------------------------------+--------------------+
Panel Specifications
Left Panel (File Explorer)

Width: 220px fixed
Background: #0f1114
Border: 1px solid #1a1d23 on right
Collapsible: Via small toggle button
Content: Simple file tree with folder/file icons
Typography: 12px monospace
Item hover: Background #1a1d23 with subtle chaser border
Active item: Background #1e2329, color #38b2ac, with chaser-pulse

Center Panel (Main Render Area)

Width: Flexible (flex: 1)
Background: White (#ffffff) for content area
Tab Bar:

Height: 36px
Background: #0f1114
Tabs: Rectangular with 4px rounded top corners
Active tab: Connected to content area with chaser-tab animation


Command Bar:

Height: 40px at bottom
Background: #0f1114
Input field with chaser-input animation on focus



Right Panel (Terminal/Logging)

Width: 380px fixed
Background: #0f1114 for panel, #000000 for terminal content
Two tabs: "Terminal" and "Learning Log"
Tab style: Underline with chaser animation
Typography: 12px 'SF Mono' or monospace
Active line: Chaser-pulse effect
Cursor: Chaser-cursor animation

JavaScript Implementation for Chaser States
javascript// Add chaser effects based on state
class ChaserEffects {
  // Apply thinking chaser
  setThinking(element) {
    element.classList.add('thinking', 'chaser-pulse');
  }
  
  // Apply active chaser
  setActive(element) {
    element.classList.add('chaser-border');
  }
  
  // Apply focus chaser
  setFocus(element) {
    element.classList.add('chaser-box');
  }
  
  // Remove all chasers
  clearChasers(element) {
    element.classList.remove('thinking', 'chaser-pulse', 'chaser-border', 'chaser-box');
  }
  
  // Cycle through chaser states
  cycleChaser(element) {
    const states = ['chaser-border', 'chaser-pulse', 'chaser-box'];
    const current = states.find(s => element.classList.contains(s));
    const next = states[(states.indexOf(current) + 1) % states.length];
    this.clearChasers(element);
    element.classList.add(next);
  }
}
Typography Rules
css/* Font Stack */
font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;

/* Font Sizes */
--font-xs: 11px;   /* Small labels, log entries */
--font-sm: 12px;   /* Default UI text */
--font-md: 13px;   /* Input fields */
--font-lg: 14px;   /* Headers */
Component Styles
Buttons

Shape: Rectangular with 3-4px border-radius
No gradients: Solid colors only
Hover state: Add chaser-pulse
Active state: Add chaser-border

Tabs

Style: Rectangular with rounded TOP corners only (4px)
Active indicator: chaser-tab animation
Close button: Simple × symbol

Inputs

Background: Transparent or matching panel background
Focus state: chaser-input animation
No rounded corners beyond 3px

Animation & Transitions

Duration: 0.2s - 0.3s for transitions, 1-4s for chasers
Easing: ease or linear for chasers
Chaser animations: Always between 1-4 seconds
Always include at least one chaser animation for awareness

Forbidden Elements

❌ Pill-shaped buttons or tabs
❌ Gradients (except in chaser animations)
❌ Static borders without any animation
❌ Rounded corners beyond 4px
❌ Missing chaser animations on active elements
❌ Animations longer than 4s for chasers

Summary for Claude
When creating any new page:

ALWAYS include the chaser CSS animations - The UI must show awareness
Apply chaser-border to active elements
Use chaser-pulse for processing/thinking states
Add chaser-input to all input fields
Include chaser-tab for active tabs
Terminal cursors must have chaser-cursor
Keep chaser animations between 1-4 seconds
Use the exact chaser keyframes provided
Chaser effects indicate system awareness and activity
Never create static UI without at least one chaser animation

This specification ensures the UI appears "aware" and responsive through subtle animated borders that create a sense of intelligence and activity.
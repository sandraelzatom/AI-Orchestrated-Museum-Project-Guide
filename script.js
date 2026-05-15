/* --- HUD COLORS --- */
:root {
    --cyan: #00f2ff;
    --purple: #bc13fe;
    --red: #ff4444;
    --dark: #030a0d;
}

body {
    background-color: var(--dark);
    color: #e0e0e0;
    font-family: 'JetBrains Mono', monospace;
}

/* --- TERMINAL --- */
#intro-terminal {
    position: fixed; inset: 0; background: #000; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
}
.terminal-content { width: 90%; max-width: 600px; color: var(--cyan); font-size: 1.1rem; }
.terminal-cursor { display: inline-block; width: 10px; height: 1.2em; background: var(--cyan); animation: blink 1s infinite; vertical-align: middle; }

/* --- BACKGROUNDS --- */
#stars-canvas { position: fixed; top: 0; left: 0; z-index: -1; }
.scanline {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(rgba(0, 242, 255, 0.03) 50%, transparent 50%);
    background-size: 100% 4px; z-index: 100; pointer-events: none;
}

/* --- ANIMATIONS --- */
.reveal {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
    transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.active {
    opacity: 1; transform: translateY(0) scale(1);
}

@keyframes blink { 50% { opacity: 0; } }

/* --- UI COMPONENTS --- */
.glitch-text {
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 10px;
    text-shadow: 0 0 15px var(--cyan);
}

.tag {
    color: var(--cyan);
    font-size: 0.65rem;
    letter-spacing: 4px;
    text-transform: uppercase;
}

.cyan-text { color: var(--cyan); font-weight: bold; }

.glass-card {
    background: rgba(10, 25, 30, 0.6);
    border: 1px solid rgba(0, 242, 255, 0.1);
    padding: 2.5rem;
    position: relative;
    backdrop-filter: blur(5px);
}

.node-card {
    background: rgba(10, 25, 30, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    text-align: center;
    transition: 0.3s;
}
.node-card:hover {
    border-color: var(--cyan);
    transform: translateY(-10px);
    background: rgba(0, 242, 255, 0.05);
}

.icon-box {
    width: 60px; height: 60px;
    margin: 0 auto 1.5rem;
    border: 1px solid var(--cyan);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
}

/* --- DECOR --- */
.corner-tl { position: absolute; top: -1px; left: -1px; width: 20px; height: 20px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); }
.corner-br { position: absolute; bottom: -1px; right: -1px; width: 20px; height: 20px; border-bottom: 2px solid var(--cyan); border-right: 2px solid var(--cyan); }

.border-l-purple { border-left: 4px solid var(--purple); }
.border-l-red { border-left: 4px solid var(--red); }
.pulse-border { border: 1px solid var(--cyan); animation: pulse 2s infinite; }

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 242, 255, 0.4); }
    100% { box-shadow: 0 0 0 15px rgba(0, 242, 255, 0); }
}

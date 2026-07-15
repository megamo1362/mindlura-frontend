export const tokens = {
  color: {
    canvas:    "#0A0E17",
    // Full-bleed alternate band for section-rhythm pacing — deliberately
    // close to canvas (not a "surface" card color) so zones read as pacing,
    // not new UI chrome.
    canvasAlt: "#0D1420",
    surface:   "#12121C",
    line:      "#232332",
    text:      "#E9ECF3",
    muted:     "#7C8296",
    // #767C96 on canvas measures ~4.7:1 (WCAG AA for normal text is 4.5:1).
    // The previous #5A6178 measured ~3.1:1 and failed AA at the body/caption
    // sizes it's actually used at (text-xs/text-sm), not just large labels.
    mutedDim:  "#767C96",
    trader:    "#8B7CF6",
    coach:     "#38BDF8",
  },
  font: {
    display: "'Fraunces', serif",
    body:    "'Inter', sans-serif",
    fa:      "'Vazirmatn', sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },
} as const;

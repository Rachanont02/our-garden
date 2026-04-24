// Shared wireframe primitives — sketchy but readable
// All wireframes use these building blocks.

const COLORS = {
  ink: '#1a1a1a',
  paper: '#fbfaf7',
  muted: '#8b8680',
  line: '#2a2a28',
  lavender: '#d8cbe8',
  mint: '#c5e0d0',
  peach: '#f4d4c1',
  lavenderDeep: '#9d8ec2',
  mintDeep: '#7aa98d',
  peachDeep: '#d49677',
};

// Sketchy SVG filter — applied to borders/shapes for a hand-drawn quality
function SketchyDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <filter id="sketchy" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
        <filter id="sketchy-strong" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="2" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
        <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.35" />
        </pattern>
        <pattern id="dots" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="2" cy="2" r="0.8" fill="#1a1a1a" opacity="0.3" />
        </pattern>
      </defs>
    </svg>
  );
}

// Box with sketchy border
function SketchBox({ children, style = {}, fill, tilt = 0, dashed = false, ...rest }) {
  return (
    <div
      style={{
        position: 'relative',
        border: `1.5px solid ${COLORS.line}`,
        borderStyle: dashed ? 'dashed' : 'solid',
        background: fill || 'transparent',
        borderRadius: 2,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        filter: 'url(#sketchy)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ filter: 'none' }}>{children}</div>
    </div>
  );
}

// Photo placeholder — hatched box with optional label
function PhotoBox({ label, w, h, tilt = 0, fill, tape = false, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width: w, height: h,
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      ...style,
    }}>
      {tape && (
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
          width: 46, height: 16, background: 'rgba(244,212,193,0.6)',
          border: '0.5px solid rgba(0,0,0,0.08)', zIndex: 2,
        }} />
      )}
      <div style={{
        width: '100%', height: '100%',
        border: `1.25px solid ${COLORS.line}`,
        background: fill || '#fff',
        position: 'relative',
        overflow: 'hidden',
        filter: 'url(#sketchy)',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <rect width="100%" height="100%" fill="url(#diagonalHatch)" opacity="0.5" />
          <line x1="0" y1="0" x2="100%" y2="100%" stroke={COLORS.line} strokeWidth="0.8" opacity="0.35" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke={COLORS.line} strokeWidth="0.8" opacity="0.35" />
        </svg>
        {label && (
          <div style={{
            position: 'absolute', bottom: 6, left: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
            background: COLORS.paper, padding: '2px 5px',
            color: COLORS.muted, letterSpacing: '0.04em',
          }}>{label}</div>
        )}
      </div>
    </div>
  );
}

// A squiggly underline — hand-drawn quality
function Squiggle({ width = 80, color = COLORS.line, style = {} }) {
  return (
    <svg width={width} height="8" viewBox={`0 0 ${width} 8`} style={style}>
      <path d={`M2 4 Q${width/8} 1, ${width/4} 4 T${width/2} 4 T${width*3/4} 4 T${width-2} 4`}
            stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// A heart shape (hand-drawn)
function Heart({ size = 20, fill = 'none', stroke = COLORS.line, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 22" style={style}>
      <path
        d="M12 20 C 4 14, 1 9, 3 5 C 5 1, 10 2, 12 6 C 14 2, 19 1, 21 5 C 23 9, 20 14, 12 20 Z"
        fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'url(#sketchy)' }}
      />
    </svg>
  );
}

// Circle with hand-drawn quality
function SketchCircle({ size = 80, fill = 'none', stroke = COLORS.line, children, style = {} }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={size/2 - 2}
                fill={fill} stroke={stroke} strokeWidth="1.5"
                style={{ filter: 'url(#sketchy)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

// Button — sketchy pill
function SketchButton({ children, fill, style = {}, small = false, onClick }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none',
      padding: small ? '6px 14px' : '10px 20px',
      border: `1.5px solid ${COLORS.line}`,
      background: fill || COLORS.paper,
      borderRadius: 999,
      fontFamily: 'Caveat, cursive',
      fontSize: small ? 15 : 18,
      color: COLORS.ink,
      cursor: 'pointer',
      filter: 'url(#sketchy)',
      ...style,
    }}>{children}</button>
  );
}

// Arrow — hand-drawn
function Arrow({ length = 40, direction = 'right', style = {} }) {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[direction];
  return (
    <svg width={length} height="12" viewBox={`0 0 ${length} 12`}
         style={{ transform: `rotate(${rot}deg)`, ...style }}>
      <path d={`M2 6 Q${length/3} 3, ${length/2} 6 T${length-6} 6 M${length-12} 2 L${length-4} 6 L${length-12} 10`}
            stroke={COLORS.line} strokeWidth="1.3" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: 'url(#sketchy)' }} />
    </svg>
  );
}

// Annotation — dashed line + handwritten note
function Annotation({ text, style = {}, dir = 'right' }) {
  return (
    <div style={{
      fontFamily: 'Caveat, cursive',
      fontSize: 15,
      color: COLORS.muted,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      ...style,
    }}>
      {dir === 'left' && <span>←</span>}
      <span>{text}</span>
      {dir === 'right' && <span>→</span>}
    </div>
  );
}

// Text line placeholder (for lorem-ish use)
function TextLine({ width = '100%', height = 6, style = {} }) {
  return (
    <div style={{
      width, height,
      background: COLORS.line, opacity: 0.18,
      borderRadius: 2,
      ...style,
    }} />
  );
}

// Stacked lines paragraph placeholder
function TextLines({ lines = 3, lastShort = true, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <TextLine key={i} width={lastShort && i === lines - 1 ? '65%' : '100%'} />
      ))}
    </div>
  );
}

// Calculate days together from anniversary
function daysTogether(date = '2025-06-10') {
  const start = new Date(date);
  const now = new Date('2026-04-24');
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

Object.assign(window, {
  COLORS, SketchyDefs, SketchBox, PhotoBox, Squiggle, Heart,
  SketchCircle, SketchButton, Arrow, Annotation, TextLine, TextLines,
  daysTogether,
});

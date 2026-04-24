// Variation D — Story scroll
// Single long narrative, chapter-based. Feels like a book or zine.

function StoryChapter({ num, title, children, bg }) {
  return (
    <div style={{ padding: '100px 80px', background: bg || COLORS.paper, position: 'relative' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    letterSpacing: '0.2em', color: COLORS.muted }}>
        CHAPTER {num}
      </div>
      <div style={{ fontFamily: 'Caveat, cursive', fontSize: 64, lineHeight: 1.05,
                    marginTop: 12, marginBottom: 40, color: COLORS.ink }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StoryHome() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Floating nav dots — right side */}
      <div style={{ position: 'fixed', right: 30, top: '50%', transform: 'translateY(-50%)',
                    display: 'flex', flexDirection: 'column', gap: 18, zIndex: 5 }}>
        {['home', 'story', 'photos', 'letters', 'list', 'songs', 'map'].map((n, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10,
                                justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                           letterSpacing: '0.12em', color: COLORS.muted, textTransform: 'uppercase',
                           opacity: i === 0 ? 1 : 0 }}>{n}</span>
            <div style={{ width: i === 0 ? 14 : 8, height: i === 0 ? 14 : 8,
                          borderRadius: '50%',
                          background: i === 0 ? COLORS.peachDeep : 'transparent',
                          border: `1.25px solid ${COLORS.line}` }} />
          </div>
        ))}
      </div>

      {/* Cover — full bleed */}
      <div style={{ minHeight: 700, padding: '120px 80px', background: COLORS.peach,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    position: 'relative' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em',
                      color: COLORS.ink, opacity: 0.6, marginBottom: 20 }}>
          A PRIVATE BOOK · NOT FOR SALE
        </div>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 160, lineHeight: 0.95, color: COLORS.ink }}>
          us, so far
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 30 }}>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42, fontStyle: 'italic' }}>
            volume one —
          </div>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42 }}>
            {daysTogether()} days in
          </div>
        </div>
        <div style={{ marginTop: 60, fontFamily: 'Instrument Serif, serif', fontSize: 20,
                      fontStyle: 'italic', maxWidth: 560, lineHeight: 1.5, color: COLORS.ink, opacity: 0.75 }}>
          What follows is a small record — pictures, letters, places we went, songs we played,
          and a list of things we still want to do. Read slowly.
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: 80, fontSize: 13,
                      color: COLORS.ink, opacity: 0.6, fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: '0.12em' }}>
          ↓ SCROLL TO BEGIN
        </div>
      </div>

      {/* Chapter 1 — Story */}
      <StoryChapter num="ONE" title="how it began">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80, alignItems: 'center' }}>
          <PhotoBox w="100%" h={400} fill={COLORS.mint} label="jun 10, 2025" tilt={-1.5} tape />
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 34, fontStyle: 'italic',
                          lineHeight: 1.3, color: COLORS.ink }}>
              "It was a coffee that was supposed to be forty minutes, and we stayed for four hours."
            </div>
            <div style={{ marginTop: 30, fontSize: 15, color: COLORS.muted, lineHeight: 1.7 }}>
              <TextLines lines={5} />
            </div>
          </div>
        </div>
      </StoryChapter>

      {/* Chapter 2 — Photos */}
      <StoryChapter num="TWO" title="the things we photographed" bg="#f5f0e8">
        <div style={{ fontSize: 16, color: COLORS.muted, maxWidth: 500, marginBottom: 40,
                      fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
          One hundred ninety-four, and counting. Here are a few.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {[COLORS.peach, COLORS.mint, COLORS.lavender, COLORS.peach,
            COLORS.lavender, COLORS.mint, COLORS.peach, COLORS.lavender].map((c, i) => (
            <PhotoBox key={i} w="100%" h={i % 3 === 0 ? 280 : 200} fill={c}
                      tilt={(i % 2 === 0 ? -1 : 1) * (0.8 + i * 0.2)} />
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: 'right', fontFamily: 'Caveat, cursive',
                      fontSize: 24, color: COLORS.muted }}>
          see all 194 →
        </div>
      </StoryChapter>

      {/* Chapter 3 — Letters */}
      <StoryChapter num="THREE" title="what we wrote each other">
        <div style={{ maxWidth: 680, margin: '0 auto', background: COLORS.paper,
                      padding: 60, border: `1px solid ${COLORS.line}`,
                      filter: 'url(#sketchy)' }}>
          <div style={{ filter: 'none' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                          letterSpacing: '0.15em', color: COLORS.muted }}>
              APRIL 21, 2026
            </div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, fontStyle: 'italic',
                          lineHeight: 1.3, marginTop: 20 }}>
              "You make ordinary tuesdays feel like something worth keeping."
            </div>
            <div style={{ marginTop: 24, fontSize: 15, color: COLORS.muted, lineHeight: 1.8 }}>
              <TextLines lines={5} />
            </div>
            <div style={{ marginTop: 30, fontFamily: 'Caveat, cursive', fontSize: 24,
                          color: COLORS.ink, textAlign: 'right' }}>
              — yours,
            </div>
          </div>
        </div>
        <div style={{ marginTop: 30, textAlign: 'center', fontSize: 13, color: COLORS.muted,
                      fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>
          12 LETTERS WRITTEN  ·  4 SEALED FOR LATER
        </div>
      </StoryChapter>

      {/* Chapter 4 — Map */}
      <StoryChapter num="FOUR" title="places we went" bg="#eef0e8">
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 60 }}>
          <div style={{ height: 440, position: 'relative', background: COLORS.paper,
                        border: `1px solid ${COLORS.line}`, filter: 'url(#sketchy)' }}>
            <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#dots)" /></svg>
            {[
              { x: '25%', y: '35%', l: 'porto' }, { x: '50%', y: '30%', l: 'lisbon' },
              { x: '65%', y: '55%', l: 'barcelona' }, { x: '75%', y: '40%', l: 'rome' },
              { x: '40%', y: '70%', l: 'home' },
            ].map((p, i) => (
              <div key={i} style={{ position: 'absolute', left: p.x, top: p.y }}>
                <Heart size={20} fill={COLORS.peach} />
                <div style={{ fontFamily: 'Caveat, cursive', fontSize: 18, marginTop: 2 }}>{p.l}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, fontStyle: 'italic',
                          lineHeight: 1.4, color: COLORS.muted }}>
              Five cities, two countries, and one apartment that became home.
            </div>
            <div style={{ marginTop: 30 }}>
              {['Porto · MAR 2026', 'Lisbon · FEB 2026', 'Barcelona · NOV 2025', 'Rome · AUG 2025'].map((p, i) => (
                <div key={i} style={{ padding: '14px 0', borderTop: `1px solid ${COLORS.line}`,
                                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                                      letterSpacing: '0.1em' }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </StoryChapter>

      {/* Chapter 5 — Songs */}
      <StoryChapter num="FIVE" title="the soundtrack">
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic',
                        color: COLORS.muted, marginBottom: 30, textAlign: 'center' }}>
            42 songs · 2h 38m · for the drive, the kitchen, the rain
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20,
                                    padding: '16px 20px', background: i === 0 ? COLORS.lavender : 'transparent',
                                    borderRadius: 4 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                               color: COLORS.muted, width: 24 }}>{String(i+1).padStart(2,'0')}</span>
                <div style={{ flex: 1 }}>
                  <TextLine width="50%" style={{ height: 8 }} />
                  <TextLine width="30%" style={{ marginTop: 6, opacity: 0.12, height: 6 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20 }}>
                  {[8, 12, 6, 14, 10, 16].map((h, j) => (
                    <div key={j} style={{ width: 2, height: h, background: COLORS.ink, opacity: 0.5 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </StoryChapter>

      {/* Chapter 6 — Bucket */}
      <StoryChapter num="SIX" title="what's still ahead" bg="#f0e8ee">
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic',
                      color: COLORS.muted, marginBottom: 40, textAlign: 'center' }}>
          Three done, fifteen waiting.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {[
            { t: 'Cherry blossoms in Kyoto', d: true },
            { t: 'Pasta from scratch', d: true },
            { t: 'Road trip along the coast', d: true },
            { t: 'Mountain sunrise', d: false },
            { t: 'Get a dog', d: false },
            { t: 'Iceland in winter', d: false },
            { t: 'Plant a garden', d: false },
            { t: 'A little festival, ours', d: false },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16,
                                  padding: '18px 0', borderBottom: `1px dashed ${COLORS.muted}` }}>
              <SketchCircle size={24} fill={it.d ? COLORS.mintDeep : 'transparent'}>
                {it.d && <span style={{ fontSize: 14, color: COLORS.paper }}>✓</span>}
              </SketchCircle>
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24,
                             opacity: it.d ? 0.45 : 1, textDecoration: it.d ? 'line-through' : 'none' }}>
                {it.t}
              </span>
            </div>
          ))}
        </div>
      </StoryChapter>

      {/* Ending */}
      <div style={{ padding: '120px 80px', textAlign: 'center', background: COLORS.paper }}>
        <Squiggle width={120} style={{ display: 'block', margin: '0 auto 30px' }} />
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 72, lineHeight: 1 }}>
          to be continued —
        </div>
        <div style={{ marginTop: 40, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                      letterSpacing: '0.2em', color: COLORS.muted }}>
          END OF VOLUME ONE · {daysTogether()} DAYS · APRIL 24, 2026
        </div>
      </div>
    </div>
  );
}

// Sub-pages share the dashboard-style simpler layouts for navigation
function StoryPlaceholder({ title }) {
  return (
    <div style={{ padding: '100px 80px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: COLORS.muted }}>
        THIS VARIATION IS A SINGLE-PAGE BOOK
      </div>
      <div style={{ fontFamily: 'Caveat, cursive', fontSize: 56, marginTop: 20 }}>
        {title} lives inside the story
      </div>
      <div style={{ fontSize: 15, color: COLORS.muted, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
        Scroll the home page to find this chapter, or switch variations above.
      </div>
    </div>
  );
}

Object.assign(window, { StoryHome, StoryPlaceholder });

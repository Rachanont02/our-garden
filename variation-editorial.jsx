// Variation B — Editorial magazine
// Big type, calm, generous whitespace, restrained palette

function EditorialHome() {
  return (
    <div style={{ padding: '50px 100px', fontFamily: 'Inter, sans-serif' }}>
      {/* Masthead */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    paddingBottom: 24, borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 40, letterSpacing: '-0.02em' }}>
          <span style={{ fontStyle: 'italic' }}>Us</span>, issue 318
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', color: COLORS.muted }}>
          APR · 24 · 2026  ·  DAY 318
        </div>
      </div>

      {/* Nav — horizontal underlined */}
      <div style={{ display: 'flex', gap: 36, padding: '20px 0', fontSize: 13,
                    borderBottom: `1px solid ${COLORS.line}`, fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        <span style={{ borderBottom: `2px solid ${COLORS.ink}`, paddingBottom: 4 }}>home</span>
        <span>story</span><span>photos</span><span>letters</span>
        <span>list</span><span>songs</span><span>map</span>
      </div>

      {/* Hero — editorial layout */}
      <div style={{ padding: '80px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: COLORS.muted, marginBottom: 20 }}>
            — a private record, no. 001
          </div>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 120, lineHeight: 0.95,
                        letterSpacing: '-0.03em' }}>
            Three hundred<br/>
            <span style={{ fontStyle: 'italic' }}>eighteen</span><br/>
            days.
          </div>
          <div style={{ marginTop: 24, fontSize: 15, color: COLORS.muted, maxWidth: 420, lineHeight: 1.6 }}>
            <TextLines lines={3} />
          </div>
        </div>
        <PhotoBox w="100%" h={540} fill={COLORS.peach} label="cover · porto, march" />
      </div>

      {/* Feature tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40,
                    paddingTop: 50, borderTop: `1px solid ${COLORS.line}` }}>
        {[
          { n: '01', t: 'The story so far', s: 'Six moments, two cities, one shared bookshelf.', c: COLORS.lavender },
          { n: '02', t: 'From the drawer', s: 'Twelve letters. The newest one is for a tuesday.', c: COLORS.mint },
          { n: '03', t: 'What\'s next', s: 'Kyoto in spring. We\'ve been reading about it.', c: COLORS.peach },
        ].map((f) => (
          <div key={f.n}>
            <PhotoBox w="100%" h={240} fill={f.c} />
            <div style={{ marginTop: 18, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                          letterSpacing: '0.12em', color: COLORS.muted }}>
              NO. {f.n}
            </div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, marginTop: 6, lineHeight: 1.1 }}>
              {f.t}
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: COLORS.muted, lineHeight: 1.5 }}>
              {f.s}
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{ marginTop: 100, padding: '60px 0', borderTop: `1px solid ${COLORS.line}`,
                    borderBottom: `1px solid ${COLORS.line}`, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, fontStyle: 'italic',
                      lineHeight: 1.3, maxWidth: 800, margin: '0 auto' }}>
          "You make ordinary tuesdays<br/>feel like something worth keeping."
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em',
                      color: COLORS.muted, marginTop: 24 }}>
          — FROM A LETTER, APRIL 21
        </div>
      </div>
    </div>
  );
}

function EditorialGallery() {
  return (
    <div style={{ padding: '50px 100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em',
                    color: COLORS.muted, marginBottom: 10 }}>
            ← BACK  ·  SECTION 03
      </div>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 96, lineHeight: 1,
                    letterSpacing: '-0.03em', marginBottom: 16 }}>
        Photographs, <span style={{ fontStyle: 'italic' }}>kept.</span>
      </div>
      <div style={{ fontSize: 16, color: COLORS.muted, maxWidth: 600, marginBottom: 50 }}>
        One hundred ninety-four frames. Arranged by month, from the first to the most recent.
      </div>

      {/* Months ribbon */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 40, fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, letterSpacing: '0.12em', overflowX: 'auto', paddingBottom: 12,
                    borderBottom: `1px solid ${COLORS.line}` }}>
        {['ALL', 'JUN 25', 'JUL 25', 'AUG 25', 'SEP 25', 'OCT 25', 'NOV 25', 'DEC 25', 'JAN 26', 'FEB 26', 'MAR 26', 'APR 26'].map((m, i) => (
          <span key={m} style={{ whiteSpace: 'nowrap', borderBottom: i === 0 ? `2px solid ${COLORS.ink}` : 'none', paddingBottom: 4 }}>
            {m}
          </span>
        ))}
      </div>

      {/* Magazine grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <PhotoBox w="100%" h={360} fill={COLORS.peach} style={{ gridColumn: 'span 8' }} label="porto · mar 15" />
        <PhotoBox w="100%" h={360} fill={COLORS.mint} style={{ gridColumn: 'span 4' }} label="the balcony" />
        <PhotoBox w="100%" h={240} fill={COLORS.lavender} style={{ gridColumn: 'span 4' }} label="feb 14" />
        <PhotoBox w="100%" h={240} fill={COLORS.peach} style={{ gridColumn: 'span 4' }} label="apr 02" />
        <PhotoBox w="100%" h={240} fill={COLORS.mint} style={{ gridColumn: 'span 4' }} label="apr 11" />
        <PhotoBox w="100%" h={280} fill={COLORS.lavender} style={{ gridColumn: 'span 6' }} label="sunday brunch" />
        <PhotoBox w="100%" h={280} fill={COLORS.peach} style={{ gridColumn: 'span 6' }} label="birthday, 28" />
      </div>
    </div>
  );
}

function EditorialTimeline() {
  const moments = [
    { d: 'JUN · 10 · 25', t: 'The first day', n: 'A coffee that lasted four hours.' },
    { d: 'JUL · 04 · 25', t: 'A road trip', n: 'We got lost, then we found a lake.' },
    { d: 'AUG · 19 · 25', t: 'Family', n: 'Her sister approved, she said so later.' },
    { d: 'SEP · 22 · 25', t: 'One kitchen', n: 'Three boxes of books, one of plants.' },
    { d: 'DEC · 31 · 25', t: 'New year', n: 'Kissed at 11:58. Nobody was counting.' },
    { d: 'MAR · 15 · 26', t: 'Porto', n: 'The trip we spent six months imagining.' },
  ];
  return (
    <div style={{ padding: '50px 100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em', color: COLORS.muted, marginBottom: 10 }}>
        ← BACK  ·  SECTION 02
      </div>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 96, lineHeight: 1, marginBottom: 60, letterSpacing: '-0.03em' }}>
        A <span style={{ fontStyle: 'italic' }}>chronology.</span>
      </div>
      {moments.map((m, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 50,
                              padding: '40px 0', borderTop: `1px solid ${COLORS.line}` }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.15em',
                        color: COLORS.muted, paddingTop: 8 }}>{m.d}</div>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, lineHeight: 1.1 }}>{m.t}</div>
            <div style={{ marginTop: 14, fontSize: 16, color: COLORS.muted, lineHeight: 1.6, maxWidth: 400 }}>
              {m.n}
            </div>
          </div>
          <PhotoBox w="100%" h={200} fill={[COLORS.peach, COLORS.mint, COLORS.lavender][i % 3]} />
        </div>
      ))}
    </div>
  );
}

function EditorialLetters() {
  return (
    <div style={{ padding: '50px 100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em', color: COLORS.muted, marginBottom: 10 }}>
        ← BACK  ·  SECTION 04
      </div>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 96, lineHeight: 1, marginBottom: 16, letterSpacing: '-0.03em' }}>
        <span style={{ fontStyle: 'italic' }}>Correspondence.</span>
      </div>
      <div style={{ fontSize: 15, color: COLORS.muted, maxWidth: 600, marginBottom: 60 }}>
        Twelve letters written, twelve still sealed in the app — to be opened on dates we set.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50 }}>
        {[
          { d: 'APR · 21 · 2026', o: true, t: 'On a tuesday morning', c: COLORS.peach },
          { d: 'JUN · 10 · 2026', o: false, t: 'Sealed until anniversary', c: COLORS.lavender },
          { d: 'FEB · 14 · 2026', o: true, t: 'For a valentine', c: COLORS.mint },
          { d: 'DEC · 25 · 2026', o: false, t: 'Sealed until christmas', c: COLORS.peach },
        ].map((l, i) => (
          <div key={i} style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 30 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em',
                          color: COLORS.muted, marginBottom: 14 }}>
              {l.d}  ·  {l.o ? 'OPEN' : 'SEALED'}
            </div>
            <PhotoBox w="100%" h={160} fill={l.c} />
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, marginTop: 20, fontStyle: 'italic', lineHeight: 1.1 }}>
              "{l.t}"
            </div>
            {l.o ? (
              <div style={{ marginTop: 14, color: COLORS.muted }}><TextLines lines={4} /></div>
            ) : (
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                            letterSpacing: '0.15em', color: COLORS.muted }}>
                47 DAYS UNTIL UNSEALED
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialBucket() {
  const items = [
    { t: 'See cherry blossoms in Kyoto', d: true, c: COLORS.peach },
    { t: 'Make pasta from scratch', d: true, c: COLORS.mint },
    { t: 'Road trip along the coast', d: true, c: COLORS.lavender },
    { t: 'Watch a sunrise from a mountain', d: false },
    { t: 'Get a dog', d: false },
    { t: 'Iceland in winter', d: false },
    { t: 'Plant a garden together', d: false },
    { t: 'Our own little festival', d: false },
  ];
  return (
    <div style={{ padding: '50px 100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em', color: COLORS.muted, marginBottom: 10 }}>
        ← BACK  ·  SECTION 05
      </div>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 96, lineHeight: 1, marginBottom: 60, letterSpacing: '-0.03em' }}>
        A <span style={{ fontStyle: 'italic' }}>list.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 200px', padding: '20px 0',
                    borderTop: `1px solid ${COLORS.line}`, fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, letterSpacing: '0.12em', color: COLORS.muted }}>
        <span>STATUS</span><span>ITEM</span><span style={{ textAlign: 'right' }}>COMPLETED</span>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 200px',
                              padding: '28px 0', borderTop: `1px solid ${COLORS.line}`,
                              alignItems: 'center' }}>
          <div style={{ width: 18, height: 18, border: `1.5px solid ${COLORS.line}`,
                        background: it.d ? COLORS.ink : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {it.d && <span style={{ color: COLORS.paper, fontSize: 12 }}>✓</span>}
          </div>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32,
                        opacity: it.d ? 0.4 : 1, textDecoration: it.d ? 'line-through' : 'none' }}>
            {it.t}
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11, letterSpacing: '0.12em', color: COLORS.muted }}>
            {it.d ? 'MAR · 15 · 2026' : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

function EditorialSongs() {
  return (
    <div style={{ padding: '50px 100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em', color: COLORS.muted, marginBottom: 10 }}>
        ← BACK  ·  SECTION 06
      </div>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 96, lineHeight: 1, marginBottom: 16, letterSpacing: '-0.03em' }}>
        A <span style={{ fontStyle: 'italic' }}>soundtrack.</span>
      </div>
      <div style={{ fontSize: 15, color: COLORS.muted, marginBottom: 50 }}>
        42 songs · 2h 38m
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 100px',
                    padding: '16px 0', borderTop: `1px solid ${COLORS.line}`,
                    borderBottom: `1px solid ${COLORS.line}`,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.12em', color: COLORS.muted }}>
        <span>#</span><span>TRACK</span><span>ARTIST</span><span style={{ textAlign: 'right' }}>TIME</span>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 100px',
                              padding: '18px 0', borderBottom: `1px solid ${COLORS.line}`,
                              alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: COLORS.muted }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22 }}>
            <TextLine width="70%" style={{ height: 8 }} />
          </div>
          <div><TextLine width="55%" style={{ opacity: 0.12, height: 8 }} /></div>
          <span style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: COLORS.muted }}>
            3:{10 + i * 3}
          </span>
        </div>
      ))}
    </div>
  );
}

function EditorialMap() {
  return (
    <div style={{ padding: '50px 100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em', color: COLORS.muted, marginBottom: 10 }}>
        ← BACK  ·  SECTION 07
      </div>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 96, lineHeight: 1, marginBottom: 60, letterSpacing: '-0.03em' }}>
        <span style={{ fontStyle: 'italic' }}>Geographies.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 50 }}>
        <SketchBox fill={COLORS.paper} style={{ height: 500, position: 'relative' }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          {[
            { x: '25%', y: '35%', l: 'porto' },
            { x: '45%', y: '28%', l: 'lisbon' },
            { x: '60%', y: '55%', l: 'barcelona' },
            { x: '70%', y: '40%', l: 'rome' },
            { x: '35%', y: '65%', l: 'home' },
          ].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.x, top: p.y,
                                  display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, background: COLORS.ink, borderRadius: '50%' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{p.l}</span>
            </div>
          ))}
        </SketchBox>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em', color: COLORS.muted, marginBottom: 16 }}>
            INDEX
          </div>
          {[
            { l: 'Porto', d: 'MAR · 15 · 2026' },
            { l: 'Lisbon', d: 'FEB · 02 · 2026' },
            { l: 'Barcelona', d: 'NOV · 08 · 2025' },
            { l: 'Rome', d: 'AUG · 19 · 2025' },
            { l: 'Home', d: 'EVERY DAY' },
          ].map((p, i) => (
            <div key={i} style={{ padding: '18px 0', borderTop: `1px solid ${COLORS.line}` }}>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28 }}>{p.l}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.12em', color: COLORS.muted, marginTop: 4 }}>
                {p.d}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  EditorialHome, EditorialGallery, EditorialTimeline,
  EditorialLetters, EditorialBucket, EditorialSongs, EditorialMap,
});

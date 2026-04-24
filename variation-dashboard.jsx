// Variation C — Dashboard
// Counter-first, widget cards, info-dense but calm. Pastel accents.

function DashCard({ children, fill, span = 1, style = {} }) {
  return (
    <div style={{
      gridColumn: `span ${span}`,
      background: fill || COLORS.paper,
      border: `1.25px solid ${COLORS.line}`,
      borderRadius: 14,
      padding: 22,
      filter: 'url(#sketchy)',
      ...style,
    }}>
      <div style={{ filter: 'none' }}>{children}</div>
    </div>
  );
}

function DashLabel({ children }) {
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: COLORS.muted, marginBottom: 10 }}>{children}</div>
  );
}

function DashHome() {
  return (
    <div style={{ padding: '40px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f3ee' }}>
      {/* Sidebar-style nav */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 40 }}>
        <div style={{ position: 'sticky', top: 40, height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 30 }}>
            <Heart size={20} fill={COLORS.peach} />
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic' }}>us</span>
          </div>
          {[
            ['home', true], ['story', false], ['photos', false], ['letters', false],
            ['list', false], ['songs', false], ['map', false],
          ].map(([n, a]) => (
            <div key={n} style={{ padding: '10px 14px', marginLeft: -14,
                                  borderRadius: 8, background: a ? COLORS.lavender : 'transparent',
                                  fontSize: 14, marginBottom: 4, fontWeight: a ? 500 : 400 }}>
              {n}
            </div>
          ))}
          <div style={{ marginTop: 30, padding: 12, background: COLORS.paper, borderRadius: 10,
                        fontSize: 11, color: COLORS.muted, lineHeight: 1.5 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: 4 }}>SINCE</div>
            jun 10, 2025
          </div>
        </div>

        <div>
          {/* Greeting */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, color: COLORS.muted }}>friday, april 24</div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Hi, you two.
            </div>
          </div>

          {/* Dashboard grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {/* Big counter */}
            <DashCard span={4} fill={COLORS.lavender}>
              <DashLabel>days together</DashLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 110, lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {daysTogether()}
                </span>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>
                  <div>10 months</div>
                  <div>14 days</div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 20, fontSize: 12, color: COLORS.muted }}>
                <span>next milestone · <b style={{ color: COLORS.ink }}>365</b> in 47 days</span>
              </div>
            </DashCard>

            {/* Photos count */}
            <DashCard span={2} fill={COLORS.peach}>
              <DashLabel>photos</DashLabel>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 64, lineHeight: 1 }}>194</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>+12 this week</div>
              {/* mini sparkline */}
              <svg width="100%" height="40" style={{ marginTop: 10 }}>
                <polyline fill="none" stroke={COLORS.ink} strokeWidth="1.2"
                  points="0,30 20,25 40,28 60,20 80,24 100,15 120,18 140,10 160,12 180,8" />
              </svg>
            </DashCard>

            {/* Mini photo wall */}
            <DashCard span={3}>
              <DashLabel>recent photos</DashLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[COLORS.peach, COLORS.mint, COLORS.lavender, COLORS.peach,
                  COLORS.mint, COLORS.lavender, COLORS.peach, COLORS.mint].map((c, i) => (
                  <PhotoBox key={i} w="100%" h={72} fill={c} />
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 13, color: COLORS.muted }}>
                view all 194 →
              </div>
            </DashCard>

            {/* Letter preview */}
            <DashCard span={3} fill={COLORS.mint}>
              <DashLabel>latest letter · apr 21</DashLabel>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, fontStyle: 'italic',
                            lineHeight: 1.3 }}>
                "You make ordinary tuesdays feel like something worth keeping."
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 16, fontSize: 13 }}>
                <span style={{ textDecoration: 'underline' }}>read</span>
                <span style={{ color: COLORS.muted }}>12 letters total</span>
              </div>
            </DashCard>

            {/* Bucket */}
            <DashCard span={2}>
              <DashLabel>bucket list</DashLabel>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, lineHeight: 1 }}>
                3<span style={{ color: COLORS.muted, fontSize: 28 }}>/18</span>
              </div>
              <div style={{ marginTop: 12, height: 4, background: '#eee', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${(3/18)*100}%`, height: '100%', background: COLORS.peachDeep }} />
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>
                next up:<br/><b style={{ color: COLORS.ink }}>cherry blossoms · kyoto</b>
              </div>
            </DashCard>

            {/* Countdown */}
            <DashCard span={2} fill={COLORS.peach}>
              <DashLabel>1 year anniversary</DashLabel>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, lineHeight: 1 }}>47<span style={{ color: COLORS.muted, fontSize: 20 }}> days</span></div>
              <div style={{ marginTop: 14, display: 'flex', gap: 4 }}>
                {Array.from({ length: 47 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 14, background: COLORS.ink, opacity: 0.5 + (i/100) }} />
                )).slice(0, 20)}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>jun 10, 2026</div>
            </DashCard>

            {/* Song */}
            <DashCard span={3}>
              <DashLabel>song of the week</DashLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <SketchCircle size={54} fill={COLORS.lavender}>
                  <div style={{ fontSize: 20 }}>▶</div>
                </SketchCircle>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20 }}>
                    <TextLine width="70%" style={{ height: 8 }} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <TextLine width="40%" style={{ opacity: 0.12, height: 6 }} />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 3, alignItems: 'flex-end', height: 28 }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 6 + Math.abs(Math.sin(i * 0.7)) * 22,
                                        background: COLORS.ink, opacity: 0.45 }} />
                ))}
              </div>
            </DashCard>

            <DashCard span={3}>
              <DashLabel>places visited</DashLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, lineHeight: 1 }}>5</span>
                <span style={{ color: COLORS.muted, fontSize: 14 }}>cities · 2 countries</span>
              </div>
              <div style={{ marginTop: 12, height: 80, position: 'relative', background: '#faf9f5',
                            border: `1px solid ${COLORS.line}`, borderRadius: 6, overflow: 'hidden' }}>
                <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#dots)" /></svg>
                {[[20, 30], [35, 25], [50, 50], [65, 38], [40, 60]].map(([x, y], i) => (
                  <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`,
                                        width: 6, height: 6, background: COLORS.peachDeep, borderRadius: '50%' }} />
                ))}
              </div>
            </DashCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simpler sub-pages for the dashboard variant — consistent card-based
function DashGallery() {
  return (
    <div style={{ padding: '40px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f3ee' }}>
      <DashLabel>section · photos</DashLabel>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, letterSpacing: '-0.02em', marginBottom: 8 }}>
        Photos
      </div>
      <div style={{ color: COLORS.muted, marginBottom: 30, fontSize: 14 }}>194 frames, filtered by month</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'this month', 'porto trip', 'sundays', 'birthdays'].map((t, i) => (
          <div key={t} style={{ padding: '6px 14px', borderRadius: 999,
                                background: i === 0 ? COLORS.ink : COLORS.paper,
                                color: i === 0 ? COLORS.paper : COLORS.ink,
                                fontSize: 12, border: `1px solid ${COLORS.line}` }}>{t}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <PhotoBox key={i} w="100%" h={160} fill={[COLORS.peach, COLORS.mint, COLORS.lavender][i % 3]} />
        ))}
      </div>
    </div>
  );
}

function DashTimeline() {
  const moments = [
    { d: 'jun 10, 2025', t: 'day one', n: 'coffee that lasted 4 hours', c: COLORS.peach },
    { d: 'jul 04', t: 'first road trip', n: 'got lost, found a lake', c: COLORS.mint },
    { d: 'aug 19', t: 'met family', n: 'they approved', c: COLORS.lavender },
    { d: 'sep 22', t: 'moved in', n: '3 boxes of books', c: COLORS.peach },
    { d: 'dec 31', t: 'new year', n: 'kiss at 11:58', c: COLORS.mint },
    { d: 'mar 15, 2026', t: 'porto', n: 'six months saving', c: COLORS.lavender },
  ];
  return (
    <div style={{ padding: '40px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f3ee' }}>
      <DashLabel>section · story</DashLabel>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, letterSpacing: '-0.02em', marginBottom: 30 }}>
        Story
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {moments.map((m, i) => (
          <DashCard key={i} fill={m.c}>
            <DashLabel>{m.d}</DashLabel>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, lineHeight: 1.1 }}>{m.t}</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, fontStyle: 'italic' }}>{m.n}</div>
            <PhotoBox w="100%" h={130} fill="#ffffff88" style={{ marginTop: 14 }} />
          </DashCard>
        ))}
      </div>
    </div>
  );
}

function DashLetters() {
  return (
    <div style={{ padding: '40px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f3ee' }}>
      <DashLabel>section · letters</DashLabel>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, letterSpacing: '-0.02em', marginBottom: 30 }}>
        Letters
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {[
          { d: 'apr 21', t: 'On a tuesday morning', c: COLORS.peach, o: true },
          { d: 'feb 14', t: 'For valentines', c: COLORS.lavender, o: true },
          { d: 'jun 10', t: 'Sealed · anniversary', c: COLORS.mint, o: false },
          { d: 'dec 25', t: 'Sealed · christmas', c: COLORS.peach, o: false },
        ].map((l, i) => (
          <DashCard key={i} fill={l.c}>
            <DashLabel>{l.d} · {l.o ? 'open' : 'sealed'}</DashLabel>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, fontStyle: 'italic' }}>
              "{l.t}"
            </div>
            <div style={{ marginTop: 16 }}>{l.o ? <TextLines lines={3} /> :
              <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'JetBrains Mono, monospace',
                            letterSpacing: '0.1em' }}>47 DAYS</div>}</div>
          </DashCard>
        ))}
      </div>
    </div>
  );
}

function DashBucket() {
  const items = [
    { t: 'Cherry blossoms · Kyoto', d: true }, { t: 'Pasta from scratch', d: true },
    { t: 'Coast road trip', d: true }, { t: 'Mountain sunrise', d: false },
    { t: 'Get a dog', d: false }, { t: 'Iceland in winter', d: false },
    { t: 'A garden together', d: false }, { t: 'Little festival', d: false },
  ];
  return (
    <div style={{ padding: '40px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f3ee' }}>
      <DashLabel>section · list</DashLabel>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, letterSpacing: '-0.02em' }}>
        List
      </div>
      <div style={{ color: COLORS.muted, marginBottom: 30, fontSize: 14 }}>3 of 18 complete</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {items.map((it, i) => (
          <DashCard key={i} fill={it.d ? COLORS.paper : '#fff'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 20, height: 20, border: `1.5px solid ${COLORS.line}`,
                            borderRadius: 4, background: it.d ? COLORS.ink : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: COLORS.paper, fontSize: 13 }}>
                {it.d && '✓'}
              </div>
              <span style={{ fontSize: 18, opacity: it.d ? 0.4 : 1,
                             textDecoration: it.d ? 'line-through' : 'none' }}>{it.t}</span>
            </div>
          </DashCard>
        ))}
      </div>
    </div>
  );
}

function DashSongs() {
  return (
    <div style={{ padding: '40px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f3ee' }}>
      <DashLabel>section · songs</DashLabel>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, letterSpacing: '-0.02em' }}>
        Songs
      </div>
      <div style={{ color: COLORS.muted, marginBottom: 30, fontSize: 14 }}>42 songs · 2h 38m</div>
      <DashCard>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0',
                                borderBottom: i < 7 ? `1px solid #eee` : 'none' }}>
            <span style={{ width: 24, color: COLORS.muted, fontSize: 12,
                           fontFamily: 'JetBrains Mono, monospace' }}>{String(i+1).padStart(2, '0')}</span>
            <div style={{ width: 36, height: 36, borderRadius: 6,
                          background: [COLORS.peach, COLORS.mint, COLORS.lavender][i % 3],
                          border: `1px solid ${COLORS.line}` }} />
            <div style={{ flex: 1 }}>
              <TextLine width="40%" style={{ height: 8 }} />
              <TextLine width="25%" style={{ marginTop: 6, opacity: 0.12, height: 6 }} />
            </div>
            <span style={{ fontSize: 12, color: COLORS.muted,
                           fontFamily: 'JetBrains Mono, monospace' }}>3:{12 + i}</span>
          </div>
        ))}
      </DashCard>
    </div>
  );
}

function DashMap() {
  return (
    <div style={{ padding: '40px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f3ee' }}>
      <DashLabel>section · map</DashLabel>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, letterSpacing: '-0.02em' }}>
        Map
      </div>
      <div style={{ color: COLORS.muted, marginBottom: 30, fontSize: 14 }}>5 cities · 2 countries · 1 home</div>
      <DashCard>
        <div style={{ height: 460, position: 'relative', background: '#faf9f5',
                      border: `1px dashed ${COLORS.muted}`, borderRadius: 8 }}>
          <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#dots)" /></svg>
          {[
            { x: '25%', y: '35%', l: 'porto' }, { x: '45%', y: '28%', l: 'lisbon' },
            { x: '60%', y: '55%', l: 'barcelona' }, { x: '70%', y: '40%', l: 'rome' },
            { x: '35%', y: '65%', l: 'home' },
          ].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.x, top: p.y,
                                  display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: COLORS.peachDeep, borderRadius: '50%',
                            boxShadow: '0 0 0 4px rgba(212,150,119,0.2)' }} />
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
                             letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.l}</span>
            </div>
          ))}
        </div>
      </DashCard>
    </div>
  );
}

Object.assign(window, {
  DashHome, DashGallery, DashTimeline, DashLetters, DashBucket, DashSongs, DashMap,
});

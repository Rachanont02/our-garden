// Variation A — Scrapbook grid
// Playful collage layout. Tilted photos, tape, annotations, masonry feel.

function ScrapbookHome() {
  return (
    <div style={{ padding: '60px 80px', fontFamily: 'Caveat, cursive', position: 'relative' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Heart size={24} fill={COLORS.peach} />
          <span style={{ fontSize: 26 }}>us &amp; us</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 18, color: COLORS.muted }}>
          <span>home</span><span>story</span><span>photos</span><span>letters</span>
          <span>list</span><span>songs</span><span>map</span>
        </div>
      </div>

      {/* Hero strip — big days counter, handwritten */}
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic', color: COLORS.muted }}>
          today we have been together for
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 6 }}>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 180, lineHeight: 0.9, color: COLORS.ink }}>
            {daysTogether()}
          </span>
          <span style={{ fontSize: 42, color: COLORS.lavenderDeep }}>days</span>
          <Squiggle width={120} style={{ marginLeft: 10 }} />
        </div>
        <Annotation text="counter ticks up each day" style={{ position: 'absolute', right: 0, top: 30 }} dir="left" />
      </div>

      {/* Collage grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginBottom: 50 }}>
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PhotoBox label="first trip · porto" w="100%" h={280} tilt={-1.5} tape fill={COLORS.peach} />
          <div style={{ display: 'flex', gap: 18 }}>
            <PhotoBox label="sunday brunch" w="50%" h={150} tilt={1.5} tape fill={COLORS.mint} />
            <PhotoBox label="your birthday" w="50%" h={150} tilt={-2} tape fill={COLORS.lavender} />
          </div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <SketchBox fill={COLORS.paper} style={{ padding: 24, height: '100%' }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>a letter for you —</div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 16, fontStyle: 'italic', color: COLORS.muted, lineHeight: 1.5 }}>
              "april 21, 2026"
            </div>
            <div style={{ marginTop: 14 }}>
              <TextLines lines={6} />
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
              <SketchButton small fill={COLORS.peach}>read →</SketchButton>
              <span style={{ fontSize: 14, color: COLORS.muted }}>12 letters in the drawer</span>
            </div>
          </SketchBox>
        </div>

        <SketchBox fill={COLORS.lavender} style={{ padding: 18, height: 180 }}>
          <div style={{ fontSize: 20, color: COLORS.ink }}>our song this week</div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <SketchCircle size={50} fill={COLORS.paper}>
              <div style={{ fontSize: 22 }}>♪</div>
            </SketchCircle>
            <div>
              <TextLine width={120} />
              <TextLine width={80} style={{ marginTop: 6, opacity: 0.1 }} />
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 6, alignItems: 'flex-end', height: 24 }}>
            {[8, 16, 10, 20, 14, 22, 12, 18, 10, 6].map((h, i) => (
              <div key={i} style={{ width: 4, height: h, background: COLORS.ink, opacity: 0.5 }} />
            ))}
          </div>
        </SketchBox>

        <PhotoBox label="rainy saturday" w="100%" h={180} tilt={2} tape fill={COLORS.mint} />

        <SketchBox fill={COLORS.mint} style={{ padding: 18, height: 180 }}>
          <div style={{ fontSize: 18, color: COLORS.ink }}>places we've been</div>
          <div style={{ fontSize: 42, marginTop: 6 }}>7</div>
          <div style={{ fontSize: 14, color: COLORS.muted }}>cities · 2 countries</div>
          <div style={{ marginTop: 10 }}><Arrow length={50} /></div>
        </SketchBox>

        <SketchBox fill={COLORS.peach} style={{ padding: 18, height: 180 }}>
          <div style={{ fontSize: 18, color: COLORS.ink }}>next on our list</div>
          <div style={{ fontSize: 22, marginTop: 10, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
            "cherry blossoms<br/>in kyoto"
          </div>
          <div style={{ marginTop: 14, fontSize: 14, color: COLORS.muted }}>☐ 3 of 18 done</div>
        </SketchBox>
      </div>

      {/* Footer — scribble */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 30, borderTop: `1px dashed ${COLORS.muted}` }}>
        <span style={{ fontSize: 18, color: COLORS.muted }}>made with ♡ · private for us</span>
        <Squiggle width={100} />
      </div>
    </div>
  );
}

function ScrapbookGallery() {
  return (
    <div style={{ padding: '60px 80px', fontFamily: 'Caveat, cursive' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 18, color: COLORS.muted }}>← home</div>
        <div style={{ fontSize: 68, lineHeight: 1 }}>the photo drawer</div>
        <div style={{ marginTop: 8, fontFamily: 'Instrument Serif, serif', fontSize: 20, fontStyle: 'italic', color: COLORS.muted }}>
          194 photos · sorted by feeling, not date
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
        {['all', 'us', 'food', 'trips', 'silly', 'quiet mornings', 'rainy days'].map((t, i) => (
          <SketchButton key={t} small fill={i === 0 ? COLORS.peach : COLORS.paper}>{t}</SketchButton>
        ))}
      </div>

      {/* Tilted photo wall */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
        {[
          { t: -2, h: 180, c: COLORS.peach, l: 'jan 03' },
          { t: 1.5, h: 220, c: COLORS.lavender, l: 'feb 14' },
          { t: -1, h: 160, c: COLORS.mint, l: 'feb 22' },
          { t: 2, h: 200, c: COLORS.peach, l: 'mar 08' },
          { t: -1.5, h: 180, c: COLORS.lavender, l: 'mar 19' },
          { t: 1, h: 200, c: COLORS.mint, l: 'apr 02' },
          { t: -2, h: 160, c: COLORS.peach, l: 'apr 11' },
          { t: 1.5, h: 220, c: COLORS.mint, l: 'apr 15' },
          { t: -1, h: 180, c: COLORS.lavender, l: 'apr 18' },
          { t: 2, h: 200, c: COLORS.peach, l: 'apr 20' },
        ].map((p, i) => (
          <PhotoBox key={i} label={p.l} w="100%" h={p.h} tilt={p.t} tape fill={p.c} />
        ))}
      </div>
    </div>
  );
}

function ScrapbookTimeline() {
  const moments = [
    { d: 'jun 10, 2025', t: 'day one', n: 'coffee that lasted 4 hours', c: COLORS.peach },
    { d: 'jul 04', t: 'first road trip', n: 'got lost, found a lake', c: COLORS.mint },
    { d: 'aug 19', t: 'met your sister', n: 'she approves (she told me)', c: COLORS.lavender },
    { d: 'sep 22', t: 'moved in', n: '3 boxes of books', c: COLORS.peach },
    { d: 'dec 31', t: 'new year', n: 'kiss at 11:58 (early)', c: COLORS.mint },
    { d: 'mar 15, 2026', t: 'porto', n: 'the trip we saved for', c: COLORS.lavender },
  ];
  return (
    <div style={{ padding: '60px 80px', fontFamily: 'Caveat, cursive' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 18, color: COLORS.muted }}>← home</div>
        <div style={{ fontSize: 68, lineHeight: 1 }}>how we got here</div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 40 }}>
        <div style={{ position: 'absolute', left: 8, top: 12, bottom: 0, width: 1.5,
          borderLeft: `1.5px dashed ${COLORS.muted}` }} />
        {moments.map((m, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 36, display: 'flex', gap: 24 }}>
            <div style={{ position: 'absolute', left: -40 }}>
              <SketchCircle size={22} fill={m.c} />
            </div>
            <PhotoBox label={m.d} w={200} h={140} tilt={i % 2 === 0 ? -1.5 : 1.5} fill={m.c} />
            <div>
              <div style={{ fontSize: 32 }}>{m.t}</div>
              <div style={{ fontSize: 20, color: COLORS.muted, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
                {m.n}
              </div>
              <div style={{ marginTop: 10, width: 300 }}><TextLines lines={2} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrapbookLetters() {
  return (
    <div style={{ padding: '60px 80px', fontFamily: 'Caveat, cursive' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 18, color: COLORS.muted }}>← home</div>
        <div style={{ fontSize: 68, lineHeight: 1 }}>letters to you</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        {[
          { d: 'apr 21, 2026', p: 'on a tuesday morning', c: COLORS.peach, t: 0.8 },
          { d: 'feb 14, 2026', p: 'for valentines', c: COLORS.lavender, t: -1.2 },
          { d: 'dec 25, 2025', p: 'christmas eve', c: COLORS.mint, t: 1.5 },
          { d: 'oct 07, 2025', p: 'after the fight', c: COLORS.peach, t: -0.8 },
          { d: 'aug 19, 2025', p: 'meeting your family', c: COLORS.lavender, t: 1 },
          { d: 'jun 10, 2025', p: 'the first one', c: COLORS.mint, t: -1.5 },
        ].map((l, i) => (
          <div key={i} style={{ transform: `rotate(${l.t}deg)` }}>
            <SketchBox fill={l.c} style={{ padding: 24, minHeight: 220 }}>
              <div style={{ fontSize: 14, color: COLORS.muted, fontFamily: 'JetBrains Mono, monospace' }}>
                {l.d}
              </div>
              <div style={{ fontSize: 28, marginTop: 6, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
                "{l.p}"
              </div>
              <div style={{ marginTop: 16 }}><TextLines lines={5} /></div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16 }}>open →</span>
                <Heart size={18} />
              </div>
            </SketchBox>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <SketchButton fill={COLORS.peach}>+ write a new one</SketchButton>
      </div>
    </div>
  );
}

function ScrapbookBucket() {
  const items = [
    { t: 'see cherry blossoms in kyoto', d: true, c: COLORS.peach },
    { t: 'learn to make pasta from scratch', d: true, c: COLORS.mint },
    { t: 'road trip along the coast', d: true, c: COLORS.lavender },
    { t: 'watch the sunrise from a mountain', d: false, c: COLORS.peach },
    { t: 'get a dog', d: false, c: COLORS.mint },
    { t: 'visit iceland in winter', d: false, c: COLORS.lavender },
    { t: 'plant a garden together', d: false, c: COLORS.peach },
    { t: 'go to a music festival', d: false, c: COLORS.mint },
  ];
  return (
    <div style={{ padding: '60px 80px', fontFamily: 'Caveat, cursive' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 18, color: COLORS.muted }}>← home</div>
        <div style={{ fontSize: 68, lineHeight: 1 }}>things we want to do</div>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontStyle: 'italic', color: COLORS.muted }}>
          3 of 18 done · the rest is ahead of us
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {items.map((item, i) => (
          <SketchBox key={i} fill={item.d ? COLORS.paper : item.c}
                     style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <SketchCircle size={28} fill={item.d ? COLORS.mintDeep : 'none'}>
              {item.d && <span style={{ fontSize: 18, color: COLORS.paper }}>✓</span>}
            </SketchCircle>
            <span style={{ fontSize: 24, textDecoration: item.d ? 'line-through' : 'none',
                           opacity: item.d ? 0.5 : 1 }}>{item.t}</span>
          </SketchBox>
        ))}
      </div>
    </div>
  );
}

function ScrapbookSongs() {
  const songs = Array.from({ length: 8 }).map((_, i) => ({ i }));
  return (
    <div style={{ padding: '60px 80px', fontFamily: 'Caveat, cursive' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 18, color: COLORS.muted }}>← home</div>
        <div style={{ fontSize: 68, lineHeight: 1 }}>our playlist</div>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontStyle: 'italic', color: COLORS.muted }}>
          42 songs · 2h 38m · "for the drive"
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {songs.map((s) => (
          <SketchBox key={s.i} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 20 }}>
            <SketchCircle size={42} fill={[COLORS.peach, COLORS.mint, COLORS.lavender][s.i % 3]}>
              <div style={{ fontSize: 18 }}>▶</div>
            </SketchCircle>
            <div style={{ flex: 1 }}>
              <TextLine width="40%" />
              <TextLine width="25%" style={{ marginTop: 6, opacity: 0.12 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 22 }}>
              {[6, 12, 8, 16, 10, 14].map((h, j) => (
                <div key={j} style={{ width: 3, height: h, background: COLORS.line, opacity: 0.5 }} />
              ))}
            </div>
            <span style={{ fontSize: 16, color: COLORS.muted, width: 50, textAlign: 'right' }}>3:12</span>
          </SketchBox>
        ))}
      </div>
    </div>
  );
}

function ScrapbookMap() {
  return (
    <div style={{ padding: '60px 80px', fontFamily: 'Caveat, cursive' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 18, color: COLORS.muted }}>← home</div>
        <div style={{ fontSize: 68, lineHeight: 1 }}>places we've been</div>
      </div>
      <SketchBox fill={COLORS.paper} style={{ padding: 40, height: 500, position: 'relative' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 40 }}>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        {/* Pin markers */}
        {[
          { x: '25%', y: '35%', label: 'porto' },
          { x: '45%', y: '28%', label: 'lisbon' },
          { x: '60%', y: '55%', label: 'barcelona' },
          { x: '70%', y: '40%', label: 'rome' },
          { x: '35%', y: '65%', label: 'home' },
          { x: '82%', y: '70%', label: 'kyoto ✧ next' },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p.x, top: p.y }}>
            <Heart size={24} fill={COLORS.peach} />
            <div style={{ fontSize: 18, marginTop: 4, whiteSpace: 'nowrap' }}>{p.label}</div>
          </div>
        ))}
      </SketchBox>
      <div style={{ marginTop: 20, display: 'flex', gap: 30, fontSize: 18 }}>
        <span>✓ 5 cities</span>
        <span>♡ 3 favorites</span>
        <span style={{ color: COLORS.muted }}>☐ 12 dreaming of</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScrapbookHome, ScrapbookGallery, ScrapbookTimeline,
  ScrapbookLetters, ScrapbookBucket, ScrapbookSongs, ScrapbookMap,
});

/**
 * Hand-drawn schematic, not a map screenshot. Deliberately makes no compass
 * claim — the GO walk enters as a labelled dashed path rather than from a
 * direction we'd be asserting without checking.
 */
export default function PlazaMap() {
  const stalls = (rowY: number) =>
    Array.from({ length: 12 }, (_, i) => (
      <rect
        key={`${rowY}-${i}`}
        x={186 + i * 48}
        y={rowY}
        width="40"
        height="52"
        rx="3"
        fill="none"
        stroke="var(--ink-12)"
        strokeWidth="1.5"
      />
    ))

  return (
    <svg
      viewBox="0 0 880 540"
      role="img"
      aria-labelledby="plaza-title plaza-desc"
      className="h-auto w-full"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <title id="plaza-title">ThirsTEA’s position inside the plaza</title>
      <desc id="plaza-desc">
        A schematic of the plaza at Hurontario Street and Dundas Street East. The plaza opens off
        Dundas Street East. Parking fills the middle of the lot. The shops run along the back of the
        lot, and ThirsTEA is Unit 3.
      </desc>

      {/* Dundas St E */}
      <rect x="0" y="410" width="880" height="82" fill="var(--ink-12)" />
      <line
        x1="0"
        y1="451"
        x2="880"
        y2="451"
        stroke="var(--milk)"
        strokeWidth="3"
        strokeDasharray="22 18"
      />
      <text x="24" y="512" fill="var(--ink-70)" fontSize="15" letterSpacing="0.12em">
        DUNDAS ST E
      </text>

      {/* Hurontario St */}
      <rect x="0" y="0" width="78" height="410" fill="var(--ink-12)" />
      <line
        x1="39"
        y1="0"
        x2="39"
        y2="410"
        stroke="var(--milk)"
        strokeWidth="3"
        strokeDasharray="22 18"
      />
      <text
        x="0"
        y="0"
        fill="var(--ink-70)"
        fontSize="15"
        letterSpacing="0.12em"
        transform="translate(30 190) rotate(-90)"
      >
        HURONTARIO ST
      </text>

      {/* The lot */}
      <rect
        x="112"
        y="40"
        width="716"
        height="342"
        rx="12"
        fill="var(--feature-soft)"
        stroke="var(--ink)"
        strokeWidth="2"
      />

      {/* Entrance — a real gap in the lot edge */}
      <rect x="236" y="374" width="116" height="16" fill="var(--milk)" />
      <path
        d="M294 404 L294 330"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#arrow)"
      />
      <text x="312" y="372" fill="var(--ink)" fontSize="15" letterSpacing="0.1em">
        IN
      </text>

      {/* Parking */}
      {stalls(232)}
      {stalls(300)}
      <text x="186" y="216" fill="var(--ink-70)" fontSize="14" letterSpacing="0.12em">
        PARKING
      </text>

      {/* The units */}
      <rect x="140" y="72" width="660" height="104" rx="6" fill="var(--milk)" stroke="var(--ink)" strokeWidth="2" />
      {[1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={140 + i * 132}
          y1="72"
          x2={140 + i * 132}
          y2="176"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
      ))}

      {/* Unit 3 — solid ink, the highest-contrast thing on the drawing */}
      <rect x="404" y="72" width="132" height="104" fill="var(--feature)" />
      <line x1="404" y1="72" x2="404" y2="176" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="536" y1="72" x2="536" y2="176" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="470" cy="124" r="27" fill="var(--ink)" />
      <text
        x="470"
        y="133"
        textAnchor="middle"
        fill="var(--milk)"
        fontSize="26"
        fontWeight="700"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        3
      </text>

      {/* Pointer */}
      <path
        d="M470 216 L470 186"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#arrow)"
      />
      <text
        x="470"
        y="243"
        textAnchor="middle"
        fill="var(--ink)"
        fontSize="17"
        fontWeight="700"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ThirsTEA — Unit 3
      </text>

      {/* Stated, not drawn. A path entering from an edge would assert a compass
          direction we haven't verified. */}
      <text x="856" y="424" textAnchor="end" fill="var(--ink-70)" fontSize="14">
        Cooksville GO — about 10 minutes on foot
      </text>

      <text x="112" y="30" fill="var(--ink-muted)" fontSize="13">
        Schematic, not to scale
      </text>

      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink)" />
        </marker>
      </defs>
    </svg>
  )
}

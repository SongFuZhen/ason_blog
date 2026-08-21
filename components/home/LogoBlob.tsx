import Image from 'next/image'

// A single organic blob shape. The slow rotation is done with a CSS
// `transform` animation (GPU-composited) instead of SMIL `<animate>` on the
// path `d` attribute, which forced the browser to recompute path geometry on
// the CPU every frame and caused jank on first paint.
const BLOB =
  'M0.0,-88.5C22.9,-86.4 46.7,-66.4 60.8,-48.5C74.9,-30.5 87.1,-4.2 84.4,19.3C81.6,42.7 65.1,81.9 44.5,92.4C23.8,102.9 -18.2,94.4 -39.6,82.2C-61.0,70.0 -77.7,43.1 -83.9,19.1C-90.1,-4.8 -90.8,-43.4 -76.9,-61.3C-62.9,-79.2 -22.9,-90.6 0.0,-88.5Z'

export function LogoBlob() {
  return (
    <div className="animate-hero-reveal">
      <div className="relative w-[380px] p-10">
        <svg
          className="animate-blob-float absolute inset-0 h-full w-full text-gray-900 dark:text-gray-100"
          viewBox="-104 -104 208 208"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="blob-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#d95e10" stopOpacity="0.04" />
            </linearGradient>
            <pattern id="blob-dots" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="1.4" cy="1.4" r="1.1" fill="currentColor" fillOpacity="0.07" />
            </pattern>
          </defs>

          {/* very faint fill */}
          <path
            fill="url(#blob-grad)"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="0"
            d={BLOB}
          />

          {/* dot pattern overlay */}
          <path fill="url(#blob-dots)" d={BLOB} />
        </svg>

        <Image
          src="/static/images/logo/logo-full-transparent.png"
          alt="ASoN Logo"
          width={340}
          height={340}
          className="relative z-10 mx-auto aspect-square w-[75%] object-contain dark:invert"
          priority
        />
      </div>
    </div>
  )
}

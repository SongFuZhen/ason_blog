import Image from 'next/image'

// Distinct organic "figures" with identical command structure (M + 6×C + Z)
// so the SVG can morph smoothly between them.
const BLOB_A =
  'M0.0,-88.5C22.9,-86.4 46.7,-66.4 60.8,-48.5C74.9,-30.5 87.1,-4.2 84.4,19.3C81.6,42.7 65.1,81.9 44.5,92.4C23.8,102.9 -18.2,94.4 -39.6,82.2C-61.0,70.0 -77.7,43.1 -83.9,19.1C-90.1,-4.8 -90.8,-43.4 -76.9,-61.3C-62.9,-79.2 -22.9,-90.6 0.0,-88.5Z'
const BLOB_B =
  'M0.0,-94.5C24.6,-92.9 51.8,-73.4 67.8,-54.0C83.7,-34.6 100.3,-1.1 95.7,21.8C91.1,44.8 63.2,72.6 40.2,83.5C17.2,94.5 -24.4,99.0 -42.2,87.6C-60.0,76.2 -60.3,40.4 -66.5,15.2C-72.7,-10.0 -90.7,-45.2 -79.6,-63.5C-68.5,-81.8 -24.6,-96.1 0.0,-94.5Z'
const BLOB_C =
  'M0.0,-100.5C22.4,-102.5 62.7,-79.1 74.7,-59.6C86.7,-40.1 78.4,-5.9 72.0,16.4C65.5,38.8 55.1,62.5 35.9,74.6C16.8,86.8 -23.1,98.6 -43.0,89.3C-62.9,80.1 -80.7,41.9 -83.5,19.1C-86.3,-3.8 -73.7,-27.8 -59.8,-47.7C-45.9,-67.6 -22.4,-98.5 0.0,-100.5Z'
const BLOB_D =
  'M0.0,-70.5C18.8,-69.7 37.0,-58.2 53.5,-42.7C70.0,-27.2 101.1,1.5 98.9,22.6C96.7,43.6 62.3,75.7 40.2,83.5C18.1,91.3 -10.5,79.7 -33.5,69.5C-56.4,59.3 -93.1,41.8 -97.5,22.2C-101.8,2.7 -75.8,-32.1 -59.6,-47.5C-43.3,-63.0 -18.8,-71.3 0.0,-70.5Z'

const BLOB_VALUES = `${BLOB_A};${BLOB_B};${BLOB_C};${BLOB_D};${BLOB_A}`

export function LogoBlob() {
  return (
    <div className="animate-hero-reveal">
      <div className="relative w-[380px] p-10">
        <svg
          className="absolute inset-0 h-full w-full text-gray-900 dark:text-gray-100"
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
          <path fill="url(#blob-grad)" stroke="currentColor" strokeOpacity="0.6" strokeWidth="0">
            <animate
              attributeName="d"
              dur="9s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.3;0.5;0.8;1"
              keySplines="0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1"
              values={BLOB_VALUES}
            />
          </path>

          {/* dot pattern overlay (same morphing shape) */}
          <path fill="url(#blob-dots)">
            <animate
              attributeName="d"
              dur="9s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.3;0.5;0.8;1"
              keySplines="0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1"
              values={BLOB_VALUES}
            />
            <animate
              attributeName="d"
              dur="26s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.3;0.5;0.8;1"
              keySplines="0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1"
              values={BLOB_VALUES}
            />
          </path>

          {/* dot pattern overlay (same morphing shape) */}
          <path fill="url(#blob-dots)">
            <animate
              attributeName="d"
              dur="26s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.3;0.5;0.8;1"
              keySplines="0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1"
              values={BLOB_VALUES}
            />
          </path>
        </svg>

        <Image
          src="/static/images/logo/logo-full-transparent.png"
          alt="Ason Logo"
          width={340}
          height={340}
          className="relative z-10 mx-auto aspect-square w-[75%] object-contain dark:invert"
          priority
        />
      </div>
    </div>
  )
}

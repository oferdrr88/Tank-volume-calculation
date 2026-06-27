import { useState, useEffect, useId } from 'react'
import { getCylinderDimensions, getFillHeight } from './cylinder.utils'

const GREEN_THRESHOLD = 93
const COLOR_GREEN = '#16A34A'
const COLOR_ORANGE = '#F97316'

interface TankCylinderProps {
  levelPercent: number
  width?: number
  height?: number
  showLabel?: boolean
}

export function TankCylinder({
  levelPercent,
  width = 100,
  height = 160,
  showLabel = true,
}: TankCylinderProps) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(levelPercent), 60)
    return () => clearTimeout(timer)
  }, [levelPercent])

  const uid = useId()
  const greenClipId = `green-${uid.replace(/:/g, '')}`
  const orangeClipId = `orange-${uid.replace(/:/g, '')}`

  const dim = getCylinderDimensions(width, height)
  const transition = 'y 0.9s ease-out, height 0.9s ease-out'

  const totalFillH  = getFillHeight(animated, dim.bodyHeight)
  const greenFillH  = getFillHeight(Math.min(animated, GREEN_THRESHOLD), dim.bodyHeight)
  const orangeFillH = Math.max(0, totalFillH - greenFillH)

  const greenClipY  = dim.bottomCy - greenFillH
  const orangeClipY = dim.bottomCy - totalFillH

  const hasOrange = animated > GREEN_THRESHOLD

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={`מיכל ${Math.round(levelPercent)}% מלא`}
    >
      <defs>
        {/* clip ירוק – מהתחתית עד 95% */}
        <clipPath id={greenClipId}>
          <rect x={0} y={greenClipY} width={width} height={greenFillH} style={{ transition }} />
        </clipPath>
        {/* clip כתום – מ-95% עד הרמה הנוכחית */}
        <clipPath id={orangeClipId}>
          <rect x={0} y={orangeClipY} width={width} height={orangeFillH} style={{ transition }} />
        </clipPath>
      </defs>

      {/* גוף אחורי – אפור */}
      <rect x={dim.cx - dim.rx} y={dim.topCy} width={dim.rx * 2} height={dim.bodyHeight} fill="#D1D5DB" />
      <ellipse cx={dim.cx} cy={dim.bottomCy} rx={dim.rx} ry={dim.ry} fill="#D1D5DB" />

      {/* שכבה ירוקה */}
      <g clipPath={`url(#${greenClipId})`}>
        <rect x={dim.cx - dim.rx} y={dim.topCy} width={dim.rx * 2} height={dim.bodyHeight} fill={COLOR_GREEN} />
        <ellipse cx={dim.cx} cy={dim.bottomCy} rx={dim.rx} ry={dim.ry} fill={COLOR_GREEN} />
      </g>

      {/* שכבה כתומה (מעל 95% בלבד) */}
      {hasOrange && (
        <g clipPath={`url(#${orangeClipId})`}>
          <rect x={dim.cx - dim.rx} y={dim.topCy} width={dim.rx * 2} height={dim.bodyHeight} fill={COLOR_ORANGE} />
        </g>
      )}

      {/* גבול גוף */}
      <rect
        x={dim.cx - dim.rx} y={dim.topCy}
        width={dim.rx * 2} height={dim.bodyHeight}
        fill="none" stroke="#9CA3AF" strokeWidth={1.5}
      />

      {/* מכסה עליון */}
      <ellipse
        cx={dim.cx} cy={dim.topCy} rx={dim.rx} ry={dim.ry}
        fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1.5}
      />

      {/* אינדיקטור צד כחול */}
      <rect
        x={dim.cx + dim.rx - 6}
        y={dim.topCy + dim.bodyHeight - totalFillH}
        width={5} height={totalFillH}
        fill="#0D99FF" rx={2}
        style={{ transition }}
      />

      {/* תווית % */}
      {showLabel && (
        <text
          x={dim.cx}
          y={dim.topCy + dim.bodyHeight / 2 + 5}
          textAnchor="middle"
          fill={animated > 15 ? 'white' : '#374151'}
          fontSize={Math.max(10, Math.round(width * 0.13))}
          fontFamily="Heebo, sans-serif"
          fontWeight="600"
        >
          {Math.round(levelPercent)}%
        </text>
      )}
    </svg>
  )
}

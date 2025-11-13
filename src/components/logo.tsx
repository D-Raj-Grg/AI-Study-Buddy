import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function Logo({ className, size = 40, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:#0EA5E9]" />
            <stop offset="50%" className="[stop-color:#6366F1]" />
            <stop offset="100%" className="[stop-color:#8B5CF6]" />
          </linearGradient>
        </defs>

        {/* Brain Icon */}
        <g transform="translate(20, 20)">
          {/* Left hemisphere */}
          <path
            d="M-5,-6 Q-9,-6 -9,-2 Q-9,2 -7,4 Q-5,6 -3,5 Q-2,4.4 -2,3 L-2,-3 Q-2,-5 -3,-5.6 Q-4,-6 -5,-6 Z"
            fill="url(#brainGradient)"
            opacity="0.9"
          />

          {/* Right hemisphere */}
          <path
            d="M5,-6 Q9,-6 9,-2 Q9,2 7,4 Q5,6 3,5 Q2,4.4 2,3 L2,-3 Q2,-5 3,-5.6 Q4,-6 5,-6 Z"
            fill="url(#brainGradient)"
          />

          {/* Brain folds/details - Left */}
          <path
            d="M-7,-3 Q-6,-2 -7,-1"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M-7,0 Q-5.6,1 -7,2"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Brain folds/details - Right */}
          <path
            d="M7,-3 Q6,-2 7,-1"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M7,0 Q5.6,1 7,2"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Center connection */}
          <ellipse
            cx="0"
            cy="-1"
            rx="1.6"
            ry="3"
            fill="url(#brainGradient)"
            opacity="0.7"
          />
        </g>
      </svg>

      {/* Text Logo */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Study Buddy
          </span>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Box, Text, useApp } from 'ink'

export interface AnimateOptions {
  duration: number
  intensity: number
  fps: number
  settle: boolean
}

function calculateOffset(
  col: number,
  centerX: number,
  tiltAmount: number
): number {
  if (centerX === 0) return 0
  return Math.round(tiltAmount * ((col - centerX) / centerX))
}

function getTiltAmount(t: number, maxTilt: number, settle: boolean): number {
  const frequency = 3 // oscillations per second
  const fullCycles = 5 // full intensity cycles before decay
  const cycleTime = 1 / frequency // time for one full cycle
  const decayStart = fullCycles * cycleTime // when decay kicks in

  const oscillation = Math.sin(t * frequency * 2 * Math.PI)

  if (!settle) {
    return maxTilt * oscillation
  }

  // Full intensity for first N cycles, then decay
  if (t < decayStart) {
    return maxTilt * oscillation
  }

  const decayTime = t - decayStart
  const decayFactor = Math.exp(-2 * decayTime)
  return maxTilt * oscillation * decayFactor
}

interface CharPosition {
  row: number
  col: number
  char: string
}

function getCharPositions(lines: string[], tiltAmount: number): CharPosition[] {
  const maxWidth = Math.max(...lines.map((line) => line.length))
  const centerX = maxWidth / 2
  const maxOffset = Math.ceil(Math.abs(tiltAmount))

  const chars: CharPosition[] = []

  lines.forEach((line, lineRow) => {
    for (let col = 0; col < line.length; col++) {
      const char = line[col]
      if (!char) continue

      const offset = calculateOffset(col, centerX, tiltAmount)
      const row = lineRow + maxOffset + offset

      chars.push({ row, col, char })
    }
  })

  // Normalize rows to start from 0
  const minRow = Math.min(...chars.map((c) => c.row))
  return chars.map((c) => ({ ...c, row: c.row - minRow }))
}

interface AppProps {
  input: string
  options: AnimateOptions
}

export function App({ input, options }: AppProps): React.ReactElement {
  const { exit } = useApp()
  const lines = input.trimEnd().split('\n')
  const maxWidth = Math.max(...lines.map((line) => line.length))

  const [frame, setFrame] = useState(0)
  const { duration, intensity, fps, settle } = options
  const frameInterval = 1000 / fps
  const totalFrames = Math.ceil(duration / frameInterval)

  useEffect(() => {
    if (frame > totalFrames) {
      exit()
      return
    }

    const timer = setTimeout(() => {
      setFrame((f) => f + 1)
    }, frameInterval)

    return () => clearTimeout(timer)
  }, [frame, totalFrames, frameInterval, exit])

  const t = (frame / totalFrames) * (duration / 1000)
  const tiltAmount =
    frame > totalFrames ? 0 : getTiltAmount(t, intensity, settle)
  const chars = getCharPositions(lines, tiltAmount)

  // Build a grid
  const maxRow = Math.max(...chars.map((c) => c.row))
  const grid: string[][] = Array.from({ length: maxRow + 1 }, () =>
    Array(maxWidth).fill(' ')
  )

  for (const { row, col, char } of chars) {
    if (grid[row]) {
      grid[row]![col] = char
    }
  }

  return (
    <Box flexDirection="column">
      {grid.map((row, i) => (
        <Text key={i}>{row.join('')}</Text>
      ))}
    </Box>
  )
}

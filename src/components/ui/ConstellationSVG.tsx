interface Props {
  nodes: [number, number][]
  edges: [number, number][]
  color: string
  id: string
  className?: string
}

export function ConstellationSVG({ nodes, edges, color, id, className }: Props) {
  const centerIdx = Math.floor(nodes.length / 2)

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={color} strokeWidth="0.6" strokeOpacity="0.25"
          className="transition-all duration-400 group-hover:stroke-opacity-70"
          style={{ strokeOpacity: 'var(--edge-opacity, 0.25)' }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y}
          r={i === centerIdx ? 3.5 : 1.8}
          fill={color}
          opacity={i === centerIdx ? 1 : 0.55}
          filter={i === centerIdx ? `url(#glow-${id})` : undefined}
          className="transition-all duration-400"
        />
      ))}
    </svg>
  )
}

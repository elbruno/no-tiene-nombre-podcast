import { useEffect, useState } from 'react';

interface NeuralNode {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export function NeuralBackground() {
  const [nodes, setNodes] = useState<NeuralNode[]>([]);

  useEffect(() => {
    const createNodes = () => {
      const newNodes: NeuralNode[] = [];
      for (let i = 0; i < 50; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
      setNodes(newNodes);
    };

    createNodes();
    window.addEventListener('resize', createNodes);
    return () => window.removeEventListener('resize', createNodes);
  }, []);

  useEffect(() => {
    const animateNodes = () => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          x: (node.x + node.speed) % window.innerWidth,
          opacity: 0.1 + Math.sin(Date.now() * 0.001 + node.id) * 0.3 + 0.3,
        }))
      );
    };

    const interval = setInterval(animateNodes, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 neural-bg" />
      
      {/* Floating Neural Nodes */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(0, 212, 255)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(0, 212, 255)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGradientPurple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(139, 95, 255)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(139, 95, 255)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Connection lines */}
        {nodes.map((node, index) => {
          const nearbyNodes = nodes.filter((other, otherIndex) => {
            if (otherIndex === index) return false;
            const distance = Math.sqrt(
              Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
            );
            return distance < 150;
          });

          return nearbyNodes.map((nearbyNode, nearbyIndex) => (
            <line
              key={`${index}-${nearbyIndex}`}
              x1={node.x}
              y1={node.y}
              x2={nearbyNode.x}
              y2={nearbyNode.y}
              stroke="rgb(0, 212, 255)"
              strokeWidth="0.5"
              strokeOpacity={node.opacity * 0.3}
            />
          ));
        })}
        
        {/* Neural nodes */}
        {nodes.map((node, index) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={index % 3 === 0 ? "url(#nodeGradientPurple)" : "url(#nodeGradient)"}
            opacity={node.opacity}
          />
        ))}
      </svg>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }} 
        />
      </div>
    </div>
  );
}
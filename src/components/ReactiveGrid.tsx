import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import { ReactiveCard } from './ReactiveCard';
import * as THREE from 'three';

export const ReactiveGrid: React.FC = () => {
  const { movies, loading } = useStore();
  const groupRef = useRef<THREE.Group>(null);
  // Shared mouse position vector (World Space)
  // Initial position far away so cards start flat
  const mousePos = useRef(new THREE.Vector3(9999, 9999, 0));

  // Layout parameters
  const columns = 8; // Wider grid
  const spacingX = 2.5;
  const spacingY = 3.6;
  const offsetX = (columns * spacingX) / 2 - spacingX / 2;

  const handlePointerMove = (e: any) => {
    // e.point is the intersection point in world space
    mousePos.current.copy(e.point);
  };

  if (loading && movies.length === 0) return null;

  return (
    <group ref={groupRef}>
      {/* Invisible plane to catch mouse raycasts across the entire background */}
      <mesh
        position={[0, 0, -0.1]}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {movies.map((movie, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        const x = col * spacingX - offsetX;
        const y = -row * spacingY + (Math.floor(movies.length / columns) * spacingY) / 2;

        return (
          <ReactiveCard
            key={movie.id}
            movie={movie}
            index={index}
            position={[x, y, 0]}
            mousePos={mousePos}
          />
        );
      })}
    </group>
  );
};

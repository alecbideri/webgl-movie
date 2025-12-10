import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { type Movie, tmdbApi } from '../services/tmdb';
import { useStore } from '../store/useStore';

// Custom Shader Material that reacts to World Mouse Position
const CardShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector3(0, 0, 0), // World position of mouse
    uStrength: 0, // Force field strength
    uViewport: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vElevation;
    varying float vDist;
    
    uniform vec3 uMouse;
    uniform float uTime;
    
    // Constants
    const float FIELD_RADIUS = 4.0; 
    const float MAX_ELEVATION = 2.0;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Get World Position of this vertex
      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      
      // Distance from mouse in X/Y plane
      float dist = distance(worldPosition.xy, uMouse.xy);
      vDist = dist;
      
      if (dist < FIELD_RADIUS) {
         // Smooth falloff
         float influence = smoothstep(FIELD_RADIUS, 0.0, dist);
         
         // Bend: Push away in Z (towards camera)
         // And maybe curve the edges away from the center of influence
         
         pos.z += influence * MAX_ELEVATION;
         
         // Slight sine wave ripple
         // pos.z += sin(uTime * 3.0 - dist * 2.0) * influence * 0.2;
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      vElevation = pos.z;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying float vElevation;
    varying float vDist;
    uniform sampler2D uTexture;

    void main() {
      vec4 textureColor = texture2D(uTexture, vUv);
      
      // Highlight: if elevated, make it brighter or add a rim
      float influence = smoothstep(3.0, 0.0, vDist);
      
      // Make high elevation pixels slightly brighter/bluer
      vec3 highlight = vec3(0.1, 0.3, 0.8) * vElevation * 0.5;
      
      gl_FragColor = vec4(textureColor.rgb + highlight, textureColor.a);
    }
  `
);

extend({ CardShaderMaterial });

// Fix TS for intrinsic elements
declare module '@react-three/fiber' {
  interface ThreeElements {
    cardShaderMaterial: React.RefAttributes<THREE.ShaderMaterial> & {
      uTexture?: THREE.Texture;
      uMouse?: THREE.Vector3;
      uTime?: number;
      uStrength?: number;
      uViewport?: THREE.Vector2;
      transparent?: boolean;
    };
  }
}

interface Props {
  movie: Movie;
  position: [number, number, number];
  index?: number;
  mousePos: React.MutableRefObject<THREE.Vector3>;
}

export const ReactiveCard: React.FC<Props> = ({ movie, position, mousePos }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const setActiveMovie = useStore((state) => state.setActiveMovie);

  const imageUrl = movie.poster_path ? tmdbApi.getImageUrl(movie.poster_path) : 'https://via.placeholder.com/500x750?text=No+Poster';
  const texture = useTexture(imageUrl);

  useFrame((_state, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value += delta;

      // Update uniform with current shared mouse position
      // We can lerp it here for per-card lag, or just set it.
      // Lerping gives a nice "drag" feel.
      material.current.uniforms.uMouse.value.lerp(mousePos.current, 0.1);
    }

    // Optional: Rotate card slightly based on mouse position (Parallax)
    /*
    if (mesh.current) {
        const dist = mesh.current.position.distanceTo(mousePos.current);
        if (dist < 4) {
            // lookAt slightly?
        }
    }
    */
  });

  const [hovered, setHover] = React.useState(false);

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={(e) => { e.stopPropagation(); setActiveMovie(movie); }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      // Scale on click or hover? Hover scaling interferes with shader bending sometimes, 
      // but let's keep a small scale.
      scale={hovered ? 1.05 : 1}
    >
      <planeGeometry args={[2.2, 3.3, 32, 32]} />
      {/* 
         // @ts-ignore */}
      <cardShaderMaterial
        ref={material}
        uTexture={texture}
        transparent
      />
    </mesh>
  );
};

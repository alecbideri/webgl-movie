import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { ReactiveGrid } from './ReactiveGrid';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export const Experience: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <color attach="background" args={['#050505']} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#00d4ff" />

        <Suspense fallback={null}>
          <ReactiveGrid />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={5}
          // Limit rotation to keep it mostly front-facing but allow some exploration
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />

        {/* Post Processing for the "Premium" feel */}
        {/* Note: EffectComposer can be performance heavy. Disabled for now to ensure smooth initial testing, 
            or uncomment if performance is good. */}
        {/* 
        <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={0.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer> 
        */}
      </Canvas>
    </div>
  );
};

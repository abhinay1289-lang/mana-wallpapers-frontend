import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { useEffect, useRef } from 'react';

const LightWithLensflare = () => {
  const lightRef = useRef();
  const [flareTexture, flareTexture2, flareTexture3] = useTexture([
    'https://threejs.org/examples/textures/lensflare/lensflare0.png',
    'https://threejs.org/examples/textures/lensflare/lensflare2.png',
    'https://threejs.org/examples/textures/lensflare/lensflare3.png',
  ]);

  useEffect(() => {
    if (lightRef.current) {
      const lensflare = new Lensflare();
      lensflare.addElement(new LensflareElement(flareTexture, 700, 0, lightRef.current.color));
      lensflare.addElement(new LensflareElement(flareTexture2, 512, 0));
      lensflare.addElement(new LensflareElement(flareTexture3, 60, 0.6));
      lensflare.addElement(new LensflareElement(flareTexture3, 70, 0.7));
      lensflare.addElement(new LensflareElement(flareTexture3, 120, 0.9));
      lensflare.addElement(new LensflareElement(flareTexture3, 70, 1.0));
      lightRef.current.add(lensflare);
    }
  }, [flareTexture, flareTexture2, flareTexture3]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time * 0.1) * 30;
    const y = Math.cos(time * 0.1) * 40;
    const z = -Math.cos(time * 0.1) * 30;
    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color={new THREE.Color().setHSL(0.995, 0.5, 0.9)}
      intensity={1.5}
      distance={2000}
    />
  );
};

const ThreeDBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 45 }}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <LightWithLensflare />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;

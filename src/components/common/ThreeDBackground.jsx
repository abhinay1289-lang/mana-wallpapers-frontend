import { Canvas } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';

const ThreeDBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <directionalLight color="#6366f1" position={[0, 0, 5]} />
        <TorusKnot args={[1, 0.4, 256, 32]} scale={1.2}>
          <meshStandardMaterial color="#6366f1" roughness={0.5} />
        </TorusKnot>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;

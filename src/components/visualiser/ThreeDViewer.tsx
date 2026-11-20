"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";

interface ThreeDViewerProps {
  wallTile: any;
  floorTile: any;
  groutColor: string;
  groutThickness: number;
  tileScale: number;
  dayNight: "day" | "night";
  tilePattern: string;
}

function RoomModel({ wallTile, floorTile, groutColor, groutThickness, tileScale, tilePattern }: Omit<ThreeDViewerProps, "dayNight">) {
  const [wallTex, setWallTex] = useState<THREE.Texture | null>(null);
  const [floorTex, setFloorTex] = useState<THREE.Texture | null>(null);

  // Load wall texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const url = wallTile?.images[0] || "/images/products/stone-1-front.svg";
    loader.load(url, (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      // Adjust repeat scale
      const rep = (10 / tileScale);
      tex.repeat.set(rep, rep);
      setWallTex(tex);
    });
  }, [wallTile, tileScale]);

  // Load floor texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const url = floorTile?.images[0] || "/images/products/stone-2-front.svg";
    loader.load(url, (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      const rep = (8 / tileScale);
      tex.repeat.set(rep, rep);
      setFloorTex(tex);
    });
  }, [floorTile, tileScale]);

  return (
    <group>
      {/* 1. Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          map={floorTex || undefined}
          color={floorTex ? "#ffffff" : "#cccccc"}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Back Wall */}
      <mesh position={[0, 3, -10]} receiveShadow castShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          map={wallTex || undefined}
          color={wallTex ? "#ffffff" : "#eaeaea"}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>

      {/* 3. Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10, 3, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          map={wallTex || undefined}
          color={wallTex ? "#ffffff" : "#eaeaea"}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>

      {/* Basic furniture block (Luxury Tub/Stand mockup) */}
      <mesh position={[0, -1, -5]} castShadow>
        <boxGeometry args={[4, 2, 2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
      </mesh>
    </group>
  );
}

export default function ThreeDViewer({
  wallTile,
  floorTile,
  groutColor,
  groutThickness,
  tileScale,
  dayNight,
  tilePattern,
}: ThreeDViewerProps) {
  const isNight = dayNight === "night";

  return (
    <div className="w-full h-full bg-slate-900 relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
        
        {/* Lights configurations */}
        <ambientLight intensity={isNight ? 0.15 : 0.45} />
        
        <directionalLight
          position={[5, 10, 5]}
          intensity={isNight ? 0.1 : 1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {isNight && (
          // Add luxury warm spot lights for night mood
          <group>
            <spotLight
              position={[0, 6, -3]}
              intensity={2.5}
              angle={Math.PI / 4}
              penumbra={0.5}
              color="#ffcc88"
              castShadow
            />
            <spotLight
              position={[-4, 6, 0]}
              intensity={1.5}
              angle={Math.PI / 4}
              penumbra={0.5}
              color="#ffcc88"
            />
          </group>
        )}

        <RoomModel
          wallTile={wallTile}
          floorTile={floorTile}
          groutColor={groutColor}
          groutThickness={groutThickness}
          tileScale={tileScale}
          tilePattern={tilePattern}
        />

        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.05} // don't go below floor
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-black/70 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md backdrop-blur-sm pointer-events-none">
        3D View Mode &bull; Orbit Active
      </div>
    </div>
  );
}

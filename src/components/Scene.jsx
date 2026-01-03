
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";


/* ---------- DATA ---------- */

function generateNodes(count) {
  const nodes = [];

  for (let i = 0; i < count; i++) {
    nodes.push({
      position: [
        THREE.MathUtils.randFloatSpread(6),
        THREE.MathUtils.randFloatSpread(4),
        THREE.MathUtils.randFloatSpread(4)
      ]
    });
  }

  return nodes;
}

/* ---------- COMPONENTS ---------- */

function Node({ position, interactive = false, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.scale.setScalar(
      1 + Math.sin(t) * (hovered ? 0.1 : 0.05)
    );
  });

  if (interactive) {
    // Nav node
    return (
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        cursor="pointer"
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#E6C27A" />
      </mesh>
    );
  }

  // Background node
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color="#E6C27A"
        emissive="#E6C27A"
        emissiveIntensity={hovered ? 0.6 : 0.3}
      />
    </mesh>
  );
}



function Connections({ nodes }) {
  const geometry = useMemo(() => {
    const positions = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = new THREE.Vector3(...nodes[i].position);
        const b = new THREE.Vector3(...nodes[j].position);

        if (a.distanceTo(b) < 1.5) {
          positions.push(...a.toArray(), ...b.toArray());
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    return geo;
  }, [nodes]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#B7A6F6"
        transparent
        opacity={0.25}
      />
    </lineSegments>
  );
}

function CameraController({ target, offset = new THREE.Vector3(0, 0, 3) }) {
  const { camera } = useThree();
  const desiredPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    // desiredPosition = target + offset
    desiredPosition.current.copy(target.current).add(offset);

    camera.position.lerp(desiredPosition.current, 0.1);
    camera.lookAt(target.current);
  });

  return null;
}




/* ---------- SCENE ---------- */

export default function Scene({ cameraTarget, setZoomed }) {
  const nodes = useMemo(() => generateNodes(40), []);
  const navNodes = [
    { label: "Projects", position: [2.5, 1.2, 0] },
    { label: "Achievements", position: [-2.8, 1.5, 0] },
    { label: "Blog", position: [2.2, -1.8, 0] },
    { label: "About", position: [-2.0, -1.4, 0] }
  ];

  return (
    <Canvas camera={{ position: [0, 0, 6] }} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} />
      <CameraController target={cameraTarget} />

      <Connections nodes={nodes} />
      {nodes.map((node, i) => (
        <Node key={i} position={node.position} />
      ))}

      {navNodes.map((node, i) => (
        <Node
          key={`nav-${i}`}
          position={node.position}
          interactive
          onClick={() => {
            cameraTarget.current.set(...node.position);
            setZoomed(true);
          }}
        />
      ))}
    </Canvas>
  );
}

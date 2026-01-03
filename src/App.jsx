import React, { useRef, useState } from "react";
import * as THREE from "three";

import { motion } from "framer-motion";
import Layout from "./components/Layout";
import Scene from "./components/Scene";


function App() {
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const homePosition = useRef(new THREE.Vector3(0, 0, 6));
  const [zoomed, setZoomed] = useState(false);

  const handleBack = () => {
    cameraTargetRef.current.copy(homePosition.current);
    setZoomed(false);
  };

  return (
    <Layout>
      {/* 3D Background */}
      <Scene
        cameraTarget={cameraTargetRef}
        setZoomed={setZoomed} 
      />

      {/* Foreground Content */}
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        Hi, I’m Tas.
      </motion.h1>

      <motion.p
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.2 }}
      >
        I build systems, stories, and communities
        <br />
        at the intersection of technology, neuroscience, and care.
      </motion.p>

      {/* 3️⃣ Back Button Overlay */}
      {zoomed && (
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "0.5rem 1rem",
            border: "1px solid #E6C27A",
            borderRadius: "8px",
            color: "#F4F1EC",
            cursor: "pointer",
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(11, 14, 20, 0.4)",
            transition: "0.3s",
            textAlign: "center",
          }}
          onClick={handleBack}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#B7A6F6")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E6C27A")}
        >
          Back
        </div>
      )}
    </Layout>
  );
}

export default App;

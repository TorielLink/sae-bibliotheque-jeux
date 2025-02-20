import React, { useRef, useEffect } from 'react';
import * as THREE from "three";
import { useTheme } from "@mui/material/styles";

const LoginBg = () => {
    const theme = useTheme();
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const shapesRef = useRef([]); // ✅ Stocke les formes pour éviter leur recréation
    const sceneRef = useRef(new THREE.Scene()); // ✅ Garde la même scène

    const colors = [
        theme.palette.colors.blue,
        theme.palette.colors.yellow,
        theme.palette.colors.red,
        theme.palette.colors.green,
        theme.palette.colors.purple
    ];

    function randomRelatif(n = 1) {
        return Math.random() * n * 2 - n;
    }

    function addShape(color1, color2, size, x, y) {
        const innerBoxSize = size * 0.75;
        const inner = new THREE.Mesh(
            new THREE.BoxGeometry(innerBoxSize, innerBoxSize, innerBoxSize),
            new THREE.MeshBasicMaterial({ color: color2 })
        );
        const outer = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshBasicMaterial({ color: color1 })
        );

        inner.position.set(x * window.innerWidth, y * window.innerHeight, 200);
        outer.position.set(x * window.innerWidth, y * window.innerHeight, 100);

        shapesRef.current.push({ inner, outer, rotX: randomRelatif(0.02), rotY: randomRelatif(0.02), rotZ: randomRelatif(0.02) });
        sceneRef.current.add(inner);
        sceneRef.current.add(outer);
    }

    function generateShapes() {
        if (shapesRef.current.length > 0) return; // ✅ Empêche de recréer les formes à chaque rendu

        sceneRef.current.background = new THREE.Color(theme.palette.background.default);
        const occShape = 0.5;

        for (let sx = 0; sx < window.innerWidth; sx += 200) {
            for (let sy = 0; sy < window.innerHeight; sy += 200) { // ✅ Fix de `innerWidth`
                if (Math.random() > occShape) {
                    const col = colors[Math.floor(Math.random() * colors.length)];
                    const size = 50 + Math.random() * 50;
                    const x = (sx + randomRelatif(30) - window.innerWidth / 2) / window.innerWidth;
                    const y = (sy + randomRelatif(30) - window.innerHeight / 2) / window.innerHeight;
                    addShape(col, theme.palette.background.paper, size, x, y);
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        shapesRef.current.forEach((shape) => {
            shape.inner.rotation.x += shape.rotX;
            shape.inner.rotation.y += shape.rotY;
            shape.inner.rotation.z += shape.rotZ;
            shape.outer.rotation.x += shape.rotX;
            shape.outer.rotation.y += shape.rotY;
            shape.outer.rotation.z += shape.rotZ;
        });
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;

        const camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            -1000,
            1000
        );
        camera.position.setZ(150);
        cameraRef.current = camera;

        generateShapes(); // ✅ Génère les formes une seule fois
        animate(); // ✅ Lance l'animation une seule fois

        return () => {
            renderer.dispose();
        };
    }, []); // ✅ Exécute seulement au premier rendu

    return <canvas id="bg" ref={canvasRef} style={{ position: "fixed", top: 0, left: 0 }}></canvas>;
};

export default LoginBg;

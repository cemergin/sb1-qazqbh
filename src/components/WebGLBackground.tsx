import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WebGLBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create a plane geometry
    const geometry = new THREE.PlaneGeometry(5, 5, 50, 50);

    // Create a shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
          vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
          float t = time * 0.1;
          
          for(int i = 1; i < 5; i++) {
            p.x += 0.3 / float(i) * sin(float(i) * 3.0 * p.y + t);
            p.y += 0.3 / float(i) * cos(float(i) * 3.0 * p.x + t);
          }
          
          float r = sin(p.x + p.y + 1.0) * 0.5 + 0.5;
          float g = sin(p.x + p.y + 2.0) * 0.5 + 0.5;
          float b = sin(p.x + p.y + 3.0) * 0.5 + 0.5;
          
          gl_FragColor = vec4(r, g * 1.5, b * 0.5, 0.3);
        }
      `,
      transparent: true,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 1;

    const animate = (time: number) => {
      requestAnimationFrame(animate);
      material.uniforms.time.value = time * 0.001;
      renderer.render(scene, camera);
    };

    animate(0);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default WebGLBackground;
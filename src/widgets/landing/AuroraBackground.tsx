"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    UnicornStudio?: { isInitialized: boolean; init: () => void };
  }
}

export function AuroraBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Layer 1: UnicornStudio ──────────────────────────────────────
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => {} };
      const s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.2/dist/unicornStudio.umd.js";
      s.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(s);
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }



    // ── Layer 2: Three.js particle mesh ────────────────────────────
    let rafId: number;
    let cleanup: (() => void) | null = null;

    import("three").then(
      ({
        WebGLRenderer,
        Scene,
        PerspectiveCamera,
        BufferGeometry,
        BufferAttribute,
        PointsMaterial,
        Points,
        AdditiveBlending,
        Timer,
      }) => {
        const container = mountRef.current;
        if (!container) return;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 30;

        const renderer = new WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
        container.appendChild(renderer.domElement);

        // 800 white particles
        const geo = new BufferGeometry();
        const pos = new Float32Array(800 * 3);
        for (let i = 0; i < 800 * 3; i++) pos[i] = (Math.random() - 0.5) * 60;
        geo.setAttribute("position", new BufferAttribute(pos, 3));

        const mat = new PointsMaterial({
          size: 0.05,
          color: "#ffffff",
          transparent: true,
          opacity: 0.15,
          blending: AdditiveBlending,
        });

        const mesh = new Points(geo, mat);
        scene.add(mesh);

        let tx = 0;
        let ty = 0;

        const onMouse = (e: MouseEvent) => {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", onMouse);

        const timer = new Timer();
        const tick = () => {
          rafId = requestAnimationFrame(tick);
          timer.update();
          const elapsed = timer.getElapsed();

          mesh.rotation.y = elapsed * 0.02;
          mesh.rotation.x = elapsed * 0.01;
          mesh.rotation.y += 0.015 * (tx * 0.05 - mesh.rotation.y);
          mesh.rotation.x += 0.015 * (ty * 0.05 - mesh.rotation.x);
          camera.position.x += (tx * 0.08 - camera.position.x) * 0.008;
          camera.position.y += (ty * 0.08 - camera.position.y) * 0.008;

          renderer.render(scene, camera);
        };
        tick();

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener("mousemove", onMouse);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          geo.dispose();
          mat.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        };
      }
    );

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div className="absolute inset-0" style={{ background: "#0A0A1A", overflow: "hidden" }}>
      {/* UnicornStudio aurora/curtain layer */}
      <div
        id="bg-unicorn"
        data-us-project="qO2hJSXvjk0iEIVJ5nim"
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
      {/* Gradient cover — hides UnicornStudio watermark (z-index > 99999999) */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "180px",
          background: "linear-gradient(to bottom, transparent 0%, #0A0A1A 50%)",
          zIndex: 100000000,
        }}
      />
      {/* Three.js particle canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

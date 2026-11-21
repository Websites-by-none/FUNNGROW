
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export default function GlassCube() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      mount.classList.add("glass-cube--unsupported");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // Environment reflections give the glass something to reflect.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    const environmentMap = pmrem.fromScene(environment, 0.04).texture;
    scene.environment = environmentMap;

    const geometry = new RoundedBoxGeometry(2.15, 2.15, 2.15, 8, 0.19);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#b4ffd9"),
      metalness: 0.02,
      roughness: 0.055,
      transmission: 1,
      thickness: 1.35,
      ior: 1.28,
      attenuationColor: new THREE.Color("#29b77b"),
      attenuationDistance: 2.4,
      clearcoat: 1,
      clearcoatRoughness: 0.045,
      envMapIntensity: 1.5,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // A subtle emerald outline catches the light around the glass edges.
    const edgeGeometry = new THREE.EdgesGeometry(geometry, 24);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: "#9dffd0",
      transparent: true,
      opacity: 0.42,
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    cube.add(edges);

    const ambient = new THREE.AmbientLight("#dffff0", 1.1);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.2);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const greenLight = new THREE.PointLight("#29b77b", 8, 9);
    greenLight.position.set(3, -2, 3);
    scene.add(greenLight);

    let width = 0;
    let height = 0;
    let frameId = 0;
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastTime = 0;

    const resize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.position.z = width < 500 ? 7 : 6;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      mount.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousX;
      const deltaY = event.clientY - previousY;

      cube.rotation.y += deltaX * 0.008;
      cube.rotation.x += deltaY * 0.008;

      velocityY = deltaX * 0.0008;
      velocityX = deltaY * 0.0008;

      previousX = event.clientX;
      previousY = event.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const render = (time: number) => {
      frameId = requestAnimationFrame(render);

      const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
      lastTime = time;

      if (!isDragging) {
        cube.rotation.y += velocityY * delta;
        cube.rotation.x += velocityX * delta;

        velocityX *= Math.pow(0.94, delta);
        velocityY *= Math.pow(0.94, delta);

        if (!prefersReducedMotion) {
          cube.rotation.y += 0.0025 * delta;
          cube.rotation.x += 0.0007 * delta;
        }
      }

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();

      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);

      geometry.dispose();
      material.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      environmentMap.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-glass-cube"
      role="img"
      aria-label="Interactive transparent emerald glass cube. Drag to rotate."
    />
  );
}

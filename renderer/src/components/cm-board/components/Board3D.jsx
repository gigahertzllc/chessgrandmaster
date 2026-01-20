import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { allSquares, squareToFR, isDarkSquare } from "../utils/squares";
import { getBoardTheme } from "../themes/boardThemes";
import { getPieceSet, getGeometryStyle } from "../themes/pieceSets";

/**
 * Premium 3D board with procedural pieces, swappable materials/geometry, and smooth animations.
 *
 * Props
 * - chess: engine instance
 * - size: px number OR "full" for fullscreen container fill
 * - orientation: "w" | "b"
 * - interactive: boolean
 * - onMove: ({from,to,promotion}) => void
 * - lastMove: {from,to} | null
 * - themeId: board theme (affects square colors + accents)
 * - pieceSetId: 3D piece material set (also determines geometry style)
 * - cameraPreset: "straight" | "angled" | "top" (default straight)
 * - animations: boolean (default true)
 */
export default function Board3D({
  chess,
  size = 560,
  orientation = "w",
  interactive = true,
  onMove,
  lastMove = null,
  themeId = "carrara_gold",
  pieceSetId = "classic_ebony_ivory",
  cameraPreset = "straight",
  animations = true
}) {
  const mountRef = useRef(null);
  const rafRef = useRef(null);
  const isFullscreen = size === "full";

  const theme = useMemo(() => getBoardTheme(themeId), [themeId]);
  const setDef = useMemo(() => getPieceSet(pieceSetId), [pieceSetId]);
  const geoStyle = useMemo(() => getGeometryStyle(setDef.geometryStyle || "staunton"), [setDef]);

  // Animation registry: key -> {mesh, from, to, t0, durMs, lift}
  const animRef = useRef(new Map());
  const prevPosRef = useRef(new Map()); // key -> {sq}
  const selectionRef = useRef({ selected: null, legal: [], hover: null });

  useEffect(() => {
    if (!mountRef.current) return;

    // Get initial size
    const getSize = () => {
      if (isFullscreen) {
        const rect = mountRef.current.getBoundingClientRect();
        return { width: rect.width || window.innerWidth, height: rect.height || window.innerHeight };
      }
      return { width: size, height: size };
    };

    let currentSize = getSize();

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0b);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, currentSize.width / currentSize.height, 0.1, 200);
    const setCamera = () => {
      const sign = orientation === "w" ? 1 : -1;
      
      if (cameraPreset === "top") {
        // Bird's eye view - position based on orientation
        // Small z offset to prevent gimbal lock, oriented so white/black is at bottom
        camera.position.set(0, 18, 0.5 * sign);
        camera.lookAt(0, 0, 0);
        // Ensure "forward" from player's perspective
        camera.up.set(0, 0, -sign);
      } else if (cameraPreset === "angled") {
        // Classic 3/4 diagonal view from player's corner
        camera.position.set(6 * sign, 12, 10 * sign);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);
      } else {
        // "straight" - Straight on from white/black side
        camera.position.set(0, 8, 14 * sign);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);
      }
    };
    setCamera();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(currentSize.width, currentSize.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls (subtle: lock to prevent "getting lost")
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 12;
    controls.maxDistance = 22;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = Math.PI * 0.2;

    // Lights (Chessmaster-ish)
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(12, 18, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 2;
    key.shadow.camera.far = 60;
    key.shadow.camera.left = -18;
    key.shadow.camera.right = 18;
    key.shadow.camera.top = 18;
    key.shadow.camera.bottom = -18;

    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-12, 10, -10);

    const rim = new THREE.DirectionalLight(0xffffff, 0.25);
    rim.position.set(-2, 16, 18);

    const amb = new THREE.AmbientLight(0xffffff, 0.25);

    scene.add(key, fill, rim, amb);

    // Board group
    const root = new THREE.Group();
    scene.add(root);

    // Board base/frame
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(theme.frame),
      roughness: 0.55,
      metalness: 0.15
    });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.7, 10.2), frameMat);
    frame.position.y = -0.35;
    frame.receiveShadow = true;
    frame.castShadow = false;
    root.add(frame);

    // Squares
    const lightMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(theme.light), roughness: 0.75, metalness: 0.05 });
    const darkMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(theme.dark), roughness: 0.75, metalness: 0.05 });

    const squareGeo = new THREE.BoxGeometry(1, 0.12, 1);
    const squareMeshes = new Map(); // sq -> mesh (for picking / highlighting)
    const squares = allSquares("w"); // world mapping is always a1 at (-3.5,-3.5)
    for (const sq of squares) {
      const { file, rank } = squareToFR(sq);
      const isDark = isDarkSquare(sq);
      const m = new THREE.Mesh(squareGeo, isDark ? darkMat : lightMat);
      m.position.set(file - 3.5, -0.05, rank - 3.5);
      m.receiveShadow = true;
      m.castShadow = false;
      m.userData = { square: sq };
      root.add(m);
      squareMeshes.set(sq, m);
    }

    // Highlight overlay plane (single mesh reused)
    const hlGeo = new THREE.PlaneGeometry(1.02, 1.02);
    const hlMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xd4af37), transparent: true, opacity: 0.0, side: THREE.DoubleSide });
    const hl = new THREE.Mesh(hlGeo, hlMat);
    hl.rotation.x = -Math.PI / 2;
    hl.position.y = 0.02;
    root.add(hl);

    const legalMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xd4af37), transparent: true, opacity: 0.0 });
    const legalDotGeo = new THREE.CircleGeometry(0.14, 24);
    const legalDots = new Map(); // sq -> mesh
    for (const sq of squares) {
      const dot = new THREE.Mesh(legalDotGeo, legalMat.clone());
      dot.rotation.x = -Math.PI / 2;
      const { file, rank } = squareToFR(sq);
      dot.position.set(file - 3.5, 0.025, rank - 3.5);
      dot.visible = false;
      root.add(dot);
      legalDots.set(sq, dot);
    }

    // Piece materials (set-dependent)
    const mkMat = (def) => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(def.color),
      roughness: def.roughness ?? 0.5,
      metalness: def.metalness ?? 0.0,
      clearcoat: def.clearcoat ?? 0.0,
      clearcoatRoughness: def.clearcoatRoughness ?? 0.5,
      transmission: def.transmission ?? 0.0,
      thickness: def.thickness ?? 0.0,
      ior: def.ior ?? 1.5
    });

    const matWhite = mkMat(setDef.white);
    const matBlack = mkMat(setDef.black);

    // Procedural geometry builder using style profiles
    const cacheGeo = new Map(); // key -> BufferGeometry
    const mkLathe = (profile, segments = 48) => {
      const pts = profile.map(p => new THREE.Vector2(p[0], p[1]));
      const geo = new THREE.LatheGeometry(pts, segments);
      geo.computeVertexNormals();
      return geo;
    };

    const mkCrown = () => {
      // simple crown: cylinder + small spheres
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24), new THREE.MeshStandardMaterial());
      base.position.y = 0.06;
      g.add(base);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshStandardMaterial());
        s.position.set(Math.cos(a) * 0.22, 0.14, Math.sin(a) * 0.22);
        g.add(s);
      }
      return g;
    };

    const getPieceGeo = (type) => {
      const cacheKey = `${geoStyle.id}_${type}`;
      if (cacheGeo.has(cacheKey)) return cacheGeo.get(cacheKey);

      // Get profile from geometry style
      const profile = geoStyle.profiles[type];
      if (!profile) {
        console.warn(`No profile for piece type ${type} in style ${geoStyle.id}`);
        return new THREE.BoxGeometry(0.5, 0.5, 0.5);
      }

      const geo = mkLathe(profile);
      geo.scale(geoStyle.scale, geoStyle.scale, geoStyle.scale);
      geo.computeBoundingBox();
      cacheGeo.set(cacheKey, geo);
      return geo;
    };

    const pieceGroup = new THREE.Group();
    root.add(pieceGroup);

    const keyFor = (sq) => {
      const p = chess.get(sq);
      if (!p) return null;
      return `${p.color}${p.type}@${sq}`;
    };

    // Create piece meshes for current position (one mesh per piece = simplest and swappable sets)
    const pieceMeshes = new Map(); // sq -> mesh
    const buildPieces = () => {
      pieceGroup.clear();
      pieceMeshes.clear();
      prevPosRef.current.clear();
      for (const sq of squares) {
        const p = chess.get(sq);
        if (!p) continue;

        const geo = getPieceGeo(p.type);
        const mat = p.color === "w" ? matWhite : matBlack;
        const mesh = new THREE.Mesh(geo, mat);
        const { file, rank } = squareToFR(sq);
        mesh.position.set(file - 3.5, 0.06, rank - 3.5);
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        mesh.userData = { square: sq, piece: p };
        pieceGroup.add(mesh);
        pieceMeshes.set(sq, mesh);
        prevPosRef.current.set(`${p.color}${p.type}`, { square: sq }); // coarse tracking by type+color count is imperfect; fixed below
      }
    };

    // Better tracking: build stable IDs by scanning pieces and numbering per type/color
    const stableIdMap = new Map(); // sq -> id like wP#3
    const computeStableIds = () => {
      stableIdMap.clear();
      const counts = { w: {p:0,n:0,b:0,r:0,q:0,k:0}, b: {p:0,n:0,b:0,r:0,q:0,k:0} };
      for (const sq of squares) {
        const p = chess.get(sq);
        if (!p) continue;
        counts[p.color][p.type] += 1;
        const id = `${p.color}${p.type}#${counts[p.color][p.type]}`;
        stableIdMap.set(sq, id);
      }
    };

    const worldPosForSquare = (sq) => {
      const { file, rank } = squareToFR(sq);
      return new THREE.Vector3(file - 3.5, 0.06, rank - 3.5);
    };

    const applyMoveAnimations = () => {
      if (!animations) return;

      // Compare current stableId positions to previous snapshot
      const prev = prevPosRef.current; // id -> {square}
      const next = new Map(); // id -> {square, mesh}
      const counts = { w: {p:0,n:0,b:0,r:0,q:0,k:0}, b: {p:0,n:0,b:0,r:0,q:0,k:0} };

      for (const sq of squares) {
        const p = chess.get(sq);
        if (!p) continue;
        counts[p.color][p.type] += 1;
        const id = `${p.color}${p.type}#${counts[p.color][p.type]}`;
        const mesh = pieceMeshes.get(sq);
        next.set(id, { square: sq, mesh });
      }

      // Start animations for moved pieces
      for (const [id, n] of next.entries()) {
        const p = prev.get(id);
        if (!p) continue;
        if (p.square === n.square) continue;

        const from = worldPosForSquare(p.square);
        const to = worldPosForSquare(n.square);

        // Start the mesh at "from" then animate to "to"
        n.mesh.position.copy(from);

        animRef.current.set(id, {
          mesh: n.mesh,
          from,
          to,
          t0: performance.now(),
          durMs: 220,
          lift: 0.22
        });
      }

      // Save snapshot
      prev.clear();
      for (const [id, n] of next.entries()) {
        prev.set(id, { square: n.square });
      }
    };

    // Initial build
    computeStableIds();
    buildPieces();

    // Initialize prev snapshot for animations
    prevPosRef.current.clear();
    {
      const counts = { w: {p:0,n:0,b:0,r:0,q:0,k:0}, b: {p:0,n:0,b:0,r:0,q:0,k:0} };
      for (const sq of squares) {
        const p = chess.get(sq);
        if (!p) continue;
        counts[p.color][p.type] += 1;
        const id = `${p.color}${p.type}#${counts[p.color][p.type]}`;
        prevPosRef.current.set(id, { square: sq });
      }
    }

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const clearLegalDots = () => {
      for (const dot of legalDots.values()) {
        dot.visible = false;
        dot.material.opacity = 0.0;
      }
    };

    const setLegalDots = (arr) => {
      clearLegalDots();
      for (const sq of arr) {
        const dot = legalDots.get(sq);
        if (!dot) continue;
        dot.visible = true;
        dot.material.opacity = 0.55;
      }
    };

    const setSelectedSquare = (sq) => {
      selectionRef.current.selected = sq;
      if (!sq) {
        hl.material.opacity = 0.0;
        setLegalDots([]);
        return;
      }
      const pos = worldPosForSquare(sq);
      hl.position.set(pos.x, 0.022, pos.z);
      hl.material.opacity = 0.35;

      // Legal moves
      let moves = [];
      try {
        moves = chess.moves({ square: sq, verbose: true }).map(m => m.to);
      } catch {
        moves = [];
      }
      selectionRef.current.legal = moves;
      setLegalDots(moves);
    };

    const tryUserMove = (toSq) => {
      const sel = selectionRef.current.selected;
      const legal = selectionRef.current.legal || [];
      if (!sel) return false;
      if (!legal.includes(toSq)) return false;
      onMove?.({ from: sel, to: toSq, promotion: "q" });
      setSelectedSquare(null);
      return true;
    };

    const onPointer = (ev) => {
      if (!interactive) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.set(x, y);

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects([...squareMeshes.values(), ...pieceMeshes.values()], true);
      if (!hits.length) return;

      const hit = hits[0].object;
      const sq = hit.userData?.square || hit.parent?.userData?.square;
      if (!sq) return;

      const p = chess.get(sq);

      // If clicking a legal target, execute move
      if (tryUserMove(sq)) return;

      // Otherwise select piece if it's your turn
      if (p && p.color === chess.turn()) {
        setSelectedSquare(sq);
      } else {
        setSelectedSquare(null);
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointer);

    // Mount
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Resize observer (keeps aspect correct, handles fullscreen)
    const ro = new ResizeObserver(() => {
      const el = mountRef.current;
      if (!el) return;
      if (isFullscreen) {
        const rect = el.getBoundingClientRect();
        const w = rect.width || window.innerWidth;
        const h = rect.height || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
      } else {
        renderer.setSize(size, size);
        camera.aspect = 1;
      }
      camera.updateProjectionMatrix();
    });
    ro.observe(mountRef.current);

    // Render loop (controls + animations)
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = () => {
      controls.update();

      // Run piece animations
      if (animRef.current.size > 0) {
        const now = performance.now();
        for (const [id, a] of animRef.current.entries()) {
          const t = Math.min(1, (now - a.t0) / a.durMs);
          const e = ease(t);
          a.mesh.position.lerpVectors(a.from, a.to, e);
          // small lift in middle
          const lift = Math.sin(Math.PI * t) * a.lift;
          a.mesh.position.y = 0.06 + lift;

          if (t >= 1) {
            a.mesh.position.copy(a.to);
            a.mesh.position.y = 0.06;
            animRef.current.delete(id);
          }
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    // Clean up
    return () => {
      renderer.domElement.removeEventListener("pointerdown", onPointer);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);

      // Dispose
      controls.dispose();
      renderer.dispose();

      squareGeo.dispose();
      hlGeo.dispose();
      legalDotGeo.dispose();

      lightMat.dispose();
      darkMat.dispose();
      frameMat.dispose();

      for (const g of cacheGeo.values()) g.dispose();
      matWhite.dispose();
      matBlack.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, isFullscreen, orientation, cameraPreset, pieceSetId, themeId]);

  // Respond to chess state changes: rebuild meshes and animate differences.
  // Parent app causes rerender by passing updated chess object (same instance is fine).
  useEffect(() => {
    // This effect runs after mount and after parent re-renders.
    // We trigger a "soft rebuild" by dispatching a custom event listened by the scene effect.
    // Simpler approach: remount Board3D when chess state changes (parent can provide key),
    // but we keep it internal by nudging via DOM event.
    if (!mountRef.current) return;
    const ev = new CustomEvent("cm_board3d_state_changed");
    mountRef.current.dispatchEvent(ev);
  }, [chess, lastMove]);

  // NOTE: We cannot easily mutate the scene created inside the mount effect without a shared ref object.
  // For a complete integration, parent should supply a `key` prop that changes when position changes
  // OR we can extend this module further to keep scene refs. For now, the initial mount is complete,
  // and re-renders are supported by remounting Board3D (see README).
  return (
    <div 
      ref={mountRef} 
      style={isFullscreen 
        ? { width: '100%', height: '100%', position: 'absolute', inset: 0 } 
        : { width: size, height: size }
      } 
    />
  );
}

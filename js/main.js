// 3. ESTADO GLOBAL DA APLICAÇÃO
    // ==========================================
    const appState = {
      currentView: 'purpose', // 'purpose' | 'builder' | 'summary'
      purpose: 'jogos',       // 'jogos' | 'trabalho' | 'hibrido' | 'livre'
      budget: 5000,
      viewerMode: 'hotspots', // 'hotspots' (Imagem 2) | '3d' (Imagem 3)
      activeSlotKey: 'cpu',
      modalCategoryKey: null,
      filterCompatibleOnly: false,
      selectedParts: {
        cpu: null,
        cooler: null,
        mobo: null,
        gpu: null,
        ram: null,
        ssd: null,
        case: null,
        psu: null
      }
    };

    const PURPOSE_LABELS = {
      jogos: 'Jogos (Performance Gamer)',
      trabalho: 'Trabalho e Produtividade',
      hibrido: 'Uso Doméstico, Híbrido e Estudos',
      livre: 'Monte do Seu Jeito (Livre)'
    };

    // ==========================================
    
const threeState = {
      initialized: false,
      scene: null,
      camera: null,
      renderer: null,
      caseGroup: null,
      partMeshes: {},
      animatedFans: [],
      pulsingMaterials: [],
      clock: null,
      isDragging: false,
      prevX: 0,
      prevY: 0,
      rotX: 0.16,
      rotY: -0.42,
      distance: 5.7
    };

    // 1. GERA MAPA DE REFLEXO DE ESTÚDIO (Faz o metal, vidro e cobre brilharem de verdade!)
    function createStudioEnvironment(renderer) {
      try {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0x090d16);

        const lightGeo = new THREE.PlaneGeometry(10, 10);
        const topPanel = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
        topPanel.position.set(0, 8, 0);
        topPanel.rotation.x = Math.PI / 2;
        envScene.add(topPanel);

        const purpleSoftbox = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide }));
        purpleSoftbox.position.set(-8, 3, 5);
        purpleSoftbox.lookAt(0, 0, 0);
        envScene.add(purpleSoftbox);

        const cyanSoftbox = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide }));
        cyanSoftbox.position.set(8, 2, 5);
        cyanSoftbox.lookAt(0, 0, 0);
        envScene.add(cyanSoftbox);

        const frontFill = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide }));
        frontFill.position.set(0, -4, 9);
        frontFill.lookAt(0, 0, 0);
        envScene.add(frontFill);

        const rt = pmremGenerator.fromScene(envScene, 0.04);
        pmremGenerator.dispose();
        return rt.texture;
      } catch (e) {
        return null;
      }
    }

    // 2. TEXTURA ULTRA DETALHADA DA PLACA-MÃE (Trilhas de cobre, soldas e serigrafia)
    function createHighResPCBTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Fundo PCB Preto Fosco Premium
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, 1024, 1024);

      // Malha sutil de fibra de vidro
      ctx.strokeStyle = '#111622';
      ctx.lineWidth = 1;
      for (let i = 0; i < 1024; i += 16) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
      }

      // Trilhas de barramento (Buses de dados da CPU para RAM e PCIe)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      for (let i = 0; i < 160; i++) {
        ctx.beginPath();
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        ctx.moveTo(x, y);
        const step = 40 + Math.random() * 120;
        ctx.lineTo(x + step, y + step);
        ctx.lineTo(x + step + 80, y + step);
        ctx.stroke();
      }

      // Trilhas douradas de áudio isoladas no canto inferior esquerdo
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(110, 620);
      ctx.lineTo(110, 980);
      ctx.stroke();

      // Pontos de solda SMD prateados
      ctx.fillStyle = '#64748b';
      for (let i = 0; i < 450; i++) {
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 3, 3);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    // 3. TEXTURAS DE DISPLAYS LCD E LOGOS (Cooler AIO, GPU e Fonte Digital)
    function createLabelCanvasTexture(type) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      if (type === 'aio-lcd') {
        canvas.height = 512;
        ctx.fillStyle = '#03050a';
        ctx.fillRect(0, 0, 512, 512);

        // Anéis de telemetria no LCD
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(256, 256, 200, -Math.PI * 0.7, Math.PI * 0.4);
        ctx.stroke();

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(256, 256, 178, Math.PI * 0.5, Math.PI * 1.2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 92px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('36°C', 256, 260);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('CPU LIQUID', 256, 315);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px monospace';
        ctx.fillText('4.85 GHz | 1240 RPM', 256, 360);
      } else if (type === 'gpu-side') {
        ctx.fillStyle = '#090c14';
        ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('GEFORCE RTX', 35, 148);
      } else if (type === 'psu-oled') {
        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, 0, 512, 256);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 8;
        ctx.strokeRect(12, 12, 488, 232);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 88px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('850W', 36, 130);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText('80 PLUS GOLD', 40, 195);

        // Gráfico de consumo na tela da PSU
        ctx.fillStyle = '#22c55e';
        [60, 95, 130, 85, 140, 110].forEach((bh, idx) => {
          ctx.fillRect(320 + idx * 24, 200 - bh, 16, bh);
        });
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    // 4. TEXTURA DE COLMEIA HEXAGONAL (Para grades e ventilação)
    function createHexMeshTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#141824';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#030407';
      for (let y = 6; y < 256; y += 10) {
        for (let x = 6; x < 256; x += 10) {
          ctx.beginPath();
          ctx.arc(x + (y % 20 === 6 ? 0 : 5), y, 3.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }

    // Geometria Chanfrada (Bevel)
    function createBeveledBox(w, h, d, bevel = 0.018) {
      const shape = new THREE.Shape();
      const hw = Math.max(0.004, w / 2 - bevel);
      const hh = Math.max(0.004, h / 2 - bevel);
      shape.moveTo(-hw, -hh);
      shape.lineTo(hw, -hh);
      shape.lineTo(hw, hh);
      shape.lineTo(-hw, hh);
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: Math.max(0.004, d - bevel * 2),
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: bevel,
        bevelThickness: bevel
      });
      geo.center();
      return geo;
    }

    // 5. VENTOINHA ARGB REALISTA (CORRIGIDA: Sem cilindro tapando as pás! Hélice 100% visível e iluminada)
    function createRealisticARGBFan(size, thickness, ledMat) {
      const fanGroup = new THREE.Group();
      const outerR = size * 0.46;

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x111520, roughness: 0.4, metalness: 0.5 });
      const rubberPadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });

      // Quatro cantos externos com amortecedores antivibração (Sem bloquear o centro!)
      const cornerSize = size * 0.25;
      const cornerPos = size * 0.365;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([cx, cy]) => {
        const corner = new THREE.Mesh(createBeveledBox(cornerSize, cornerSize, thickness, 0.01), frameMat);
        corner.position.set(cx * cornerPos, cy * cornerPos, 0);
        fanGroup.add(corner);

        // Furo de parafuso + amortecedor de borracha
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, thickness + 0.006, 12), rubberPadMat);
        pad.rotation.x = Math.PI / 2;
        pad.position.set(cx * (size * 0.41), cy * (size * 0.41), 0);
        fanGroup.add(pad);
      });

      // Anel estrutural do túnel de vento (Aberto no meio!)
      const tunnelWall = new THREE.Mesh(
        new THREE.CylinderGeometry(outerR, outerR, thickness, 32, 1, true),
        frameMat
      );
      tunnelWall.rotation.x = Math.PI / 2;
      fanGroup.add(tunnelWall);

      // Disco de fundo bem atrás para não colidir com as hélices + 4 hastes (Stators)
      const backPlate = new THREE.Mesh(
        new THREE.CircleGeometry(outerR, 32),
        new THREE.MeshStandardMaterial({ color: 0x06080e, roughness: 0.8, side: THREE.DoubleSide })
      );
      backPlate.position.z = -thickness * 0.46;
      fanGroup.add(backPlate);

      for (let s = 0; s < 4; s++) {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(outerR * 1.9, 0.018, 0.012), frameMat);
        strut.rotation.z = (s / 4) * Math.PI + 0.4;
        strut.position.z = -thickness * 0.40;
        fanGroup.add(strut);
      }

      // Halo Duplo ARGB (Frente e Verso + Filetes Laterais estilo Lian Li Infinity)
      const frontHalo = new THREE.Mesh(new THREE.TorusGeometry(outerR * 0.96, thickness * 0.14, 16, 40), ledMat);
      frontHalo.position.z = thickness * 0.44;
      fanGroup.add(frontHalo);

      const backHalo = new THREE.Mesh(new THREE.TorusGeometry(outerR * 0.96, thickness * 0.10, 12, 32), ledMat);
      backHalo.position.z = -thickness * 0.44;
      fanGroup.add(backHalo);

      // Grupo Rotor (Pás Translúcidas Iluminadas + Hub Espelho Infinito)
      const rotorGroup = new THREE.Group();
      rotorGroup.position.z = thickness * 0.06;

      // Motor Central (Hub)
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(outerR * 0.33, outerR * 0.33, thickness * 0.65, 24),
        new THREE.MeshStandardMaterial({ color: 0x161b26, roughness: 0.2, metalness: 0.85 })
      );
      hub.rotation.x = Math.PI / 2;
      rotorGroup.add(hub);

      // Espelho Infinito Central no Hub (Anel cromado + centro brilhante)
      const infinityRing = new THREE.Mesh(new THREE.RingGeometry(outerR * 0.16, outerR * 0.27, 24), ledMat);
      infinityRing.position.z = thickness * 0.34;
      rotorGroup.add(infinityRing);

      const infinityCenter = new THREE.Mesh(
        new THREE.CircleGeometry(outerR * 0.15, 24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.05 })
      );
      infinityCenter.position.z = thickness * 0.342;
      rotorGroup.add(infinityCenter);

      // 9 Pás Aerodinâmicas Translúcidas (Brilham suavemente com a luz interna!)
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, -0.015);
      bladeShape.quadraticCurveTo(outerR * 0.35, -0.055, outerR * 0.62, -0.025);
      bladeShape.lineTo(outerR * 0.62, 0.035);
      bladeShape.quadraticCurveTo(outerR * 0.32, 0.055, 0, 0.02);
      bladeShape.closePath();

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.008,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: 0.003,
        bevelThickness: 0.003
      });

      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        emissive: 0x64748b,
        emissiveIntensity: 0.28,
        roughness: 0.2,
        metalness: 0.15,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide
      });

      for (let i = 0; i < 9; i++) {
        const pivot = new THREE.Group();
        pivot.rotation.z = (i / 9) * Math.PI * 2;

        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.x = outerR * 0.26;
        blade.rotation.x = 0.48; // Inclinação real da pá para você enxergar a superfície dela de frente!
        pivot.add(blade);
        rotorGroup.add(pivot);
      }

      fanGroup.add(rotorGroup);
      threeState.animatedFans.push(rotorGroup);
      return fanGroup;
    }

    // 6. GERADOR DE CABOS SLEEVED FIO-A-FIO COM PENTES ORGANIZADORES (CABLE COMBS)
    function createSleevedCableBundle(pointsArray, strandCount, spacing, strandRadius, colorHex, accentMat) {
      const bundleGroup = new THREE.Group();
      const curve = new THREE.CatmullRomCurve3(pointsArray);
      const strandMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6, metalness: 0.15 });
      const combMat = new THREE.MeshStandardMaterial({ color: 0x05070c, roughness: 0.3, metalness: 0.5 });

      const totalWidth = (strandCount - 1) * spacing;
      for (let i = 0; i < strandCount; i++) {
        const offset = -totalWidth / 2 + i * spacing;
        const offsetPoints = pointsArray.map(p => new THREE.Vector3(p.x + offset, p.y, p.z));
        const strandCurve = new THREE.CatmullRomCurve3(offsetPoints);
        const tubeGeo = new THREE.TubeGeometry(strandCurve, 24, strandRadius, 8, false);
        const mesh = new THREE.Mesh(tubeGeo, (i % 3 === 1 && accentMat) ? accentMat : strandMat);
        bundleGroup.add(mesh);
      }

      // Adiciona 2 Pentes Organizadores (Cable Combs) ao longo do cabo
      [0.35, 0.7].forEach((t) => {
        const pt = curve.getPoint(t);
        const comb = new THREE.Mesh(new THREE.BoxGeometry(totalWidth + strandRadius * 3, 0.025, strandRadius * 3.2), combMat);
        comb.position.copy(pt);
        bundleGroup.add(comb);
      });

      return bundleGroup;
    }

    function initOrResizeThreeViewer() {
      const host = document.getElementById('threeCanvasHost');
      if (!host || typeof THREE === 'undefined') return;

      const width = host.clientWidth || 600;
      const height = host.clientHeight || 480;

      if (!threeState.initialized) {
        threeState.initialized = true;
        threeState.animatedFans = [];
        threeState.pulsingMaterials = [];
        threeState.clock = new THREE.Clock();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x05060d);

        const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if (THREE.ACESFilmicToneMapping) {
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.18;
        }
        host.innerHTML = '';
        host.appendChild(renderer.domElement);

        // Aplica Mapa de Reflexo de Estúdio na Cena (Essencial para realismo metálico!)
        const envMap = createStudioEnvironment(renderer);
        if (envMap) {
          scene.environment = envMap;
        }

        // Iluminação Cinematográfica Multi-Ponto
        const ambient = new THREE.AmbientLight(0xe2e8f0, 0.75);
        scene.add(ambient);

        const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.45);
        mainKeyLight.position.set(4.5, 6.5, 8);
        mainKeyLight.castShadow = true;
        mainKeyLight.shadow.mapSize.width = 2048;
        mainKeyLight.shadow.mapSize.height = 2048;
        mainKeyLight.shadow.bias = -0.0005;
        scene.add(mainKeyLight);

        const rimLightLeft = new THREE.DirectionalLight(0xa855f7, 1.1);
        rimLightLeft.position.set(-6, 3, 4);
        scene.add(rimLightLeft);

        const rimLightRight = new THREE.DirectionalLight(0x38bdf8, 1.1);
        rimLightRight.position.set(6, -1, 5);
        scene.add(rimLightRight);

        const interiorTopGlow = new THREE.PointLight(0xa855f7, 1.8, 5.5);
        interiorTopGlow.position.set(-0.1, 1.25, 0.1);
        scene.add(interiorTopGlow);

        const interiorBottomGlow = new THREE.PointLight(0x38bdf8, 1.4, 5.0);
        interiorBottomGlow.position.set(0.3, -0.5, 0.3);
        scene.add(interiorBottomGlow);

        const caseGroup = new THREE.Group();
        scene.add(caseGroup);

        // Plataforma / Piso de Estúdio com Grid Tecnológico
        const gridHelper = new THREE.GridHelper(10, 20, 0x6d28d9, 0x161e31);
        gridHelper.position.y = -1.78;
        caseGroup.add(gridHelper);

        // Texturas Procedurais
        const pcbTex = createHighResPCBTexture();
        const hexGrillTex = createHexMeshTexture();
        const aioLcdTex = createLabelCanvasTexture('aio-lcd');
        const gpuSideTex = createLabelCanvasTexture('gpu-side');
        const psuOledTex = createLabelCanvasTexture('psu-oled');

        // Materiais PBR de Alta Fidelidade
        const matteBlackSteel = new THREE.MeshStandardMaterial({ color: 0x0f131c, roughness: 0.48, metalness: 0.55 });
        const gunmetalAnodized = new THREE.MeshStandardMaterial({ color: 0x1e2536, roughness: 0.28, metalness: 0.82 });
        const brushedAluminum = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.22, metalness: 0.92 });
        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98 });
        const pureCopperMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.2, metalness: 0.92 });
        const goldContactMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.18, metalness: 0.95 });
        const hexMeshMat = new THREE.MeshStandardMaterial({ map: hexGrillTex, color: 0x181e2c, roughness: 0.7, metalness: 0.4 });

        function makeLedMat(hexColor, intensity = 1.0) {
          const mat = new THREE.MeshStandardMaterial({
            color: hexColor,
            emissive: hexColor,
            emissiveIntensity: intensity,
            roughness: 0.15
          });
          threeState.pulsingMaterials.push({ mat, baseIntensity: intensity });
          return mat;
        }

        // =========================================================================
        // 1. GABINETE PANORÂMICO DUAL-CHAMBER (ESTILO NZXT H9 / LIAN LI O11 VISION)
        // =========================================================================
        const caseLedMat = makeLedMat(0xa855f7, 0.95);
        const caseTopGroup = new THREE.Group();

        // Chapa Traseira Principal + Rebaixo para Fans Laterais
        const moboTray = new THREE.Mesh(createBeveledBox(2.74, 3.34, 0.08, 0.02), matteBlackSteel);
        moboTray.position.set(0, 0, -0.84);
        moboTray.receiveShadow = true;
        caseGroup.add(moboTray);

        // Passa-cabos Emborrachados com relevo (Cable Grommets)
        [0.62, 0.02, -0.52].forEach((gy) => {
          const grommetFrame = new THREE.Mesh(createBeveledBox(0.18, 0.44, 0.05, 0.01), gunmetalAnodized);
          grommetFrame.position.set(0.62, gy, -0.80);
          caseGroup.add(grommetFrame);

          const rubberSlit = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.06), new THREE.MeshStandardMaterial({ color: 0x06080c, roughness: 0.95 }));
          rubberSlit.position.set(0.62, gy, -0.80);
          caseGroup.add(rubberSlit);
        });

        // Parede Traseira Esquerda (Com grade colmeia, espelho I/O e 7 Slots PCIe)
        const rearWall = new THREE.Mesh(createBeveledBox(0.08, 3.34, 1.74, 0.02), matteBlackSteel);
        rearWall.position.set(-1.33, 0, 0);
        caseGroup.add(rearWall);

        // 7 Brackets de Expansão PCIe Ventilados na traseira esquerda
        for (let s = 0; s < 7; s++) {
          const pciCover = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.55), gunmetalAnodized);
          pciCover.position.set(-1.33, -0.02 - s * 0.09, -0.35);
          caseGroup.add(pciCover);
        }

        // Fan Traseira 120mm ARGB (Presa na parede esquerda, com pás 100% visíveis!)
        const rearExhaustFan = createRealisticARGBFan(0.64, 0.12, caseLedMat);
        rearExhaustFan.rotation.y = Math.PI / 2;
        rearExhaustFan.position.set(-1.22, 0.72, -0.22);
        caseGroup.add(rearExhaustFan);

        // Coluna Direita + Suporte para 3 Fans Intake ARGB (Visão Frontal/Lateral)
        const rightPillar = new THREE.Mesh(createBeveledBox(0.09, 3.34, 1.74, 0.02), matteBlackSteel);
        rightPillar.position.set(1.33, 0, 0);
        caseGroup.add(rightPillar);

        [0.92, 0.24, -0.44].forEach((fy) => {
          const sideFan = createRealisticARGBFan(0.64, 0.12, caseLedMat);
          sideFan.rotation.y = -Math.PI / 2;
          sideFan.position.set(1.21, fy, 0.04);
          caseGroup.add(sideFan);
        });

        // Teto do Gabinete com Filtro Mesh e Painel I/O Superior Detalhado (USB-C, USB 3.0, Botão Power LED)
        const topPanelMesh = new THREE.Mesh(createBeveledBox(2.76, 0.12, 1.78, 0.025), matteBlackSteel);
        topPanelMesh.position.set(0, 1.63, 0);
        caseTopGroup.add(topPanelMesh);

        const topMeshFilter = new THREE.Mesh(createBeveledBox(2.1, 0.03, 1.25, 0.01), hexMeshMat);
        topMeshFilter.position.set(-0.08, 1.69, 0);
        caseTopGroup.add(topMeshFilter);

        // Barra Difusora Neon Superior
        const topNeonBar = new THREE.Mesh(new THREE.BoxGeometry(2.64, 0.028, 0.035), caseLedMat);
        topNeonBar.position.set(0, 1.56, 0.85);
        caseTopGroup.add(topNeonBar);

        // Botão Power Iluminado + Portas USB Azuis no topo
        const powerRing = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.048, 20), caseLedMat);
        powerRing.rotation.x = -Math.PI / 2;
        powerRing.position.set(1.08, 1.695, 0.65);
        caseTopGroup.add(powerRing);

        [0.42, 0.28].forEach((uz) => {
          const usbPort = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.01, 0.07), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
          usbPort.position.set(1.08, 1.692, uz);
          caseTopGroup.add(usbPort);
        });

        caseTopGroup.userData.accentMaterials = [caseLedMat];
        caseGroup.add(caseTopGroup);

        // PSU Shroud (Cobertura Inferior da Fonte com Grade Superior, Passa-cabo da GPU e Fita Neon)
        const shroudTop = new THREE.Mesh(createBeveledBox(2.68, 0.06, 1.72, 0.015), gunmetalAnodized);
        shroudTop.position.set(0, -0.88, 0);
        shroudTop.receiveShadow = true;
        caseGroup.add(shroudTop);

        const shroudVent = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.065, 0.65), hexMeshMat);
        shroudVent.position.set(-0.2, -0.88, 0.15);
        caseGroup.add(shroudVent);

        const shroudFront = new THREE.Mesh(createBeveledBox(2.68, 0.74, 0.08, 0.015), matteBlackSteel);
        shroudFront.position.set(0, -1.26, 0.82);
        caseGroup.add(shroudFront);

        const bottomNeonBar = new THREE.Mesh(new THREE.BoxGeometry(2.64, 0.028, 0.035), caseLedMat);
        bottomNeonBar.position.set(0, -0.88, 0.86);
        caseGroup.add(bottomNeonBar);

        // Pés Cromados de Amplificador Hi-Fi com base de borracha
        [[-1.14, -0.68], [1.14, -0.68], [-1.14, 0.68], [1.14, 0.68]].forEach(([fx, fz]) => {
          const footMetal = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.11, 24), chromeMat);
          footMetal.position.set(fx, -1.68, fz);
          caseGroup.add(footMetal);
        });

        // Painel de Vidro Temperado Cristalino com Borda Chanfrada e Reflexo
        const glassPanel = new THREE.Mesh(
          new THREE.PlaneGeometry(2.62, 3.10),
          new THREE.MeshStandardMaterial({
            color: 0xe0f2fe,
            transparent: true,
            opacity: 0.06,
            roughness: 0.02,
            metalness: 0.95
          })
        );
        glassPanel.position.set(0, 0.04, 0.88);
        caseGroup.add(glassPanel);

        [[-1.21, 1.45], [1.21, 1.45], [-1.21, -1.38], [1.21, -1.38]].forEach(([sx, sy]) => {
          const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.05, 16), chromeMat);
          screw.rotation.x = Math.PI / 2;
          screw.position.set(sx, sy, 0.89);
          caseGroup.add(screw);
        });

        // =========================================================================
        // 2. PLACA-MÃE Z790 / X670E FLAGSHIP (COM BOBINAS VRM, CABOS 24-PIN, ÁUDIO)
        // =========================================================================
        const moboGroup = new THREE.Group();
        moboGroup.position.set(-0.24, 0.28, -0.76);
        const moboLedMat = makeLedMat(0x38bdf8, 0.9);

        // PCB Texturizado de Alta Resolução
        const pcbMesh = new THREE.Mesh(
          createBeveledBox(1.56, 1.88, 0.05, 0.015),
          new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.42, metalness: 0.3 })
        );
        pcbMesh.receiveShadow = true;
        moboGroup.add(pcbMesh);

        // Armadura Traseira I/O + VRM Heatsink com Aletas Usinadas e Painel Espelhado RGB
        const vrmLeftHeatsink = new THREE.Mesh(createBeveledBox(0.30, 0.96, 0.17, 0.015), gunmetalAnodized);
        vrmLeftHeatsink.position.set(-0.56, 0.38, 0.08);
        moboGroup.add(vrmLeftHeatsink);

        // Ranhuras metálicas no VRM Esquerdo
        for (let r = 0; r < 6; r++) {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.015, 0.18), brushedAluminum);
          fin.position.set(-0.56, 0.05 + r * 0.12, 0.08);
          moboGroup.add(fin);
        }

        const vrmInfiniteStrip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.78, 0.182), moboLedMat);
        vrmInfiniteStrip.position.set(-0.54, 0.38, 0.08);
        moboGroup.add(vrmInfiniteStrip);

        // Dissipador VRM Superior + Heatpipe de Cobre Conectando os Dois VRMs
        const vrmTopHeatsink = new THREE.Mesh(createBeveledBox(0.74, 0.22, 0.15, 0.015), gunmetalAnodized);
        vrmTopHeatsink.position.set(-0.04, 0.76, 0.07);
        moboGroup.add(vrmTopHeatsink);

        const vrmTopAcrylic = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.16), moboLedMat);
        vrmTopAcrylic.position.set(-0.04, 0.76, 0.07);
        moboGroup.add(vrmTopAcrylic);

        // Fileira de 12 Bobinas de Ferrite (Chokes) + Capacitores Sólidos ao redor do Socket
        for (let c = 0; c < 7; c++) {
          const choke = new THREE.Mesh(createBeveledBox(0.055, 0.055, 0.05, 0.006), gunmetalAnodized);
          choke.position.set(-0.37, 0.14 + c * 0.072, 0.04);
          moboGroup.add(choke);

          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.055, 12), chromeMat);
          cap.rotation.x = Math.PI / 2;
          cap.position.set(-0.31, 0.14 + c * 0.072, 0.04);
          moboGroup.add(cap);
        }

        // Conectores Duplos 8-Pin EPS de CPU no topo esquerdo + Cabos Sleeved
        [-0.62, -0.48].forEach((ex) => {
          const epsPlug = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.08), matteBlackSteel);
          epsPlug.position.set(ex, 0.90, 0.05);
          moboGroup.add(epsPlug);
        });

        // 4 Slots DDR5 com Travas Metálicas nas pontas
        [0.24, 0.31, 0.38, 0.45].forEach((rx) => {
          const slot = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.72, 0.055), brushedAluminum);
          slot.position.set(rx, 0.36, 0.04);
          moboGroup.add(slot);

          [0.37, -0.37].forEach((ly) => {
            const latch = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.075), chromeMat);
            latch.position.set(rx, 0.36 + ly, 0.045);
            moboGroup.add(latch);
          });
        });

        // Cabo Principal ATX 24-Pinos Fio a Fio curvando para o passa-cabos!
        const atxSocket = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.38, 0.08), matteBlackSteel);
        atxSocket.position.set(0.68, 0.34, 0.05);
        moboGroup.add(atxSocket);

        const mobo24PinCables = createSleevedCableBundle(
          [
            new THREE.Vector3(0.68, 0.34, 0.07),
            new THREE.Vector3(0.78, 0.34, 0.16),
            new THREE.Vector3(0.86, 0.34, 0.06),
            new THREE.Vector3(0.86, 0.34, -0.06)
          ],
          12, 0.028, 0.012, 0x1e293b, moboLedMat
        );
        // Rotaciona os fios na vertical ao longo do conector 24-pin
        mobo24PinCables.rotation.z = Math.PI / 2;
        mobo24PinCables.position.set(1.02, -0.34, 0);
        moboGroup.add(mobo24PinCables);

        // 3 Slots PCIe x16 com Armadura de Aço Inox
        [-0.22, -0.56, -0.78].forEach((py, idx) => {
          const pcie = new THREE.Mesh(createBeveledBox(0.96, 0.055, 0.065, 0.008), idx === 0 ? chromeMat : gunmetalAnodized);
          pcie.position.set(-0.10, py, 0.045);
          moboGroup.add(pcie);
        });

        // Armadura M.2 Inferior + Dissipador do Chipset com Iluminação Diagonal
        const m2BottomArmor = new THREE.Mesh(createBeveledBox(0.88, 0.26, 0.07, 0.012), gunmetalAnodized);
        m2BottomArmor.position.set(-0.12, -0.39, 0.045);
        moboGroup.add(m2BottomArmor);

        const chipsetBlock = new THREE.Mesh(createBeveledBox(0.46, 0.42, 0.09, 0.015), gunmetalAnodized);
        chipsetBlock.position.set(0.44, -0.52, 0.05);
        moboGroup.add(chipsetBlock);

        const chipsetNeon = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.045, 0.095), moboLedMat);
        chipsetNeon.rotation.z = -0.38;
        chipsetNeon.position.set(0.44, -0.52, 0.05);
        moboGroup.add(chipsetNeon);

        // Capacitores de Áudio Dourados Hi-Fi no canto inferior esquerdo + Bateria CMOS
        for (let a = 0; a < 4; a++) {
          const audioCap = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.045, 12), goldContactMat);
          audioCap.rotation.x = Math.PI / 2;
          audioCap.position.set(-0.68, -0.55 - a * 0.07, 0.04);
          moboGroup.add(audioCap);
        }

        const cmosBattery = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.025, 24), chromeMat);
        cmosBattery.rotation.x = Math.PI / 2;
        cmosBattery.position.set(-0.48, -0.06, 0.035);
        moboGroup.add(cmosBattery);

        // Display Post Code Q-LED de 2 dígitos no topo direito da placa-mãe
        const postCodeBox = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.04), matteBlackSteel);
        postCodeBox.position.set(0.64, 0.82, 0.04);
        moboGroup.add(postCodeBox);

        const postCodeDigits = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.045), makeLedMat(0xef4444, 1.1));
        postCodeDigits.position.set(0.64, 0.82, 0.04);
        moboGroup.add(postCodeDigits);

        moboGroup.userData.accentMaterials = [moboLedMat];
        caseGroup.add(moboGroup);

        // =========================================================================
        // 3. PROCESSADOR (SOCKET LGA/AM5 + TRAVA CROMADA + IHS DETALHADO)
        // =========================================================================
        const cpuGroup = new THREE.Group();
        cpuGroup.position.set(-0.28, 0.64, -0.71);
        const cpuLedMat = makeLedMat(0xf97316, 0.85);

        const socketFrame = new THREE.Mesh(createBeveledBox(0.46, 0.46, 0.035, 0.01), gunmetalAnodized);
        cpuGroup.add(socketFrame);

        // Alavanca de Retenção Cromada do Socket
        const retentionArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.48, 8), chromeMat);
        retentionArm.position.set(0.25, 0, 0.02);
        cpuGroup.add(retentionArm);

        const cpuPcb = new THREE.Mesh(
          createBeveledBox(0.38, 0.38, 0.035, 0.008),
          new THREE.MeshStandardMaterial({ color: 0x0d5c3a, roughness: 0.35, metalness: 0.4 })
        );
        cpuPcb.position.z = 0.022;
        cpuGroup.add(cpuPcb);

        // Heatspreader (IHS) de Níquel Polido com abas recortadas
        const cpuIhsMain = new THREE.Mesh(createBeveledBox(0.30, 0.30, 0.048, 0.012), chromeMat);
        cpuIhsMain.position.z = 0.042;
        cpuGroup.add(cpuIhsMain);

        const cpuLedRing = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.19, 4), cpuLedMat);
        cpuLedRing.rotation.z = Math.PI / 4;
        cpuLedRing.position.z = 0.045;
        cpuGroup.add(cpuLedRing);

        cpuGroup.userData.accentMaterials = [cpuLedMat];
        caseGroup.add(cpuGroup);

        // =========================================================================
        // 4. COOLER DE CPU (HÍBRIDO AIO LIQUID COOLER COM TELA LCD + RADIADOR 360MM)
        // =========================================================================
        const coolerGroup = new THREE.Group();
        coolerGroup.position.set(-0.28, 0.64, -0.52);
        const coolerLedMat = makeLedMat(0xa855f7, 0.95);

        // Base de Cobre (Coldplate) + Suporte de Montagem Cromado
        const coldplate = new THREE.Mesh(createBeveledBox(0.44, 0.44, 0.06, 0.01), pureCopperMat);
        coldplate.position.z = -0.12;
        coolerGroup.add(coldplate);

        // Corpo Cilíndrico da Bomba / Bloco com Aletas Laterais Usinadas
        const pumpHousing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.30, 0.28, 36),
          gunmetalAnodized
        );
        pumpHousing.rotation.x = Math.PI / 2;
        pumpHousing.position.z = 0.02;
        coolerGroup.add(pumpHousing);

        // Anel ARGB Luminoso ao redor do Display LCD
        const pumpHalo = new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.022, 16, 40), coolerLedMat);
        pumpHalo.position.z = 0.16;
        coolerGroup.add(pumpHalo);

        // Tela LCD Circular de Alta Definição ("36°C CPU LIQUID")
        const lcdScreen = new THREE.Mesh(
          new THREE.CircleGeometry(0.25, 36),
          new THREE.MeshBasicMaterial({ map: aioLcdTex })
        );
        lcdScreen.position.z = 0.168;
        coolerGroup.add(lcdScreen);

        // 2 Conexões Rotativas Cromadas (Fittings 90°) + Mangueiras Trançadas (Sleeved AIO Tubes)
        [-0.08, 0.08].forEach((ty, idx) => {
          const fitting = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.08, 16), chromeMat);
          fitting.rotation.z = Math.PI / 2;
          fitting.position.set(0.29, ty, 0.02);
          coolerGroup.add(fitting);

          // Curva suave 3D da mangueira subindo até o radiador no teto do gabinete!
          const tubeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.31, ty, 0.02),
            new THREE.Vector3(0.52, ty + 0.05, 0.28 - idx * 0.08),
            new THREE.Vector3(0.68, 0.38, 0.36 - idx * 0.10),
            new THREE.Vector3(0.78, 0.78, 0.22 - idx * 0.08)
          ]);
          const aioTube = new THREE.Mesh(
            new THREE.TubeGeometry(tubeCurve, 32, 0.030, 12, false),
            new THREE.MeshStandardMaterial({ color: 0x111520, roughness: 0.65, metalness: 0.2 })
          );
          coolerGroup.add(aioTube);

          // Pente duplo prendendo as duas mangueiras do Water Cooler
          if (idx === 0) {
            const tubeClip = new THREE.Mesh(createBeveledBox(0.08, 0.18, 0.09, 0.01), chromeMat);
            tubeClip.position.set(0.60, 0.18, 0.28);
            coolerGroup.add(tubeClip);
          }
        });

        // Radiador Superior de 360mm no Teto + 3 Fans ARGB Empurrando o Ar!
        const topRadiatorGroup = new THREE.Group();
        topRadiatorGroup.position.set(0.22, 0.84, 0.42);

        const radBody = new THREE.Mesh(createBeveledBox(1.96, 0.12, 0.68, 0.015), matteBlackSteel);
        topRadiatorGroup.add(radBody);

        const radSideAccent = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.025, 0.69), coolerLedMat);
        topRadiatorGroup.add(radSideAccent);

        [-0.62, 0, 0.62].forEach((rx) => {
          const radFan = createRealisticARGBFan(0.60, 0.09, coolerLedMat);
          radFan.rotation.x = Math.PI / 2;
          radFan.position.set(rx, -0.10, 0);
          topRadiatorGroup.add(radFan);
        });

        coolerGroup.add(topRadiatorGroup);
        coolerGroup.userData.accentMaterials = [coolerLedMat];
        caseGroup.add(coolerGroup);

        // =========================================================================
        // 5. MEMÓRIA RAM (4 PENTES DDR5 TRIDENT-Z / DOMINATOR STYLE)
        // =========================================================================
        const ramGroup = new THREE.Group();
        ramGroup.position.set(0.11, 0.64, -0.60);
        const ramLedMat = makeLedMat(0x2dd4bf, 1.05);

        [-0.105, -0.035, 0.035, 0.105].forEach((rx, idx) => {
          const stick = new THREE.Group();
          stick.position.x = rx;

          // Dissipador de Alumínio Anodizado com Recorte Prateado
          const spreader = new THREE.Mesh(createBeveledBox(0.038, 0.68, 0.15, 0.006), gunmetalAnodized);
          stick.add(spreader);

          const chromeWing = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.28, 0.06), chromeMat);
          chromeWing.position.set(0, 0.04, 0.02);
          stick.add(chromeWing);

          // Barra Difusora Cristalina Superior com Divisórias de LED (Estilo Dominator Titanium)
          const lightBar = new THREE.Mesh(createBeveledBox(0.042, 0.70, 0.055, 0.008), ramLedMat);
          lightBar.position.z = 0.095;
          stick.add(lightBar);

          [-0.20, 0, 0.20].forEach((by) => {
            const divider = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.018, 0.06), matteBlackSteel);
            divider.position.set(0, by, 0.095);
            stick.add(divider);
          });

          ramGroup.add(stick);
        });

        ramGroup.userData.accentMaterials = [ramLedMat];
        caseGroup.add(ramGroup);

        // =========================================================================
        // 6. PLACA DE VÍDEO FLAGSHIP (RTX 4090 SUPRIM / STRIX TRIPLE-FAN + SUPORTE)
        // =========================================================================
        const gpuGroup = new THREE.Group();
        gpuGroup.position.set(-0.04, -0.02, -0.32);
        const gpuLedMat = makeLedMat(0x22c55e, 0.95);

        // Espelho Metálico Traseiro (I/O Bracket preso no gabinete à esquerda)
        const ioBracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.68), chromeMat);
        ioBracket.position.set(-0.88, -0.02, 0);
        gpuGroup.add(ioBracket);

        // Pilha Real de 36 Aletas Verticais de Alumínio no Radiador da GPU!
        const gpuFinGeo = new THREE.BoxGeometry(0.012, 0.20, 0.68);
        for (let f = -18; f <= 18; f++) {
          const gFin = new THREE.Mesh(gpuFinGeo, brushedAluminum);
          gFin.position.set(f * 0.042, 0, 0);
          gpuGroup.add(gFin);
        }

        // 4 Heatpipes de Níquel Cromado Atravessando toda a extensão da GPU
        [-0.06, -0.02, 0.02, 0.06].forEach((hy) => {
          const nPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.66, 12), chromeMat);
          nPipe.rotation.z = Math.PI / 2;
          nPipe.position.set(0, hy, 0.335);
          gpuGroup.add(nPipe);
        });

        // Carenagem Superior e Inferior Chanfrada em Metal Escovado e Gunmetal
        const shroudUpper = new THREE.Mesh(createBeveledBox(1.72, 0.07, 0.74, 0.015), gunmetalAnodized);
        shroudUpper.position.y = 0.11;
        gpuGroup.add(shroudUpper);

        const shroudLower = new THREE.Mesh(createBeveledBox(1.72, 0.07, 0.74, 0.015), gunmetalAnodized);
        shroudLower.position.y = -0.11;
        gpuGroup.add(shroudLower);

        // Backplate Metálico Usinado com Recorte de Exaustão e Capacitor Array central
        const backplateMain = new THREE.Mesh(createBeveledBox(1.70, 0.025, 0.72, 0.008), matteBlackSteel);
        backplateMain.position.y = 0.155;
        gpuGroup.add(backplateMain);

        // Detalhe do Core Bracket (Cruz metálica atrás do chip da GPU no Backplate)
        const gpuCoreBracket = new THREE.Mesh(createBeveledBox(0.28, 0.03, 0.28, 0.005), chromeMat);
        gpuCoreBracket.position.set(-0.32, 0.158, 0);
        gpuGroup.add(gpuCoreBracket);

        const gpuCoreCap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.034, 0.16), goldContactMat);
        gpuCoreCap.position.set(-0.32, 0.158, 0);
        gpuGroup.add(gpuCoreCap);

        // Recorte Flow-Through no Backplate deixando ver as aletas prateadas
        const flowThroughGrill = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.03, 0.48), hexMeshMat);
        flowThroughGrill.position.set(0.46, 0.156, 0);
        gpuGroup.add(flowThroughGrill);

        // Painel Lateral com Badge "GEFORCE RTX" + Barra ARGB Cristalina
        const rtxBadge = new THREE.Mesh(
          new THREE.PlaneGeometry(0.52, 0.12),
          new THREE.MeshBasicMaterial({ map: gpuSideTex })
        );
        rtxBadge.position.set(-0.18, 0.08, 0.372);
        gpuGroup.add(rtxBadge);

        const gpuRgbMainBar = new THREE.Mesh(createBeveledBox(0.86, 0.042, 0.03, 0.008), gpuLedMat);
        gpuRgbMainBar.position.set(0.28, 0.09, 0.372);
        gpuGroup.add(gpuRgbMainBar);

        // Chevrons Luminosos ARGB na lateral esquerda da GPU
        [-0.68, -0.58, -0.48].forEach((lx) => {
          const slash = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.14, 0.025), gpuLedMat);
          slash.rotation.z = 0.42;
          slash.position.set(lx, 0.02, 0.372);
          gpuGroup.add(slash);
        });

        // 3 Ventoinhas Axial-Tech na parte inferior (Totalmente visíveis quando olhado de baixo!)
        [-0.54, 0, 0.54].forEach((gx) => {
          const gFan = createRealisticARGBFan(0.48, 0.055, gpuLedMat);
          gFan.rotation.x = Math.PI / 2;
          gFan.position.set(gx, -0.145, 0);
          gpuGroup.add(gFan);
        });

        // Conector 12VHPWR (16-Pin) + Cabo Sleeved Fio-a-Fio Curvado com Pentes Organizadores!
        const pwrHeader = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.09), matteBlackSteel);
        pwrHeader.position.set(0.48, 0.08, 0.36);
        gpuGroup.add(pwrHeader);

        const gpuSleevedCable = createSleevedCableBundle(
          [
            new THREE.Vector3(0.48, 0.06, 0.40),
            new THREE.Vector3(0.48, -0.10, 0.52),
            new THREE.Vector3(0.48, -0.45, 0.46),
            new THREE.Vector3(0.48, -0.86, 0.32)
          ],
          8, 0.022, 0.011, 0x0f172a, gpuLedMat
        );
        gpuGroup.add(gpuSleevedCable);

        // Suporte Vertical Telescópico Anti-Sag (Segurando o canto direito da GPU na PSU Shroud!)
        const sagStandGroup = new THREE.Group();
        sagStandGroup.position.set(0.76, -0.50, 0.28);

        const sagBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.06, 20), gunmetalAnodized);
        sagBase.position.y = -0.33;
        sagStandGroup.add(sagBase);

        const sagPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.68, 16), chromeMat);
        sagStandGroup.add(sagPillar);

        const sagLedStrip = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.56, 0.07), gpuLedMat);
        sagStandGroup.add(sagLedStrip);

        const sagArm = new THREE.Mesh(createBeveledBox(0.14, 0.035, 0.12, 0.008), gunmetalAnodized);
        sagArm.position.set(-0.04, 0.34, 0);
        sagStandGroup.add(sagArm);

        gpuGroup.add(sagStandGroup);

        gpuGroup.userData.accentMaterials = [gpuLedMat];
        caseGroup.add(gpuGroup);

        // =========================================================================
        // 7. SSD NVMe M.2 GEN5 (COM DISSIPADOR ALETA DUPLA E LED)
        // =========================================================================
        const ssdGroup = new THREE.Group();
        ssdGroup.position.set(-0.34, 0.14, -0.70);
        const ssdLedMat = makeLedMat(0x38bdf8, 0.9);

        const ssdPcb = new THREE.Mesh(
          createBeveledBox(0.58, 0.17, 0.025, 0.005),
          new THREE.MeshStandardMaterial({ color: 0x090d14, roughness: 0.5 })
        );
        ssdGroup.add(ssdPcb);

        const ssdArmor = new THREE.Mesh(createBeveledBox(0.48, 0.16, 0.06, 0.01), gunmetalAnodized);
        ssdArmor.position.set(-0.02, 0, 0.035);
        ssdGroup.add(ssdArmor);

        // Ranhuras metálicas no dissipador do SSD
        [-0.04, 0.04].forEach((sy) => {
          const groove = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.015, 0.065), brushedAluminum);
          groove.position.set(-0.02, sy, 0.035);
          ssdGroup.add(groove);
        });

        const ssdNeonBar = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.03, 0.068), ssdLedMat);
        ssdNeonBar.position.set(-0.02, 0, 0.036);
        ssdGroup.add(ssdNeonBar);

        const ssdGoldEdge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.13, 0.028), goldContactMat);
        ssdGoldEdge.position.set(0.28, 0, 0);
        ssdGroup.add(ssdGoldEdge);

        ssdGroup.userData.accentMaterials = [ssdLedMat];
        caseGroup.add(ssdGroup);

        // =========================================================================
        // 8. FONTE DE ALIMENTAÇÃO (PSU ROG THOR / CORSAIR COM VISOR OLED DIGITAL)
        // =========================================================================
        const psuGroup = new THREE.Group();
        psuGroup.position.set(-0.46, -1.26, 0.05);
        const psuLedMat = makeLedMat(0xf59e0b, 0.95);

        const psuBody = new THREE.Mesh(createBeveledBox(1.30, 0.60, 1.56, 0.02), gunmetalAnodized);
        psuGroup.add(psuBody);

        // Recorte da Janela na PSU Shroud com Moldura Chanfrada Cromada
        const psuWindowFrame = new THREE.Mesh(createBeveledBox(1.12, 0.46, 0.05, 0.012), matteBlackSteel);
        psuWindowFrame.position.set(0, 0, 0.78);
        psuGroup.add(psuWindowFrame);

        // Tela OLED Digital Real ("850W 80 PLUS GOLD" + Gráfico de Barras)
        const psuOledScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(0.56, 0.28),
          new THREE.MeshBasicMaterial({ map: psuOledTex })
        );
        psuOledScreen.position.set(0.20, 0, 0.81);
        psuGroup.add(psuOledScreen);

        // Filete Luminoso ARGB contornando o visor da Fonte
        const psuNeonTrim = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.025, 0.06), psuLedMat);
        psuNeonTrim.position.set(0.20, 0.16, 0.805);
        psuGroup.add(psuNeonTrim);

        // Ventoinha ARGB Visível no lado esquerdo da janela da Fonte
        const psuVisibleFan = createRealisticARGBFan(0.36, 0.05, psuLedMat);
        psuVisibleFan.position.set(-0.30, 0, 0.79);
        psuGroup.add(psuVisibleFan);

        psuGroup.userData.accentMaterials = [psuLedMat];
        caseGroup.add(psuGroup);

        // Salva as referências mantendo 100% de compatibilidade com o seu código original
        threeState.scene = scene;
        threeState.camera = camera;
        threeState.renderer = renderer;
        threeState.caseGroup = caseGroup;
        threeState.partMeshes = {
          mobo: moboGroup,
          cpu: cpuGroup,
          cooler: coolerGroup,
          ram: ramGroup,
          gpu: gpuGroup,
          ssd: ssdGroup,
          psu: psuGroup,
          case: caseTopGroup
        };

        // Controles de rotação e zoom no Canvas 3D
        const dom = renderer.domElement;
        dom.addEventListener('pointerdown', (e) => {
          threeState.isDragging = true;
          threeState.prevX = e.clientX;
          threeState.prevY = e.clientY;
        });
        window.addEventListener('pointerup', () => {
          threeState.isDragging = false;
        });
        window.addEventListener('pointermove', (e) => {
          if (!threeState.isDragging) return;
          const dx = e.clientX - threeState.prevX;
          const dy = e.clientY - threeState.prevY;
          threeState.prevX = e.clientX;
          threeState.prevY = e.clientY;
          threeState.rotY += dx * 0.008;
          threeState.rotX = Math.max(-0.48, Math.min(0.68, threeState.rotX + dy * 0.008));
        });
        dom.addEventListener('wheel', (e) => {
          e.preventDefault();
          threeState.distance = Math.max(3.4, Math.min(8.8, threeState.distance + e.deltaY * 0.003));
        }, { passive: false });

        // Botões de clique rápido sobre o 3D
        const slotBtnsContainer = document.getElementById('threeSlotButtons');
        if (slotBtnsContainer && typeof COMPONENT_SLOTS !== 'undefined') {
          slotBtnsContainer.innerHTML = '';
          COMPONENT_SLOTS.forEach((slot) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-600 text-[11px] font-bold text-slate-200 border border-white/10 transition';
            b.textContent = `+ ${slot.shortTitle}`;
            b.addEventListener('click', () => openCatalogModal(slot.key));
            slotBtnsContainer.appendChild(b);
          });
        }

        function animate3D() {
          requestAnimationFrame(animate3D);
          if (threeState.caseGroup && threeState.camera && threeState.renderer) {
            const elapsed = threeState.clock ? threeState.clock.getElapsedTime() : 0;

            // Rotação suave e contínua de todas as 11 ventoinhas do PC (Traseira, Laterais, Radiador, GPU e Fonte)
            threeState.animatedFans.forEach((fanBlades, idx) => {
              fanBlades.rotation.z -= (idx % 2 === 0 ? 0.11 : 0.09);
            });

            // Respiração sutil da iluminação ARGB (Efeito Gamer Realista)
            threeState.pulsingMaterials.forEach((item, idx) => {
              const wave = Math.sin(elapsed * 2.5 + idx * 0.7) * 0.15;
              item.mat.emissiveIntensity = Math.max(0.4, item.baseIntensity + wave);
            });

            threeState.caseGroup.rotation.y = threeState.rotY;
            threeState.caseGroup.rotation.x = threeState.rotX;
            threeState.camera.position.set(0, 0.12, threeState.distance);
            threeState.camera.lookAt(0, 0, 0);
            threeState.renderer.render(threeState.scene, threeState.camera);
          }
        }
        animate3D();
      } else {
        threeState.camera.aspect = width / height;
        threeState.camera.updateProjectionMatrix();
        threeState.renderer.setSize(width, height);
      }

      update3DSceneMeshes();
    }

    function update3DSceneMeshes() {
      if (!threeState.initialized) return;
      const s = appState.selectedParts;
      Object.keys(threeState.partMeshes).forEach((key) => {
        const meshOrGroup = threeState.partMeshes[key];
        if (!meshOrGroup) return;

        const part = s[key];

        if (key === 'case') {
          if (part && part.corHex && meshOrGroup.userData.accentMaterials) {
            meshOrGroup.userData.accentMaterials.forEach((mat) => {
              mat.color.set(part.corHex);
              if (mat.emissive) mat.emissive.set(part.corHex);
            });
          }
          return;
        }

        if (part && part.id !== 'gpu-integrada') {
          meshOrGroup.visible = true;
          if (part.corHex && meshOrGroup.userData && meshOrGroup.userData.accentMaterials) {
            meshOrGroup.userData.accentMaterials.forEach((mat) => {
              mat.color.set(part.corHex);
              if (mat.emissive) mat.emissive.set(part.corHex);
            });
          }
        } else {
          meshOrGroup.visible = false;
        }
      });
    }
    

    // ==========================================
    // 10. UTILITÁRIOS (TOAST, COPIAR RESUMO E EVENTOS)
    // ==========================================
    let toastTimer = null;
    function showToast(message) {
      const toast = document.getElementById('toastNotification');
      document.getElementById('toastText').textContent = message;
      toast.classList.remove('hidden');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
      }, 3200);
    }

    function copyBuildToClipboard() {
      const report = evaluateBuild(appState.selectedParts, appState.budget);
      const lines = [
        `=== SIMULADOR DE MONTAGEM DE PC ===`,
        `Finalidade: ${PURPOSE_LABELS[appState.purpose]}`,
        `Orçamento: ${formatCurrency(appState.budget)} | Total: ${formatCurrency(report.totalCost)}`,
        `Consumo Estimado (c/ margem): ${report.recommendedWatts}W`,
        `-----------------------------------`
      ];
      COMPONENT_SLOTS.forEach((slot) => {
        const p = appState.selectedParts[slot.key];
        lines.push(`${slot.label}: ${p ? `${p.nome} (${formatCurrency(p.preco)})` : 'Não selecionado'}`);
      });
      if (report.issues.length > 0) {
        lines.push(`ALERTAS: ${report.issues.map((i) => i.text).join(' | ')}`);
      } else {
        lines.push(`STATUS: 100% Compatível!`);
      }

      const text = lines.join('\n');
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Resumo da configuração copiado para a área de transferência!');
      } catch (err) {
        showToast('Configuração pronta!');
      }
      document.body.removeChild(ta);
    }

    // ==========================================
    // 11. INICIALIZAÇÃO DE EVENT LISTENERS
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
      // Navegação do Header
      document.getElementById('btnLogoHome').addEventListener('click', () => switchView('purpose'));
      document.getElementById('navStepPurpose').addEventListener('click', () => switchView('purpose'));
      document.getElementById('navStepBuilder').addEventListener('click', () => switchView('builder'));
      document.getElementById('navStepSummary').addEventListener('click', () => switchView('summary'));

      // Inputs de Orçamento (Sincronizados)
      const numInput = document.getElementById('budgetNumberInput');
      const rangeInput = document.getElementById('budgetRangeInput');

      numInput.addEventListener('input', () => {
        const v = Math.max(1000, Number(numInput.value || 5000));
        appState.budget = v;
        rangeInput.value = Math.min(15000, Math.max(1800, v));
        renderAll();
      });

      rangeInput.addEventListener('input', () => {
        const v = Number(rangeInput.value || 5000);
        appState.budget = v;
        numInput.value = v;
        renderAll();
      });

      document.querySelectorAll('.budget-preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = Number(btn.getAttribute('data-budget-preset'));
          appState.budget = val;
          numInput.value = val;
          rangeInput.value = val;
          renderAll();
          showToast(`Orçamento ajustado para ${formatCurrency(val)}`);
        });
      });

      // Clique nos 4 Cards de Finalidade (Tela 1 -> Tela 2)
      document.querySelectorAll('[data-purpose-card]').forEach((card) => {
        card.addEventListener('click', () => {
          const selectedPurpose = card.getAttribute('data-purpose-card');
          appState.purpose = selectedPurpose;

          document.querySelectorAll('[data-purpose-card]').forEach((c) => c.classList.remove('active-purpose'));
          card.classList.add('active-purpose');

          switchView('builder');
          showToast(`Modo "${PURPOSE_LABELS[selectedPurpose]}" selecionado!`);
        });
      });

      // Botões da Tela 2 (Builder)
      document.getElementById('btnBackToPurpose').addEventListener('click', () => switchView('purpose'));
      document.getElementById('btnGoToSummary').addEventListener('click', () => switchView('summary'));
      document.getElementById('btnOpenTestScenarios').addEventListener('click', () => switchView('summary'));

      document.getElementById('btnAutoFillProfile').addEventListener('click', () => {
        const target = appState.purpose === 'livre' ? 'jogos' : appState.purpose;
        loadPresetBuild(target);
        showToast('Configuração sugerida carregada no gabinete!');
      });

      document.getElementById('btnClearBuild').addEventListener('click', () => {
        Object.keys(appState.selectedParts).forEach((k) => {
          appState.selectedParts[k] = null;
        });
        resetCabinetZoom();
        renderAll();
        showToast('Gabinete esvaziado.');
      });

      // Alternância entre Modo Hotspots (Imagem 2) e Modo 3D (Imagem 3)
      const btnHotspots = document.getElementById('btnModeHotspots');
      const btn3D = document.getElementById('btnMode3D');
      const contHotspots = document.getElementById('cabinetHotspotContainer');
      const cont3D = document.getElementById('cabinet3DContainer');
      const viewerTitle = document.getElementById('cabinetViewerTitle');

      btnHotspots.addEventListener('click', () => {
        appState.viewerMode = 'hotspots';
        contHotspots.classList.remove('hidden');
        cont3D.classList.add('hidden');
        viewerTitle.textContent = 'INSPEÇÃO ÓPTICA DO GABINETE (CLIQUE NA PEÇA PARA ESCOLHER)';
        btnHotspots.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 transition';
        btn3D.className = 'px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition';
      });

      btn3D.addEventListener('click', () => {
        appState.viewerMode = '3d';
        contHotspots.classList.add('hidden');
        cont3D.classList.remove('hidden');
        viewerTitle.textContent = 'VISUALIZADOR 3D DO GABINETE (INTERIOR REAL)';
        btn3D.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-purple-600/30 text-purple-200 border border-purple-500/40 transition';
        btnHotspots.className = 'px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition';
        initOrResizeThreeViewer();
      });

      document.getElementById('btnResetCamera').addEventListener('click', () => {
        resetCabinetZoom();
      });

      document.getElementById('btnInspectorOpenCatalog').addEventListener('click', () => {
        openCatalogModal(appState.activeSlotKey || 'cpu');
      });

      // Modal de Catálogo
      document.getElementById('btnCloseCatalogModal').addEventListener('click', closeCatalogModal);
      document.getElementById('catalogModal').addEventListener('click', (e) => {
        if (e.target.id === 'catalogModal') closeCatalogModal();
      });

      document.getElementById('chkFilterCompatible').addEventListener('change', (e) => {
        appState.filterCompatibleOnly = e.target.checked;
        renderCatalogModalCards();
      });

      // Modal Como Funciona
      document.getElementById('btnHowItWorks').addEventListener('click', () => {
        document.getElementById('howItWorksModal').classList.remove('hidden');
      });
      document.getElementById('btnCloseHowItWorks').addEventListener('click', () => {
        document.getElementById('howItWorksModal').classList.add('hidden');
      });
      document.getElementById('btnGotItHowItWorks').addEventListener('click', () => {
        document.getElementById('howItWorksModal').classList.add('hidden');
      });

      // Botões da Tela 3 (Resumo e Cenários de Teste)
      document.getElementById('btnBackToBuilderFromSummary').addEventListener('click', () => switchView('builder'));
      document.getElementById('btnCopyBuildSummary').addEventListener('click', copyBuildToClipboard);

      document.querySelectorAll('.scenario-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const sc = btn.getAttribute('data-test-scenario');
          loadTestScenario(sc);
        });
      });

      window.addEventListener('resize', () => {
        if (appState.currentView === 'builder' && appState.viewerMode === '3d') {
          initOrResizeThreeViewer();
        }
      });

      renderAll();
    });
  
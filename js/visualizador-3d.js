/**
 * Visualizador 3D de Gabinete Gamer — Konoha Hardware
 * 
 * IMPORTANTE: Conforme especificação do projeto, este visualizador 3D existe
 * EXCLUSIVAMENTE na aba "PCs Gamer". Nenhuma outra aba instancia ou exibe objetos 3D.
 * 
 * Funcionalidades:
 * - Girar o gabinete em 360° (arrastar com mouse ou toque).
 * - Aproximar e afastar (scroll do mouse ou botões de zoom).
 * - Alternar a visualização interna conforme o nível do PC Gamer (Entrada, Intermediário, Avançado).
 */

(() => {
let cena = null;
let camera = null;
let renderizador = null;
let grupoGabinete = null;
let grupoInternoDinamico = null;
let ventoinhasAnimadas = [];
let animacaoFrameId = null;
let inicializado = false;
let giroAutomatico = true;

// Estado de controle orbital simples (rotação e zoom)
const estadoOrbita = {
  arrastando: false,
  ultimoX: 0,
  ultimoY: 0,
  rotacaoY: -0.55,
  rotacaoX: 0.18,
  distancia: 6.2,
  distanciaMin: 3.8,
  distanciaMax: 9.0
};

/**
 * Inicializa o visualizador 3D dentro do container exclusivo da aba "PCs Gamer".
 */
window.Konoha = window.Konoha || {};

function inicializarVisualizador3DGamer(containerId, statusId) {
  const container = document.getElementById(containerId);
  const statusEl = document.getElementById(statusId);
  if (!container) return;

  if (inicializado && renderizador) {
    ajustarTamanhoVisualizador(container);
    return;
  }

  // Verifica disponibilidade da biblioteca Three.js e suporte WebGL
  if (typeof window.THREE === 'undefined') {
    if (statusEl) {
      statusEl.textContent = 'Visualizador 3D pendente: biblioteca WebGL (Three.js) não pôde ser carregada sem conexão.';
      statusEl.classList.add('alerta-pendencia-3d');
    }
    return;
  }

  const THREE = window.THREE;

  try {
    cena = new THREE.Scene();
    cena.background = new THREE.Color(0x16191e);

    const largura = container.clientWidth || 640;
    const altura = container.clientHeight || 420;

    camera = new THREE.PerspectiveCamera(40, largura / altura, 0.1, 100);
    atualizarPosicaoCamera();

    renderizador = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderizador.setSize(largura, altura);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = '';
    container.appendChild(renderizador.domElement);

    // Iluminação limpa e equilibrada (sem exageros neon)
    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.75);
    cena.add(luzAmbiente);

    const luzDirecionalPrincipal = new THREE.DirectionalLight(0xffffff, 0.9);
    luzDirecionalPrincipal.position.set(5, 8, 6);
    cena.add(luzDirecionalPrincipal);

    const luzComplementar = new THREE.DirectionalLight(0xff8533, 0.35);
    luzComplementar.position.set(-5, 3, -4);
    cena.add(luzComplementar);

    // Base discreta sob o gabinete
    const geometriaBase = new THREE.CylinderGeometry(2.3, 2.5, 0.08, 48);
    const materialBase = new THREE.MeshStandardMaterial({
      color: 0x20242b,
      roughness: 0.8,
      metalness: 0.2
    });
    const malhaBase = new THREE.Mesh(geometriaBase, materialBase);
    malhaBase.position.y = -1.95;
    cena.add(malhaBase);

    // Anel sutil laranja na plataforma (referência discreta à paleta Naruto)
    const geometriaAnel = new THREE.RingGeometry(2.15, 2.23, 48);
    const materialAnel = new THREE.MeshBasicMaterial({
      color: 0xff6b00,
      side: THREE.DoubleSide
    });
    const malhaAnel = new THREE.Mesh(geometriaAnel, materialAnel);
    malhaAnel.rotation.x = Math.PI / 2;
    malhaAnel.position.y = -1.90;
    cena.add(malhaAnel);

    // Constrói a estrutura 3D do Gabinete Gamer Mid-Tower
    grupoGabinete = new THREE.Group();
    cena.add(grupoGabinete);

    construirEstruturaFixaGabinete(THREE, grupoGabinete);

    grupoInternoDinamico = new THREE.Group();
    grupoGabinete.add(grupoInternoDinamico);

    // Carrega configuração padrão (Intermediário)
    atualizarPreset3DGamer({
      corLedHex: '#ff6b00',
      labelNivel: 'Nível Intermediário — Mid-Tower (RTX 4060 + Air Cooler Tower)',
      tipoCooler: 'air-tower',
      tamanhoGpu: 'dual-fan'
    });

    configurarEventosInteracao(container);
    window.addEventListener('resize', () => ajustarTamanhoVisualizador(container));

    inicializado = true;
    iniciarLoopRenderizacao();
  } catch (erro) {
    console.error('Erro ao iniciar visualizador 3D:', erro);
    if (statusEl) {
      statusEl.textContent = 'Visualizador 3D indisponível neste dispositivo (WebGL desativado).';
    }
  }
}

/**
 * Constrói o chassi metálico, painel frontal mesh, fonte shroud, placa-mãe e vidro temperado.
 */
function construirEstruturaFixaGabinete(THREE, grupo) {
  ventoinhasAnimadas = [];

  const matAcoEscuro = new THREE.MeshStandardMaterial({
    color: 0x1e2229,
    roughness: 0.55,
    metalness: 0.6
  });

  const matAcoInterno = new THREE.MeshStandardMaterial({
    color: 0x15181d,
    roughness: 0.7,
    metalness: 0.4
  });

  const matPlacaMae = new THREE.MeshStandardMaterial({
    color: 0x222730,
    roughness: 0.5,
    metalness: 0.3
  });

  const matDetalheLaranja = new THREE.MeshStandardMaterial({
    color: 0xff6b00,
    roughness: 0.35,
    metalness: 0.2
  });

  // Dimensões do gabinete: Largura (Z) = 1.8, Altura (Y) = 3.5, Profundidade (X) = 3.1
  // Painel superior e inferior
  const topo = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.1, 1.8), matAcoEscuro);
  topo.position.set(0, 1.7, 0);
  grupo.add(topo);

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.12, 1.8), matAcoEscuro);
  base.position.set(0, -1.7, 0);
  grupo.add(base);

  // 4 Pés de borracha
  const geoPe = new THREE.CylinderGeometry(0.14, 0.14, 0.16, 16);
  const posPes = [
    [-1.25, -1.84, -0.68],
    [1.25, -1.84, -0.68],
    [-1.25, -1.84, 0.68],
    [1.25, -1.84, 0.68]
  ];
  posPes.forEach(([px, py, pz]) => {
    const pe = new THREE.Mesh(geoPe, matAcoInterno);
    pe.position.set(px, py, pz);
    grupo.add(pe);
  });

  // Lateral traseira fechada (Z negativo)
  const lateralDireita = new THREE.Mesh(new THREE.BoxGeometry(3.08, 3.3, 0.06), matAcoEscuro);
  lateralDireita.position.set(0, 0, -0.87);
  grupo.add(lateralDireita);

  // Bandeja interna da Placa-mãe
  const bandejaMobo = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.1, 0.05), matAcoInterno);
  bandejaMobo.position.set(-0.05, 0.05, -0.55);
  grupo.add(bandejaMobo);

  // Painel traseiro (X negativo)
  const painelTraseiro = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.3, 1.76), matAcoInterno);
  painelTraseiro.position.set(-1.52, 0, 0);
  grupo.add(painelTraseiro);

  // PSU Shroud (Cobertura da Fonte na parte inferior)
  const psuShroud = new THREE.Mesh(new THREE.BoxGeometry(2.98, 0.72, 1.38), matAcoInterno);
  psuShroud.position.set(0, -1.3, -0.15);
  grupo.add(psuShroud);

  // Faixa discreta laranja no PSU Shroud
  const faixaLaranja = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.05, 0.02), matDetalheLaranja);
  faixaLaranja.position.set(0, -1.02, 0.55);
  grupo.add(faixaLaranja);

  // Placa-mãe ATX instalada na bandeja
  const pcbPlacaMae = new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.05, 0.06), matPlacaMae);
  pcbPlacaMae.position.set(-0.35, 0.52, -0.49);
  grupo.add(pcbPlacaMae);

  // Dissipadores de VRM na placa-mãe
  const vrmEsq = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.14), matAcoEscuro);
  vrmEsq.position.set(-1.05, 0.95, -0.43);
  grupo.add(vrmEsq);

  // 2 Módulos de Memória RAM
  const matRam = new THREE.MeshStandardMaterial({ color: 0xff6b00, roughness: 0.3, metalness: 0.4 });
  for (let i = 0; i < 2; i++) {
    const penteRam = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.62, 0.14), matRam);
    penteRam.position.set(0.12 + i * 0.09, 0.92, -0.42);
    grupo.add(penteRam);
  }

  // Painel Frontal Mesh (X positivo)
  const molduraFrontal = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.38, 1.8), matAcoEscuro);
  molduraFrontal.position.set(1.52, 0, 0);
  grupo.add(molduraFrontal);

  // 3 Ventoinhas Frontais de 120mm e 1 Traseira
  const posicoesFans = [
    { x: 1.44, y: 1.0, z: 0 },
    { x: 1.44, y: 0.0, z: 0 },
    { x: 1.44, y: -1.0, z: 0 },
    { x: -1.44, y: 0.95, z: -0.1 }
  ];

  posicoesFans.forEach((pos) => {
    const grupoFan = criarVentoinha3D(THREE);
    grupoFan.position.set(pos.x, pos.y, pos.z);
    grupoFan.rotation.z = Math.PI / 2;
    grupo.add(grupoFan);
    ventoinhasAnimadas.push(grupoFan);
  });

  // Painel Lateral em Vidro Temperado Transparente (Z positivo)
  const matVidro = new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    transparent: true,
    opacity: 0.18,
    roughness: 0.1,
    metalness: 0.1
  });
  const vidroLateral = new THREE.Mesh(new THREE.BoxGeometry(2.96, 3.24, 0.03), matVidro);
  vidroLateral.position.set(0, 0, 0.88);
  grupo.add(vidroLateral);

  // 4 Parafusos de fixação do vidro temperado
  const geoParafuso = new THREE.CylinderGeometry(0.045, 0.045, 0.06, 12);
  geoParafuso.rotateX(Math.PI / 2);
  const posParafusos = [
    [-1.36, 1.48, 0.90],
    [1.36, 1.48, 0.90],
    [-1.36, -1.48, 0.90],
    [1.36, -1.48, 0.90]
  ];
  posParafusos.forEach(([px, py, pz]) => {
    const p = new THREE.Mesh(geoParafuso, matDetalheLaranja);
    p.position.set(px, py, pz);
    grupo.add(p);
  });
}

/**
 * Cria uma ventoinha 3D com aro iluminado discreto e hélices rotativas.
 */
function criarVentoinha3D(THREE) {
  const fanGroup = new THREE.Group();

  const geoAro = new THREE.TorusGeometry(0.42, 0.035, 12, 28);
  geoAro.rotateX(Math.PI / 2);
  const matAro = new THREE.MeshBasicMaterial({ color: 0xff6b00 });
  const aro = new THREE.Mesh(geoAro, matAro);
  fanGroup.add(aro);

  const matHelice = new THREE.MeshStandardMaterial({ color: 0x2c323d, roughness: 0.4 });
  const centro = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16), matHelice);
  fanGroup.add(centro);

  for (let i = 0; i < 7; i++) {
    const pa = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.09), matHelice);
    const angulo = (i / 7) * Math.PI * 2;
    pa.position.set(Math.cos(angulo) * 0.22, 0, Math.sin(angulo) * 0.22);
    pa.rotation.y = -angulo;
    pa.rotation.z = 0.35;
    fanGroup.add(pa);
  }

  return fanGroup;
}

/**
 * Atualiza os componentes internos do gabinete 3D (Cooler e GPU) de acordo com o nível selecionado.
 */
function atualizarPreset3DGamer(preset) {
  if (!grupoInternoDinamico || typeof window.THREE === 'undefined') return;
  const THREE = window.THREE;

  // Limpa malhas anteriores do grupo dinâmico
  while (grupoInternoDinamico.children.length > 0) {
    grupoInternoDinamico.remove(grupoInternoDinamico.children[0]);
  }

  const corDestaque = new THREE.Color(preset?.corLedHex || '#ff6b00');

  // 1. Placa de Vídeo (GPU Dual Fan ou Triple Fan)
  const comprimentoGpu = preset?.tamanhoGpu === 'triple-fan' ? 2.15 : 1.55;
  const posXGpU = preset?.tamanhoGpu === 'triple-fan' ? -0.25 : -0.52;

  const matCorpoGpu = new THREE.MeshStandardMaterial({
    color: 0x262b35,
    roughness: 0.4,
    metalness: 0.5
  });
  const corpoGpu = new THREE.Mesh(new THREE.BoxGeometry(comprimentoGpu, 0.24, 0.78), matCorpoGpu);
  corpoGpu.position.set(posXGpU, 0.02, -0.05);
  grupoInternoDinamico.add(corpoGpu);

  // Faixa lateral iluminada na GPU (GEFORCE RTX / RADEON)
  const matFaixaGpu = new THREE.MeshBasicMaterial({ color: corDestaque });
  const faixaGpu = new THREE.Mesh(new THREE.BoxGeometry(comprimentoGpu * 0.65, 0.05, 0.02), matFaixaGpu);
  faixaGpu.position.set(posXGpU, 0.04, 0.35);
  grupoInternoDinamico.add(faixaGpu);

  // 2. Sistema de Refrigeração do Processador (Cooler Box, Air Tower ou Water Cooler 240mm)
  const posCpu = { x: -0.42, y: 0.92, z: -0.25 };

  if (preset?.tipoCooler === 'water-240') {
    // Bloco bomba sobre a CPU com anel laranja
    const blocoBomba = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.22, 24),
      new THREE.MeshStandardMaterial({ color: 0x1b1f26, roughness: 0.3 })
    );
    blocoBomba.rotation.x = Math.PI / 2;
    blocoBomba.position.set(posCpu.x, posCpu.y, posCpu.z);
    grupoInternoDinamico.add(blocoBomba);

    const anelBomba = new THREE.Mesh(
      new THREE.RingGeometry(0.14, 0.19, 24),
      new THREE.MeshBasicMaterial({ color: corDestaque, side: THREE.DoubleSide })
    );
    anelBomba.position.set(posCpu.x, posCpu.y, posCpu.z + 0.12);
    grupoInternoDinamico.add(anelBomba);

    // Radiador superior de 240mm
    const radiador = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.18, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x161920, roughness: 0.6 })
    );
    radiador.position.set(-0.15, 1.52, -0.05);
    grupoInternoDinamico.add(radiador);
  } else if (preset?.tipoCooler === 'air-tower') {
    // Torre de alumínio Air Cooler 120mm (DeepCool AK400)
    const torreDissipador = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.68, 0.56),
      new THREE.MeshStandardMaterial({ color: 0x2d333f, roughness: 0.35, metalness: 0.7 })
    );
    torreDissipador.position.set(posCpu.x, posCpu.y, posCpu.z + 0.1);
    grupoInternoDinamico.add(torreDissipador);

    const topoTorre = new THREE.Mesh(
      new THREE.BoxGeometry(0.47, 0.69, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x181b22 })
    );
    topoTorre.position.set(posCpu.x, posCpu.y, posCpu.z + 0.39);
    grupoInternoDinamico.add(topoTorre);
  } else {
    // Cooler Box Padrão Cilíndrico Baixo
    const coolerBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.25, 24),
      new THREE.MeshStandardMaterial({ color: 0x2b303c, roughness: 0.5 })
    );
    coolerBox.rotation.x = Math.PI / 2;
    coolerBox.position.set(posCpu.x, posCpu.y, posCpu.z);
    grupoInternoDinamico.add(coolerBox);
  }

  const labelEl = document.getElementById('label-preset-3d');
  if (labelEl && preset?.labelNivel) {
    labelEl.textContent = preset.labelNivel;
  }
}

function atualizarPosicaoCamera() {
  if (!camera) return;
  const { distancia, rotacaoX, rotacaoY } = estadoOrbita;
  camera.position.x = distancia * Math.sin(rotacaoY) * Math.cos(rotacaoX);
  camera.position.y = distancia * Math.sin(rotacaoX);
  camera.position.z = distancia * Math.cos(rotacaoY) * Math.cos(rotacaoX);
  camera.lookAt(0, 0, 0);
}

function configurarEventosInteracao(container) {
  const dom = renderizador.domElement;

  dom.addEventListener('pointerdown', (e) => {
    estadoOrbita.arrastando = true;
    estadoOrbita.ultimoX = e.clientX;
    estadoOrbita.ultimoY = e.clientY;
    giroAutomatico = false;
    atualizarBotaoGiro();
  });

  window.addEventListener('pointermove', (e) => {
    if (!estadoOrbita.arrastando) return;
    const deltaX = e.clientX - estadoOrbita.ultimoX;
    const deltaY = e.clientY - estadoOrbita.ultimoY;
    estadoOrbita.ultimoX = e.clientX;
    estadoOrbita.ultimoY = e.clientY;

    estadoOrbita.rotacaoY -= deltaX * 0.008;
    estadoOrbita.rotacaoX = Math.max(-0.45, Math.min(0.65, estadoOrbita.rotacaoX + deltaY * 0.006));
    atualizarPosicaoCamera();
  });

  window.addEventListener('pointerup', () => {
    estadoOrbita.arrastando = false;
  });

  dom.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      estadoOrbita.distancia = Math.max(
        estadoOrbita.distanciaMin,
        Math.min(estadoOrbita.distanciaMax, estadoOrbita.distancia + e.deltaY * 0.003)
      );
      atualizarPosicaoCamera();
    },
    { passive: false }
  );
}

function controlarCamera3D(acao) {
  if (!camera) return;
  if (acao === 'zoom-in') {
    estadoOrbita.distancia = Math.max(estadoOrbita.distanciaMin, estadoOrbita.distancia - 0.55);
  } else if (acao === 'zoom-out') {
    estadoOrbita.distancia = Math.min(estadoOrbita.distanciaMax, estadoOrbita.distancia + 0.55);
  } else if (acao === 'reset') {
    estadoOrbita.rotacaoY = -0.55;
    estadoOrbita.rotacaoX = 0.18;
    estadoOrbita.distancia = 6.2;
  } else if (acao === 'toggle-spin') {
    giroAutomatico = !giroAutomatico;
    atualizarBotaoGiro();
  }
  atualizarPosicaoCamera();
}

function atualizarBotaoGiro() {
  const btn = document.getElementById('btn-3d-spin');
  if (btn) {
    btn.textContent = giroAutomatico ? 'Pausar Giro' : 'Girar Automaticamente';
  }
}

function ajustarTamanhoVisualizador(container) {
  if (!renderizador || !camera || !container) return;
  const largura = container.clientWidth || 640;
  const altura = container.clientHeight || 420;
  if (largura === 0 || altura === 0) return;
  camera.aspect = largura / altura;
  camera.updateProjectionMatrix();
  renderizador.setSize(largura, altura);
}

function iniciarLoopRenderizacao() {
  if (animacaoFrameId) cancelAnimationFrame(animacaoFrameId);

  function animar() {
    animacaoFrameId = requestAnimationFrame(animar);

    // Só renderiza ativamente quando a aba "PCs Gamer" estiver visível na tela
    const secaoGamer = document.getElementById('aba-gamer');
    if (!secaoGamer || secaoGamer.hidden) return;

    if (giroAutomatico && !estadoOrbita.arrastando) {
      estadoOrbita.rotacaoY += 0.0035;
      atualizarPosicaoCamera();
    }

    ventoinhasAnimadas.forEach((fan) => {
      fan.rotation.y += 0.08;
    });

    renderizador.render(cena, camera);
  }

  animar();
}

Object.assign(window.Konoha, {
  inicializarVisualizador3DGamer,
  atualizarPreset3DGamer,
  controlarCamera3D,
  ajustarTamanhoVisualizador
});
})();

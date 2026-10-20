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
    
// 9. VISUALIZADOR 3D DO GABINETE EM THREE.JS (EXEMPLO 2 - IMAGEM 3)
    // ==========================================
    const threeState = {
      initialized: false,
      scene: null,
      camera: null,
      renderer: null,
      caseGroup: null,
      partMeshes: {},
      isDragging: false,
      prevX: 0,
      prevY: 0,
      rotX: 0.22,
      rotY: -0.55,
      distance: 6.2
    };

    function initOrResizeThreeViewer() {
      const host = document.getElementById('threeCanvasHost');
      if (!host || typeof THREE === 'undefined') return;

      const width = host.clientWidth || 600;
      const height = host.clientHeight || 480;

      if (!threeState.initialized) {
        threeState.initialized = true;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x060711);

        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        host.innerHTML = '';
        host.appendChild(renderer.domElement);

        // Iluminação estilo gabinete gamer (roxo/ciano)
        const ambient = new THREE.AmbientLight(0xffffff, 0.65);
        scene.add(ambient);

        const topLight = new THREE.PointLight(0xa855f7, 1.6, 12);
        topLight.position.set(0, 2.3, 0.5);
        scene.add(topLight);

        const frontLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
        frontLight.position.set(3, 2, 4);
        scene.add(frontLight);

        const caseGroup = new THREE.Group();
        scene.add(caseGroup);

        // Estrutura base do gabinete 3D (Fiel à Imagem 3: Teto com brilho roxo, fundo escuro, PSU shroud embaixo)
        const backPlate = new THREE.Mesh(
          new THREE.BoxGeometry(2.6, 3.2, 0.12),
          new THREE.MeshStandardMaterial({ color: 0x181b28, roughness: 0.6, metalness: 0.4 })
        );
        backPlate.position.set(0, 0, -0.8);
        caseGroup.add(backPlate);

        const topPanel = new THREE.Mesh(
          new THREE.BoxGeometry(2.65, 0.12, 1.75),
          new THREE.MeshStandardMaterial({ color: 0x6d28d9, emissive: 0x4c1d95, emissiveIntensity: 0.55 })
        );
        topPanel.position.set(0, 1.58, 0);
        caseGroup.add(topPanel);

        const psuShroud = new THREE.Mesh(
          new THREE.BoxGeometry(2.62, 0.72, 1.72),
          new THREE.MeshStandardMaterial({ color: 0x10131f, roughness: 0.5, metalness: 0.5 })
        );
        psuShroud.position.set(0, -1.24, 0);
        caseGroup.add(psuShroud);

        const rearFanRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.32, 0.05, 16, 36),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, emissive: 0x38bdf8, emissiveIntensity: 0.3 })
        );
        rearFanRing.position.set(-0.82, 0.62, -0.7);
        caseGroup.add(rearFanRing);

        // Cria os meshes das 8 peças dentro do gabinete 3D
        const moboMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.55, 1.75, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 })
        );
        moboMesh.position.set(-0.2, 0.35, -0.68);
        caseGroup.add(moboMesh);

        const cpuMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.38, 0.09),
          new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0x7c2d12, emissiveIntensity: 0.4 })
        );
        cpuMesh.position.set(-0.25, 0.58, -0.62);
        caseGroup.add(cpuMesh);

        const coolerMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.52, 0.52, 0.45),
          new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x581c87, emissiveIntensity: 0.4 })
        );
        coolerMesh.position.set(-0.25, 0.58, -0.38);
        caseGroup.add(coolerMesh);

        const ramMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, 0.52, 0.18),
          new THREE.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x0d9488, emissiveIntensity: 0.6 })
        );
        ramMesh.position.set(0.18, 0.58, -0.56);
        caseGroup.add(ramMesh);

        const gpuMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.45, 0.28, 0.68),
          new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x14532d, emissiveIntensity: 0.45 })
        );
        gpuMesh.position.set(-0.12, -0.05, -0.34);
        caseGroup.add(gpuMesh);

        const ssdMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.46, 0.14, 0.06),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0369a1, emissiveIntensity: 0.5 })
        );
        ssdMesh.position.set(-0.22, -0.38, -0.62);
        caseGroup.add(ssdMesh);

        const psuMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 0.55, 0.9),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x78350f, emissiveIntensity: 0.35 })
        );
        psuMesh.position.set(-0.65, -1.22, -0.15);
        caseGroup.add(psuMesh);

        threeState.scene = scene;
        threeState.camera = camera;
        threeState.renderer = renderer;
        threeState.caseGroup = caseGroup;
        threeState.partMeshes = {
          mobo: moboMesh,
          cpu: cpuMesh,
          cooler: coolerMesh,
          ram: ramMesh,
          gpu: gpuMesh,
          ssd: ssdMesh,
          psu: psuMesh,
          case: topPanel
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
          threeState.rotX = Math.max(-0.5, Math.min(0.8, threeState.rotX + dy * 0.008));
        });
        dom.addEventListener('wheel', (e) => {
          e.preventDefault();
          threeState.distance = Math.max(3.8, Math.min(9.0, threeState.distance + e.deltaY * 0.003));
        }, { passive: false });

        // Botões de clique rápido sobre o 3D
        const slotBtnsContainer = document.getElementById('threeSlotButtons');
        slotBtnsContainer.innerHTML = '';
        COMPONENT_SLOTS.forEach((slot) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-600 text-[11px] font-bold text-slate-200 border border-white/10 transition';
          b.textContent = `+ ${slot.shortTitle}`;
          b.addEventListener('click', () => openCatalogModal(slot.key));
          slotBtnsContainer.appendChild(b);
        });

        function animate3D() {
          requestAnimationFrame(animate3D);
          if (threeState.caseGroup && threeState.camera && threeState.renderer) {
            threeState.caseGroup.rotation.y = threeState.rotY;
            threeState.caseGroup.rotation.x = threeState.rotX;
            threeState.camera.position.set(0, 0.2, threeState.distance);
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
        const mesh = threeState.partMeshes[key];
        if (!mesh) return;
        if (key === 'case') return;
        const part = s[key];
        if (part && part.id !== 'gpu-integrada') {
          mesh.visible = true;
          if (part.corHex && mesh.material) {
            mesh.material.color.set(part.corHex);
          }
        } else {
          mesh.visible = false;
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
  
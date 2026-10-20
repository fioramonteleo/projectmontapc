// 5. RENDERIZAÇÃO DA INTERFACE E COMPONENTES
    // ==========================================
    function switchView(viewName) {
      appState.currentView = viewName;
      document.getElementById('viewPurpose').classList.toggle('hidden', viewName !== 'purpose');
      document.getElementById('viewBuilder').classList.toggle('hidden', viewName !== 'builder');
      document.getElementById('viewSummary').classList.toggle('hidden', viewName !== 'summary');

      // Atualiza botões de navegação no topo
      const navP = document.getElementById('navStepPurpose');
      const navB = document.getElementById('navStepBuilder');
      const navS = document.getElementById('navStepSummary');
      [navP, navB, navS].forEach((b) => {
        b.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition text-slate-300 hover:text-white';
      });
      if (viewName === 'purpose') navP.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition bg-purple-600 text-white shadow';
      if (viewName === 'builder') navB.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition bg-purple-600 text-white shadow';
      if (viewName === 'summary') navS.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition bg-purple-600 text-white shadow';

      renderAll();
      if (viewName === 'builder' && appState.viewerMode === '3d') {
        initOrResizeThreeViewer();
      }
    }

    function renderAll() {
      const report = evaluateBuild(appState.selectedParts, appState.budget);

      // Header pills
      document.getElementById('headerBudgetValue').textContent = formatCurrency(appState.budget);
      const headerTotalEl = document.getElementById('headerTotalValue');
      headerTotalEl.textContent = formatCurrency(report.totalCost);
      headerTotalEl.className = report.overBudget
        ? 'font-bold text-rose-400 font-mono-tech'
        : 'font-bold text-purple-300 font-mono-tech';
      document.getElementById('navCountBadge').textContent = `${report.selectedCount}/8`;

      // Builder top bar
      document.getElementById('activePurposeBadge').textContent = PURPOSE_LABELS[appState.purpose] || 'Personalizado';
      document.getElementById('selectedPartsCounter').textContent = `${report.selectedCount} / 8 peças`;

      const pct = Math.min(100, Math.round((report.totalCost / Math.max(1, appState.budget)) * 100));
      const budgetBar = document.getElementById('builderBudgetBar');
      const budgetText = document.getElementById('builderBudgetText');
      budgetText.textContent = `${formatCurrency(report.totalCost)} / ${formatCurrency(appState.budget)}`;
      budgetBar.style.width = `${pct}%`;

      if (report.overBudget) {
        budgetBar.className = 'h-full bg-rose-500 transition-all duration-300';
        budgetText.className = 'font-mono-tech font-bold text-rose-400';
      } else if (pct >= 88) {
        budgetBar.className = 'h-full bg-amber-400 transition-all duration-300';
        budgetText.className = 'font-mono-tech font-bold text-amber-300';
      } else {
        budgetBar.className = 'h-full bg-emerald-500 transition-all duration-300';
        budgetText.className = 'font-mono-tech font-bold text-emerald-400';
      }

      const psuText = report.psuWatts > 0 ? `${report.psuWatts}W` : 'Sem Fonte';
      document.getElementById('builderWattsText').textContent = `${report.recommendedWatts}W / Fonte: ${psuText}`;

      // Banner de compatibilidade
      const banner = document.getElementById('compatibilityBanner');
      const cIcon = document.getElementById('compatIcon');
      const cTitle = document.getElementById('compatTitle');
      const cDetails = document.getElementById('compatDetails');

      if (report.issues.length > 0) {
        banner.className = 'rounded-xl px-4 py-3 border border-rose-500/45 bg-rose-950/30 flex items-start sm:items-center justify-between gap-3 text-xs';
        cIcon.className = 'w-6 h-6 rounded-full bg-rose-500/25 text-rose-300 flex items-center justify-center font-bold shrink-0';
        cIcon.textContent = '!';
        cTitle.className = 'font-bold text-rose-300';
        cTitle.textContent = `${report.issues.length} Alerta(s) Encontrado(s):`;
        cDetails.textContent = report.issues.map((i) => i.text).join(' • ');
      } else {
        banner.className = 'rounded-xl px-4 py-3 border border-emerald-500/30 bg-emerald-950/25 flex items-start sm:items-center justify-between gap-3 text-xs';
        cIcon.className = 'w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0';
        cIcon.textContent = '✓';
        cTitle.className = 'font-bold text-emerald-300';
        cTitle.textContent = 'Verificador de Compatibilidade:';
        cDetails.textContent = report.selectedCount === 0
          ? 'Clique em qualquer peça no gabinete ou na lista ao lado para começar.'
          : 'Todas as peças selecionadas são compatíveis e estão dentro do orçamento!';
      }

      renderSelectedComponentsList(report);
      renderCabinetHotspots(report);
      renderInspectorBox();
      renderSummaryView(report);
      update3DSceneMeshes();
    }

    // Renderiza a lista das 8 peças à esquerda (Fiel à Imagem 3)
    function renderSelectedComponentsList(report) {
      const container = document.getElementById('selectedComponentsList');
      container.innerHTML = '';

      const problemSlots = new Set();
      report.issues.forEach((iss) => iss.slots.forEach((s) => problemSlots.add(s)));

      COMPONENT_SLOTS.forEach((slot) => {
        const chosen = appState.selectedParts[slot.key];
        const hasError = problemSlots.has(slot.key);
        const isFocused = appState.activeSlotKey === slot.key;

        const row = document.createElement('div');
        row.className = `p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
          hasError
            ? 'bg-rose-950/25 border-rose-500/50'
            : isFocused
            ? 'bg-[#151a36] border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.18)]'
            : chosen
            ? 'bg-[#11152c] border-indigo-500/30 hover:border-purple-500/40'
            : 'bg-[#0e1224] border-white/5 hover:border-white/20'
        }`;

        row.addEventListener('click', (e) => {
          if (e.target.closest('.btn-remove-part')) return;
          focusSlotInCabinet(slot.key, true);
        });

        const leftDiv = document.createElement('div');
        leftDiv.className = 'flex items-center gap-3 min-w-0';

        const iconBox = document.createElement('div');
        iconBox.className = `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
          hasError
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            : chosen
            ? 'bg-purple-600/25 border-purple-500/40 text-purple-300'
            : 'bg-slate-800/80 border-white/10 text-slate-400'
        }`;
        iconBox.innerHTML = slot.iconSvg;

        const textDiv = document.createElement('div');
        textDiv.className = 'min-w-0';
        if (chosen) {
          textDiv.innerHTML = `
            <div class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>${slot.label}</span>
              ${hasError ? '<span class="px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 text-[10px]">Incompatível</span>' : ''}
            </div>
            <div class="text-xs sm:text-sm font-bold text-white truncate">${chosen.nome}</div>
            <div class="text-[11px] font-mono-tech text-emerald-400">${formatCurrency(chosen.preco)}</div>
          `;
        } else {
          textDiv.innerHTML = `
            <div class="text-xs sm:text-sm font-semibold text-slate-200">${slot.label}</div>
            <div class="text-xs italic text-slate-500">Nenhum componente selecionado</div>
          `;
        }

        leftDiv.appendChild(iconBox);
        leftDiv.appendChild(textDiv);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'flex items-center gap-1.5 shrink-0';

        const chooseBtn = document.createElement('button');
        chooseBtn.type = 'button';
        chooseBtn.className = chosen
          ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-950 hover:bg-purple-700 text-purple-200 border border-purple-500/40 transition'
          : 'px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2b174d] hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 transition';
        chooseBtn.textContent = chosen ? 'Trocar' : '+ Escolher';

        rightDiv.appendChild(chooseBtn);

        if (chosen) {
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.title = 'Remover peça';
          removeBtn.className = 'btn-remove-part w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-rose-600 text-slate-400 hover:text-white text-xs font-bold transition';
          removeBtn.textContent = '✕';
          removeBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            appState.selectedParts[slot.key] = null;
            showToast(`${slot.label} removido da montagem.`);
            renderAll();
          });
          rightDiv.appendChild(removeBtn);
        }

        row.appendChild(leftDiv);
        row.appendChild(rightDiv);
        container.appendChild(row);
      });
    }

    // Renderiza os círculos luminosos interativos (Hotspots) sobre o gabinete (Fiel à Imagem 2)
    function renderCabinetHotspots(report) {
      const overlay = document.getElementById('hotspotsOverlay');
      overlay.innerHTML = '';

      const problemSlots = new Set();
      report.issues.forEach((iss) => iss.slots.forEach((s) => problemSlots.add(s)));

      COMPONENT_SLOTS.forEach((slot) => {
        const chosen = appState.selectedParts[slot.key];
        const hasError = problemSlots.has(slot.key);
        const isSelected = appState.activeSlotKey === slot.key;

        const node = document.createElement('button');
        node.type = 'button';
        node.style.left = `${slot.hotspotX}%`;
        node.style.top = `${slot.hotspotY}%`;
        node.title = `${slot.label}: clique para inspecionar e escolher peça`;

        let statusClass = '';
        if (hasError) statusClass = 'incompatible';
        else if (chosen) statusClass = 'filled';
        if (isSelected) statusClass += ' selected-hotspot';

        node.className = `hotspot-node ${statusClass} group`;
        node.innerHTML = `
          <span class="hotspot-dot"></span>
          <span class="hidden sm:block absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-slate-950/95 border border-teal-400/40 text-[10px] font-mono-tech font-bold text-teal-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
            ${slot.shortTitle} ${chosen ? '✓' : '+'}
          </span>
        `;

        node.addEventListener('click', () => {
          focusSlotInCabinet(slot.key, true);
        });

        node.addEventListener('mouseenter', () => {
          focusSlotInCabinet(slot.key, false);
        });

        overlay.appendChild(node);
      });
    }

    function focusSlotInCabinet(slotKey, openDrawer) {
      appState.activeSlotKey = slotKey;
      const slot = COMPONENT_SLOTS.find((s) => s.key === slotKey) || COMPONENT_SLOTS[0];

      // Atualiza zoom suave e HUD "ÓPTICA ATIVA"
      const zoomLayer = document.getElementById('cabinetZoomLayer');
      zoomLayer.style.transformOrigin = slot.zoomOrigin;
      zoomLayer.style.transform = 'scale(1.12)';

      document.getElementById('hudZoomLabel').textContent = `ZOOM 1.1x — ${slot.shortTitle}`;
      document.getElementById('hudActiveSlotLabel').textContent = slot.pinCode;

      renderInspectorBox();
      renderSelectedComponentsList(evaluateBuild(appState.selectedParts, appState.budget));
      renderCabinetHotspots(evaluateBuild(appState.selectedParts, appState.budget));

      if (openDrawer) {
        openCatalogModal(slotKey);
      }
    }

    function resetCabinetZoom() {
      const zoomLayer = document.getElementById('cabinetZoomLayer');
      zoomLayer.style.transformOrigin = 'center center';
      zoomLayer.style.transform = 'scale(1)';
      document.getElementById('hudZoomLabel').textContent = 'ZOOM 1.0x — VISÃO GERAL';
      document.getElementById('hudActiveSlotLabel').textContent = 'TODOS OS COMPONENTES';
      if (threeState.camera) {
        threeState.rotX = 0.22;
        threeState.rotY = -0.55;
        threeState.distance = 6.2;
      }
    }

    function renderInspectorBox() {
      const slot = COMPONENT_SLOTS.find((s) => s.key === appState.activeSlotKey) || COMPONENT_SLOTS[0];
      const chosen = appState.selectedParts[slot.key];

      document.getElementById('inspectorPinCode').textContent = `${slot.pinCode}`;
      if (chosen) {
        document.getElementById('inspectorPartTitle').textContent = `${chosen.nome}`;
        document.getElementById('inspectorPartSub').textContent = `${chosen.specs} • ${formatCurrency(chosen.preco)}`;
      } else {
        document.getElementById('inspectorPartTitle').textContent = `${slot.label} — Nenhum selecionado`;
        document.getElementById('inspectorPartSub').textContent = `Clique em "INSPECIONAR" ou no círculo luminoso para abrir a listagem de peças.`;
      }
    }

    // ==========================================
    
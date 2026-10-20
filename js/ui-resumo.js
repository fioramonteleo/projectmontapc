// 7. TELA DE RESUMO E CENÁRIOS DE TESTE (ETAPA 4 E 5)
    // ==========================================
    function renderSummaryView(report) {
      const rulesGrid = document.getElementById('summaryRulesGrid');
      rulesGrid.innerHTML = '';

      Object.values(report.rulesStatus).forEach((rule) => {
        const div = document.createElement('div');
        div.className = `p-4 rounded-xl border ${
          rule.ok
            ? 'bg-emerald-950/20 border-emerald-500/35'
            : 'bg-rose-950/30 border-rose-500/50'
        }`;
        div.innerHTML = `
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-extrabold uppercase tracking-wider ${rule.ok ? 'text-emerald-300' : 'text-rose-300'}">
              ${rule.title}
            </span>
            <span class="text-xs font-bold ${rule.ok ? 'text-emerald-400' : 'text-rose-400'}">
              ${rule.ok ? '✓ OK' : '✕ ERRO'}
            </span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${rule.msg}</p>
        `;
        rulesGrid.appendChild(div);
      });

      const listEl = document.getElementById('summaryPartsList');
      listEl.innerHTML = '';

      COMPONENT_SLOTS.forEach((slot) => {
        const p = appState.selectedParts[slot.key];
        const item = document.createElement('div');
        item.className = 'p-3 rounded-xl bg-[#11152c] border border-white/10 flex items-center justify-between gap-3';
        item.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-purple-300">
              ${slot.iconSvg}
            </div>
            <div>
              <div class="text-xs text-slate-400">${slot.label}</div>
              <div class="text-sm font-bold text-white">${p ? p.nome : 'Não selecionado'}</div>
              ${p ? `<div class="text-xs text-slate-400">${p.specs}</div>` : ''}
            </div>
          </div>
          <div class="text-right font-mono-tech font-bold text-sm ${p ? 'text-emerald-400' : 'text-slate-500'}">
            ${p ? formatCurrency(p.preco) : 'R$ 0,00'}
          </div>
        `;
        listEl.appendChild(item);
      });

      document.getElementById('sumPurpose').textContent = PURPOSE_LABELS[appState.purpose];
      document.getElementById('sumBudget').textContent = formatCurrency(appState.budget);
      document.getElementById('sumTotalCost').textContent = formatCurrency(report.totalCost);

      const balance = appState.budget - report.totalCost;
      const balEl = document.getElementById('sumBalance');
      balEl.textContent = formatCurrency(balance);
      balEl.className = balance >= 0
        ? 'font-mono-tech font-bold text-emerald-400'
        : 'font-mono-tech font-bold text-rose-400';

      document.getElementById('sumPower').textContent = `${report.recommendedWatts}W (Fonte: ${report.psuWatts}W)`;
    }

    // ==========================================
    // 8. AUTO-PREENCHIMENTO E CENÁRIOS DE TESTE (QA)
    // ==========================================
    function loadPresetBuild(presetKey) {
      const findPart = (cat, id) => CATALOG_PARTS[cat].find((x) => x.id === id) || CATALOG_PARTS[cat][0];

      if (presetKey === 'jogos') {
        if (appState.budget >= 6200) {
          appState.selectedParts = {
            cpu: findPart('cpu', 'cpu-r5-7600'),
            cooler: findPart('cooler', 'cool-ag620'),
            mobo: findPart('mobo', 'mobo-b650-am5'),
            ram: findPart('ram', 'ram-32gb-ddr5'),
            gpu: findPart('gpu', 'gpu-rtx4060'),
            ssd: findPart('ssd', 'ssd-1tb-nvme'),
            case: findPart('case', 'case-atx-aquario'),
            psu: findPart('psu', 'psu-650w-bronze')
          };
        } else {
          appState.selectedParts = {
            cpu: findPart('cpu', 'cpu-r5-5600'),
            cooler: findPart('cooler', 'cool-box-amd'),
            mobo: findPart('mobo', 'mobo-b550m-am4'),
            ram: findPart('ram', 'ram-16gb-ddr4'),
            gpu: findPart('gpu', 'gpu-rx6600'),
            ssd: findPart('ssd', 'ssd-1tb-nvme'),
            case: findPart('case', 'case-matx-mesh'),
            psu: findPart('psu', 'psu-550w-bronze')
          };
        }
      } else if (presetKey === 'trabalho') {
        appState.selectedParts = {
          cpu: findPart('cpu', 'cpu-i5-12400f'),
          cooler: findPart('cooler', 'cool-box-amd'),
          mobo: findPart('mobo', 'mobo-b660m-lga1700'),
          ram: findPart('ram', 'ram-32gb-ddr4'),
          gpu: findPart('gpu', 'gpu-rtx4060'),
          ssd: findPart('ssd', 'ssd-1tb-nvme'),
          case: findPart('case', 'case-matx-mesh'),
          psu: findPart('psu', 'psu-550w-bronze')
        };
      } else if (presetKey === 'hibrido') {
        appState.selectedParts = {
          cpu: findPart('cpu', 'cpu-r5-5600g'),
          cooler: findPart('cooler', 'cool-box-amd'),
          mobo: findPart('mobo', 'mobo-b550m-am4'),
          ram: findPart('ram', 'ram-16gb-ddr4'),
          gpu: findPart('gpu', 'gpu-integrada'),
          ssd: findPart('ssd', 'ssd-500gb-nvme'),
          case: findPart('case', 'case-matx-mesh'),
          psu: findPart('psu', 'psu-550w-bronze')
        };
      }
      renderAll();
    }

    function loadTestScenario(scenarioId) {
      const findPart = (cat, id) => CATALOG_PARTS[cat].find((x) => x.id === id);
      if (scenarioId === 'valid_gamer') {
        appState.budget = 7000;
        appState.purpose = 'jogos';
        appState.selectedParts = {
          cpu: findPart('cpu', 'cpu-r5-7600'),
          cooler: findPart('cooler', 'cool-ag620'),
          mobo: findPart('mobo', 'mobo-b650-am5'),
          ram: findPart('ram', 'ram-32gb-ddr5'),
          gpu: findPart('gpu', 'gpu-rtx4060'),
          ssd: findPart('ssd', 'ssd-1tb-nvme'),
          case: findPart('case', 'case-atx-aquario'),
          psu: findPart('psu', 'psu-650w-bronze')
        };
        showToast('Cenário 1 carregado: Montagem Gamer 100% compatível!');
      } else if (scenarioId === 'error_socket') {
        appState.budget = 6000;
        appState.selectedParts = {
          cpu: findPart('cpu', 'cpu-r5-7600'), // AM5
          cooler: findPart('cooler', 'cool-box-amd'),
          mobo: findPart('mobo', 'mobo-b660m-lga1700'), // LGA1700
          ram: findPart('ram', 'ram-16gb-ddr4'),
          gpu: findPart('gpu', 'gpu-rx6600'),
          ssd: findPart('ssd', 'ssd-500gb-nvme'),
          case: findPart('case', 'case-matx-mesh'),
          psu: findPart('psu', 'psu-550w-bronze')
        };
        showToast('Cenário 2 carregado: Teste de erro de Soquete (AM5 vs LGA1700).');
      } else if (scenarioId === 'error_ram') {
        appState.budget = 5500;
        appState.selectedParts = {
          cpu: findPart('cpu', 'cpu-r5-5600'),
          cooler: findPart('cooler', 'cool-box-amd'),
          mobo: findPart('mobo', 'mobo-b550m-am4'), // DDR4
          ram: findPart('ram', 'ram-32gb-ddr5'), // DDR5
          gpu: findPart('gpu', 'gpu-rx6600'),
          ssd: findPart('ssd', 'ssd-1tb-nvme'),
          case: findPart('case', 'case-matx-mesh'),
          psu: findPart('psu', 'psu-550w-bronze')
        };
        showToast('Cenário 3 carregado: Teste de erro de Memória RAM (DDR4 vs DDR5).');
      } else if (scenarioId === 'error_psu_case') {
        appState.budget = 6000;
        appState.selectedParts = {
          cpu: findPart('cpu', 'cpu-i7-14700k'),
          cooler: findPart('cooler', 'cool-wc-240'),
          mobo: findPart('mobo', 'mobo-z790-lga1700'), // ATX
          ram: findPart('ram', 'ram-32gb-ddr5'),
          gpu: findPart('gpu', 'gpu-rtx4070s'), // 220W + 310mm
          ssd: findPart('ssd', 'ssd-2tb-fury'),
          case: findPart('case', 'case-itx-compact'), // Só Mini-ITX
          psu: findPart('psu', 'psu-300w-basica') // Só 300W
        };
        showToast('Cenário 4 carregado: Fonte insuficiente + Placa ATX em Gabinete Mini-ITX + Orçamento estourado.');
      }

      document.getElementById('budgetNumberInput').value = appState.budget;
      document.getElementById('budgetRangeInput').value = Math.min(15000, appState.budget);
      renderAll();
    }

    // ==========================================
    
// 4. MOTOR DE LÓGICA: CUSTO TOTAL E COMPATIBILIDADE (ITEM 4 DO PROJETO)
    // ==========================================
    function evaluateBuild(selected, budgetLimit) {
      let totalCost = 0;
      let rawWatts = 0;
      let selectedCount = 0;

      Object.keys(selected).forEach((k) => {
        const part = selected[k];
        if (part) {
          selectedCount++;
          totalCost += Number(part.preco || 0);
          rawWatts += Number(part.consumoWatts || 0);
        }
      });

      // Margem de segurança de 25% para dimensionamento de fonte
      const recommendedWatts = rawWatts > 0 ? Math.ceil(rawWatts * 1.25) : 0;
      const psuWatts = selected.psu ? selected.psu.potenciaWatts : 0;

      const issues = [];
      const rulesStatus = {
        socket: { ok: true, title: 'Soquete CPU / Placa-mãe', msg: 'Aguardando seleção de CPU e Placa-mãe.' },
        ram: { ok: true, title: 'Padrão de Memória RAM', msg: 'Aguardando seleção de Placa-mãe e RAM.' },
        psu: { ok: true, title: 'Potência da Fonte (PSU)', msg: 'Aguardando seleção da Fonte de Alimentação.' },
        caseSize: { ok: true, title: 'Tamanho no Gabinete', msg: 'Aguardando seleção de Placa-mãe e Gabinete.' }
      };

      // Regra 1: Soquete entre CPU e Placa-Mãe
      if (selected.cpu && selected.mobo) {
        if (selected.cpu.soquete !== selected.mobo.soquete) {
          const m = `Incompatibilidade de Soquete: O processador (${selected.cpu.soquete}) não encaixa na Placa-mãe (${selected.mobo.soquete}).`;
          issues.push({ slots: ['cpu', 'mobo'], text: m });
          rulesStatus.socket = { ok: false, title: 'Soquete CPU / Placa-mãe', msg: m };
        } else {
          rulesStatus.socket = {
            ok: true,
            title: 'Soquete CPU / Placa-mãe',
            msg: `Compatível: ambos utilizam o soquete ${selected.cpu.soquete}.`
          };
        }
      }

      // Regra 2: Tipo de RAM (DDR4 vs DDR5)
      if (selected.mobo && selected.ram) {
        if (selected.mobo.tipoRam !== selected.ram.tipoRam) {
          const m = `Incompatibilidade de RAM: A Placa-mãe exige ${selected.mobo.tipoRam}, mas a memória escolhida é ${selected.ram.tipoRam}.`;
          issues.push({ slots: ['mobo', 'ram'], text: m });
          rulesStatus.ram = { ok: false, title: 'Padrão de Memória RAM', msg: m };
        } else {
          rulesStatus.ram = {
            ok: true,
            title: 'Padrão de Memória RAM',
            msg: `Compatível: Placa-mãe e Memória operam em ${selected.ram.tipoRam}.`
          };
        }
      }

      // Regra 3: Potência da Fonte vs Consumo das Peças
      if (selected.psu) {
        if (psuWatts < recommendedWatts) {
          const m = `Fonte Insuficiente: O sistema requer cerca de ${recommendedWatts}W (c/ margem), mas a fonte fornece apenas ${psuWatts}W.`;
          issues.push({ slots: ['psu', 'gpu'], text: m });
          rulesStatus.psu = { ok: false, title: 'Potência da Fonte (PSU)', msg: m };
        } else {
          rulesStatus.psu = {
            ok: true,
            title: 'Potência da Fonte (PSU)',
            msg: `Fonte de ${psuWatts}W suporta com folga a demanda estimada de ${recommendedWatts}W.`
          };
        }
      }

      // Regra 4: Formato da Placa-mãe e GPU dentro do Gabinete
      if (selected.case && selected.mobo) {
        const supportsMobo = selected.case.formatosSuportados.includes(selected.mobo.formato);
        const gpuFits = !selected.gpu || (selected.gpu.comprimentoMm || 0) <= selected.case.maxGpuMm;

        if (!supportsMobo) {
          const m = `Tamanho Incompatível: A Placa-mãe é formato ${selected.mobo.formato}, mas o gabinete só aceita ${selected.case.formatosSuportados.join(', ')}.`;
          issues.push({ slots: ['mobo', 'case'], text: m });
          rulesStatus.caseSize = { ok: false, title: 'Tamanho no Gabinete', msg: m };
        } else if (!gpuFits) {
          const m = `Espaço de GPU: A Placa de Vídeo (${selected.gpu.comprimentoMm}mm) excede o limite do gabinete (${selected.case.maxGpuMm}mm).`;
          issues.push({ slots: ['gpu', 'case'], text: m });
          rulesStatus.caseSize = { ok: false, title: 'Tamanho no Gabinete', msg: m };
        } else {
          rulesStatus.caseSize = {
            ok: true,
            title: 'Tamanho no Gabinete',
            msg: `Compatível: Gabinete comporta placa ${selected.mobo.formato} e GPU selecionada.`
          };
        }
      }

      const overBudget = totalCost > budgetLimit;
      if (overBudget) {
        issues.push({
          slots: [],
          text: `Orçamento ultrapassado em ${formatCurrency(totalCost - budgetLimit)} (Total: ${formatCurrency(totalCost)} / Limite: ${formatCurrency(budgetLimit)}).`
        });
      }

      return {
        totalCost,
        rawWatts,
        recommendedWatts,
        psuWatts,
        selectedCount,
        overBudget,
        issues,
        rulesStatus
      };
    }

    // Verifica se um candidato específico no modal geraria conflito imediato com o que já está montado
    function checkCandidateCompatibility(candidate) {
      const s = appState.selectedParts;
      const reasons = [];

      if (candidate.categoria === 'cpu' && s.mobo && candidate.soquete !== s.mobo.soquete) {
        reasons.push(`Soquete ${candidate.soquete} difere da Placa-mãe atual (${s.mobo.soquete})`);
      }
      if (candidate.categoria === 'mobo') {
        if (s.cpu && candidate.soquete !== s.cpu.soquete) {
          reasons.push(`Soquete ${candidate.soquete} difere do Processador atual (${s.cpu.soquete})`);
        }
        if (s.ram && candidate.tipoRam !== s.ram.tipoRam) {
          reasons.push(`Exige RAM ${candidate.tipoRam}, mas você selecionou ${s.ram.tipoRam}`);
        }
        if (s.case && !s.case.formatosSuportados.includes(candidate.formato)) {
          reasons.push(`Formato ${candidate.formato} não cabe no gabinete selecionado`);
        }
      }
      if (candidate.categoria === 'ram' && s.mobo && candidate.tipoRam !== s.mobo.tipoRam) {
        reasons.push(`Memória ${candidate.tipoRam} incompatível com Placa-mãe ${s.mobo.tipoRam}`);
      }
      if (candidate.categoria === 'case') {
        if (s.mobo && !candidate.formatosSuportados.includes(s.mobo.formato)) {
          reasons.push(`Não comporta a Placa-mãe ${s.mobo.formato} atual`);
        }
        if (s.gpu && (s.gpu.comprimentoMm || 0) > candidate.maxGpuMm) {
          reasons.push(`Espaço interno (${candidate.maxGpuMm}mm) menor que a GPU (${s.gpu.comprimentoMm}mm)`);
        }
      }
      if (candidate.categoria === 'psu') {
        const tempBuild = Object.assign({}, s, { psu: candidate });
        const evalTemp = evaluateBuild(tempBuild, appState.budget);
        if (candidate.potenciaWatts < evalTemp.recommendedWatts) {
          reasons.push(`Potência (${candidate.potenciaWatts}W) abaixo do recomendado (${evalTemp.recommendedWatts}W)`);
        }
      }
      return {
        compatible: reasons.length === 0,
        reasons
      };
    }

    function formatCurrency(val) {
      return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // ==========================================
    
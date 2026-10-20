// 6. MODAL DE CATÁLOGO / SELEÇÃO DE PEÇAS (ETAPA 3)
    // ==========================================
    function openCatalogModal(slotKey) {
      appState.modalCategoryKey = slotKey;
      const slot = COMPONENT_SLOTS.find((s) => s.key === slotKey) || COMPONENT_SLOTS[0];
      document.getElementById('modalSlotBadge').textContent = `SLOT DO GABINETE: ${slot.pinCode}`;
      document.getElementById('modalCategoryTitle').textContent = `Selecionar ${slot.label}`;
      document.getElementById('catalogModal').classList.remove('hidden');
      renderCatalogModalCards();
    }

    function closeCatalogModal() {
      document.getElementById('catalogModal').classList.add('hidden');
    }

    function renderCatalogModalCards() {
      const slotKey = appState.modalCategoryKey;
      if (!slotKey) return;
      const list = CATALOG_PARTS[slotKey] || [];
      const grid = document.getElementById('modalPartsGrid');
      grid.innerHTML = '';

      const currentSelected = appState.selectedParts[slotKey];

      list.forEach((part) => {
        const compatCheck = checkCandidateCompatibility(part);
        if (appState.filterCompatibleOnly && !compatCheck.compatible) {
          return;
        }

        const isRecommended = part.finalidades && part.finalidades.includes(appState.purpose);
        const isCurrent = currentSelected && currentSelected.id === part.id;

        const card = document.createElement('div');
        card.className = `rounded-xl p-4 border transition flex flex-col justify-between gap-3 ${
          isCurrent
            ? 'bg-purple-950/35 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
            : compatCheck.compatible
            ? 'bg-[#121731] border-white/10 hover:border-purple-500/60'
            : 'bg-rose-950/20 border-rose-500/40'
        }`;

        // Badges técnicas da peça
        const techTags = [];
        if (part.soquete) techTags.push(`Soquete: ${part.soquete}`);
        if (part.tipoRam) techTags.push(`RAM: ${part.tipoRam}`);
        if (part.formato) techTags.push(`Formato: ${part.formato}`);
        if (part.formatosSuportados) techTags.push(`Aceita: ${part.formatosSuportados.join('/')}`);
        if (part.potenciaWatts) techTags.push(`Potência: ${part.potenciaWatts}W`);
        else if (part.consumoWatts !== undefined) techTags.push(`TDP/Consumo: ${part.consumoWatts}W`);

        card.innerHTML = `
          <div class="space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-wrap gap-1.5">
                ${
                  isRecommended
                    ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/25 text-purple-200 border border-purple-400/40">★ Ideal para seu perfil</span>'
                    : ''
                }
                ${
                  compatCheck.compatible
                    ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ Compatível</span>'
                    : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/25 text-rose-300 border border-rose-500/40">⚠ Incompatível</span>'
                }
              </div>
              <span class="font-mono-tech font-extrabold text-base text-emerald-400 shrink-0">
                ${formatCurrency(part.preco)}
              </span>
            </div>

            <div class="flex items-center gap-3 pt-1">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10" style="background:${part.corHex}22; color:${part.corHex}">
                ${COMPONENT_SLOTS.find((s) => s.key === slotKey).iconSvg}
              </div>
              <div>
                <h4 class="text-sm font-bold text-white leading-snug">${part.nome}</h4>
                <p class="text-xs text-slate-300 mt-0.5">${part.specs}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              ${techTags
                .map(
                  (t) =>
                    `<span class="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/10 text-[10px] font-mono-tech">${t}</span>`
                )
                .join('')}
            </div>

            ${
              !compatCheck.compatible
                ? `<div class="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-200">
                    <strong>Conflito detectado:</strong> ${compatCheck.reasons.join('; ')}
                   </div>`
                : ''
            }
          </div>

          <div class="pt-2 border-t border-white/10 flex items-center justify-end">
            <button type="button" class="btn-select-part w-full py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition ${
              isCurrent
                ? 'bg-emerald-600 text-white'
                : compatCheck.compatible
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-rose-800/80 hover:bg-rose-700 text-rose-100'
            }">
              ${isCurrent ? '✓ Selecionado no Gabinete' : compatCheck.compatible ? 'Instalar no Gabinete' : 'Instalar Mesmo Assim (Teste de Erro)'}
            </button>
          </div>
        `;

        card.querySelector('.btn-select-part').addEventListener('click', () => {
          appState.selectedParts[slotKey] = part;
          closeCatalogModal();
          showToast(`${part.nome} instalado no gabinete!`);
          renderAll();
        });

        grid.appendChild(card);
      });

      if (grid.children.length === 0) {
        grid.innerHTML = `
          <div class="col-span-2 text-center py-8 text-slate-400 text-sm">
            Nenhuma peça compatível com o filtro atual. Desmarque "Apenas compatíveis" para ver todas as opções.
          </div>
        `;
      }
    }

    // ==========================================
    
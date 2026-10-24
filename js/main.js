/**
 * Controlador Principal da Aplicação — Konoha Hardware
 * 
 * Orquestra:
 * - Navegação consistente entre as abas do site.
 * - Pesquisa funcional de componentes no cabeçalho.
 * - Montador de PC ("Montar seu PC") com verificação de compatibilidade em tempo real.
 * - Tela de Resultados Finais e Desempenho (FPS Gamer, Produtividade/AutoCAD e Híbrido).
 * - Seção "PCs Gamer" com o Visualizador 3D exclusivo.
 * - Seção "PCs para Trabalho" com configurações pré-montadas e personalizáveis.
 * - Seção "Arquitetura da Computação" e "Sobre a Equipe".
 */

(() => {
window.Konoha = window.Konoha || {};

const {
  CATEGORIAS_MONTADOR,
  CATALOGO_PECAS,
  buscarPecaPorId,
  PCS_GAMER,
  PCS_TRABALHO,
  EQUIPE_DESENVOLVIMENTO,
  avaliarCompatibilidadePeca,
  calcularConsumoSistema,
  validarMontagemCompleta,
  gerarRelatorioDesempenho,
  inicializarVisualizador3DGamer,
  atualizarPreset3DGamer,
  controlarCamera3D,
  inicializarSecaoArquitetura,
  inicializarAutenticacaoGoogle
} = window.Konoha;

const estadoApp = {
  abaAtiva: 'inicio',
  categoriaAtiva: 'cpu',
  finalidadeMontagem: 'jogos', // 'jogos' | 'trabalho' | 'hibrido'
  apenasCompativeis: false,
  termoBuscaPecas: '',
  exibindoResultadoFinal: false,
  selecao: {
    cpu: null,
    placamae: null,
    ram: null,
    gpu: null,
    armazenamento: null,
    fonte: null,
    gabinete: null,
    cooler: null
  }
};

/**
 * Formata valores numéricos para moeda Real Brasileiro (R$).
 */
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Calcula o preço total de um conjunto de IDs de peças.
 */
function calcularPrecoPorIds(pecasIds) {
  return Object.values(pecasIds).reduce((soma, id) => {
    const peca = buscarPecaPorId(id);
    return soma + (peca ? peca.preco : 0);
  }, 0);
}

/**
 * Inicialização geral ao carregar o DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
  configurarNavegacaoAbas();
  configurarPesquisaGlobal();
  configurarEventosMontador();
  renderizarMontadorCompleto();
  renderizarPcsGamer();
  renderizarPcsTrabalho();
  inicializarSecaoArquitetura();
  renderizarEquipe();
  inicializarAutenticacaoGoogle();
  configurarModalDetalhes();

  // Suporte a navegação direta via hash na URL (#montar, #gamer, #trabalho, #arquitetura, #equipe)
  const hashInicial = window.location.hash.replace('#', '').trim();
  const abasValidas = ['inicio', 'montar', 'gamer', 'trabalho', 'arquitetura', 'equipe'];
  if (abasValidas.includes(hashInicial)) {
    mudarAba(hashInicial);
  }
});

/* ==========================================================================
   1. NAVEGAÇÃO ENTRE ABAS E ATALHOS DA PÁGINA INICIAL
   ========================================================================== */

function configurarNavegacaoAbas() {
  document.querySelectorAll('[data-ir-aba]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const destino = el.getAttribute('data-ir-aba');
      const finalidadeOpcional = el.getAttribute('data-finalidade-inicial');
      if (finalidadeOpcional) {
        estadoApp.finalidadeMontagem = finalidadeOpcional;
      }
      mudarAba(destino);
    });
  });
}

function mudarAba(nomeAba) {
  estadoApp.abaAtiva = nomeAba;

  // Atualiza botões do menu principal
  document.querySelectorAll('.link-aba-menu').forEach((btn) => {
    const ativo = btn.getAttribute('data-ir-aba') === nomeAba;
    btn.classList.toggle('ativa', ativo);
    btn.setAttribute('aria-current', ativo ? 'page' : 'false');
  });

  // Exibe apenas a seção correspondente
  document.querySelectorAll('.secao-aba').forEach((secao) => {
    secao.hidden = secao.id !== `aba-${nomeAba}`;
  });

  // Se entrou na aba "PCs Gamer", inicializa o visualizador 3D exclusivo
  if (nomeAba === 'gamer') {
    setTimeout(() => {
      inicializarVisualizador3DGamer('palco-3d-gamer', 'status-3d-gamer');
    }, 60);
  }

  // Se entrou na aba "Montar seu PC", atualiza interface do montador
  if (nomeAba === 'montar') {
    renderizarMontadorCompleto();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   2. PESQUISA FUNCIONAL DE COMPONENTES NO CABEÇALHO
   ========================================================================== */

function configurarPesquisaGlobal() {
  const form = document.getElementById('form-pesquisa-global');
  const input = document.getElementById('input-pesquisa-global');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const termo = input.value.trim();
    estadoApp.termoBuscaPecas = termo;
    estadoApp.exibindoResultadoFinal = false;
    mudarAba('montar');
  });
}

/* ==========================================================================
   3. ABA "MONTAR SEU PC" (SELEÇÃO, COMPATIBILIDADE E ORÇAMENTO)
   ========================================================================== */

function configurarEventosMontador() {
  // Botões de finalidade (Jogos, Trabalho, Híbrido)
  document.querySelectorAll('[data-set-finalidade]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estadoApp.finalidadeMontagem = btn.getAttribute('data-set-finalidade');
      atualizarBotoesFinalidade();
      if (estadoApp.exibindoResultadoFinal) {
        renderizarTelaResultadoFinal();
      }
    });
  });

  // Checkbox "Apenas compatíveis"
  const chkCompativeis = document.getElementById('chk-apenas-compativeis');
  chkCompativeis?.addEventListener('change', () => {
    estadoApp.apenasCompativeis = chkCompativeis.checked;
    renderizarGradeCatalogoPecas();
  });

  // Botão limpar filtro de busca
  document.getElementById('btn-limpar-busca-pecas')?.addEventListener('click', () => {
    estadoApp.termoBuscaPecas = '';
    const input = document.getElementById('input-pesquisa-global');
    if (input) input.value = '';
    renderizarMontadorCompleto();
  });

  // Botão limpar toda a montagem
  document.getElementById('btn-limpar-montagem')?.addEventListener('click', () => {
    Object.keys(estadoApp.selecao).forEach((k) => {
      estadoApp.selecao[k] = null;
    });
    estadoApp.categoriaAtiva = 'cpu';
    estadoApp.exibindoResultadoFinal = false;
    ocultarAlertaMontador();
    renderizarMontadorCompleto();
  });

  // Botão principal: Ver Resultado e Desempenho da Montagem
  document.getElementById('btn-ver-resultado-montagem')?.addEventListener('click', () => {
    const validacao = validarMontagemCompleta(estadoApp.selecao);
    if (!validacao.completa) {
      if (validacao.categoriasFaltantes.length > 0) {
        exibirAlertaMontador(
          `Selecione todos os 8 componentes antes de ver o desempenho final. Faltam: ${validacao.categoriasFaltantes.join(', ')}.`
        );
        // Direciona automaticamente para a primeira categoria pendente
        const primeiraPendente = CATEGORIAS_MONTADOR.find((c) => !estadoApp.selecao[c.id]);
        if (primeiraPendente) {
          estadoApp.categoriaAtiva = primeiraPendente.id;
          renderizarMontadorCompleto();
        }
        return;
      }
      if (validacao.conflitosAtivos.length > 0) {
        exibirAlertaMontador(`Corrija o conflito antes de concluir: ${validacao.conflitosAtivos[0]}`);
        return;
      }
    }

    ocultarAlertaMontador();
    estadoApp.exibindoResultadoFinal = true;
    renderizarMontadorCompleto();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function atualizarBotoesFinalidade() {
  document.querySelectorAll('[data-set-finalidade]').forEach((btn) => {
    const ativa = btn.getAttribute('data-set-finalidade') === estadoApp.finalidadeMontagem;
    btn.classList.toggle('ativa', ativa);
  });
}

function exibirAlertaMontador(mensagem) {
  const box = document.getElementById('alerta-feedback-montador');
  if (!box) return;
  box.hidden = false;
  box.textContent = mensagem;
}

function ocultarAlertaMontador() {
  const box = document.getElementById('alerta-feedback-montador');
  if (box) box.hidden = true;
}

function renderizarMontadorCompleto() {
  atualizarBotoesFinalidade();

  const areaSelecao = document.getElementById('container-etapa-selecao-montador');
  const areaResultado = document.getElementById('painel-resultado-montagem');

  if (!areaSelecao || !areaResultado) return;

  if (estadoApp.exibindoResultadoFinal) {
    areaSelecao.hidden = true;
    areaResultado.hidden = false;
    renderizarTelaResultadoFinal();
  } else {
    areaSelecao.hidden = false;
    areaResultado.hidden = true;
    renderizarAbasCategoriasPecas();
    renderizarGradeCatalogoPecas();
    renderizarResumoLateral();
  }
}

function renderizarAbasCategoriasPecas() {
  const nav = document.getElementById('nav-categorias-montador');
  if (!nav) return;

  nav.innerHTML = CATEGORIAS_MONTADOR.map((cat, idx) => {
    const pecaEscolhida = estadoApp.selecao[cat.id];
    const ativa = estadoApp.categoriaAtiva === cat.id && !estadoApp.termoBuscaPecas;
    return `
      <button
        type="button"
        class="aba-categoria-peca ${ativa ? 'ativa' : ''} ${pecaEscolhida ? 'preenchida' : ''}"
        data-cat-id="${cat.id}"
      >
        <div class="topo-aba-cat">
          <span>Etapa ${idx + 1}</span>
          <span class="status-categoria-ponto">${pecaEscolhida ? '✓ OK' : 'Pendente'}</span>
        </div>
        <div class="nome-aba-cat">${cat.tituloCurto}</div>
      </button>
    `;
  }).join('');

  nav.querySelectorAll('[data-cat-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estadoApp.categoriaAtiva = btn.getAttribute('data-cat-id');
      estadoApp.termoBuscaPecas = '';
      const inputBusca = document.getElementById('input-pesquisa-global');
      if (inputBusca) inputBusca.value = '';
      renderizarAbasCategoriasPecas();
      renderizarGradeCatalogoPecas();
    });
  });
}

function renderizarGradeCatalogoPecas() {
  const grade = document.getElementById('grade-catalogo-pecas');
  const tituloCat = document.getElementById('titulo-categoria-atual');
  const descCat = document.getElementById('descricao-categoria-atual');
  const btnLimparBusca = document.getElementById('btn-limpar-busca-pecas');

  if (!grade) return;

  let listaPecas = [];
  const termo = estadoApp.termoBuscaPecas.toLowerCase().trim();

  if (termo) {
    // Busca global em todas as 8 categorias
    for (const [catId, itens] of Object.entries(CATALOGO_PECAS)) {
      itens.forEach((p) => {
        const textoAlvo = `${p.nome} ${p.marca} ${p.especificacoes.join(' ')} ${catId}`.toLowerCase();
        if (textoAlvo.includes(termo)) {
          listaPecas.push(p);
        }
      });
    }
    if (tituloCat) tituloCat.textContent = `Resultados para "${estadoApp.termoBuscaPecas}" (${listaPecas.length})`;
    if (descCat) descCat.textContent = 'Mostrando componentes encontrados em todas as categorias do catálogo.';
    if (btnLimparBusca) btnLimparBusca.hidden = false;
  } else {
    const infoCat = CATEGORIAS_MONTADOR.find((c) => c.id === estadoApp.categoriaAtiva) || CATEGORIAS_MONTADOR[0];
    listaPecas = CATALOGO_PECAS[infoCat.id] || [];
    if (tituloCat) tituloCat.textContent = infoCat.nome;
    if (descCat) descCat.textContent = infoCat.descricao;
    if (btnLimparBusca) btnLimparBusca.hidden = true;
  }

  // Avalia compatibilidade de cada peça candidata em relação ao que já foi escolhido
  const itensAvaliados = listaPecas
    .map((peca) => {
      const avaliacao = avaliarCompatibilidadePeca(peca, estadoApp.selecao);
      return { peca, avaliacao };
    })
    .filter(({ avaliacao }) => (estadoApp.apenasCompativeis ? avaliacao.compativel : true));

  if (itensAvaliados.length === 0) {
    grade.innerHTML = `
      <div class="aviso-incompatibilidade-card" style="grid-column: 1 / -1; text-align: center; padding: 1.5rem;">
        Nenhum componente encontrado com os filtros atuais. Desmarque a opção "Apenas compatíveis" ou limpe a pesquisa.
      </div>
    `;
    return;
  }

  grade.innerHTML = itensAvaliados.map(({ peca, avaliacao }) => {
    const jaSelecionada = estadoApp.selecao[peca.categoria]?.id === peca.id;
    const { compativel, motivos } = avaliacao;

    let textoBotao = 'Selecionar';
    if (jaSelecionada) {
      textoBotao = 'Selecionado ✓ (Remover)';
    } else if (!compativel) {
      textoBotao = 'Incompatível';
    } else if (estadoApp.selecao[peca.categoria]) {
      textoBotao = 'Substituir Peça';
    }

    return `
      <article class="cartao-produto-peca ${jaSelecionada ? 'peca-selecionada' : ''} ${!compativel ? 'peca-incompativel' : ''}">
        <div>
          <div class="cartao-peca-topo-badges">
            <span class="badge-marca-peca">${peca.marca}</span>
            <span class="badge-compatibilidade ${compativel ? 'ok' : 'bloqueado'}">
              ${compativel ? '✓ Compatível' : '✕ Incompatível'}
            </span>
          </div>

          <div class="box-imagem-peca">
            <img src="${peca.imagem}" alt="${peca.nome}" loading="lazy" />
          </div>

          <h4 class="titulo-peca">${peca.nome}</h4>

          <ul class="lista-specs-peca">
            ${peca.especificacoes.map((esp) => `<li>${esp}</li>`).join('')}
          </ul>

          ${!compativel ? `
            <div class="aviso-incompatibilidade-card" role="alert">
              <strong>Seleção bloqueada:</strong> ${motivos.join(' ')}
            </div>
          ` : ''}
        </div>

        <div class="rodape-preco-acao-peca">
          <div class="bloco-preco-loja">
            <span class="rotulo-preco-vista">${peca.preco === 0 ? 'Sem custo adicional' : 'À vista no PIX'}</span>
            <span class="valor-preco-peca">${formatarMoeda(peca.preco)}</span>
          </div>

          <button
            type="button"
            class="btn-selecionar-peca ${jaSelecionada ? 'selecionada' : ''}"
            data-selecionar-peca="${peca.id}"
            ${!compativel && !jaSelecionada ? 'disabled' : ''}
          >
            ${textoBotao}
          </button>
        </div>
      </article>
    `;
  }).join('');

  grade.querySelectorAll('[data-selecionar-peca]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idPeca = btn.getAttribute('data-selecionar-peca');
      selecionarOuRemoverPeca(idPeca);
    });
  });
}

function selecionarOuRemoverPeca(idPeca) {
  const peca = buscarPecaPorId(idPeca);
  if (!peca) return;

  const atualNaCategoria = estadoApp.selecao[peca.categoria];

  // Se clicar na peça já selecionada, remove-a do slot
  if (atualNaCategoria && atualNaCategoria.id === peca.id) {
    estadoApp.selecao[peca.categoria] = null;
    ocultarAlertaMontador();
    renderizarMontadorCompleto();
    return;
  }

  // Verifica compatibilidade antes de permitir a seleção
  const avaliacao = avaliarCompatibilidadePeca(peca, estadoApp.selecao);
  if (!avaliacao.compativel) {
    exibirAlertaMontador(`Combinação incompatível: ${avaliacao.motivos.join(' ')}`);
    return;
  }

  estadoApp.selecao[peca.categoria] = peca;
  ocultarAlertaMontador();

  // Avança automaticamente para a próxima categoria ainda vazia (se não estiver em busca global)
  if (!estadoApp.termoBuscaPecas) {
    const proximaCatVazia = CATEGORIAS_MONTADOR.find((c) => !estadoApp.selecao[c.id]);
    if (proximaCatVazia) {
      estadoApp.categoriaAtiva = proximaCatVazia.id;
    }
  }

  renderizarMontadorCompleto();
}

function renderizarResumoLateral() {
  const listaSlots = document.getElementById('lista-slots-resumo');
  const spanConsumo = document.getElementById('resumo-consumo-watts');
  const spanFonteRec = document.getElementById('resumo-fonte-minima');
  const spanTotal = document.getElementById('resumo-preco-total');
  const spanParcelado = document.getElementById('resumo-preco-parcelado');
  const spanContagem = document.getElementById('resumo-contagem-pecas');

  if (!listaSlots) return;

  let total = 0;
  let qtdEscolhidas = 0;

  listaSlots.innerHTML = CATEGORIAS_MONTADOR.map((cat) => {
    const peca = estadoApp.selecao[cat.id];
    if (peca) {
      total += peca.preco;
      qtdEscolhidas += 1;
    }

    return `
      <li class="item-slot-resumo ${peca ? 'preenchido' : ''}">
        <div class="slot-info-texto">
          <span class="slot-nome-categoria">${cat.tituloCurto}</span>
          <span class="slot-nome-peca" title="${peca ? peca.nome : 'Não selecionado'}">
            ${peca ? peca.nome.split(',')[0] : 'Nenhum selecionado'}
          </span>
        </div>
        <div class="slot-preco-acoes">
          ${peca ? `<span class="slot-valor-peca">${formatarMoeda(peca.preco)}</span>` : ''}
          <button type="button" class="btn-trocar-slot" data-ir-cat="${cat.id}">
            ${peca ? 'Trocar' : 'Escolher'}
          </button>
        </div>
      </li>
    `;
  }).join('');

  listaSlots.querySelectorAll('[data-ir-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estadoApp.categoriaAtiva = btn.getAttribute('data-ir-cat');
      estadoApp.termoBuscaPecas = '';
      renderizarAbasCategoriasPecas();
      renderizarGradeCatalogoPecas();
    });
  });

  const { consumoWatts, fonteMinimaRecomendada } = calcularConsumoSistema(estadoApp.selecao);
  if (spanConsumo) spanConsumo.textContent = `Consumo est.: ~${consumoWatts}W`;
  if (spanFonteRec) spanFonteRec.textContent = `Fonte mín.: ${fonteMinimaRecomendada}W`;
  if (spanContagem) spanContagem.textContent = `${qtdEscolhidas}/8 peças`;
  if (spanTotal) spanTotal.textContent = formatarMoeda(total);
  if (spanParcelado) {
    const parcela = (total * 1.1) / 12;
    spanParcelado.textContent = `ou em até 12x de ${formatarMoeda(parcela)} no cartão`;
  }
}

/* ==========================================================================
   4. TELA DE RESULTADOS FINAIS DA MONTAGEM (FOCO EM DESEMPENHO E FPS)
   ========================================================================== */

function renderizarTelaResultadoFinal() {
  const container = document.getElementById('painel-resultado-montagem');
  if (!container) return;

  const relatorio = gerarRelatorioDesempenho(estadoApp.selecao, estadoApp.finalidadeMontagem);

  // Ordem rigorosa exigida:
  // 1. Resumo da configuração montada
  // 2. Preço total
  // 3. Desempenho esperado de acordo com a finalidade
  // 4. Estimativas de FPS (exclusivamente quando relevantes e sustentadas por dados)
  // 5. Aplicações ou jogos recomendados
  // 6. Pontos fortes e limitações
  // 7. Opção para voltar e editar os componentes

  const mostrarSecaoFps = relatorio.finalidade === 'jogos' || relatorio.finalidade === 'hibrido';
  const mostrarSecaoTrabalho = relatorio.finalidade === 'trabalho' || relatorio.finalidade === 'hibrido';

  container.innerHTML = `
    <div class="painel-resultado-final">
      <div class="cabecalho-secao" style="margin-bottom: 1.5rem;">
        <div>
          <span class="etiqueta-secao-topo">Configuração Concluída</span>
          <h3 class="titulo-secao">Análise de Desempenho do Computador Montado</h3>
          <p class="subtitulo-secao">
            Veja o que a sua máquina é capaz de executar na prática. Alterne a finalidade abaixo se desejar consultar outros cenários de uso.
          </p>
        </div>
        <div class="grupo-botoes-finalidade">
          <button type="button" class="btn-finalidade-opcao ${relatorio.finalidade === 'jogos' ? 'ativa' : ''}" data-resultado-finalidade="jogos">
            Jogos (PC Gamer)
          </button>
          <button type="button" class="btn-finalidade-opcao ${relatorio.finalidade === 'trabalho' ? 'ativa' : ''}" data-resultado-finalidade="trabalho">
            Trabalho e Produtividade
          </button>
          <button type="button" class="btn-finalidade-opcao ${relatorio.finalidade === 'hibrido' ? 'ativa' : ''}" data-resultado-finalidade="hibrido">
            Uso Híbrido
          </button>
        </div>
      </div>

      <!-- 1. RESUMO DA CONFIGURAÇÃO MONTADA -->
      <section class="bloco-resultado-secao">
        <h4 class="titulo-bloco-resultado">
          <span class="numero-ordem-resultado">1</span>
          Resumo da Configuração Montada
        </h4>
        <div class="grade-pecas-resultado-final">
          ${CATEGORIAS_MONTADOR.map((cat) => {
            const p = estadoApp.selecao[cat.id];
            if (!p) return '';
            return `
              <div class="card-peca-resumo-final">
                <img src="${p.imagem}" alt="${p.nome}" />
                <div style="min-width: 0;">
                  <span class="slot-nome-categoria">${cat.tituloCurto}</span>
                  <strong style="display:block; font-size:0.83rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${p.nome}">
                    ${p.nome.split(',')[0]}
                  </strong>
                  <span style="font-size:0.8rem; color:var(--cor-laranja); font-weight:700;">${formatarMoeda(p.preco)}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- 2. PREÇO TOTAL -->
      <section class="bloco-resultado-secao">
        <h4 class="titulo-bloco-resultado">
          <span class="numero-ordem-resultado">2</span>
          Preço Total da Montagem
        </h4>
        <div class="faixa-preco-resultado-final">
          <div>
            <span style="font-size:0.82rem; color:#9ca3af; text-transform:uppercase;">Valor Total dos 8 Componentes Selecionados</span>
            <p style="font-size:0.88rem; color:#d1d5db;">Em até 12x de ${formatarMoeda((relatorio.precoTotal * 1.1) / 12)} ou à vista com desconto no PIX</p>
          </div>
          <div class="valor-gigante-resultado">${formatarMoeda(relatorio.precoTotal)}</div>
        </div>
      </section>

      <!-- 3. DESEMPENHO ESPERADO DE ACORDO COM A FINALIDADE -->
      <section class="bloco-resultado-secao">
        <h4 class="titulo-bloco-resultado">
          <span class="numero-ordem-resultado">3</span>
          Desempenho Esperado (${relatorio.finalidade === 'jogos' ? 'Jogos' : relatorio.finalidade === 'trabalho' ? 'Trabalho e Produtividade' : 'Uso Híbrido'})
        </h4>
        <div class="caixa-desempenho-esperado">
          <span class="classificacao-badge-grande">Classificação: ${relatorio.classificacaoGeral}</span>
          <p style="font-size:0.95rem; color:var(--cor-texto-principal); font-weight:500;">
            ${relatorio.descricaoDesempenho}
          </p>
        </div>
      </section>

      <!-- 4. ESTIMATIVAS DE FPS (EXCLUSIVAMENTE PARA JOGOS OU USO HÍBRIDO) -->
      ${mostrarSecaoFps ? `
        <section class="bloco-resultado-secao">
          <h4 class="titulo-bloco-resultado">
            <span class="numero-ordem-resultado">4</span>
            Estimativas Médias de FPS em Jogos Populares (1080p e 1440p)
          </h4>
          <div class="grade-cartoes-fps">
            ${relatorio.estimativasFps.map((jogo) => {
              const largura1080 = jogo.fps1080p.disponivel ? Math.min(100, Math.round((jogo.fps1080p.media / 300) * 100)) : 0;
              const largura1440 = jogo.fps1440p.disponivel ? Math.min(100, Math.round((jogo.fps1440p.media / 300) * 100)) : 0;
              return `
                <article class="cartao-jogo-fps">
                  <div class="topo-cartao-fps">
                    <span class="nome-jogo-fps">${jogo.nome}</span>
                    <span class="genero-jogo-fps">${jogo.genero}</span>
                  </div>

                  <div class="linha-resolucao-fps">
                    <div class="cabecalho-res-fps">
                      <span><strong>1080p</strong> • ${jogo.fps1080p.qualidade}</span>
                      <span class="numero-fps-estimado">
                        ${jogo.fps1080p.disponivel ? `~${jogo.fps1080p.media} FPS` : 'Indisponível'}
                      </span>
                    </div>
                    ${jogo.fps1080p.disponivel ? `
                      <div class="barra-fps-trilha">
                        <div class="barra-fps-preenchimento" style="width: ${largura1080}%"></div>
                      </div>
                    ` : `
                      <p style="font-size:0.76rem; color:var(--cor-erro);">${jogo.fps1080p.motivo}</p>
                    `}
                  </div>

                  <div class="linha-resolucao-fps">
                    <div class="cabecalho-res-fps">
                      <span><strong>1440p</strong> • ${jogo.fps1440p.qualidade}</span>
                      <span class="numero-fps-estimado">
                        ${jogo.fps1440p.disponivel ? `~${jogo.fps1440p.media} FPS` : 'Indisponível'}
                      </span>
                    </div>
                    ${jogo.fps1440p.disponivel ? `
                      <div class="barra-fps-trilha">
                        <div class="barra-fps-preenchimento" style="width: ${largura1440}%"></div>
                      </div>
                    ` : `
                      <p style="font-size:0.76rem; color:var(--cor-texto-suave);">${jogo.fps1440p.motivo}</p>
                    `}
                  </div>
                </article>
              `;
            }).join('')}
          </div>
          <p class="nota-estimativa-fps">
            <strong>Aviso importante sobre desempenho:</strong> Os valores de FPS apresentados são <strong>estimativas médias</strong> baseadas em benchmarks documentados para a combinação de processador, placa de vídeo e memória RAM escolhida, nunca garantias absolutas. A taxa de quadros real varia conforme versão de driver, mapa da partida e temperatura ambiente.
          </p>
        </section>
      ` : ''}

      <!-- 5. APLICAÇÕES OU JOGOS RECOMENDADOS (INCLUI ANÁLISE DE TRABALHO E AUTOCAD) -->
      <section class="bloco-resultado-secao">
        <h4 class="titulo-bloco-resultado">
          <span class="numero-ordem-resultado">${mostrarSecaoFps ? '5' : '4'}</span>
          ${relatorio.finalidade === 'jogos' ? 'Jogos e Perfis Recomendados' : 'Aplicações Recomendadas e Adequação para Trabalho'}
        </h4>

        ${mostrarSecaoTrabalho ? `
          <div class="grade-adequacao-trabalho" style="margin-bottom: 1rem;">
            ${relatorio.avaliacaoAplicacoesTrabalho.map((app) => `
              <div class="cartao-adequacao-app">
                <strong style="display:block; font-size:0.9rem;">${app.area}</strong>
                <span class="badge-adequacao ${app.statusClasse}">${app.nivelAdequacao}</span>
                <p style="font-size:0.82rem; color:var(--cor-texto-secundario);">${app.detalhe}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <ul class="lista-marcadores-resultado">
          ${relatorio.recomendacoesUso.map((rec) => `<li>${rec}</li>`).join('')}
        </ul>
      </section>

      <!-- 6. PONTOS FORTES E LIMITAÇÕES -->
      <section class="bloco-resultado-secao">
        <h4 class="titulo-bloco-resultado">
          <span class="numero-ordem-resultado">${mostrarSecaoFps ? '6' : '5'}</span>
          Pontos Fortes e Possíveis Limitações da Configuração
        </h4>
        <div class="grade-fortes-limitacoes">
          <div class="caixa-pontos-fortes">
            <strong style="color:var(--cor-sucesso); font-size:0.95rem;">✓ Pontos Fortes da Montagem</strong>
            <ul class="lista-marcadores-resultado">
              ${relatorio.pontosFortes.map((pf) => `<li>${pf}</li>`).join('')}
            </ul>
          </div>
          <div class="caixa-limitacoes">
            <strong style="color:var(--cor-alerta); font-size:0.95rem;">! Possíveis Limitações de Desempenho</strong>
            <ul class="lista-marcadores-resultado">
              ${relatorio.limitacoes.map((lim) => `<li>${lim}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- 7. OPÇÃO PARA VOLTAR E EDITAR OS COMPONENTES -->
      <section class="bloco-resultado-secao" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <strong>Deseja ajustar alguma peça para melhorar o desempenho ou reduzir o orçamento?</strong>
          <p style="font-size:0.85rem; color:var(--cor-texto-secundario);">Suas escolhas continuam salvas no montador.</p>
        </div>
        <button type="button" class="btn-laranja-principal" id="btn-voltar-editar-pecas">
          ← Voltar e Editar Componentes
        </button>
      </section>
    </div>
  `;

  container.querySelectorAll('[data-resultado-finalidade]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estadoApp.finalidadeMontagem = btn.getAttribute('data-resultado-finalidade');
      atualizarBotoesFinalidade();
      renderizarTelaResultadoFinal();
    });
  });

  document.getElementById('btn-voltar-editar-pecas')?.addEventListener('click', () => {
    estadoApp.exibindoResultadoFinal = false;
    renderizarMontadorCompleto();
  });
}

/* ==========================================================================
   5. ABA "PCs GAMER" + VISUALIZADOR 3D EXCLUSIVO
   ========================================================================== */

function renderizarPcsGamer() {
  const grade = document.getElementById('grade-pcs-gamer');
  if (!grade) return;

  grade.innerHTML = PCS_GAMER.map((pc) => {
    const precoTotal = calcularPrecoPorIds(pc.pecasIds);
    return `
      <article class="cartao-pc-pronto">
        <div>
          <span class="badge-nivel-pc">Nível ${pc.nivel}</span>
          <div class="box-foto-pc-pronto">
            <img src="${pc.imagem}" alt="${pc.nome}" loading="lazy" />
          </div>
          <h3 class="nome-pc-pronto">${pc.nome}</h3>
          <p class="perfil-uso-pc">${pc.perfilUso}</p>
          <ul class="lista-componentes-pc">
            ${pc.componentesPrincipais.map((item) => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>

        <div class="rodape-cartao-pc">
          <div class="rotulo-preco-vista">Preço Total da Configuração</div>
          <div class="preco-pc-pronto">${formatarMoeda(precoTotal)}</div>
          <div class="acoes-cartao-pc">
            <button type="button" class="btn-laranja-principal" data-detalhes-pc="${pc.id}" data-tipo-pc="gamer">
              Consultar Detalhes e FPS
            </button>
            <button type="button" class="btn-secundario-simples" data-carregar-montador="${pc.id}" data-tipo-pc="gamer">
              Personalizar no Montador
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Controles do Visualizador 3D exclusivo da aba Gamer
  document.querySelectorAll('[data-acao-3d]').forEach((btn) => {
    btn.addEventListener('click', () => {
      controlarCamera3D(btn.getAttribute('data-acao-3d'));
    });
  });

  document.querySelectorAll('[data-preset-3d]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idPreset = btn.getAttribute('data-preset-3d');
      const pc = PCS_GAMER.find((item) => item.id === idPreset);
      if (pc && pc.preset3D) {
        document.querySelectorAll('[data-preset-3d]').forEach((b) => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        atualizarPreset3DGamer(pc.preset3D);
      }
    });
  });

  vincularBotoesCartoesPcs(grade);
}

/* ==========================================================================
   6. ABA "PCs PARA TRABALHO" (3 NÍVEIS PRÉ-MONTADOS)
   ========================================================================== */

function renderizarPcsTrabalho() {
  const grade = document.getElementById('grade-pcs-trabalho');
  if (!grade) return;

  grade.innerHTML = PCS_TRABALHO.map((pc) => {
    const precoTotal = calcularPrecoPorIds(pc.pecasIds);
    return `
      <article class="cartao-pc-pronto">
        <div>
          <span class="badge-nivel-pc">Nível ${pc.nivel}</span>
          <div class="box-foto-pc-pronto">
            <img src="${pc.imagem}" alt="PC para Trabalho ${pc.nivel}" loading="lazy" />
          </div>
          <h3 class="nome-pc-pronto">PC Trabalho ${pc.nivel} — ${pc.subtitulo}</h3>
          <p class="perfil-uso-pc"><strong>Finalidade:</strong> ${pc.finalidade}</p>

          <ul class="lista-componentes-pc">
            ${pc.componentesPrincipais.map((c) => `<li>• ${c}</li>`).join('')}
            <li>• <strong>Memória:</strong> ${pc.memoriaResumo}</li>
            <li>• <strong>Armazenamento:</strong> ${pc.armazenamentoResumo}</li>
          </ul>

          <div class="bloco-limitacoes-trabalho">
            <strong>Limitações Técnicas:</strong>
            <ul style="padding-left: 1rem; margin-top: 0.25rem;">
              ${pc.limitacoes.map((lim) => `<li>${lim}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="rodape-cartao-pc">
          <div class="rotulo-preco-vista">Preço da Configuração Pré-Montada</div>
          <div class="preco-pc-pronto">${formatarMoeda(precoTotal)}</div>
          <div class="acoes-cartao-pc">
            <button type="button" class="btn-laranja-principal" data-detalhes-pc="${pc.id}" data-tipo-pc="trabalho">
              Visualizar Configuração
            </button>
            <button type="button" class="btn-secundario-simples" data-carregar-montador="${pc.id}" data-tipo-pc="trabalho">
              Personalizar no Montador
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  vincularBotoesCartoesPcs(grade);
}

function vincularBotoesCartoesPcs(container) {
  container.querySelectorAll('[data-detalhes-pc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-detalhes-pc');
      const tipo = btn.getAttribute('data-tipo-pc');
      abrirModalDetalhesPc(id, tipo);
    });
  });

  container.querySelectorAll('[data-carregar-montador]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-carregar-montador');
      const tipo = btn.getAttribute('data-tipo-pc');
      carregarConfiguracaoNoMontador(id, tipo, false);
    });
  });
}

function carregarConfiguracaoNoMontador(idPc, tipo, abrirDiretoNoResultado = false) {
  const fonteLista = tipo === 'gamer' ? PCS_GAMER : PCS_TRABALHO;
  const pc = fonteLista.find((item) => item.id === idPc);
  if (!pc) return;

  Object.entries(pc.pecasIds).forEach(([cat, idPeca]) => {
    estadoApp.selecao[cat] = buscarPecaPorId(idPeca);
  });

  estadoApp.finalidadeMontagem = tipo === 'gamer' ? 'jogos' : 'trabalho';
  estadoApp.exibindoResultadoFinal = abrirDiretoNoResultado;
  fecharModalDetalhesPc();
  mudarAba('montar');
}

/* ==========================================================================
   7. MODAL DE DETALHES DE CONFIGURAÇÃO (GAMER / TRABALHO)
   ========================================================================== */

function configurarModalDetalhes() {
  document.getElementById('btn-fechar-modal-detalhes')?.addEventListener('click', fecharModalDetalhesPc);
  document.getElementById('modal-detalhes-pc')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-detalhes-pc') fecharModalDetalhesPc();
  });
}

function abrirModalDetalhesPc(idPc, tipo) {
  const modal = document.getElementById('modal-detalhes-pc');
  const corpo = document.getElementById('corpo-modal-detalhes-pc');
  const titulo = document.getElementById('titulo-modal-detalhes-pc');
  if (!modal || !corpo || !titulo) return;

  const lista = tipo === 'gamer' ? PCS_GAMER : PCS_TRABALHO;
  const pc = lista.find((item) => item.id === idPc);
  if (!pc) return;

  const selecaoTemp = {};
  Object.entries(pc.pecasIds).forEach(([cat, idPeca]) => {
    selecaoTemp[cat] = buscarPecaPorId(idPeca);
  });

  const relatorio = gerarRelatorioDesempenho(selecaoTemp, tipo === 'gamer' ? 'jogos' : 'trabalho');
  titulo.textContent = pc.nome || `PC Trabalho ${pc.nivel} — ${pc.subtitulo}`;

  corpo.innerHTML = `
    <p style="font-size:0.9rem; color:var(--cor-texto-secundario); margin-bottom:1rem;">
      ${pc.perfilUso || pc.finalidade}
    </p>

    <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:0.5rem;">Peças Inclusas na Montagem:</h4>
    <ul class="lista-componentes-pc" style="margin-bottom:1rem;">
      ${CATEGORIAS_MONTADOR.map((cat) => {
        const p = selecaoTemp[cat.id];
        return p
          ? `<li><strong>${cat.tituloCurto}:</strong> ${p.nome} — <span style="color:var(--cor-laranja); font-weight:700;">${formatarMoeda(p.preco)}</span></li>`
          : '';
      }).join('')}
    </ul>

    <div class="faixa-preco-resultado-final" style="margin-bottom:1rem; padding:0.9rem 1.15rem;">
      <span>Preço Total dos Componentes:</span>
      <strong style="font-size:1.4rem; color:var(--cor-laranja);">${formatarMoeda(relatorio.precoTotal)}</strong>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:flex-end;">
      <button type="button" class="btn-secundario-simples" id="btn-modal-personalizar">
        Personalizar Peças no Montador
      </button>
      <button type="button" class="btn-laranja-principal" id="btn-modal-ver-desempenho">
        Ver Relatório Completo de Desempenho
      </button>
    </div>
  `;

  document.getElementById('btn-modal-personalizar')?.addEventListener('click', () => {
    carregarConfiguracaoNoMontador(idPc, tipo, false);
  });

  document.getElementById('btn-modal-ver-desempenho')?.addEventListener('click', () => {
    carregarConfiguracaoNoMontador(idPc, tipo, true);
  });

  modal.hidden = false;
}

function fecharModalDetalhesPc() {
  const modal = document.getElementById('modal-detalhes-pc');
  if (modal) modal.hidden = true;
}

/* ==========================================================================
   8. ABA "SOBRE A EQUIPE"
   ========================================================================== */

function renderizarEquipe() {
  const grade = document.getElementById('grade-equipe-desenvolvimento');
  if (!grade) return;

  grade.innerHTML = EQUIPE_DESENVOLVIMENTO.map((membro) => `
    <article class="cartao-membro-equipe">
      <div class="avatar-iniciais-equipe" aria-hidden="true">${membro.iniciais}</div>
      <div>
        <h3 class="nome-membro-equipe">${membro.nome}</h3>
        <p class="funcao-membro-equipe">${membro.funcao}</p>
      </div>
    </article>
  `).join('');
}
})();

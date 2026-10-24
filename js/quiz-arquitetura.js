/**
 * Controlador Interativo — Aprenda Arquitetura da Computação
 * 
 * Gerencia a listagem dos 12 cartões temáticos e o fluxo interativo de perguntas:
 * 1. Seleção do tema em cartão clicável.
 * 2. Exibição de uma pergunta por vez com 4 alternativas.
 * 3. Seleção de apenas uma alternativa por questão.
 * 4. Confirmação de resposta com feedback imediato (Correta / Incorreta) e explicação técnica.
 * 5. Avanço para a próxima questão e tela final de pontuação com opção de tentar novamente.
 */

(() => {
window.Konoha = window.Konoha || {};

const estadoQuiz = {
  temaAtual: null,
  indicePergunta: 0,
  alternativaSelecionada: null,
  respostaConfirmada: false,
  acertos: 0
};

function inicializarSecaoArquitetura() {
  renderizarCartoesTemas();
}

function renderizarCartoesTemas() {
  const { TEMAS_ARQUITETURA } = window.Konoha;
  const gradeTemas = document.getElementById('grade-temas-arquitetura');
  const painelPergunta = document.getElementById('painel-quiz-arquitetura');
  if (!gradeTemas || !painelPergunta) return;

  gradeTemas.hidden = false;
  painelPergunta.hidden = true;

  gradeTemas.innerHTML = TEMAS_ARQUITETURA.map((tema, idx) => `
    <article class="cartao-tema-arquitetura" data-tema-id="${tema.id}">
      <div class="cartao-tema-topo">
        <span class="badge-tema-numero">Tema ${String(idx + 1).padStart(2, '0')}</span>
        <span class="badge-tema-etiqueta">${tema.etiqueta}</span>
      </div>
      <h3 class="cartao-tema-titulo">${tema.titulo}</h3>
      <p class="cartao-tema-descricao">${tema.descricao}</p>
      <div class="cartao-tema-rodape">
        <span class="meta-qtd-perguntas">${tema.perguntas.length} perguntas interativas</span>
        <button type="button" class="btn-iniciar-tema" data-iniciar-tema="${tema.id}">
          Iniciar Perguntas
        </button>
      </div>
    </article>
  `).join('');

  gradeTemas.querySelectorAll('[data-iniciar-tema]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      iniciarTema(btn.getAttribute('data-iniciar-tema'));
    });
  });

  gradeTemas.querySelectorAll('.cartao-tema-arquitetura').forEach((card) => {
    card.addEventListener('click', () => {
      iniciarTema(card.getAttribute('data-tema-id'));
    });
  });
}

function iniciarTema(idTema) {
  const { TEMAS_ARQUITETURA } = window.Konoha;
  const tema = TEMAS_ARQUITETURA.find((t) => t.id === idTema);
  if (!tema) return;

  estadoQuiz.temaAtual = tema;
  estadoQuiz.indicePergunta = 0;
  estadoQuiz.alternativaSelecionada = null;
  estadoQuiz.respostaConfirmada = false;
  estadoQuiz.acertos = 0;

  const gradeTemas = document.getElementById('grade-temas-arquitetura');
  const painelPergunta = document.getElementById('painel-quiz-arquitetura');
  if (gradeTemas && painelPergunta) {
    gradeTemas.hidden = true;
    painelPergunta.hidden = false;
    renderizarPerguntaAtual();
    painelPergunta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderizarPerguntaAtual() {
  const painel = document.getElementById('painel-quiz-arquitetura');
  if (!painel || !estadoQuiz.temaAtual) return;

  const { temaAtual, indicePergunta, alternativaSelecionada, respostaConfirmada } = estadoQuiz;
  const total = temaAtual.perguntas.length;

  // Se terminou todas as perguntas do tema, exibe a pontuação final
  if (indicePergunta >= total) {
    renderizarResultadoTema(painel);
    return;
  }

  const questao = temaAtual.perguntas[indicePergunta];
  const letras = ['A', 'B', 'C', 'D'];

  painel.innerHTML = `
    <div class="quiz-container-interno">
      <div class="quiz-cabecalho">
        <div>
          <span class="badge-tema-etiqueta">${temaAtual.etiqueta}</span>
          <h3 class="quiz-titulo-tema">${temaAtual.titulo}</h3>
        </div>
        <button type="button" class="btn-secundario-simples" id="btn-voltar-temas">
          ← Todos os Temas
        </button>
      </div>

      <div class="quiz-progresso-barra">
        <div class="quiz-progresso-texto">
          <span>Pergunta <strong>${indicePergunta + 1}</strong> de <strong>${total}</strong></span>
          <span>Pontuação parcial: <strong>${estadoQuiz.acertos}</strong> acerto(s)</span>
        </div>
        <div class="quiz-trilha-progresso">
          <div class="quiz-preenchimento-progresso" style="width: ${Math.round(((indicePergunta + 1) / total) * 100)}%"></div>
        </div>
      </div>

      <div class="quiz-enunciado-box">
        <p class="quiz-enunciado-texto">${questao.enunciado}</p>
      </div>

      <div class="quiz-lista-alternativas" role="radiogroup" aria-label="Alternativas da questão">
        ${questao.alternativas.map((textoAlt, idx) => {
          let classeEstado = '';
          if (alternativaSelecionada === idx && !respostaConfirmada) {
            classeEstado = 'selecionada';
          } else if (respostaConfirmada) {
            if (idx === questao.correta) {
              classeEstado = 'correta';
            } else if (idx === alternativaSelecionada && idx !== questao.correta) {
              classeEstado = 'incorreta';
            }
          }

          return `
            <button
              type="button"
              class="quiz-opcao-alternativa ${classeEstado}"
              data-alt-index="${idx}"
              ${respostaConfirmada ? 'disabled' : ''}
              aria-pressed="${alternativaSelecionada === idx}"
            >
              <span class="quiz-letra-alternativa">${letras[idx]}</span>
              <span class="quiz-texto-alternativa">${textoAlt}</span>
            </button>
          `;
        }).join('')}
      </div>

      ${respostaConfirmada ? `
        <div class="quiz-feedback-box ${alternativaSelecionada === questao.correta ? 'feedback-correto' : 'feedback-incorreto'}">
          <div class="quiz-feedback-titulo">
            ${alternativaSelecionada === questao.correta
              ? '✓ Resposta Correta!'
              : `✕ Resposta Incorreta — A alternativa correta é a letra ${letras[questao.correta]}.`}
          </div>
          <p class="quiz-feedback-explicacao">
            <strong>Explicação Técnica:</strong> ${questao.explicacao}
          </p>
        </div>
      ` : ''}

      <div class="quiz-acoes-rodape">
        ${!respostaConfirmada ? `
          <button
            type="button"
            class="btn-laranja-principal"
            id="btn-confirmar-resposta"
            ${alternativaSelecionada === null ? 'disabled' : ''}
          >
            Confirmar Resposta
          </button>
        ` : `
          <button type="button" class="btn-laranja-principal" id="btn-proxima-pergunta">
            ${indicePergunta + 1 < total ? 'Próxima Pergunta →' : 'Ver Pontuação Final →'}
          </button>
        `}
      </div>
    </div>
  `;

  document.getElementById('btn-voltar-temas')?.addEventListener('click', renderizarCartoesTemas);

  painel.querySelectorAll('[data-alt-index]').forEach((btnAlt) => {
    btnAlt.addEventListener('click', () => {
      if (estadoQuiz.respostaConfirmada) return;
      estadoQuiz.alternativaSelecionada = Number(btnAlt.getAttribute('data-alt-index'));
      renderizarPerguntaAtual();
    });
  });

  document.getElementById('btn-confirmar-resposta')?.addEventListener('click', () => {
    if (estadoQuiz.alternativaSelecionada === null || estadoQuiz.respostaConfirmada) return;
    estadoQuiz.respostaConfirmada = true;
    if (estadoQuiz.alternativaSelecionada === questao.correta) {
      estadoQuiz.acertos += 1;
    }
    renderizarPerguntaAtual();
  });

  document.getElementById('btn-proxima-pergunta')?.addEventListener('click', () => {
    estadoQuiz.indicePergunta += 1;
    estadoQuiz.alternativaSelecionada = null;
    estadoQuiz.respostaConfirmada = false;
    renderizarPerguntaAtual();
  });
}

function renderizarResultadoTema(painel) {
  const { temaAtual, acertos } = estadoQuiz;
  const total = temaAtual.perguntas.length;
  const percentual = Math.round((acertos / total) * 100);

  let mensagemDesempenho = 'Bom estudo! Revise as explicações técnicas para consolidar os conceitos.';
  if (percentual === 100) {
    mensagemDesempenho = 'Excelente! Você acertou todas as questões deste tema de Arquitetura da Computação.';
  } else if (percentual >= 65) {
    mensagemDesempenho = 'Ótimo resultado! Você compreendeu bem os conceitos fundamentais deste tema.';
  }

  painel.innerHTML = `
    <div class="quiz-container-interno quiz-resultado-final">
      <span class="badge-tema-etiqueta">Tema Concluído</span>
      <h3 class="quiz-titulo-tema">${temaAtual.titulo}</h3>
      <div class="quiz-placar-circulo">
        <span class="quiz-placar-numero">${acertos} / ${total}</span>
        <span class="quiz-placar-sub">(${percentual}% de acerto)</span>
      </div>
      <p class="quiz-resultado-mensagem">${mensagemDesempenho}</p>
      <div class="quiz-acoes-resultado">
        <button type="button" class="btn-laranja-principal" id="btn-tentar-novamente">
          Tentar Novamente este Tema
        </button>
        <button type="button" class="btn-secundario-simples" id="btn-escolher-outro-tema">
          Escolher Outro Tema
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-tentar-novamente')?.addEventListener('click', () => {
    iniciarTema(temaAtual.id);
  });

  document.getElementById('btn-escolher-outro-tema')?.addEventListener('click', () => {
    renderizarCartoesTemas();
  });
}

Object.assign(window.Konoha, {
  inicializarSecaoArquitetura,
  renderizarCartoesTemas,
  iniciarTema
});
})();

/**
 * Módulo de Autenticação Real Google (Google Identity Services SDK)
 * 
 * Requisitos cumpridos:
 * - Utiliza exclusivamente a solução oficial Google Identity Services (`https://accounts.google.com/gsi/client`).
 * - Solicita apenas identificação do e-mail da conta (`openid email profile`).
 * - NUNCA simula login falso quando as credenciais não estão configuradas.
 * - Exibe o e-mail autenticado no cabeçalho e permite encerrar a sessão (revogação/logout).
 */

(() => {
window.Konoha = window.Konoha || {};

let tokenClient = null;
let usuarioAutenticado = null;

/**
 * Obtém o Client ID ativo (do arquivo `config-auth.js` ou salvo no navegador).
 */
function obterClientIdAtivo() {
  const { GOOGLE_AUTH_CONFIG } = window.Konoha;
  const fixo = (GOOGLE_AUTH_CONFIG.clientId || '').trim();
  if (fixo) return fixo;
  try {
    return (localStorage.getItem(GOOGLE_AUTH_CONFIG.storageKeyClientId) || '').trim();
  } catch {
    return '';
  }
}

/**
 * Verifica se o Client ID possui o formato oficial do Google Cloud (`.apps.googleusercontent.com`).
 */
function clientIdValido(clientId) {
  return Boolean(clientId && clientId.endsWith('.apps.googleusercontent.com') && clientId.length > 30);
}

/**
 * Inicializa o estado de autenticação e restaura sessão válida se existir.
 */
function inicializarAutenticacaoGoogle() {
  const { GOOGLE_AUTH_CONFIG } = window.Konoha;
  try {
    const salvo = sessionStorage.getItem(GOOGLE_AUTH_CONFIG.storageKeyUser);
    if (salvo) {
      const dados = JSON.parse(salvo);
      if (dados && dados.email && dados.autenticadoViaGoogleOficial === true) {
        usuarioAutenticado = dados;
      }
    }
  } catch {
    usuarioAutenticado = null;
  }

  atualizarInterfaceAuth();

  // Botão principal no cabeçalho
  document.getElementById('btn-entrar-google')?.addEventListener('click', iniciarFluxoLoginGoogle);
  document.getElementById('btn-sair-google')?.addEventListener('click', encerrarSessaoGoogle);

  // Eventos do modal de configuração de Client ID
  document.getElementById('btn-fechar-modal-auth')?.addEventListener('click', fecharModalConfigAuth);
  document.getElementById('form-config-client-id')?.addEventListener('submit', (e) => {
    e.preventDefault();
    salvarClientIdEAutenticar();
  });
}

/**
 * Inicia o fluxo oficial de autenticação OAuth 2.0 com conta Google.
 */
function iniciarFluxoLoginGoogle() {
  const { GOOGLE_AUTH_CONFIG } = window.Konoha;
  const clientId = obterClientIdAtivo();

  if (!clientIdValido(clientId)) {
    abrirModalConfigAuth(
      'Credencial OAuth 2.0 pendente: informe um Google Client ID válido (.apps.googleusercontent.com) para iniciar a autenticação oficial do Google.'
    );
    return;
  }

  if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
    abrirModalConfigAuth(
      'A biblioteca oficial Google Identity Services (accounts.google.com/gsi/client) ainda não carregou ou não há conexão com a internet.'
    );
    return;
  }

  try {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_AUTH_CONFIG.scopes,
      prompt: 'select_account',
      callback: async (tokenResponse) => {
        if (tokenResponse && tokenResponse.error) {
          exibirMensagemAuthModal(`Falha na autorização Google: ${tokenResponse.error_description || tokenResponse.error}`, true);
          return;
        }
        if (tokenResponse && tokenResponse.access_token) {
          await buscarPerfilEmailGoogle(tokenResponse.access_token);
        }
      },
      error_callback: (err) => {
        abrirModalConfigAuth(
          `Não foi possível concluir a janela do Google (${err?.type || 'erro de origem/credencial'}). Verifique se a URL atual (${window.location.origin}) está autorizada no Google Cloud Console.`
        );
      }
    });

    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (erro) {
    abrirModalConfigAuth(`Erro ao inicializar cliente OAuth Google: ${erro.message}`);
  }
}

/**
 * Consulta o endpoint oficial de UserInfo do Google para obter o e-mail verificado da conta autenticada.
 */
async function buscarPerfilEmailGoogle(accessToken) {
  const { GOOGLE_AUTH_CONFIG } = window.Konoha;
  try {
    const resposta = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!resposta.ok) {
      throw new Error('Falha ao validar token junto ao servidor Google.');
    }

    const perfil = await resposta.json();
    if (!perfil || !perfil.email) {
      throw new Error('A resposta do Google não retornou um endereço de e-mail válido.');
    }

    usuarioAutenticado = {
      email: perfil.email,
      nome: perfil.name || perfil.email.split('@')[0],
      foto: perfil.picture || '',
      accessToken,
      autenticadoViaGoogleOficial: true
    };

    try {
      sessionStorage.setItem(GOOGLE_AUTH_CONFIG.storageKeyUser, JSON.stringify(usuarioAutenticado));
    } catch {
      // Ignora erro de quota
    }

    fecharModalConfigAuth();
    atualizarInterfaceAuth();
  } catch (erro) {
    abrirModalConfigAuth(`Erro ao obter e-mail autenticado do Google: ${erro.message}`);
  }
}

/**
 * Encerra a sessão ativa e revoga o token se disponível.
 */
function encerrarSessaoGoogle() {
  const { GOOGLE_AUTH_CONFIG } = window.Konoha;
  if (usuarioAutenticado?.accessToken && window.google?.accounts?.oauth2) {
    try {
      window.google.accounts.oauth2.revoke(usuarioAutenticado.accessToken, () => {});
    } catch {
      // Prossegue com limpeza local
    }
  }

  usuarioAutenticado = null;
  try {
    sessionStorage.removeItem(GOOGLE_AUTH_CONFIG.storageKeyUser);
  } catch {
    // Ignora
  }

  atualizarInterfaceAuth();
}

/**
 * Atualiza os elementos do cabeçalho para mostrar o botão "Entrar com Google" ou o e-mail autenticado.
 */
function atualizarInterfaceAuth() {
  const btnEntrar = document.getElementById('btn-entrar-google');
  const boxLogado = document.getElementById('box-usuario-google');
  const spanEmail = document.getElementById('texto-email-autenticado');

  if (!btnEntrar || !boxLogado || !spanEmail) return;

  if (usuarioAutenticado && usuarioAutenticado.email) {
    btnEntrar.hidden = true;
    boxLogado.hidden = false;
    spanEmail.textContent = usuarioAutenticado.email;
  } else {
    btnEntrar.hidden = false;
    boxLogado.hidden = true;
    spanEmail.textContent = '';
  }
}

function abrirModalConfigAuth(mensagemStatus) {
  const modal = document.getElementById('modal-config-google');
  const inputClientId = document.getElementById('input-google-client-id');
  const origemSpan = document.getElementById('texto-origem-atual');

  if (!modal) return;
  if (origemSpan) {
    origemSpan.textContent = window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'http://localhost:5500 (execute via servidor HTTP local)';
  }
  if (inputClientId) {
    inputClientId.value = obterClientIdAtivo();
  }

  exibirMensagemAuthModal(mensagemStatus, true);
  modal.hidden = false;
}

function fecharModalConfigAuth() {
  const modal = document.getElementById('modal-config-google');
  if (modal) modal.hidden = true;
}

function exibirMensagemAuthModal(msg, isAviso = false) {
  const boxMsg = document.getElementById('msg-status-modal-auth');
  if (!boxMsg) return;
  if (!msg) {
    boxMsg.hidden = true;
    return;
  }
  boxMsg.hidden = false;
  boxMsg.className = `alerta-modal-auth ${isAviso ? 'alerta-aviso' : 'alerta-sucesso'}`;
  boxMsg.textContent = msg;
}

function salvarClientIdEAutenticar() {
  const { GOOGLE_AUTH_CONFIG } = window.Konoha;
  const input = document.getElementById('input-google-client-id');
  const valor = (input?.value || '').trim();

  if (!clientIdValido(valor)) {
    exibirMensagemAuthModal(
      'Formato inválido: o Client ID oficial do Google deve terminar com ".apps.googleusercontent.com". O login não é simulado sem uma credencial real.',
      true
    );
    return;
  }

  try {
    localStorage.setItem(GOOGLE_AUTH_CONFIG.storageKeyClientId, valor);
  } catch {
    // Ignora
  }

  exibirMensagemAuthModal('Client ID salvo! Abrindo janela oficial de autenticação do Google...', false);
  iniciarFluxoLoginGoogle();
}

Object.assign(window.Konoha, {
  obterClientIdAtivo,
  clientIdValido,
  inicializarAutenticacaoGoogle,
  iniciarFluxoLoginGoogle,
  encerrarSessaoGoogle
});
})();

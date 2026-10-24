/**
 * Configuração da Autenticação Oficial Google (Google Identity Services - OAuth 2.0)
 * 
 * Para habilitar o login direto sem abrir o modal de configuração:
 * 1. Acesse https://console.cloud.google.com/apis/credentials
 * 2. Crie um "ID do cliente OAuth 2.0" do tipo "Aplicativo da Web".
 * 3. Adicione a origem local (ex.: http://localhost:5500 ou http://127.0.0.1:5500 ou http://localhost:8080)
 *    em "Origens JavaScript autorizadas".
 * 4. Cole o Client ID gerado (terminado em .apps.googleusercontent.com) na propriedade `clientId` abaixo,
 *    ou informe-o diretamente na interface ao clicar em "Entrar com Google".
 * 
 * Escopos utilizados: exclusivamente `openid email profile` (identificação do e-mail autenticado,
 * sem qualquer permissão de leitura de caixa de entrada, contatos ou arquivos).
 */

(() => {
window.Konoha = window.Konoha || {};

const GOOGLE_AUTH_CONFIG = {
  clientId: '', // Ex.: '1234567890-abcdefg.apps.googleusercontent.com'
  scopes: 'openid email profile',
  storageKeyUser: 'konoha_hardware_google_user',
  storageKeyClientId: 'konoha_hardware_google_client_id'
};

Object.assign(window.Konoha, {
  GOOGLE_AUTH_CONFIG
});
})();

# Konoha Hardware — Montador de PCs, Configurações e Arquitetura da Computação

Aplicação web desenvolvida do zero com HTML5, CSS3 e JavaScript ES6+ modular, inspirada na experiência de navegação de lojas de informática (Pichau, KaBuM!, Terabyte Shop) e na paleta de cores de **Naruto** (laranja `#FF6B00`, grafite/preto, branco, cinza-claro e azul-escuro complementar), sem efeitos futuristas, neon ou imagens de anime.

---

## 1. Estrutura de Arquivos do Projeto

```text
montapc/
├── index.html                        # Estrutura principal e navegação entre as seções
├── README.md                         # Documentação de execução e configuração OAuth
├── assets/
│   ├── css/
│   │   ├── global.css                # Paleta Naruto, tipografia, cabeçalho e rodapé
│   │   └── componentes.css           # Cartões de produtos, montador, resultados, quiz e modais
│   ├── img/
│   │   └── pecas/                    # Fotografias reais de todas as peças do catálogo
│   └── models/
│       └── gabinete-gamer.glb        # Modelo 3D do gabinete gamer
├── data/
│   ├── pecas.js                      # Base de dados de componentes nas 8 categorias (fácil atualização)
│   ├── pcs-prontos.js                # Configurações PCs Gamer, PCs para Trabalho e dados da equipe
│   └── arquitetura-questoes.js       # 12 temas e questões interativas de Arquitetura da Computação
└── js/
    ├── main.js                       # Controlador principal de navegação, busca e montador
    ├── compatibilidade.js            # Motor independente de compatibilidade durante a seleção
    ├── desempenho.js                 # Motor de avaliação de desempenho, estimativas de FPS e AutoCAD
    ├── visualizador-3d.js            # Visualizador 3D isolado exclusivamente na aba "PCs Gamer"
    ├── quiz-arquitetura.js           # Controlador do módulo "Aprenda Arquitetura da Computação"
    ├── config-auth.js                # Arquivo de configuração do Client ID Google OAuth 2.0
    └── auth-google.js                # Autenticação oficial Google Identity Services
```

---

## 2. Como Iniciar o Projeto

Como o projeto utiliza **JavaScript ES6 Modules (`type="module"`)**, abra-o por meio de um servidor HTTP local (como a extensão **Live Server** do VS Code, Python `http.server` ou Node `npx serve`):

### Opção 1 — VS Code (Live Server)
1. Abra a pasta `montapc` no Visual Studio Code.
2. Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

### Opção 2 — Terminal (Python ou Node.js)
```bash
# Usando Python 3:
python -m http.server 5500

# Ou usando Node.js:
npx serve -l 5500
```
Em seguida, acesse `http://localhost:5500` no navegador.

---

## 3. Como Configurar a Autenticação Oficial Google (OAuth 2.0)

O login utiliza exclusivamente o **Google Identity Services SDK** (`https://accounts.google.com/gsi/client`) com os escopos mínimos `openid email profile` para identificar e exibir o e-mail autenticado no cabeçalho. O sistema **não simula logins falsos** caso as credenciais ainda não estejam configuradas.

### Passo a passo:
1. Acesse o [Google Cloud Console — Credenciais](https://console.cloud.google.com/apis/credentials).
2. Crie um projeto (ou selecione um existente) e configure a **Tela de permissão OAuth** como *Externo* (adicionando seu e-mail como usuário de teste, se em modo de teste).
3. Clique em **Criar credenciais → ID do cliente OAuth** e escolha o tipo **Aplicativo da Web**.
4. Em **Origens JavaScript autorizadas**, adicione a URL onde o projeto está rodando (ex.: `http://localhost:5500` e `http://127.0.0.1:5500`).
5. Copie o **ID do cliente** gerado (terminado em `.apps.googleusercontent.com`) e configure-o de uma das duas maneiras:
   - **No código:** abra `js/config-auth.js` e preencha a propriedade `clientId`.
   - **Na interface:** clique em **"Entrar com Google"** no cabeçalho do site, cole o Client ID no modal de configuração e clique em **Salvar Client ID e Autenticar com Google**.

---

## 4. Como Atualizar Preços e Especificações dos Componentes

Todos os componentes estão centralizados em `data/pecas.js` organizados nas 8 categorias:
- `cpu` (Processador)
- `placamae` (Placa-mãe)
- `ram` (Memória RAM)
- `gpu` (Placa de vídeo)
- `armazenamento` (Armazenamento SSD)
- `fonte` (Fonte de alimentação)
- `gabinete` (Gabinete)
- `cooler` (Cooler de processador)

Para atualizar um preço ou especificação, basta editar o objeto correspondente em `data/pecas.js`. Os valores totais do montador, dos PCs Gamer e dos PCs para Trabalho são recalculados automaticamente.

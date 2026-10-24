/**
 * Configurações Pré-Montadas (PCs Gamer e PCs para Trabalho) e Dados da Equipe
 * 
 * Todos os computadores pré-montados referenciam peças reais do catálogo (`data/pecas.js`),
 * permitindo que o usuário consulte todos os detalhes ou carregue a configuração diretamente
 * na aba "Montar seu PC" para personalização.
 */

(() => {
window.Konoha = window.Konoha || {};

const PCS_GAMER = [
  {
    id: 'gamer-entrada',
    nivel: 'Entrada',
    badgeCor: 'entrada',
    nome: 'Konoha Genin — Gamer 1080p Full HD',
    imagem: 'assets/img/pecas/case-mesh.jpg',
    resumoCurto: 'Configuração acessível e equilibrada para jogar em 1080p (Full HD) com alta fluidez em títulos competitivos e jogos populares.',
    perfilUso: 'Indicado para CS2, Valorant, Fortnite, GTA V e jogos atuais em Full HD (1080p) na qualidade Média/Alta.',
    componentesPrincipais: [
      'Processador AMD Ryzen 5 5600 (6C/12T até 4.4GHz)',
      'Placa de Vídeo Radeon RX 6600 8GB GDDR6',
      'Memória 16GB (2x8GB) DDR4 3200MHz Dual Channel',
      'Placa-Mãe MSI A520M-A PRO AM4',
      'SSD Kingston NV2 500GB M.2 NVMe PCIe 4.0',
      'Fonte MSI MAG A650BN 650W 80 Plus Bronze'
    ],
    pecasIds: {
      cpu: 'cpu-r5-5600',
      placamae: 'mb-msi-a520m',
      ram: 'ram-16gb-ddr4',
      gpu: 'gpu-rx6600',
      armazenamento: 'ssd-nvme-500gb',
      fonte: 'psu-msi-650w',
      gabinete: 'case-montech-x3',
      cooler: 'cooler-box-padrao'
    },
    preset3D: {
      corLedHex: '#ff6b00',
      labelNivel: 'Nível Entrada — Mid-Tower Mesh (RX 6600 + Cooler Box)',
      tipoCooler: 'air-compact',
      tamanhoGpu: 'dual-fan'
    }
  },
  {
    id: 'gamer-intermediario',
    nivel: 'Intermediário',
    badgeCor: 'intermediario',
    nome: 'Konoha Chunin — Gamer Full HD Ultra & DLSS 3',
    imagem: 'assets/img/pecas/case-tower.png',
    resumoCurto: 'Excelente equilíbrio entre custo e desempenho para rodar lançamentos no Alto/Ultra em 1080p e iniciar em 1440p.',
    perfilUso: 'Ideal para jogos AAA modernos (Cyberpunk 2077, Red Dead Redemption 2, Forza) em 1080p Ultra com Ray Tracing moderado e eSports acima de 240 FPS.',
    componentesPrincipais: [
      'Processador AMD Ryzen 5 5600 (6C/12T) + Cooler DeepCool AK400',
      'Placa de Vídeo ASUS GeForce RTX 4060 OC 8GB GDDR6',
      'Memória 16GB (2x8GB) DDR4 3200MHz Dual Channel',
      'Placa-Mãe ASUS TUF Gaming B550M-Plus PCIe 4.0',
      'SSD Kingston NV2 1TB M.2 NVMe (3500MB/s)',
      'Fonte MSI MAG A650BN 650W 80 Plus Bronze'
    ],
    pecasIds: {
      cpu: 'cpu-r5-5600',
      placamae: 'mb-asus-b550m',
      ram: 'ram-16gb-ddr4',
      gpu: 'gpu-rtx4060',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-msi-650w',
      gabinete: 'case-montech-x3',
      cooler: 'cooler-deepcool-ak400'
    },
    preset3D: {
      corLedHex: '#ff8533',
      labelNivel: 'Nível Intermediário — Mid-Tower (RTX 4060 + Air Cooler Tower)',
      tipoCooler: 'air-tower',
      tamanhoGpu: 'dual-fan'
    }
  },
  {
    id: 'gamer-avancado',
    nivel: 'Avançado',
    badgeCor: 'avancado',
    nome: 'Konoha Hokage — Quad HD 1440p & Alto Desempenho',
    imagem: 'assets/img/pecas/case-full.png',
    resumoCurto: 'Plataforma AM5 de última geração com memória DDR5, 3D V-Cache e placa de vídeo de 12GB GDDR6X para máxima taxa de quadros.',
    perfilUso: 'Projetado para monitores de 144Hz a 240Hz em 1440p (Quad HD) no Ultra, jogos competitivos em nível profissional e transmissões ao vivo.',
    componentesPrincipais: [
      'Processador AMD Ryzen 7 7800X3D (8C/16T, 104MB 3D V-Cache)',
      'Placa de Vídeo GeForce RTX 4070 Super 12GB GDDR6X Triple Fan',
      'Memória Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz',
      'Placa-Mãe MSI MAG B650 Tomahawk WiFi ATX',
      'SSD WD Black SN850X 2TB M.2 NVMe (7300MB/s)',
      'Water Cooler 240mm + Fonte Corsair 750W 80 Plus Gold Modular'
    ],
    pecasIds: {
      cpu: 'cpu-r7-7800x3d',
      placamae: 'mb-msi-b650-atx',
      ram: 'ram-32gb-ddr5',
      gpu: 'gpu-rtx4070s',
      armazenamento: 'ssd-nvme-2tb',
      fonte: 'psu-corsair-750w',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-ml240l'
    },
    preset3D: {
      corLedHex: '#ff5500',
      labelNivel: 'Nível Avançado — Chassi Airflow (RTX 4070 Super Triple Fan + Water Cooler 240mm)',
      tipoCooler: 'water-240',
      tamanhoGpu: 'triple-fan'
    }
  }
];

const PCS_TRABALHO = [
  {
    id: 'trabalho-basico',
    nivel: 'Básico',
    subtitulo: 'Estudos, Escritório e Tarefas Cotidianas',
    imagem: 'assets/img/pecas/case-matx.png',
    componentesPrincipais: [
      'Processador AMD Ryzen 5 4600G (6 Núcleos / 12 Threads com Radeon Vega 7)',
      'Placa-Mãe MSI A520M-A PRO AM4',
      'Fonte Cooler Master MWE 450W 80 Plus Bronze',
      'Gabinete Compacto Micro-ATX Pichau HX300M'
    ],
    memoriaResumo: '8GB DDR4 3200MHz (Expansível até 64GB)',
    armazenamentoResumo: 'SSD Kingston A400 480GB SATA III (500MB/s)',
    finalidade: 'Navegação na internet com múltiplas abas, estudos, edição de documentos (Word/Docs), planilhas leves, aulas on-line, videochamadas e sistemas administrativos.',
    limitacoes: [
      'Possui apenas 8GB de RAM e vídeo integrado básico: não é recomendado para AutoCAD, modelagem 3D ou edição de vídeo pesada.',
      'Armazenamento SATA III de 480GB é ágil para o dia a dia, mas possui menor taxa de transferência que unidades NVMe para arquivos gigantes.'
    ],
    pecasIds: {
      cpu: 'cpu-r5-4600g',
      placamae: 'mb-msi-a520m',
      ram: 'ram-8gb-ddr4',
      gpu: 'gpu-integrada',
      armazenamento: 'ssd-sata-480gb',
      fonte: 'psu-cm-450w',
      gabinete: 'case-hx300m',
      cooler: 'cooler-box-padrao'
    }
  },
  {
    id: 'trabalho-intermediario',
    nivel: 'Intermediário',
    subtitulo: 'Multitarefas, Programação e Produtividade',
    imagem: 'assets/img/pecas/case-tower.png',
    componentesPrincipais: [
      'Processador AMD Ryzen 5 7600 (6 Núcleos / 12 Threads até 5.1GHz, Zen 4)',
      'Placa-Mãe MSI MAG B650 Tomahawk WiFi ATX',
      'Air Cooler DeepCool AK400 120mm Silencioso',
      'Fonte Cooler Master MWE 450W 80 Plus Bronze'
    ],
    memoriaResumo: '32GB (2x16GB) DDR5 6000MHz em Dual Channel',
    armazenamentoResumo: 'SSD Kingston NV2 1TB M.2 NVMe PCIe 4.0 (3500MB/s)',
    finalidade: 'Desenvolvimento de software (VS Code, IntelliJ, Docker, bancos de dados locais), planilhas financeiras extensas, análise de dados e multitarefa intensa com dois monitores.',
    limitacoes: [
      'Utiliza o gráfico integrado Radeon RDNA 2 do processador: atende visualização 2D leve, mas não possui placa de vídeo dedicada (VRAM exclusiva) exigida para projetos 3D no AutoCAD ou renderização GPU.',
      'Caso o usuário deseje trabalhar com modelagem 3D futuramente, será necessário adicionar uma placa de vídeo dedicada.'
    ],
    pecasIds: {
      cpu: 'cpu-r5-7600',
      placamae: 'mb-msi-b650-atx',
      ram: 'ram-32gb-ddr5',
      gpu: 'gpu-integrada',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-cm-450w',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-deepcool-ak400'
    }
  },
  {
    id: 'trabalho-profissional',
    nivel: 'Profissional',
    subtitulo: 'AutoCAD, Desenho Técnico 2D/3D e Engenharia',
    imagem: 'assets/img/pecas/case-full.png',
    componentesPrincipais: [
      'Processador AMD Ryzen 7 5700X3D (8 Núcleos / 16 Threads) + Cooler DeepCool AK400',
      'Placa de Vídeo Dedicada ASUS GeForce RTX 4060 OC 8GB GDDR6 (DirectX 12)',
      'Placa-Mãe ASUS TUF Gaming B550M-Plus com VRM Dissipado',
      'Fonte MSI MAG A650BN 650W 80 Plus Bronze'
    ],
    memoriaResumo: '32GB (2x16GB) Corsair Vengeance DDR4 3600MHz Dual Channel',
    armazenamentoResumo: 'SSD Kingston NV2 1TB M.2 NVMe PCIe 4.0 (3500MB/s)',
    finalidade: 'Projetos em AutoCAD 2D e modelagem 3D moderada (cumpre e supera os requisitos recomendados da Autodesk de 16GB+ de RAM e GPU dedicada de 4GB+ GDDR6 com DirectX 12), arquitetura técnica, compilação pesada e edição gráfica.',
    limitacoes: [
      'Embora atenda com excelência AutoCAD 2D e modelagem 3D técnica (8GB de VRAM dedicada e 32GB de RAM), simulações industriais de malha extrema ou nuvens de pontos massivas (> 64GB RAM) podem demandar upgrade para RTX 4070 Super/4080 Super.',
      'Consumo energético superior aos modelos de escritório devido à placa de vídeo dedicada.'
    ],
    pecasIds: {
      cpu: 'cpu-r7-5700x3d',
      placamae: 'mb-asus-b550m',
      ram: 'ram-32gb-ddr4',
      gpu: 'gpu-rtx4060',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-msi-650w',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-deepcool-ak400'
    }
  }
];

const EQUIPE_DESENVOLVIMENTO = [
  {
    nome: 'Leonardo Fioramonte de Oliveira',
    iniciais: 'LF',
    funcao: 'Liderança técnica e integração de dados'
  },
  {
    nome: 'Breno Martinho Denis',
    iniciais: 'BM',
    funcao: 'Telas iniciais e identidade visual'
  },
  {
    nome: 'Eduardo Francisco Bernardes da Silva',
    iniciais: 'EF',
    funcao: 'Catálogo de componentes'
  },
  {
    nome: 'Giovane Betez Romo',
    iniciais: 'GB',
    funcao: 'Resumo e orçamento'
  },
  {
    nome: 'Edwin Bono Sanches',
    iniciais: 'EB',
    funcao: 'Compatibilidade e lógica'
  },
  {
    nome: 'Gabriel Rocha Martins',
    iniciais: 'GR',
    funcao: 'Testes e integração'
  }
];

Object.assign(window.Konoha, {
  PCS_GAMER,
  PCS_TRABALHO,
  EQUIPE_DESENVOLVIMENTO
});
})();

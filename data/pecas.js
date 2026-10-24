/**
 * Base de Dados de Componentes de Hardware — Konoha Hardware
 * 
 * Organização em 8 categorias essenciais conforme especificação:
 * 1. Processador (cpu)
 * 2. Placa-mãe (placamae)
 * 3. Memória RAM (ram)
 * 4. Placa de vídeo (gpu)
 * 5. Armazenamento (armazenamento)
 * 6. Fonte (fonte)
 * 7. Gabinete (gabinete)
 * 8. Cooler (cooler)
 * 
 * Preços baseados na média praticada no varejo nacional de hardware (Pichau / KaBuM! / Terabyte).
 * Estrutura facilmente atualizável: basta editar o campo `preco` ou adicionar itens no array correspondente.
 */

(() => {
window.Konoha = window.Konoha || {};

const CATEGORIAS_MONTADOR = [
  {
    id: 'cpu',
    nome: '1. Processador',
    tituloCurto: 'Processador',
    descricao: 'Unidade central de processamento (CPU). Define o soquete da placa-mãe e o poder de cálculo.',
    obrigatorio: true
  },
  {
    id: 'placamae',
    nome: '2. Placa-mãe',
    tituloCurto: 'Placa-mãe',
    descricao: 'Conecta todos os componentes. Deve ter o mesmo soquete do processador e suportar o padrão da RAM.',
    obrigatorio: true
  },
  {
    id: 'ram',
    nome: '3. Memória RAM',
    tituloCurto: 'Memória RAM',
    descricao: 'Memória principal de acesso rápido. Deve ser compatível com o padrão DDR4 ou DDR5 da placa-mãe.',
    obrigatorio: true
  },
  {
    id: 'gpu',
    nome: '4. Placa de vídeo',
    tituloCurto: 'Placa de Vídeo',
    descricao: 'Processamento gráfico (GPU). Essencial para jogos 3D, CAD avançado e processadores sem vídeo integrado.',
    obrigatorio: true
  },
  {
    id: 'armazenamento',
    nome: '5. Armazenamento',
    tituloCurto: 'Armazenamento',
    descricao: 'Unidade SSD para sistema operacional, programas, arquivos e carregamento rápido de jogos.',
    obrigatorio: true
  },
  {
    id: 'fonte',
    nome: '6. Fonte',
    tituloCurto: 'Fonte (PSU)',
    descricao: 'Fornece energia estável e segura. Sua potência (Watts) deve suprir todos os componentes com folga.',
    obrigatorio: true
  },
  {
    id: 'gabinete',
    nome: '7. Gabinete',
    tituloCurto: 'Gabinete',
    descricao: 'Estrutura física e fluxo de ar. Deve comportar o formato da placa-mãe e o comprimento da placa de vídeo.',
    obrigatorio: true
  },
  {
    id: 'cooler',
    nome: '8. Cooler',
    tituloCurto: 'Cooler CPU',
    descricao: 'Dissipação térmica do processador. Deve suportar o soquete e o TDP térmico da CPU escolhida.',
    obrigatorio: true
  }
];

const CATALOGO_PECAS = {
  cpu: [
    {
      id: 'cpu-r5-4600g',
      categoria: 'cpu',
      nome: 'AMD Ryzen 5 4600G, 6-Core, 12-Threads, 3.7GHz (4.2GHz Turbo), AM4',
      marca: 'AMD',
      preco: 649.90,
      imagem: 'assets/img/pecas/cpu-ryzen5.jpg',
      especificacoes: [
        'Soquete: AM4',
        '6 Núcleos / 12 Threads (3.7GHz a 4.2GHz)',
        'Vídeo Integrado: Radeon Vega 7',
        'Suporte de Memória: DDR4 | TDP: 65W'
      ],
      soquete: 'AM4',
      tipoRamSuportada: 'DDR4',
      tdpWatts: 65,
      possuiVideoIntegrado: true,
      nivelCpu: 1, // 1 = Entrada/Básico, 2 = Intermediário, 3 = Alto, 4 = Entusiasta
      pontuacaoMultitarefa: 68
    },
    {
      id: 'cpu-r5-5600',
      categoria: 'cpu',
      nome: 'AMD Ryzen 5 5600, 6-Core, 12-Threads, 3.5GHz (4.4GHz Turbo), Cache 35MB, AM4',
      marca: 'AMD',
      preco: 849.90,
      imagem: 'assets/img/pecas/cpu-ryzen5.jpg',
      especificacoes: [
        'Soquete: AM4 (Arquitetura Zen 3)',
        '6 Núcleos / 12 Threads | Cache Total: 35MB',
        'Sem vídeo integrado (Exige placa de vídeo dedicada)',
        'Suporte de Memória: DDR4 | TDP: 65W'
      ],
      soquete: 'AM4',
      tipoRamSuportada: 'DDR4',
      tdpWatts: 65,
      possuiVideoIntegrado: false,
      nivelCpu: 2,
      pontuacaoMultitarefa: 82
    },
    {
      id: 'cpu-i5-12400f',
      categoria: 'cpu',
      nome: 'Intel Core i5-12400F, 6-Core, 12-Threads, 2.5GHz (4.4GHz Turbo), Cache 18MB, LGA1700',
      marca: 'Intel',
      preco: 779.90,
      imagem: 'assets/img/pecas/cpu-intel.jpg',
      especificacoes: [
        'Soquete: LGA 1700 (12ª Geração Alder Lake)',
        '6 Núcleos / 12 Threads | Cache: 18MB',
        'Sem vídeo integrado (Sufixo F — exige GPU dedicada)',
        'Suporte de Memória: DDR4 | TDP: 65W'
      ],
      soquete: 'LGA1700',
      tipoRamSuportada: 'DDR4',
      tdpWatts: 65,
      possuiVideoIntegrado: false,
      nivelCpu: 2,
      pontuacaoMultitarefa: 83
    },
    {
      id: 'cpu-r7-5700x3d',
      categoria: 'cpu',
      nome: 'AMD Ryzen 7 5700X3D, 8-Core, 16-Threads, 3.0GHz (4.1GHz Turbo), Cache 100MB, AM4',
      marca: 'AMD',
      preco: 1499.90,
      imagem: 'assets/img/pecas/cpu-ryzen7.jpg',
      especificacoes: [
        'Soquete: AM4 (Tecnologia AMD 3D V-Cache)',
        '8 Núcleos / 16 Threads | Cache Total: 100MB',
        'Sem vídeo integrado (Exige GPU dedicada e Cooler robusto)',
        'Suporte de Memória: DDR4 | TDP: 105W'
      ],
      soquete: 'AM4',
      tipoRamSuportada: 'DDR4',
      tdpWatts: 105,
      possuiVideoIntegrado: false,
      nivelCpu: 3,
      pontuacaoMultitarefa: 90
    },
    {
      id: 'cpu-r5-7600',
      categoria: 'cpu',
      nome: 'AMD Ryzen 5 7600, 6-Core, 12-Threads, 3.8GHz (5.1GHz Turbo), Cache 38MB, AM5',
      marca: 'AMD',
      preco: 1389.90,
      imagem: 'assets/img/pecas/cpu-ryzen-am5.jpg',
      especificacoes: [
        'Soquete: AM5 (Arquitetura Zen 4 - 5nm)',
        '6 Núcleos / 12 Threads | Boost até 5.1GHz',
        'Vídeo Integrado: AMD Radeon Graphics RDNA 2',
        'Suporte de Memória: Exclusivo DDR5 | TDP: 65W'
      ],
      soquete: 'AM5',
      tipoRamSuportada: 'DDR5',
      tdpWatts: 65,
      possuiVideoIntegrado: true,
      nivelCpu: 3,
      pontuacaoMultitarefa: 89
    },
    {
      id: 'cpu-r7-7800x3d',
      categoria: 'cpu',
      nome: 'AMD Ryzen 7 7800X3D, 8-Core, 16-Threads, 4.2GHz (5.0GHz Turbo), Cache 104MB, AM5',
      marca: 'AMD',
      preco: 2899.90,
      imagem: 'assets/img/pecas/cpu-ryzen-am5.jpg',
      especificacoes: [
        'Soquete: AM5 (Zen 4 com 3D V-Cache)',
        '8 Núcleos / 16 Threads | Cache: 104MB',
        'Vídeo Integrado: Radeon Graphics básico',
        'Suporte de Memória: Exclusivo DDR5 | TDP: 120W'
      ],
      soquete: 'AM5',
      tipoRamSuportada: 'DDR5',
      tdpWatts: 120,
      possuiVideoIntegrado: true,
      nivelCpu: 4,
      pontuacaoMultitarefa: 96
    }
  ],

  placamae: [
    {
      id: 'mb-msi-a520m',
      categoria: 'placamae',
      nome: 'Placa-Mãe MSI A520M-A PRO, AMD AM4, Micro-ATX, DDR4',
      marca: 'MSI',
      preco: 389.90,
      imagem: 'assets/img/pecas/mb-msi.png',
      especificacoes: [
        'Soquete: AM4 | Chipset: AMD A520',
        'Memória: 2x Slots DDR4 (até 64GB 3200MHz)',
        'Armazenamento: 1x Slot M.2 NVMe + 4x SATA III',
        'Formato: Micro-ATX (23.6cm x 20cm)'
      ],
      soquete: 'AM4',
      tipoRam: 'DDR4',
      formato: 'Micro-ATX',
      slotsRam: 2,
      consumoWatts: 30
    },
    {
      id: 'mb-asus-b550m',
      categoria: 'placamae',
      nome: 'Placa-Mãe ASUS TUF Gaming B550M-Plus, AMD AM4, Micro-ATX, DDR4',
      marca: 'ASUS',
      preco: 829.90,
      imagem: 'assets/img/pecas/mb-asus.jpg',
      especificacoes: [
        'Soquete: AM4 | Chipset: AMD B550 (PCIe 4.0)',
        'Memória: 4x Slots DDR4 (até 128GB)',
        'VRM Dissipado 8+2 Fases | 2x Slots M.2 NVMe',
        'Formato: Micro-ATX (24.4cm x 24.4cm)'
      ],
      soquete: 'AM4',
      tipoRam: 'DDR4',
      formato: 'Micro-ATX',
      slotsRam: 4,
      consumoWatts: 40
    },
    {
      id: 'mb-gigabyte-h610m',
      categoria: 'placamae',
      nome: 'Placa-Mãe Gigabyte H610M H V2, Intel LGA 1700, Micro-ATX, DDR4',
      marca: 'Gigabyte',
      preco: 529.90,
      imagem: 'assets/img/pecas/mb-msi-2.png',
      especificacoes: [
        'Soquete: LGA 1700 (Intel 12ª/13ª/14ª Geração)',
        'Memória: 2x Slots DDR4 (até 64GB 3200MHz)',
        'Armazenamento: 1x Slot M.2 NVMe PCIe 3.0 + 4x SATA',
        'Formato: Micro-ATX (23.0cm x 21.5cm)'
      ],
      soquete: 'LGA1700',
      tipoRam: 'DDR4',
      formato: 'Micro-ATX',
      slotsRam: 2,
      consumoWatts: 35
    },
    {
      id: 'mb-msi-b650-atx',
      categoria: 'placamae',
      nome: 'Placa-Mãe MSI MAG B650 Tomahawk WiFi, AMD AM5, ATX, DDR5',
      marca: 'MSI',
      preco: 1549.90,
      imagem: 'assets/img/pecas/mb-msi-2.png',
      especificacoes: [
        'Soquete: AM5 | Chipset: AMD B650',
        'Memória: 4x Slots DDR5 (até 192GB 6600+ MHz)',
        'Conectividade: Wi-Fi 6E, LAN 2.5Gbps, 3x M.2 NVMe',
        'Formato: ATX Padrão (30.5cm x 24.4cm — exige gabinete ATX)'
      ],
      soquete: 'AM5',
      tipoRam: 'DDR5',
      formato: 'ATX',
      slotsRam: 4,
      consumoWatts: 45
    }
  ],

  ram: [
    {
      id: 'ram-8gb-ddr4',
      categoria: 'ram',
      nome: 'Memória Kingston Fury Beast, 8GB (1x8GB), 3200MHz, DDR4, CL16',
      marca: 'Kingston',
      preco: 169.90,
      imagem: 'assets/img/pecas/ram-fury.jpg',
      especificacoes: [
        'Capacidade: 8GB (Módulo único 1x8GB)',
        'Padrão: DDR4 | Frequência: 3200MHz',
        'Latência: CL16 | Tensão: 1.35V',
        'Dissipador de calor em alumínio de perfil baixo'
      ],
      tipoRam: 'DDR4',
      capacidadeGb: 8,
      modulos: 1,
      frequenciaMhz: 3200,
      consumoWatts: 4
    },
    {
      id: 'ram-16gb-ddr4',
      categoria: 'ram',
      nome: 'Memória Kingston Fury Beast, 16GB (2x8GB), 3200MHz, DDR4, CL16 Dual Channel',
      marca: 'Kingston',
      preco: 329.90,
      imagem: 'assets/img/pecas/ram-fury.jpg',
      especificacoes: [
        'Capacidade: 16GB (Kit 2x8GB para Dual Channel)',
        'Padrão: DDR4 | Frequência: 3200MHz',
        'Latência: CL16 | Intel XMP 2.0 / AMD Ryzen Ready',
        'Ideal para jogos atuais e multitarefas'
      ],
      tipoRam: 'DDR4',
      capacidadeGb: 16,
      modulos: 2,
      frequenciaMhz: 3200,
      consumoWatts: 8
    },
    {
      id: 'ram-32gb-ddr4',
      categoria: 'ram',
      nome: 'Memória Corsair Vengeance LPX, 32GB (2x16GB), 3600MHz, DDR4, CL18',
      marca: 'Corsair',
      preco: 589.90,
      imagem: 'assets/img/pecas/ram-corsair.jpg',
      especificacoes: [
        'Capacidade: 32GB (Kit 2x16GB Dual Channel)',
        'Padrão: DDR4 | Frequência: 3600MHz',
        'Latência: CL18 | Tensão: 1.35V',
        'Recomendada para AutoCAD, máquinas virtuais e edição'
      ],
      tipoRam: 'DDR4',
      capacidadeGb: 32,
      modulos: 2,
      frequenciaMhz: 3600,
      consumoWatts: 10
    },
    {
      id: 'ram-32gb-ddr5',
      categoria: 'ram',
      nome: 'Memória Corsair Vengeance, 32GB (2x16GB), 6000MHz, DDR5, CL36',
      marca: 'Corsair',
      preco: 899.90,
      imagem: 'assets/img/pecas/ram-corsair.jpg',
      especificacoes: [
        'Capacidade: 32GB (Kit 2x16GB Dual Channel)',
        'Padrão: DDR5 (Incompatível com slots DDR4)',
        'Frequência: 6000MHz | Latência: CL36',
        'Perfis AMD EXPO e Intel XMP 3.0 integrados'
      ],
      tipoRam: 'DDR5',
      capacidadeGb: 32,
      modulos: 2,
      frequenciaMhz: 6000,
      consumoWatts: 12
    }
  ],

  gpu: [
    {
      id: 'gpu-integrada',
      categoria: 'gpu',
      nome: 'Vídeo Integrado do Processador (Sem Placa de Vídeo Dedicada)',
      marca: 'Integrado (iGPU)',
      preco: 0.00,
      imagem: 'assets/img/pecas/cpu-ryzen5.jpg',
      especificacoes: [
        'Utiliza o chip gráfico embutido no próprio processador',
        'Exige processador com vídeo integrado (ex.: Ryzen 4600G ou série 7000)',
        'Consumo adicional: 0W | Sem custo extra',
        'Indicado para escritório, estudos e jogos competitivos leves em 720p/1080p'
      ],
      requerVideoIntegradoCpu: true,
      vramGb: 0,
      comprimentoMm: 0,
      consumoWatts: 0,
      fonteRecomendadaWatts: 300,
      nivelGpu: 0 // 0 = Integrado, 1 = Entrada 1080p, 2 = Intermediário 1080p Ultra, 3 = 1440p Alto, 4 = 1440p/4K Ultra
    },
    {
      id: 'gpu-rx6600',
      categoria: 'gpu',
      nome: 'Placa de Vídeo ASRock Radeon RX 6600 Challenger D, 8GB GDDR6',
      marca: 'AMD / ASRock',
      preco: 1399.90,
      imagem: 'assets/img/pecas/gpu-radeon.png',
      especificacoes: [
        'Memória: 8GB GDDR6 (128-bit)',
        'Arquitetura AMD RDNA 2 | DirectX 12 Ultimate',
        'Comprimento: 269mm | Refrigeração Dual Fan',
        'Consumo: 132W | Fonte recomendada: 500W ou superior'
      ],
      requerVideoIntegradoCpu: false,
      vramGb: 8,
      comprimentoMm: 269,
      consumoWatts: 132,
      fonteRecomendadaWatts: 500,
      nivelGpu: 1
    },
    {
      id: 'gpu-rtx4060',
      categoria: 'gpu',
      nome: 'Placa de Vídeo ASUS Dual GeForce RTX 4060 OC, 8GB GDDR6, DLSS 3',
      marca: 'NVIDIA / ASUS',
      preco: 2099.90,
      imagem: 'assets/img/pecas/gpu-rtx-dual.jpg',
      especificacoes: [
        'Memória: 8GB GDDR6 | Arquitetura Ada Lovelace',
        'Tecnologias: NVIDIA DLSS 3, Ray Tracing e NVENC',
        'Comprimento compacto: 227mm | Dual Fan Axial-tech',
        'Consumo: 115W | Fonte recomendada: 550W ou superior'
      ],
      requerVideoIntegradoCpu: false,
      vramGb: 8,
      comprimentoMm: 227,
      consumoWatts: 115,
      fonteRecomendadaWatts: 550,
      nivelGpu: 2
    },
    {
      id: 'gpu-rx7700xt',
      categoria: 'gpu',
      nome: 'Placa de Vídeo Sapphire Pulse Radeon RX 7700 XT, 12GB GDDR6',
      marca: 'AMD / Sapphire',
      preco: 3099.90,
      imagem: 'assets/img/pecas/gpu-radeon.png',
      especificacoes: [
        'Memória: 12GB GDDR6 (192-bit) | RDNA 3',
        'Foco em 1440p (Quad HD) no Alto/Ultra',
        'Comprimento: 280mm | Dual Fan Dual-X',
        'Consumo: 245W | Fonte recomendada: 650W ou superior'
      ],
      requerVideoIntegradoCpu: false,
      vramGb: 12,
      comprimentoMm: 280,
      consumoWatts: 245,
      fonteRecomendadaWatts: 650,
      nivelGpu: 3
    },
    {
      id: 'gpu-rtx4070s',
      categoria: 'gpu',
      nome: 'Placa de Vídeo Gigabyte GeForce RTX 4070 Super Windforce OC, 12GB GDDR6X',
      marca: 'NVIDIA / Gigabyte',
      preco: 4299.90,
      imagem: 'assets/img/pecas/gpu-rtx-triple.png',
      especificacoes: [
        'Memória: 12GB GDDR6X (192-bit) | 7168 CUDA Cores',
        'Alto desempenho em Quad HD (1440p), CAD 3D e Renderização',
        'Comprimento: 261mm | Sistema Triple Fan Windforce',
        'Consumo: 220W | Fonte recomendada: 650W ou superior'
      ],
      requerVideoIntegradoCpu: false,
      vramGb: 12,
      comprimentoMm: 261,
      consumoWatts: 220,
      fonteRecomendadaWatts: 650,
      nivelGpu: 4
    },
    {
      id: 'gpu-rtx4080s',
      categoria: 'gpu',
      nome: 'Placa de Vídeo ASUS TUF Gaming GeForce RTX 4080 Super, 16GB GDDR6X',
      marca: 'NVIDIA / ASUS',
      preco: 6899.90,
      imagem: 'assets/img/pecas/gpu-rtx-triple.png',
      especificacoes: [
        'Memória: 16GB GDDR6X (256-bit) | 10240 CUDA Cores',
        'Desempenho extremo em 1440p/4K e engenharia pesada',
        'Comprimento: 348mm (Exige gabinete amplo > 350mm)',
        'Consumo: 320W | Fonte recomendada: 750W ou superior'
      ],
      requerVideoIntegradoCpu: false,
      vramGb: 16,
      comprimentoMm: 348,
      consumoWatts: 320,
      fonteRecomendadaWatts: 750,
      nivelGpu: 5
    }
  ],

  armazenamento: [
    {
      id: 'ssd-sata-480gb',
      categoria: 'armazenamento',
      nome: 'SSD Kingston A400, 480GB, SATA III 2.5", Leitura 500MB/s',
      marca: 'Kingston',
      preco: 229.90,
      imagem: 'assets/img/pecas/ssd-sata.png',
      especificacoes: [
        'Capacidade: 480GB | Interface: SATA III 6Gb/s',
        'Velocidade: Leitura até 500MB/s | Gravação até 450MB/s',
        'Formato: 2.5 Polegadas tradicional',
        'Compatível com qualquer placa-mãe com porta SATA'
      ],
      capacidadeGb: 480,
      tipoInterface: 'SATA',
      leituraMbs: 500,
      consumoWatts: 4
    },
    {
      id: 'ssd-nvme-500gb',
      categoria: 'armazenamento',
      nome: 'SSD Kingston NV2, 500GB, M.2 NVMe PCIe 4.0, Leitura 3500MB/s',
      marca: 'Kingston',
      preco: 279.90,
      imagem: 'assets/img/pecas/ssd-nvme.jpg',
      especificacoes: [
        'Capacidade: 500GB | Interface: M.2 2280 NVMe PCIe 4.0',
        'Velocidade: Leitura até 3500MB/s | Gravação até 2100MB/s',
        '7x mais rápido que um SSD SATA convencional',
        'Instalação direta na placa-mãe sem cabos'
      ],
      capacidadeGb: 500,
      tipoInterface: 'NVMe',
      leituraMbs: 3500,
      consumoWatts: 5
    },
    {
      id: 'ssd-nvme-1tb',
      categoria: 'armazenamento',
      nome: 'SSD Kingston NV2, 1TB, M.2 NVMe PCIe 4.0, Leitura 3500MB/s',
      marca: 'Kingston',
      preco: 429.90,
      imagem: 'assets/img/pecas/ssd-nvme.jpg',
      especificacoes: [
        'Capacidade: 1TB (1000GB) | M.2 2280 NVMe PCIe 4.0',
        'Velocidade: Leitura até 3500MB/s | Gravação até 2100MB/s',
        'Excelente espaço para múltiplos jogos modernos e projetos',
        'Baixo consumo e aquecimento reduzido'
      ],
      capacidadeGb: 1000,
      tipoInterface: 'NVMe',
      leituraMbs: 3500,
      consumoWatts: 6
    },
    {
      id: 'ssd-nvme-2tb',
      categoria: 'armazenamento',
      nome: 'SSD WD Black SN850X, 2TB, M.2 NVMe PCIe 4.0, Leitura 7300MB/s',
      marca: 'Western Digital',
      preco: 1099.90,
      imagem: 'assets/img/pecas/ssd-nvme-pro.jpg',
      especificacoes: [
        'Capacidade: 2TB (2000GB) | M.2 NVMe Gen4 High-End',
        'Velocidade: Leitura até 7300MB/s | Gravação até 6600MB/s',
        'Memória DRAM Cache dedicada para cargas pesadas de CAD/Vídeo',
        'Desempenho de topo para estações profissionais e entusiastas'
      ],
      capacidadeGb: 2000,
      tipoInterface: 'NVMe',
      leituraMbs: 7300,
      consumoWatts: 8
    }
  ],

  fonte: [
    {
      id: 'psu-cm-450w',
      categoria: 'fonte',
      nome: 'Fonte Cooler Master MWE 450W, 80 Plus Bronze, PFC Ativo',
      marca: 'Cooler Master',
      preco: 249.90,
      imagem: 'assets/img/pecas/psu-bronze.jpg',
      especificacoes: [
        'Potência: 450W Reais | Certificação 80 Plus Bronze',
        'PFC Ativo e Bivolt Automático (100-240V)',
        'Indicada para PCs com vídeo integrado ou baixo consumo',
        'Não recomendada para placas de vídeo intermediárias/avançadas'
      ],
      potenciaWatts: 450
    },
    {
      id: 'psu-msi-650w',
      categoria: 'fonte',
      nome: 'Fonte MSI MAG A650BN, 650W, 80 Plus Bronze, PFC Ativo',
      marca: 'MSI',
      preco: 329.90,
      imagem: 'assets/img/pecas/psu-bronze.jpg',
      especificacoes: [
        'Potência: 650W Reais | Certificação 80 Plus Bronze',
        'Ventoinha de 120mm silenciosa | Cabos Flat Pretos',
        'Proteções industriais OCP, OVP, OPP, OTP e SCP',
        'Suporta com folga configurações com RX 6600, RTX 4060, RX 7700 XT e RTX 4070 Super'
      ],
      potenciaWatts: 650
    },
    {
      id: 'psu-corsair-750w',
      categoria: 'fonte',
      nome: 'Fonte Corsair RM750e, 750W, 80 Plus Gold, ATX 3.0, Full Modular',
      marca: 'Corsair',
      preco: 699.90,
      imagem: 'assets/img/pecas/psu-modular.jpg',
      especificacoes: [
        'Potência: 750W Reais | Certificação 80 Plus Gold (Alta Eficiência)',
        'Padrão ATX 3.0 e PCIe 5.0 nativo',
        '100% Modular (utilize apenas os cabos necessários)',
        'Suporta configurações de alto desempenho até RTX 4080 Super'
      ],
      potenciaWatts: 750
    },
    {
      id: 'psu-xpg-850w',
      categoria: 'fonte',
      nome: 'Fonte XPG Core Reactor, 850W, 80 Plus Gold, Full Modular',
      marca: 'XPG',
      preco: 799.90,
      imagem: 'assets/img/pecas/psu-modular.jpg',
      especificacoes: [
        'Potência: 850W Reais | Certificação 80 Plus Gold',
        'Capacitores 100% Japoneses 105°C',
        '100% Modular | Operação ultra silenciosa',
        'Folga máxima para upgrades futuros e placas de alto consumo'
      ],
      potenciaWatts: 850
    }
  ],

  gabinete: [
    {
      id: 'case-hx300m',
      categoria: 'gabinete',
      nome: 'Gabinete Pichau HX300M Glass, Mini Tower, Micro-ATX, Lateral em Vidro',
      marca: 'Pichau',
      preco: 199.90,
      imagem: 'assets/img/pecas/case-matx.png',
      especificacoes: [
        'Placas-mãe suportadas: Apenas Micro-ATX e Mini-ITX (Não aceita ATX)',
        'Comprimento máximo de Placa de Vídeo: 290mm',
        'Altura máxima de Air Cooler: 160mm',
        'Compacto e discreto para escritórios e setups enxutos'
      ],
      formatosPlacaMae: ['Micro-ATX', 'Mini-ITX'],
      maxComprimentoGpuMm: 290,
      maxAlturaCoolerMm: 160,
      consumoWatts: 5
    },
    {
      id: 'case-montech-x3',
      categoria: 'gabinete',
      nome: 'Gabinete Gamer Montech X3 Mesh, Mid Tower, ATX, Frente Mesh com 6 Fans',
      marca: 'Montech',
      preco: 319.90,
      imagem: 'assets/img/pecas/case-mesh.jpg',
      especificacoes: [
        'Placas-mãe suportadas: ATX, Micro-ATX e Mini-ITX',
        'Comprimento máximo de Placa de Vídeo: 305mm',
        'Altura máxima de Air Cooler: 160mm',
        'Acompanha 6 ventoinhas instaladas e painel frontal em malha (Mesh)'
      ],
      formatosPlacaMae: ['ATX', 'Micro-ATX', 'Mini-ITX'],
      maxComprimentoGpuMm: 305,
      maxAlturaCoolerMm: 160,
      consumoWatts: 15
    },
    {
      id: 'case-corsair-4000d',
      categoria: 'gabinete',
      nome: 'Gabinete Corsair 4000D Airflow, Mid Tower, ATX, Lateral em Vidro Temperado',
      marca: 'Corsair',
      preco: 549.90,
      imagem: 'assets/img/pecas/case-tower.png',
      especificacoes: [
        'Placas-mãe suportadas: ATX, Micro-ATX e Mini-ITX',
        'Comprimento máximo de Placa de Vídeo: 360mm (Comporta GPUs Triple Fan grandes)',
        'Altura máxima de Air Cooler: 170mm | Suporta Water Cooler 240mm/360mm',
        'Painel frontal em aço perfurado de alto fluxo de ar'
      ],
      formatosPlacaMae: ['ATX', 'Micro-ATX', 'Mini-ITX'],
      maxComprimentoGpuMm: 360,
      maxAlturaCoolerMm: 170,
      consumoWatts: 10
    }
  ],

  cooler: [
    {
      id: 'cooler-box-padrao',
      categoria: 'cooler',
      nome: 'Cooler Box Padrão AMD/Intel (Para Processadores até 65W TDP)',
      marca: 'OEM / Padrão',
      preco: 49.90,
      imagem: 'assets/img/pecas/cooler-box.jpg',
      especificacoes: [
        'Soquetes suportados: AM4, AM5 e LGA 1700',
        'Capacidade térmica máxima: 65W TDP',
        'Altura: 65mm | Ventoinha de 92mm PWM',
        'Atenção: Incompatível com processadores de 105W ou 120W TDP'
      ],
      soquetesSuportados: ['AM4', 'AM5', 'LGA1700'],
      tdpMaximoWatts: 65,
      alturaMm: 65,
      consumoWatts: 4
    },
    {
      id: 'cooler-deepcool-ak400',
      categoria: 'cooler',
      nome: 'Air Cooler DeepCool AK400, 120mm, 4 Heatpipes, Preto',
      marca: 'DeepCool',
      preco: 169.90,
      imagem: 'assets/img/pecas/cooler-tower.jpg',
      especificacoes: [
        'Soquetes suportados: AM4, AM5 e LGA 1700',
        'Capacidade térmica: até 220W TDP (4 Heatpipes de cobre contato direto)',
        'Altura: 155mm | Ventoinha 120mm FDB silenciosa',
        'Excelente refrigeração para Ryzen 5, Core i5 e Ryzen 7'
      ],
      soquetesSuportados: ['AM4', 'AM5', 'LGA1700'],
      tdpMaximoWatts: 220,
      alturaMm: 155,
      consumoWatts: 6
    },
    {
      id: 'cooler-ml240l',
      categoria: 'cooler',
      nome: 'Water Cooler Cooler Master MasterLiquid ML240L V2, 240mm',
      marca: 'Cooler Master',
      preco: 419.90,
      imagem: 'assets/img/pecas/cooler-aio.jpg',
      especificacoes: [
        'Soquetes suportados: AM4, AM5 e LGA 1700',
        'Capacidade térmica: até 250W TDP | Radiador de 240mm em alumínio',
        'Bomba de câmara dupla de 3ª geração + 2x Fans 120mm SickleFlow',
        'Recomendado para uso intenso em jogos, renderização e CPUs X3D'
      ],
      soquetesSuportados: ['AM4', 'AM5', 'LGA1700'],
      tdpMaximoWatts: 250,
      alturaMm: 55,
      consumoWatts: 15
    }
  ]
};

/**
 * Função utilitária para buscar uma peça pelo seu ID em qualquer categoria.
 */
function buscarPecaPorId(idPeca) {
  if (!idPeca) return null;
  for (const lista of Object.values(CATALOGO_PECAS)) {
    const encontrada = lista.find((item) => item.id === idPeca);
    if (encontrada) return encontrada;
  }
  return null;
}

Object.assign(window.Konoha, {
  CATEGORIAS_MONTADOR,
  CATALOGO_PECAS,
  buscarPecaPorId
});
})();

// 1. DEFINIÇÃO DAS 8 CATEGORIAS E HOTSPOTS NO GABINETE (Imagens 2 e 3)
    // ==========================================
    const COMPONENT_SLOTS = [
      {
        key: 'cpu',
        label: 'Processador',
        pinCode: 'CPU / SOCKET CPU',
        shortTitle: 'PROCESSADOR',
        hotspotX: 38,
        hotspotY: 34,
        zoomOrigin: '38% 34%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/></svg>'
      },
      {
        key: 'cooler',
        label: 'Cooler do Processador',
        pinCode: 'FAN / CPU COOLER',
        shortTitle: 'COOLER CPU',
        hotspotX: 43,
        hotspotY: 25,
        zoomOrigin: '43% 25%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 5c2 2 2 4 0 4.5M19 12c-2 2-4 2-4.5 0M12 19c-2-2-2-4 0-4.5M5 12c2-2 4-2 4.5 0"/></svg>'
      },
      {
        key: 'mobo',
        label: 'Placa-mãe',
        pinCode: '8P / EPS 12V & PCB',
        shortTitle: 'PLACA-MÃE',
        hotspotX: 31,
        hotspotY: 22,
        zoomOrigin: '34% 26%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h4v4H8zM15 8h2m-2 3h2m-9 5h9"/></svg>'
      },
      {
        key: 'gpu',
        label: 'Placa de Vídeo (GPU)',
        pinCode: 'PCIe x16 / GPU',
        shortTitle: 'PLACA DE VÍDEO',
        hotspotX: 41,
        hotspotY: 54,
        zoomOrigin: '41% 54%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="8.5" cy="12" r="2.5"/><circle cx="15.5" cy="12" r="2.5"/></svg>'
      },
      {
        key: 'ram',
        label: 'Memória RAM',
        pinCode: 'DIMM / SLOTS RAM',
        shortTitle: 'MEMÓRIA RAM',
        hotspotX: 49,
        hotspotY: 33,
        zoomOrigin: '49% 33%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M7 16v2m5-2v2m5-2v2M7 11v2m5-2v2m5-2v2"/></svg>'
      },
      {
        key: 'ssd',
        label: 'Armazenamento (SSD)',
        pinCode: 'M.2 NVMe / SATA',
        shortTitle: 'ARMAZENAMENTO SSD',
        hotspotX: 37,
        hotspotY: 64,
        zoomOrigin: '37% 64%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="4" y="6" width="16" height="12" rx="2"/><circle cx="8" cy="12" r="1"/><path d="M12 12h5"/></svg>'
      },
      {
        key: 'case',
        label: 'Gabinete',
        pinCode: 'CHASSIS / AIRFLOW',
        shortTitle: 'GABINETE',
        hotspotX: 70,
        hotspotY: 48,
        zoomOrigin: '65% 48%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6M9 18h6"/></svg>'
      },
      {
        key: 'psu',
        label: 'Fonte de Alimentação',
        pinCode: 'PSU / ATX 12V',
        shortTitle: 'FONTE (PSU)',
        hotspotX: 34,
        hotspotY: 82,
        zoomOrigin: '34% 80%',
        iconSvg: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
      }
    ];

    // ==========================================
    // 2. BASE DE DADOS DE PEÇAS (ETAPA 3: IMAGEM/SVG, SPECS, PREÇO E COMPATIBILIDADE)
    // ==========================================
    const CATALOG_PARTS = {
      cpu: [
        {
          id: 'cpu-r5-5600g',
          categoria: 'cpu',
          nome: 'AMD Ryzen 5 5600GT (Vídeo Integrado)',
          preco: 849,
          specs: '6 Núcleos / 12 Threads • Até 4.6GHz • Radeon Vega 7',
          soquete: 'AM4',
          consumoWatts: 65,
          finalidades: ['domestico', 'trabalho', 'hibrido'],
          corHex: '#f97316'
        },
        {
          id: 'cpu-r5-5600',
          categoria: 'cpu',
          nome: 'AMD Ryzen 5 5600',
          preco: 899,
          specs: '6 Núcleos / 12 Threads • Clock 3.5GHz (Boost 4.4GHz) • Cache 35MB',
          soquete: 'AM4',
          consumoWatts: 65,
          finalidades: ['jogos', 'hibrido', 'trabalho'],
          corHex: '#ef4444'
        },
        {
          id: 'cpu-i5-12400f',
          categoria: 'cpu',
          nome: 'Intel Core i5-12400F',
          preco: 799,
          specs: '6 Núcleos / 12 Threads • Até 4.4GHz Turbo • 18MB Cache',
          soquete: 'LGA1700',
          consumoWatts: 65,
          finalidades: ['jogos', 'trabalho', 'hibrido'],
          corHex: '#38bdf8'
        },
        {
          id: 'cpu-r5-7600',
          categoria: 'cpu',
          nome: 'AMD Ryzen 5 7600 (Nova Geração AM5)',
          preco: 1399,
          specs: '6 Núcleos / 12 Threads • Até 5.1GHz • Arquitetura Zen 4',
          soquete: 'AM5',
          consumoWatts: 65,
          finalidades: ['jogos', 'hibrido', 'trabalho'],
          corHex: '#a855f7'
        },
        {
          id: 'cpu-i7-14700k',
          categoria: 'cpu',
          nome: 'Intel Core i7-14700K',
          preco: 2690,
          specs: '20 Núcleos (8P + 12E) / 28 Threads • Até 5.6GHz',
          soquete: 'LGA1700',
          consumoWatts: 125,
          finalidades: ['jogos', 'trabalho'],
          corHex: '#2563eb'
        }
      ],
      cooler: [
        {
          id: 'cool-box-amd',
          categoria: 'cooler',
          nome: 'Air Cooler DeepCool AK400 120mm',
          preco: 169,
          specs: '4 Heatpipes de Cobre • Fan 120mm PWM Silencioso • TDP até 220W',
          soquetesSuportados: ['AM4', 'AM5', 'LGA1700'],
          consumoWatts: 5,
          finalidades: ['domestico', 'trabalho', 'hibrido', 'jogos'],
          corHex: '#64748b'
        },
        {
          id: 'cool-ag620',
          categoria: 'cooler',
          nome: 'Air Cooler Dual Tower ARGB 120mm',
          preco: 319,
          specs: 'Torre Dupla • 6 Heatpipes • Iluminação ARGB • TDP até 260W',
          soquetesSuportados: ['AM4', 'AM5', 'LGA1700'],
          consumoWatts: 10,
          finalidades: ['jogos', 'trabalho', 'hibrido'],
          corHex: '#a855f7'
        },
        {
          id: 'cool-wc-240',
          categoria: 'cooler',
          nome: 'Water Cooler 240mm ARGB Liquid',
          preco: 449,
          specs: 'Radiador 240mm • 2x Fans 120mm ARGB • Bomba de Alto Fluxo',
          soquetesSuportados: ['AM4', 'AM5', 'LGA1700'],
          consumoWatts: 15,
          finalidades: ['jogos', 'trabalho'],
          corHex: '#06b6d4'
        }
      ],
      mobo: [
        {
          id: 'mobo-b550m-am4',
          categoria: 'mobo',
          nome: 'Placa-Mãe B550M Aorus Elite (AM4 / DDR4)',
          preco: 749,
          specs: 'Soquete AM4 • Suporte DDR4 até 128GB • Slot M.2 NVMe PCIe 4.0',
          soquete: 'AM4',
          tipoRam: 'DDR4',
          formato: 'Micro-ATX',
          consumoWatts: 35,
          finalidades: ['jogos', 'hibrido', 'trabalho', 'domestico'],
          corHex: '#f97316'
        },
        {
          id: 'mobo-b660m-lga1700',
          categoria: 'mobo',
          nome: 'Placa-Mãe B660M Gaming (Intel LGA1700 / DDR4)',
          preco: 789,
          specs: 'Soquete LGA1700 • Memória DDR4 • 2x Slots M.2 NVMe • LAN 2.5GbE',
          soquete: 'LGA1700',
          tipoRam: 'DDR4',
          formato: 'Micro-ATX',
          consumoWatts: 35,
          finalidades: ['jogos', 'trabalho', 'hibrido'],
          corHex: '#38bdf8'
        },
        {
          id: 'mobo-b650-am5',
          categoria: 'mobo',
          nome: 'Placa-Mãe B650 Gaming Plus Wi-Fi (AM5 / DDR5)',
          preco: 1299,
          specs: 'Soquete AM5 • Memória DDR5 • Wi-Fi 6E • Formato ATX Padrão',
          soquete: 'AM5',
          tipoRam: 'DDR5',
          formato: 'ATX',
          consumoWatts: 45,
          finalidades: ['jogos', 'hibrido', 'trabalho'],
          corHex: '#a855f7'
        },
        {
          id: 'mobo-z790-lga1700',
          categoria: 'mobo',
          nome: 'Placa-Mãe Z790 Aorus Elite AX (LGA1700 / DDR5)',
          preco: 1890,
          specs: 'Soquete LGA1700 • Memória DDR5 • PCIe 5.0 • Formato ATX',
          soquete: 'LGA1700',
          tipoRam: 'DDR5',
          formato: 'ATX',
          consumoWatts: 50,
          finalidades: ['jogos', 'trabalho'],
          corHex: '#3b82f6'
        }
      ],
      ram: [
        {
          id: 'ram-16gb-ddr4',
          categoria: 'ram',
          nome: 'Memória 16GB (2x8GB) Kingston Fury Beast DDR4 3200MHz',
          preco: 319,
          specs: 'Dual Channel (2x8GB) • Padrão DDR4 • 3200MHz CL16',
          tipoRam: 'DDR4',
          consumoWatts: 10,
          finalidades: ['domestico', 'trabalho', 'hibrido', 'jogos'],
          corHex: '#10b981'
        },
        {
          id: 'ram-32gb-ddr4',
          categoria: 'ram',
          nome: 'Memória 32GB (2x16GB) Corsair Vengeance RGB DDR4 3600MHz',
          preco: 589,
          specs: 'Dual Channel (2x16GB) • Padrão DDR4 • 3600MHz RGB',
          tipoRam: 'DDR4',
          consumoWatts: 14,
          finalidades: ['trabalho', 'jogos', 'hibrido'],
          corHex: '#14b8a6'
        },
        {
          id: 'ram-32gb-ddr5',
          categoria: 'ram',
          nome: 'Memória 32GB (2x16GB) XPG Lancer RGB DDR5 6000MHz',
          preco: 899,
          specs: 'Dual Channel (2x16GB) • Padrão DDR5 • 6000MHz CL30 • AMD EXPO / XMP',
          tipoRam: 'DDR5',
          consumoWatts: 15,
          finalidades: ['jogos', 'trabalho', 'hibrido'],
          corHex: '#a855f7'
        }
      ],
      gpu: [
        {
          id: 'gpu-integrada',
          categoria: 'gpu',
          nome: 'Usar Vídeo Integrado / Sem Placa Dedicada (Básico)',
          preco: 0,
          specs: 'Ideal para escritório e uso doméstico (requer CPU com gráfico integrado)',
          consumoWatts: 0,
          comprimentoMm: 0,
          finalidades: ['domestico', 'trabalho'],
          corHex: '#64748b'
        },
        {
          id: 'gpu-rx6600',
          categoria: 'gpu',
          nome: 'AMD Radeon RX 6600 8GB GDDR6',
          preco: 1399,
          specs: '8GB GDDR6 • Excelente para Jogos em Full HD (1080p) • Dual Fan',
          consumoWatts: 132,
          comprimentoMm: 240,
          finalidades: ['jogos', 'hibrido'],
          corHex: '#ef4444'
        },
        {
          id: 'gpu-rtx4060',
          categoria: 'gpu',
          nome: 'NVIDIA GeForce RTX 4060 8GB GDDR6 DLSS 3',
          preco: 1999,
          specs: '8GB GDDR6 • Ray Tracing + DLSS 3 • Criação de Conteúdo e Jogos',
          consumoWatts: 115,
          comprimentoMm: 245,
          finalidades: ['jogos', 'hibrido', 'trabalho'],
          corHex: '#22c55e'
        },
        {
          id: 'gpu-rtx4070s',
          categoria: 'gpu',
          nome: 'NVIDIA GeForce RTX 4070 Super 12GB GDDR6X',
          preco: 4199,
          specs: '12GB GDDR6X • Quad HD / 4K no Ultra • Triple Fan (310mm)',
          consumoWatts: 220,
          comprimentoMm: 310,
          finalidades: ['jogos', 'trabalho'],
          corHex: '#10b981'
        }
      ],
      ssd: [
        {
          id: 'ssd-500gb-nvme',
          categoria: 'ssd',
          nome: 'SSD Kingston NV2 500GB M.2 NVMe PCIe 4.0',
          preco: 259,
          specs: 'Leitura 3500MB/s • Gravação 2100MB/s • Formato M.2 2280',
          consumoWatts: 5,
          finalidades: ['domestico', 'trabalho', 'hibrido'],
          corHex: '#38bdf8'
        },
        {
          id: 'ssd-1tb-nvme',
          categoria: 'ssd',
          nome: 'SSD Kingston NV2 1TB M.2 NVMe PCIe 4.0',
          preco: 419,
          specs: 'Capacidade 1TB • Leitura 3500MB/s • Inicialização rápida em 8s',
          consumoWatts: 6,
          finalidades: ['jogos', 'trabalho', 'hibrido', 'domestico'],
          corHex: '#6366f1'
        },
        {
          id: 'ssd-2tb-fury',
          categoria: 'ssd',
          nome: 'SSD Fury Renegade 2TB M.2 NVMe Gen4 (7300MB/s)',
          preco: 949,
          specs: 'Capacidade 2TB • Leitura 7300MB/s • Dissipador de Grafeno',
          consumoWatts: 8,
          finalidades: ['jogos', 'trabalho'],
          corHex: '#a855f7'
        }
      ],
      case: [
        {
          id: 'case-matx-mesh',
          categoria: 'case',
          nome: 'Gabinete Gamer Mancer Goblin Micro-ATX Lateral Vidro',
          preco: 219,
          specs: 'Suporta Placas Micro-ATX e Mini-ITX • Frente Mesh • GPU até 320mm',
          formatosSuportados: ['Micro-ATX', 'Mini-ITX'],
          maxGpuMm: 320,
          consumoWatts: 5,
          finalidades: ['domestico', 'trabalho', 'hibrido', 'jogos'],
          corHex: '#94a3b8'
        },
        {
          id: 'case-atx-aquario',
          categoria: 'case',
          nome: 'Gabinete Mid-Tower NZXT / Aquário ATX Vidro Duplo + 4 Fans',
          preco: 429,
          specs: 'Suporta ATX, Micro-ATX e Mini-ITX • 4 Fans ARGB inclusos • GPU até 380mm',
          formatosSuportados: ['ATX', 'Micro-ATX', 'Mini-ITX'],
          maxGpuMm: 380,
          consumoWatts: 12,
          finalidades: ['jogos', 'hibrido', 'trabalho'],
          corHex: '#a855f7'
        },
        {
          id: 'case-itx-compact',
          categoria: 'case',
          nome: 'Gabinete Ultra Compacto Mini-ITX SFF (Apenas Placas Mini-ITX)',
          preco: 349,
          specs: 'Exclusivo Mini-ITX • GPU até 250mm • Ideal para testar restrição de tamanho',
          formatosSuportados: ['Mini-ITX'],
          maxGpuMm: 250,
          consumoWatts: 5,
          finalidades: ['domestico', 'trabalho'],
          corHex: '#f43f5e'
        }
      ],
      psu: [
        {
          id: 'psu-300w-basica',
          categoria: 'psu',
          nome: 'Fonte 300W PFC Ativo (Uso Básico Sem Placa de Vídeo Forte)',
          preco: 169,
          specs: 'Potência 300W • Bivolt Automático • Apenas para PCs de baixo consumo',
          potenciaWatts: 300,
          consumoWatts: 0,
          finalidades: ['domestico'],
          corHex: '#f59e0b'
        },
        {
          id: 'psu-550w-bronze',
          categoria: 'psu',
          nome: 'Fonte MSI MAG A550BN 550W 80 Plus Bronze PFC Ativo',
          preco: 299,
          specs: 'Potência 550W Reais • Certificação 80 Plus Bronze • Cabos Flat Pretos',
          potenciaWatts: 550,
          consumoWatts: 0,
          finalidades: ['jogos', 'hibrido', 'trabalho', 'domestico'],
          corHex: '#10b981'
        },
        {
          id: 'psu-650w-bronze',
          categoria: 'psu',
          nome: 'Fonte Corsair CV650 650W 80 Plus Bronze',
          preco: 389,
          specs: 'Potência 650W Reais • Alta Eficiência • Proteção OVP/OPP/SCP',
          potenciaWatts: 650,
          consumoWatts: 0,
          finalidades: ['jogos', 'hibrido', 'trabalho'],
          corHex: '#06b6d4'
        },
        {
          id: 'psu-750w-gold',
          categoria: 'psu',
          nome: 'Fonte XPG Core Reactor 750W 80 Plus Gold Full Modular',
          preco: 649,
          specs: 'Potência 750W • 80 Plus Gold • 100% Modular • Pronta para GPUs High-End',
          potenciaWatts: 750,
          consumoWatts: 0,
          finalidades: ['jogos', 'trabalho'],
          corHex: '#a855f7'
        }
      ]
    };

    // ==========================================
    
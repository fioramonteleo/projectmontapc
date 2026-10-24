/**
 * Motor de Avaliação de Desempenho e Estimativas de FPS — Konoha Hardware
 * 
 * Responsável exclusivamente por gerar os resultados da tela final da montagem,
 * focando no que o computador montado é capaz de realizar conforme a finalidade:
 * - Jogos (PC Gamer): Estimativas documentadas de FPS em 1080p e 1440p, qualidade gráfica e classificação.
 * - Trabalho e Produtividade: Adequação prática para escritório, programação, multitarefas e AutoCAD.
 * - Uso Híbrido: Combinação estruturada das análises de jogos e produtividade.
 * 
 * Nota Metodológica: As médias de FPS baseiam-se em referências públicas de benchmarks de hardware
 * (TechPowerUp / Hardware Unboxed / Tom's Hardware) considerando GPU, escalonamento de CPU (Zen 3 / Alder Lake / Zen 4 X3D)
 * e largura de banda de memória RAM (Single vs Dual Channel). Quando uma combinação não possui dados confiáveis
 * ou é inadequada (ex.: iGPU básico em 1440p ou jogos AAA pesados), o sistema informa explicitamente a indisponibilidade.
 */

(() => {
const BENCHMARKS_BASE_GPU = {
  'gpu-integrada': {
    resumoGrafico: 'Vídeo Integrado (Sem Placa Dedicada)',
    jogos: {
      cs2: {
        nome: 'Counter-Strike 2 (CS2)',
        genero: 'FPS Competitivo',
        fps1080p: { media: 65, qualidade: 'Baixo (1080p)', disponivel: true },
        fps1440p: { media: null, qualidade: 'Não recomendado', disponivel: false, motivo: 'Estimativa indisponível: vídeo integrado não possui largura de banda para 1440p no CS2.' }
      },
      valorant: {
        nome: 'Valorant',
        genero: 'Tático 5v5',
        fps1080p: { media: 135, qualidade: 'Médio (1080p)', disponivel: true },
        fps1440p: { media: 80, qualidade: 'Baixo (1440p)', disponivel: true }
      },
      fortnite: {
        nome: 'Fortnite',
        genero: 'Battle Royale',
        fps1080p: { media: 70, qualidade: 'Modo Desempenho / Baixo', disponivel: true },
        fps1440p: { media: null, qualidade: 'Indisponível', disponivel: false, motivo: 'Estimativa indisponível para 1440p sem placa de vídeo dedicada.' }
      },
      gtav: {
        nome: 'Grand Theft Auto V (GTA V)',
        genero: 'Mundo Aberto',
        fps1080p: { media: 58, qualidade: 'Normal / Médio (1080p)', disponivel: true },
        fps1440p: { media: null, qualidade: 'Indisponível', disponivel: false, motivo: 'Estimativa indisponível para 1440p em gráficos integrados.' }
      },
      rdr2: {
        nome: 'Red Dead Redemption 2',
        genero: 'Ação / Mundo Aberto AAA',
        fps1080p: { media: null, qualidade: 'Abaixo de 30 FPS', disponivel: false, motivo: 'Estimativa indisponível: título AAA exige placa de vídeo dedicada com pelo menos 6GB de VRAM.' },
        fps1440p: { media: null, qualidade: 'Indisponível', disponivel: false, motivo: 'Exige placa de vídeo dedicada.' }
      },
      cyberpunk: {
        nome: 'Cyberpunk 2077',
        genero: 'RPG AAA Pesado',
        fps1080p: { media: null, qualidade: 'Incompatível para jogo fluido', disponivel: false, motivo: 'Estimativa indisponível: jogo exige GPU dedicada (mínimo RX 6600 / RTX 4060).' },
        fps1440p: { media: null, qualidade: 'Indisponível', disponivel: false, motivo: 'Exige placa de vídeo dedicada.' }
      }
    }
  },

  'gpu-rx6600': {
    resumoGrafico: 'Radeon RX 6600 8GB GDDR6 (Foco em 1080p Alto)',
    jogos: {
      cs2: {
        nome: 'Counter-Strike 2 (CS2)',
        genero: 'FPS Competitivo',
        fps1080p: { media: 210, qualidade: 'Alto (1080p)', disponivel: true },
        fps1440p: { media: 145, qualidade: 'Médio (1440p)', disponivel: true }
      },
      valorant: {
        nome: 'Valorant',
        genero: 'Tático 5v5',
        fps1080p: { media: 310, qualidade: 'Alto (1080p)', disponivel: true },
        fps1440p: { media: 230, qualidade: 'Alto (1440p)', disponivel: true }
      },
      fortnite: {
        nome: 'Fortnite',
        genero: 'Battle Royale',
        fps1080p: { media: 140, qualidade: 'Alto DX12 (1080p)', disponivel: true },
        fps1440p: { media: 90, qualidade: 'Médio (1440p)', disponivel: true }
      },
      gtav: {
        nome: 'Grand Theft Auto V (GTA V)',
        genero: 'Mundo Aberto',
        fps1080p: { media: 135, qualidade: 'Muito Alto (1080p)', disponivel: true },
        fps1440p: { media: 95, qualidade: 'Alto (1440p)', disponivel: true }
      },
      rdr2: {
        nome: 'Red Dead Redemption 2',
        genero: 'Ação / Mundo Aberto AAA',
        fps1080p: { media: 78, qualidade: 'Alto (1080p)', disponivel: true },
        fps1440p: { media: 54, qualidade: 'Médio (1440p)', disponivel: true }
      },
      cyberpunk: {
        nome: 'Cyberpunk 2077',
        genero: 'RPG AAA Pesado',
        fps1080p: { media: 68, qualidade: 'Alto (1080p)', disponivel: true },
        fps1440p: { media: 45, qualidade: 'Médio / FSR Qualidade (1440p)', disponivel: true }
      }
    }
  },

  'gpu-rtx4060': {
    resumoGrafico: 'GeForce RTX 4060 8GB GDDR6 (1080p Ultra & DLSS 3)',
    jogos: {
      cs2: {
        nome: 'Counter-Strike 2 (CS2)',
        genero: 'FPS Competitivo',
        fps1080p: { media: 255, qualidade: 'Alto / Muito Alto (1080p)', disponivel: true },
        fps1440p: { media: 180, qualidade: 'Alto (1440p)', disponivel: true }
      },
      valorant: {
        nome: 'Valorant',
        genero: 'Tático 5v5',
        fps1080p: { media: 360, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 275, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      fortnite: {
        nome: 'Fortnite',
        genero: 'Battle Royale',
        fps1080p: { media: 175, qualidade: 'Alto / Épico DX12 (1080p)', disponivel: true },
        fps1440p: { media: 115, qualidade: 'Alto (1440p)', disponivel: true }
      },
      gtav: {
        nome: 'Grand Theft Auto V (GTA V)',
        genero: 'Mundo Aberto',
        fps1080p: { media: 155, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 112, qualidade: 'Muito Alto (1440p)', disponivel: true }
      },
      rdr2: {
        nome: 'Red Dead Redemption 2',
        genero: 'Ação / Mundo Aberto AAA',
        fps1080p: { media: 94, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 68, qualidade: 'Alto (1440p)', disponivel: true }
      },
      cyberpunk: {
        nome: 'Cyberpunk 2077',
        genero: 'RPG AAA Pesado',
        fps1080p: { media: 85, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 58, qualidade: 'Alto / DLSS Qualidade (1440p)', disponivel: true }
      }
    }
  },

  'gpu-rx7700xt': {
    resumoGrafico: 'Radeon RX 7700 XT 12GB GDDR6 (1440p Quad HD Alto/Ultra)',
    jogos: {
      cs2: {
        nome: 'Counter-Strike 2 (CS2)',
        genero: 'FPS Competitivo',
        fps1080p: { media: 320, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 240, qualidade: 'Alto / Ultra (1440p)', disponivel: true }
      },
      valorant: {
        nome: 'Valorant',
        genero: 'Tático 5v5',
        fps1080p: { media: 420, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 340, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      fortnite: {
        nome: 'Fortnite',
        genero: 'Battle Royale',
        fps1080p: { media: 220, qualidade: 'Épico DX12 (1080p)', disponivel: true },
        fps1440p: { media: 150, qualidade: 'Alto / Épico (1440p)', disponivel: true }
      },
      gtav: {
        nome: 'Grand Theft Auto V (GTA V)',
        genero: 'Mundo Aberto',
        fps1080p: { media: 175, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 142, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      rdr2: {
        nome: 'Red Dead Redemption 2',
        genero: 'Ação / Mundo Aberto AAA',
        fps1080p: { media: 125, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 95, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      cyberpunk: {
        nome: 'Cyberpunk 2077',
        genero: 'RPG AAA Pesado',
        fps1080p: { media: 112, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 78, qualidade: 'Ultra (1440p)', disponivel: true }
      }
    }
  },

  'gpu-rtx4070s': {
    resumoGrafico: 'GeForce RTX 4070 Super 12GB GDDR6X (Quad HD 1440p Ultra)',
    jogos: {
      cs2: {
        nome: 'Counter-Strike 2 (CS2)',
        genero: 'FPS Competitivo',
        fps1080p: { media: 360, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 285, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      valorant: {
        nome: 'Valorant',
        genero: 'Tático 5v5',
        fps1080p: { media: 460, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 380, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      fortnite: {
        nome: 'Fortnite',
        genero: 'Battle Royale',
        fps1080p: { media: 250, qualidade: 'Épico DX12 (1080p)', disponivel: true },
        fps1440p: { media: 175, qualidade: 'Épico DX12 (1440p)', disponivel: true }
      },
      gtav: {
        nome: 'Grand Theft Auto V (GTA V)',
        genero: 'Mundo Aberto',
        fps1080p: { media: 182, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 158, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      rdr2: {
        nome: 'Red Dead Redemption 2',
        genero: 'Ação / Mundo Aberto AAA',
        fps1080p: { media: 142, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 112, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      cyberpunk: {
        nome: 'Cyberpunk 2077',
        genero: 'RPG AAA Pesado',
        fps1080p: { media: 132, qualidade: 'Ultra + DLSS (1080p)', disponivel: true },
        fps1440p: { media: 96, qualidade: 'Ultra + DLSS Qualidade (1440p)', disponivel: true }
      }
    }
  },

  'gpu-rtx4080s': {
    resumoGrafico: 'GeForce RTX 4080 Super 16GB GDDR6X (Entusiasta 1440p 240Hz / 4K)',
    jogos: {
      cs2: {
        nome: 'Counter-Strike 2 (CS2)',
        genero: 'FPS Competitivo',
        fps1080p: { media: 410, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 340, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      valorant: {
        nome: 'Valorant',
        genero: 'Tático 5v5',
        fps1080p: { media: 520, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 440, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      fortnite: {
        nome: 'Fortnite',
        genero: 'Battle Royale',
        fps1080p: { media: 295, qualidade: 'Épico DX12 (1080p)', disponivel: true },
        fps1440p: { media: 220, qualidade: 'Épico DX12 (1440p)', disponivel: true }
      },
      gtav: {
        nome: 'Grand Theft Auto V (GTA V)',
        genero: 'Mundo Aberto',
        fps1080p: { media: 185, qualidade: 'Ultra — Limite da Engine (1080p)', disponivel: true },
        fps1440p: { media: 172, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      rdr2: {
        nome: 'Red Dead Redemption 2',
        genero: 'Ação / Mundo Aberto AAA',
        fps1080p: { media: 168, qualidade: 'Ultra (1080p)', disponivel: true },
        fps1440p: { media: 138, qualidade: 'Ultra (1440p)', disponivel: true }
      },
      cyberpunk: {
        nome: 'Cyberpunk 2077',
        genero: 'RPG AAA Pesado',
        fps1080p: { media: 160, qualidade: 'Ultra + Ray Tracing (1080p)', disponivel: true },
        fps1440p: { media: 124, qualidade: 'Ultra + DLSS 3 (1440p)', disponivel: true }
      }
    }
  }
};

/**
 * Calcula as estimativas de FPS ajustadas pelo processador e pela memória RAM escolhidos.
 */
function calcularFpsAjustados(cpu, gpu, ram) {
  if (!cpu || !gpu || !ram) return [];
  const baseGpu = BENCHMARKS_BASE_GPU[gpu.id];
  if (!baseGpu) return [];

  // Fator de escalonamento de CPU (referência nível 2 = 1.00)
  let fatorCpu1080p = 1.0;
  if (cpu.nivelCpu === 1) fatorCpu1080p = 0.86;
  if (cpu.nivelCpu === 2) fatorCpu1080p = 1.0;
  if (cpu.nivelCpu === 3) fatorCpu1080p = 1.12;
  if (cpu.nivelCpu === 4) fatorCpu1080p = 1.22;

  // Em 1440p o limitante principal é a placa de vídeo (menor variação de CPU)
  const fatorCpu1440p = 1 + (fatorCpu1080p - 1) * 0.55;

  // Penalidade caso a memória esteja em Single Channel (1x8GB)
  const fatorRam = ram.modulos === 1 ? 0.88 : 1.0;

  // Se for vídeo integrado de Ryzen 7000 (RDNA 2 2-CU básico para dar vídeo), avisa que é iGPU básico
  const igpuBasicoAm5 = gpu.id === 'gpu-integrada' && cpu.soquete === 'AM5';

  return Object.values(baseGpu.jogos).map((jogo) => {
    if (igpuBasicoAm5) {
      return {
        nome: jogo.nome,
        genero: jogo.genero,
        fps1080p: {
          media: jogo.nome.includes('Valorant') ? 95 : null,
          qualidade: jogo.nome.includes('Valorant') ? 'Baixo (1080p)' : 'Indisponível',
          disponivel: jogo.nome.includes('Valorant'),
          motivo: 'O vídeo integrado da linha Ryzen 7000 possui apenas 2 núcleos gráficos (foco em exibição de vídeo/escritório). Adicione uma GPU dedicada para jogos.'
        },
        fps1440p: {
          media: null,
          qualidade: 'Indisponível',
          disponivel: false,
          motivo: 'Requer placa de vídeo dedicada.'
        }
      };
    }

    const res1080 = jogo.fps1080p.disponivel
      ? {
          media: Math.round(jogo.fps1080p.media * fatorCpu1080p * fatorRam),
          qualidade: jogo.fps1080p.qualidade,
          disponivel: true
        }
      : { ...jogo.fps1080p };

    const res1440 = jogo.fps1440p.disponivel
      ? {
          media: Math.round(jogo.fps1440p.media * fatorCpu1440p * fatorRam),
          qualidade: jogo.fps1440p.qualidade,
          disponivel: true
        }
      : { ...jogo.fps1440p };

    return {
      nome: jogo.nome,
      genero: jogo.genero,
      fps1080p: res1080,
      fps1440p: res1440
    };
  });
}

/**
 * Gera o relatório completo de desempenho do computador montado de acordo com a finalidade escolhida.
 * Finalidades aceitas: 'jogos' | 'trabalho' | 'hibrido'
 */
window.Konoha = window.Konoha || {};

function gerarRelatorioDesempenho(selecao, finalidade = 'jogos') {
  const { cpu, placamae, ram, gpu, armazenamento, fonte, gabinete, cooler } = selecao;

  const pecasLista = Object.values(selecao).filter(Boolean);
  const precoTotal = pecasLista.reduce((acc, item) => acc + (item.preco || 0), 0);

  // Classificação geral Gamer
  let classificacaoGamer = 'Entrada';
  let descricaoGamer = 'Configuração voltada para jogos leves e competitivos em Full HD (1080p).';
  if (gpu) {
    if (gpu.nivelGpu === 0) {
      classificacaoGamer = 'Entrada (Vídeo Integrado)';
      descricaoGamer = 'Apto para jogos leves de eSports em 720p/1080p no Baixo. Não indicado para jogos AAA pesados sem adicionar placa de vídeo dedicada.';
    } else if (gpu.nivelGpu === 1) {
      classificacaoGamer = 'Entrada (Full HD 1080p)';
      descricaoGamer = 'Excelente custo-benefício para rodar jogos competitivos em alta taxa de quadros e títulos atuais em 1080p na qualidade Média/Alta.';
    } else if (gpu.nivelGpu === 2) {
      classificacaoGamer = 'Intermediário (1080p Ultra)';
      descricaoGamer = 'Roda todos os jogos atuais em Full HD (1080p) na qualidade Alta/Ultra com suporte a tecnologias modernas de upscaling e boa margem para 1440p.';
    } else if (gpu.nivelGpu >= 3) {
      classificacaoGamer = 'Alto Desempenho (1440p Quad HD / 4K)';
      descricaoGamer = 'Máquina de alto desempenho projetada para monitores de alta taxa de atualização em 1440p (Quad HD) no Ultra e jogos exigentes com folga de VRAM.';
    }
  }

  // Classificação e Adequação para Trabalho e AutoCAD
  let classificacaoTrabalho = 'Básico — Estudos e Escritório';
  let descricaoTrabalho = 'Atende com agilidade navegação web, aulas on-line, pacote Office e rotinas administrativas.';

  const ramGb = ram ? ram.capacidadeGb : 8;
  const temGpuDedicada = gpu && !gpu.requerVideoIntegradoCpu && gpu.vramGb >= 8;

  if (temGpuDedicada && ramGb >= 32 && cpu && cpu.nivelCpu >= 2) {
    classificacaoTrabalho = 'Profissional — Engenharia, AutoCAD 2D/3D e Criação';
    descricaoTrabalho = 'Estação de trabalho completa: combina 32GB de RAM em Dual Channel, processador de alto desempenho e placa de vídeo dedicada de 8GB+ GDDR6.';
  } else if (ramGb >= 16 && cpu && cpu.nivelCpu >= 2) {
    classificacaoTrabalho = 'Intermediário — Programação, Multitarefas e Produtividade';
    descricaoTrabalho = 'Ótimo desempenho para desenvolvimento de software, compilação de código, bancos de dados, planilhas extensas e uso simultâneo de várias aplicações.';
  }

  // Avaliação técnica específica de aplicações de trabalho (incluindo requisitos reais do AutoCAD)
  const avaliacaoAplicacoesTrabalho = [
    {
      area: 'Estudos, Pacote Office, Aulas On-line e Navegação',
      nivelAdequacao: 'Excelente',
      statusClasse: 'adequado-pleno',
      detalhe: `O processador ${cpu ? cpu.nome.split(',')[0] : ''} junto ao SSD garante inicialização rápida e fluidez total em navegadores, videochamadas e editores de texto.`
    },
    {
      area: 'Programação, IDEs (VS Code / IntelliJ) e Multitarefas',
      nivelAdequacao: ramGb >= 16 ? 'Excelente (Recomendado)' : 'Básico / Limitado em projetos grandes',
      statusClasse: ramGb >= 16 ? 'adequado-pleno' : 'adequado-parcial',
      detalhe: ramGb >= 16
        ? `Com ${ramGb}GB de RAM em Dual Channel e ${cpu ? cpu.especificacoes[1] : 'múltiplos núcleos'}, compila códigos, executa containers locais e mantém dezenas de abas abertas sem travamentos.`
        : '8GB de RAM permite estudar lógica e programação web leve, mas limita o uso simultâneo de IDEs pesadas, emuladores ou máquinas virtuais.'
    },
    {
      area: 'AutoCAD e Desenho Técnico (Requisitos Autodesk)',
      nivelAdequacao: temGpuDedicada && ramGb >= 16
        ? (ramGb >= 32 ? 'Plenamente Indicado (2D e 3D Técnico)' : 'Indicado para AutoCAD 2D e 3D Moderado')
        : (ramGb >= 16 ? 'Apenas Visualização / Plantas 2D Leves' : 'Não Recomendado para AutoCAD'),
      statusClasse: temGpuDedicada && ramGb >= 16 ? 'adequado-pleno' : (ramGb >= 16 ? 'adequado-parcial' : 'adequado-baixo'),
      detalhe: temGpuDedicada && ramGb >= 16
        ? `Cumpre os requisitos oficiais da Autodesk: possui placa de vídeo dedicada (${gpu.vramGb}GB VRAM DirectX 12) e ${ramGb}GB de RAM para manipulação fluida de plantas DWG e malhas 3D.`
        : !temGpuDedicada
          ? 'A Autodesk exige placa de vídeo dedicada (mínimo 4GB/8GB VRAM DirectX 12) para aceleração 3D no AutoCAD. Com vídeo integrado, o uso restringe-se à abertura de plantas 2D simples.'
          : 'Com apenas 8GB de RAM, projetos técnicos do AutoCAD sofrerão lentidão por falta de memória principal (recomendado 16GB a 32GB).'
    }
  ];

  // Jogos ou Aplicações recomendadas conforme a finalidade
  const recomendacoesUso = [];
  if (finalidade === 'jogos' || finalidade === 'hibrido') {
    if (gpu && gpu.nivelGpu === 0) {
      recomendacoesUso.push('Jogos competitivos leves em 720p/1080p Baixo (Valorant, League of Legends, CS2 leve)');
      recomendacoesUso.push('Emuladores leves e jogos 2D / Indie');
    } else if (gpu && gpu.nivelGpu === 1) {
      recomendacoesUso.push('eSports competitivos acima de 140 FPS em Full HD (CS2, Valorant, Fortnite, Overwatch 2)');
      recomendacoesUso.push('Jogos de mundo aberto e AAA em 1080p Alto (GTA V, Red Dead Redemption 2, Elden Ring)');
    } else if (gpu && gpu.nivelGpu === 2) {
      recomendacoesUso.push('Jogos AAA modernos em 1080p Ultra com DLSS 3 (Cyberpunk 2077, Forza, Alan Wake 2)');
      recomendacoesUso.push('Monitores Gamer 1080p de 144Hz a 240Hz em títulos competitivos');
    } else if (gpu && gpu.nivelGpu >= 3) {
      recomendacoesUso.push('Jogos em Quad HD (1440p) na qualidade Ultra com alta taxa de quadros');
      recomendacoesUso.push('Streaming de jogos e gravação simultânea em alta definição');
    }
  }

  if (finalidade === 'trabalho' || finalidade === 'hibrido') {
    recomendacoesUso.push('Navegação intensa, pesquisa acadêmica, aulas remotas e suítes de escritório (Office / Google Workspace)');
    if (ramGb >= 16) {
      recomendacoesUso.push('Desenvolvimento de software, análise de dados, planilhas complexas e multitarefa com múltiplos monitores');
    }
    if (temGpuDedicada && ramGb >= 16) {
      recomendacoesUso.push('Projetos técnicos em AutoCAD 2D/3D, modelagem CAD e edição gráfica acelerada por GPU');
    }
  }

  // Pontos Fortes e Limitações Dinâmicos
  const pontosFortes = [];
  const limitacoes = [];

  if (cpu) {
    if (cpu.nivelCpu >= 3) {
      pontosFortes.push(`Processador de alto desempenho (${cpu.nome.split(',')[0]}) com excelente folga para cargas pesadas e longevidade.`);
    } else {
      pontosFortes.push(`Processador de 6 núcleos e 12 threads (${cpu.nome.split(',')[0]}), garantindo boa resposta em tarefas simultâneas.`);
    }
  }

  if (ram) {
    if (ram.capacidadeGb >= 32) {
      pontosFortes.push(`32GB de memória RAM (${ram.tipoRam} ${ram.frequenciaMhz}MHz) em Dual Channel: folga ampla para jogos modernos, AutoCAD e multitarefa pesada.`);
    } else if (ram.capacidadeGb === 16 && ram.modulos === 2) {
      pontosFortes.push('16GB de RAM em Dual Channel (2x8GB), ponto de equilíbrio ideal para jogos em Full HD e produtividade.');
      if (finalidade !== 'jogos') {
        limitacoes.push('16GB de RAM atende muito bem hoje, mas projetos grandes de engenharia/CAD ou múltiplas máquinas virtuais podem se beneficiar de 32GB.');
      }
    } else if (ram.capacidadeGb === 8) {
      limitacoes.push('Apenas 8GB de memória RAM em módulo único (Single Channel): reduz a taxa de quadros em jogos atuais e limita softwares técnicos como AutoCAD.');
    }
  }

  if (gpu) {
    if (gpu.requerVideoIntegradoCpu) {
      pontosFortes.push('Economia de orçamento e baixo consumo elétrico ao utilizar o vídeo integrado do processador.');
      limitacoes.push('Sem placa de vídeo dedicada: não indicado para jogos AAA pesados em 1080p/1440p nem para modelagem 3D no AutoCAD.');
    } else if (gpu.vramGb === 8) {
      pontosFortes.push(`Placa de vídeo dedicada (${gpu.nome.split(',')[0]}) com 8GB GDDR6, excelente para Full HD (1080p) e aceleração gráfica.`);
      limitacoes.push('Os 8GB de VRAM atendem 1080p com folga, mas podem exigir texturas no Médio/Alto em alguns lançamentos futuros na resolução 1440p (Quad HD).');
    } else if (gpu.vramGb >= 12) {
      pontosFortes.push(`Placa de vídeo robusta com ${gpu.vramGb}GB de VRAM dedicada, pronta para 1440p no Ultra e aplicações gráficas exigentes.`);
    }
  }

  if (armazenamento) {
    if (armazenamento.tipoInterface === 'NVMe') {
      pontosFortes.push(`SSD M.2 NVMe de ${armazenamento.capacidadeGb >= 1000 ? (armazenamento.capacidadeGb / 1000) + 'TB' : armazenamento.capacidadeGb + 'GB'} (${armazenamento.leituraMbs}MB/s) para carregamento quase instantâneo do sistema e programas.`);
    } else {
      limitacoes.push('SSD SATA III (500MB/s) é muito superior a um HD mecânico, mas possui velocidade menor que um SSD M.2 NVMe PCIe 4.0.');
    }
    if (armazenamento.capacidadeGb <= 500 && (finalidade === 'jogos' || finalidade === 'hibrido')) {
      limitacoes.push(`Capacidade de ${armazenamento.capacidadeGb}GB comporta o sistema operacional e cerca de 3 a 4 jogos grandes atuais; considere 1TB caso instale muitos títulos.`);
    }
  }

  if (limitacoes.length === 0) {
    limitacoes.push('Configuração de topo sem gargalos técnicos para a faixa proposta; o consumo elétrico e a dissipação de calor são mais elevados em carga máxima.');
  }

  const estimativasFps = (finalidade === 'jogos' || finalidade === 'hibrido')
    ? calcularFpsAjustados(cpu, gpu, ram)
    : [];

  return {
    finalidade,
    precoTotal,
    pecasSelecionadas: pecasLista,
    classificacaoGeral: finalidade === 'jogos'
      ? classificacaoGamer
      : finalidade === 'trabalho'
        ? classificacaoTrabalho
        : `${classificacaoGamer} / ${classificacaoTrabalho.split('—')[0].trim()}`,
    descricaoDesempenho: finalidade === 'jogos'
      ? descricaoGamer
      : finalidade === 'trabalho'
        ? descricaoTrabalho
        : `${descricaoGamer} Na produtividade: ${descricaoTrabalho}`,
    estimativasFps,
    avaliacaoAplicacoesTrabalho: (finalidade === 'trabalho' || finalidade === 'hibrido') ? avaliacaoAplicacoesTrabalho : [],
    recomendacoesUso,
    pontosFortes,
    limitacoes
  };
}

Object.assign(window.Konoha, {
  gerarRelatorioDesempenho
});
})();

/**
 * Motor Independente de Compatibilidade de Hardware — Konoha Hardware
 * 
 * Realiza todas as verificações técnicas durante a seleção das peças:
 * - Soquete Processador <-> Placa-mãe (AM4, AM5, LGA1700)
 * - Geração de Memória RAM <-> Placa-mãe e Processador (DDR4 vs DDR5)
 * - Presença de Vídeo Integrado quando não há GPU dedicada
 * - Formato físico da Placa-mãe <-> Gabinete (ATX vs Micro-ATX)
 * - Comprimento da Placa de Vídeo (mm) <-> Espaço interno do Gabinete (mm)
 * - Altura e TDP máximo do Cooler <-> Gabinete e TDP do Processador
 * - Potência da Fonte (Watts) <-> Consumo total e requisito mínimo da GPU
 */

(() => {
window.Konoha = window.Konoha || {};

/**
 * Calcula o consumo estimado em carga (Watts) e a potência mínima de fonte recomendada.
 */
function calcularConsumoSistema(selecao) {
  let consumoBase = 25; // Placa, ventoinhas e periféricos USB básicos
  if (selecao.cpu) consumoBase += selecao.cpu.tdpWatts || 65;
  if (selecao.placamae) consumoBase += selecao.placamae.consumoWatts || 35;
  if (selecao.ram) consumoBase += selecao.ram.consumoWatts || 8;
  if (selecao.gpu) consumoBase += selecao.gpu.consumoWatts || 0;
  if (selecao.armazenamento) consumoBase += selecao.armazenamento.consumoWatts || 5;
  if (selecao.gabinete) consumoBase += selecao.gabinete.consumoWatts || 10;
  if (selecao.cooler) consumoBase += selecao.cooler.consumoWatts || 6;

  // Margem de segurança de 30% para picos transientes e eficiência da fonte
  const margemSeguranca = Math.ceil((consumoBase * 1.3) / 50) * 50;
  const requisitoGpu = selecao.gpu ? (selecao.gpu.fonteRecomendadaWatts || 300) : 300;
  const fonteMinimaRecomendada = Math.max(margemSeguranca, requisitoGpu);

  return {
    consumoWatts: consumoBase,
    fonteMinimaRecomendada
  };
}

/**
 * Avalia se uma peça candidata é compatível com as demais peças já escolhidas no montador.
 * Retorna `{ compativel: boolean, motivos: string[] }`.
 */
function avaliarCompatibilidadePeca(pecaCandidata, selecaoAtual) {
  if (!pecaCandidata) {
    return { compativel: true, motivos: [] };
  }

  // Simula a seleção substituindo a categoria da peça candidata
  const simulacao = {
    ...selecaoAtual,
    [pecaCandidata.categoria]: pecaCandidata
  };

  const motivos = [];
  const { cpu, placamae, ram, gpu, fonte, gabinete, cooler } = simulacao;

  // 1. Processador <-> Placa-mãe (Soquete)
  if (cpu && placamae && cpu.soquete !== placamae.soquete) {
    if (pecaCandidata.categoria === 'cpu') {
      motivos.push(`Soquete incompatível: este processador usa ${cpu.soquete}, mas sua placa-mãe atual é ${placamae.soquete}.`);
    } else if (pecaCandidata.categoria === 'placamae') {
      motivos.push(`Soquete incompatível: esta placa-mãe é ${placamae.soquete}, mas o processador escolhido exige ${cpu.soquete}.`);
    }
  }

  // 2. Memória RAM <-> Placa-mãe (Padrão DDR4 / DDR5)
  if (ram && placamae && ram.tipoRam !== placamae.tipoRam) {
    if (pecaCandidata.categoria === 'ram') {
      motivos.push(`Memória incompatível: esta RAM é ${ram.tipoRam}, mas a placa-mãe selecionada aceita apenas ${placamae.tipoRam}.`);
    } else if (pecaCandidata.categoria === 'placamae') {
      motivos.push(`Memória incompatível: esta placa-mãe usa ${placamae.tipoRam}, mas a memória selecionada é ${ram.tipoRam}.`);
    }
  }

  // 3. Memória RAM <-> Processador (Suporte do controlador integrado)
  if (ram && cpu && ram.tipoRam !== cpu.tipoRamSuportada) {
    if (pecaCandidata.categoria === 'ram' && !motivos.some((m) => m.includes('Memória incompatível'))) {
      motivos.push(`Memória incompatível: o processador escolhido suporta apenas memória ${cpu.tipoRamSuportada} (esta é ${ram.tipoRam}).`);
    } else if (pecaCandidata.categoria === 'cpu' && !motivos.some((m) => m.includes('Memória incompatível'))) {
      motivos.push(`Este processador exige memória ${cpu.tipoRamSuportada}, incompatível com a RAM ${ram.tipoRam} já selecionada.`);
    }
  }

  // 4. Processador sem vídeo integrado <-> Opção de Vídeo Integrado
  if (cpu && gpu && gpu.requerVideoIntegradoCpu && !cpu.possuiVideoIntegrado) {
    if (pecaCandidata.categoria === 'gpu') {
      motivos.push(`O processador selecionado (${cpu.nome.split(',')[0]}) não possui vídeo integrado. Selecione uma placa de vídeo dedicada.`);
    } else if (pecaCandidata.categoria === 'cpu') {
      motivos.push(`Este processador não possui vídeo integrado e você selecionou "Vídeo Integrado". Escolha uma GPU dedicada ou um processador com vídeo integrado.`);
    }
  }

  // 5. Placa-mãe <-> Gabinete (Formato ATX vs Micro-ATX)
  if (placamae && gabinete && !gabinete.formatosPlacaMae.includes(placamae.formato)) {
    if (pecaCandidata.categoria === 'gabinete') {
      motivos.push(`Gabinete compacto: suporta apenas placas ${gabinete.formatosPlacaMae.join('/')}, não comportando a placa-mãe ${placamae.formato} escolhida.`);
    } else if (pecaCandidata.categoria === 'placamae') {
      motivos.push(`Formato físico incompatível: esta placa-mãe é ${placamae.formato}, mas o gabinete escolhido comporta apenas ${gabinete.formatosPlacaMae.join('/')}.`);
    }
  }

  // 6. Placa de vídeo <-> Gabinete (Comprimento físico em milímetros)
  if (gpu && gabinete && gpu.comprimentoMm > gabinete.maxComprimentoGpuMm) {
    if (pecaCandidata.categoria === 'gpu') {
      motivos.push(`Placa de vídeo muito longa (${gpu.comprimentoMm}mm): o gabinete selecionado comporta GPUs de até ${gabinete.maxComprimentoGpuMm}mm.`);
    } else if (pecaCandidata.categoria === 'gabinete') {
      motivos.push(`Espaço interno insuficiente: este gabinete suporta GPUs até ${gabinete.maxComprimentoGpuMm}mm, mas a placa de vídeo escolhida tem ${gpu.comprimentoMm}mm.`);
    }
  }

  // 7. Cooler <-> Processador (TDP térmico e soquete)
  if (cooler && cpu) {
    if (!cooler.soquetesSuportados.includes(cpu.soquete)) {
      motivos.push(`Este cooler não possui suporte de montagem para o soquete ${cpu.soquete}.`);
    } else if (cpu.tdpWatts > cooler.tdpMaximoWatts) {
      if (pecaCandidata.categoria === 'cooler') {
        motivos.push(`Capacidade térmica insuficiente: suporta até ${cooler.tdpMaximoWatts}W, mas o processador escolhido tem TDP de ${cpu.tdpWatts}W.`);
      } else if (pecaCandidata.categoria === 'cpu') {
        motivos.push(`Este processador possui TDP de ${cpu.tdpWatts}W e aquece além do limite do Cooler Box (${cooler.tdpMaximoWatts}W). Troque o cooler por um modelo Tower ou Water Cooler.`);
      }
    }
  }

  // 8. Cooler <-> Gabinete (Altura máxima)
  if (cooler && gabinete && cooler.alturaMm > gabinete.maxAlturaCoolerMm) {
    motivos.push(`Altura do cooler (${cooler.alturaMm}mm) excede o limite lateral do gabinete (${gabinete.maxAlturaCoolerMm}mm).`);
  }

  // 9. Fonte <-> Consumo do Sistema e GPU
  if (fonte) {
    const { fonteMinimaRecomendada } = calcularConsumoSistema(simulacao);
    if (fonte.potenciaWatts < fonteMinimaRecomendada) {
      if (pecaCandidata.categoria === 'fonte') {
        motivos.push(`Potência insuficiente (${fonte.potenciaWatts}W): os componentes escolhidos exigem fonte mínima recomendada de ${fonteMinimaRecomendada}W.`);
      } else if (pecaCandidata.categoria === 'gpu') {
        motivos.push(`Sua fonte atual (${fonte.potenciaWatts}W) é insuficiente para esta placa de vídeo (mínimo recomendado: ${fonteMinimaRecomendada}W).`);
      } else if (pecaCandidata.categoria === 'cpu') {
        motivos.push(`Sua fonte atual (${fonte.potenciaWatts}W) fica abaixo do recomendado (${fonteMinimaRecomendada}W) com este processador.`);
      }
    }
  }

  return {
    compativel: motivos.length === 0,
    motivos
  };
}

/**
 * Valida se todas as 8 categorias obrigatórias foram preenchidas e se não há conflitos.
 */
function validarMontagemCompleta(selecaoAtual) {
  const { CATEGORIAS_MONTADOR } = window.Konoha;
  const categoriasFaltantes = [];
  for (const cat of CATEGORIAS_MONTADOR) {
    if (cat.obrigatorio && !selecaoAtual[cat.id]) {
      categoriasFaltantes.push(cat.tituloCurto);
    }
  }

  const conflitosAtivos = [];
  for (const peca of Object.values(selecaoAtual)) {
    if (!peca) continue;
    const avaliacao = avaliarCompatibilidadePeca(peca, selecaoAtual);
    if (!avaliacao.compativel) {
      for (const motivo of avaliacao.motivos) {
        if (!conflitosAtivos.includes(motivo)) {
          conflitosAtivos.push(motivo);
        }
      }
    }
  }

  return {
    completa: categoriasFaltantes.length === 0 && conflitosAtivos.length === 0,
    categoriasFaltantes,
    conflitosAtivos
  };
}

Object.assign(window.Konoha, {
  calcularConsumoSistema,
  avaliarCompatibilidadePeca,
  validarMontagemCompleta
});
})();

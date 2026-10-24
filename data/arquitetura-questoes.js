/**
 * Base de Dados Educacional — Aprenda Arquitetura da Computação
 * 
 * Contém os 12 temas obrigatórios com cartões selecionáveis, perguntas de múltipla escolha
 * sem ambiguidade, indicação da alternativa correta e explicação conceitual clara.
 */

(() => {
window.Konoha = window.Konoha || {};

const TEMAS_ARQUITETURA = [
  {
    id: 'componentes-basicos',
    titulo: 'Componentes básicos de um computador',
    etiqueta: 'Fundamentos',
    descricao: 'Entenda a função estrutural da CPU, memória principal, armazenamento secundário, placa-mãe e fonte de alimentação.',
    perguntas: [
      {
        enunciado: 'Qual componente físico atua como a plataforma central de interconexão, permitindo que o processador, a memória RAM, o armazenamento e a placa de vídeo troquem dados e recebam energia?',
        alternativas: [
          'Placa-mãe (Motherboard)',
          'Fonte de alimentação (PSU)',
          'Unidade de estado sólido (SSD)',
          'Memória Cache L1'
        ],
        correta: 0,
        explicacao: 'A placa-mãe concentra as trilhas elétricas (barramentos), o chipset, os soquetes e os conectores que interligam todos os componentes internos do computador.'
      },
      {
        enunciado: 'Qual é a principal diferença funcional entre a Memória Principal (RAM) e o Armazenamento Secundário (SSD/HD)?',
        alternativas: [
          'O SSD perde todos os dados ao desligar o PC, enquanto a RAM mantém os arquivos permanentemente.',
          'A RAM é volátil e armazena temporariamente programas em execução; o SSD é não volátil e guarda arquivos permanentemente.',
          'A RAM processa cálculos gráficos 3D, enquanto o SSD controla a tensão elétrica do processador.',
          'Não há diferença técnica, ambos operam na mesma velocidade e com a mesma função.'
        ],
        correta: 1,
        explicacao: 'A memória RAM é volátil (seus dados são apagados quando a energia é cortada) e serve como área de trabalho rápida para a CPU. O SSD é não volátil, mantendo o sistema operacional e os arquivos salvos mesmo com o PC desligado.'
      },
      {
        enunciado: 'Qual é o papel fundamental da fonte de alimentação (PSU) na arquitetura física de um computador?',
        alternativas: [
          'Aumentar a frequência do processador por meio de sinais digitais.',
          'Converter a corrente alternada (AC) da tomada em tensões contínuas estabilizadas (DC, como +12V, +5V e +3.3V) para as peças.',
          'Armazenar o BIOS e as configurações de inicialização da máquina.',
          'Resfriar diretamente o núcleo do processador através de tubos de cobre.'
        ],
        correta: 1,
        explicacao: 'Os circuitos digitais do computador operam em corrente contínua de baixa tensão. A fonte retifica, filtra e regula a energia da rede elétrica (110V/220V AC) para linhas contínuas seguras (+12V, +5V e +3.3V).'
      }
    ]
  },
  {
    id: 'processador-uc',
    titulo: 'Processador e unidade de controle',
    etiqueta: 'CPU & Controle',
    descricao: 'Descubra como a CPU coordena a execução de programas e como a Unidade de Controle (UC) interpreta instruções.',
    perguntas: [
      {
        enunciado: 'Dentro da Unidade Central de Processamento (CPU), qual é a responsabilidade específica da Unidade de Controle (UC)?',
        alternativas: [
          'Armazenar permanentemente os arquivos do usuário em blocos magnéticos.',
          'Buscar instruções na memória, decodificá-las e emitir sinais de controle para coordenar a ULA, os registradores e os barramentos.',
          'Realizar exclusivamente operações de soma e subtração em ponto flutuante.',
          'Renderizar texturas tridimensionais para exibição direta no monitor.'
        ],
        correta: 1,
        explicacao: 'A Unidade de Controle funciona como o "maestro" do processador: ela interpreta o código da instrução (opcode) e gera os sinais de controle que ditam o que cada parte da CPU deve fazer em cada pulso de clock.'
      },
      {
        enunciado: 'O que representa o sinal de Clock (frequência medida em GHz) em um processador moderno?',
        alternativas: [
          'A quantidade máxima de memória RAM que o processador consegue endereçar.',
          'Um pulso periódico sincronizador que determina o ritmo em que as etapas das instruções são executadas nos circuitos internos.',
          'A temperatura limite que o silício suporta antes de desligar.',
          'A velocidade da conexão de internet recebida pela placa de rede.'
        ],
        correta: 1,
        explicacao: 'O clock é gerado por um oscilador de cristal e serve como metrônomo digital para sincronizar a transição de estados nos transistores e registradores da CPU (1 GHz equivale a 1 bilhão de ciclos por segundo).'
      },
      {
        enunciado: 'Quando dizemos que um processador possui múltiplos núcleos (ex.: 6 Cores / 12 Threads), o que isso significa na arquitetura?',
        alternativas: [
          'Que ele possui 6 fontes de alimentação independentes dentro do gabinete.',
          'Que o chip integra múltiplas unidades de processamento independentes capazes de executar instruções simultaneamente (paralelismo).',
          'Que ele só funciona se houver 6 pentes de memória RAM instalados.',
          'Que a frequência básica é multiplicada por 6 automaticamente.'
        ],
        correta: 1,
        explicacao: 'Um processador multicore contém vários núcleos de execução no mesmo encapsulamento, permitindo processar diversas tarefas ou threads em paralelo real.'
      }
    ]
  },
  {
    id: 'ula',
    titulo: 'Unidade lógica e aritmética (ULA)',
    etiqueta: 'CPU & Execução',
    descricao: 'Compreenda o circuito responsável por todos os cálculos matemáticos e comparações lógicas dentro do processador.',
    perguntas: [
      {
        enunciado: 'Quais são as duas classes fundamentais de operações executadas pela ULA (Unidade Lógica e Aritmética)?',
        alternativas: [
          'Operações de leitura de disco rígido e transmissão de pacotes Wi-Fi.',
          'Operações aritméticas (como adição e subtração) e operações lógicas bit a bit (como AND, OR, NOT, XOR e comparações).',
          'Apenas operações de formatação de sistema operacional e backup.',
          'Conversão de energia elétrica alternada em energia térmica.'
        ],
        correta: 1,
        explicacao: 'A ULA (ou ALU, Arithmetic Logic Unit) é o circuito combinacional que executa cálculos matemáticos sobre números inteiros e avaliações lógicas/booleanas essenciais para tomadas de decisão (como desvios condicionais `if/else`).'
      },
      {
        enunciado: 'Após realizar uma operação, a ULA atualiza indicadores especiais chamados Flags (ou Registrador de Estado). Para que servem essas flags?',
        alternativas: [
          'Para aumentar a capacidade de armazenamento do SSD.',
          'Para sinalizar condições do resultado, como resultado igual a zero (Zero Flag), número negativo (Sign Flag) ou estouro de capacidade (Overflow/Carry).',
          'Para escolher a resolução de vídeo do monitor conectado.',
          'Para controlar a velocidade de rotação das ventoinhas do gabinete.'
        ],
        correta: 1,
        explicacao: 'As flags de status informam à Unidade de Controle propriedades imediatas do último cálculo da ULA (Zero, Carry, Overflow, Negativo), permitindo que instruções de salto condicional (`JZ`, `JNZ`, `JG`) funcionem.'
      },
      {
        enunciado: 'Qual operação lógica na ULA retorna verdadeiro (bit 1) SOMENTE quando ambas as entradas são iguais a 1?',
        alternativas: [
          'Operação OR (OU)',
          'Operação NOT (NÃO)',
          'Operação AND (E)',
          'Operação XOR (OU Exclusivo)'
        ],
        correta: 2,
        explicacao: 'A porta lógica AND produz saída 1 exclusivamente quando todas as suas entradas possuem valor 1. É amplamente usada na ULA para aplicar máscaras de bits.'
      }
    ]
  },
  {
    id: 'ram-e-cache',
    titulo: 'Memória RAM e memória cache',
    etiqueta: 'Memórias',
    descricao: 'Veja por que o processador precisa da memória Cache ultrarrápida além da memória RAM principal.',
    perguntas: [
      {
        enunciado: 'Por que os processadores modernos possuem Memória Cache (L1, L2 e L3) integrada no próprio chip, mesmo quando o computador já tem bastante Memória RAM?',
        alternativas: [
          'Porque a memória RAM não consegue armazenar números binários.',
          'Porque a velocidade da CPU é muito superior à da RAM; a Cache (SRAM) reduz o tempo de espera guardando os dados e instruções mais acessados.',
          'Porque a memória Cache substitui a necessidade de ter um SSD ou HD no computador.',
          'Porque a memória Cache é usada apenas para salvar arquivos quando o computador está desligado.'
        ],
        correta: 1,
        explicacao: 'A RAM dinâmica (DRAM) possui latência muito maior que a velocidade interna do processador. A Cache usa tecnologia SRAM (estática), muito mais rápida e próxima aos núcleos, evitando que a CPU fique ociosa esperando dados da RAM.'
      },
      {
        enunciado: 'Qual é a diferença entre os níveis de cache L1, L2 e L3 em um processador?',
        alternativas: [
          'L1 é a maior e mais lenta; L3 é a menor e mais rápida.',
          'L1 é a menor e extremamente rápida (dedicada a cada núcleo); L3 é maior, ligeiramente mais lenta e geralmente compartilhada entre os núcleos.',
          'L1 armazena apenas vídeos, L2 armazena músicas e L3 armazena textos.',
          'Todas possuem exatamente o mesmo tamanho e a mesma velocidade.'
        ],
        correta: 1,
        explicacao: 'Na arquitetura de cache multinível, a L1 fica colada às unidades de execução (poucos KB, latência de ~1ns), a L2 é intermediária, e a L3 tem dezenas de megabytes (até 96MB+ em CPUs 3D V-Cache) compartilhados entre os núcleos.'
      },
      {
        enunciado: 'O que significa ativar o modo Dual Channel ao usar dois módulos de memória RAM (ex.: 2x8GB em vez de 1x16GB)?',
        alternativas: [
          'Triplica a frequência do processador automaticamente.',
          'Dobra a largura do barramento de comunicação entre o controlador de memória e a RAM (de 64 bits para 128 bits), aumentando a taxa de transferência.',
          'Transforma a memória RAM em memória não volátil como um SSD.',
          'Reduz pela metade a quantidade de memória visível pelo sistema operacional.'
        ],
        correta: 1,
        explicacao: 'Em Dual Channel, o controlador de memória acessa dois canais independentes simultaneamente, dobrando a largura de banda teórica e melhorando o desempenho, especialmente em jogos e vídeos integrados.'
      }
    ]
  },
  {
    id: 'hierarquia-memoria',
    titulo: 'Hierarquia de memória',
    etiqueta: 'Memórias',
    descricao: 'Analise a relação entre velocidade, custo por bit e capacidade desde os registradores até o armazenamento em massa.',
    perguntas: [
      {
        enunciado: 'Qual das sequências abaixo ordena corretamente a hierarquia de memória da MAIS RÁPIDA (e menor capacidade) para a MAIS LENTA (e maior capacidade)?',
        alternativas: [
          'Disco Rígido (HD) → SSD NVMe → Memória RAM → Cache L1 → Registradores',
          'Registradores → Cache (L1/L2/L3) → Memória Principal (RAM) → SSD / Disco Rígido',
          'Memória RAM → Registradores → SSD → Cache L3',
          'Cache L3 → Cache L1 → SSD → Memória RAM → Registradores'
        ],
        correta: 1,
        explicacao: 'No topo da pirâmide estão os Registradores (acesso imediato dentro da CPU), seguidos pelas Caches L1/L2/L3, depois a Memória Principal (RAM) e, na base de maior capacidade e menor custo por gigabyte, o armazenamento secundário (SSD/HD).'
      },
      {
        enunciado: 'Na pirâmide da hierarquia de memória, o que acontece com o "custo por bit" à medida que subimos em direção ao topo (memórias mais rápidas)?',
        alternativas: [
          'O custo por bit aumenta significativamente, pois tecnologias como SRAM e registradores ocupam mais transistores no silício.',
          'O custo por bit diminui até chegar a zero nos registradores.',
          'O custo por bit permanece idêntico em todos os níveis da hierarquia.',
          'Apenas o disco rígido possui custo de fabricação por bit.'
        ],
        correta: 0,
        explicacao: 'Memórias ultrarrápidas (como SRAM de 6 transistores por bit usada na Cache) são muito mais caras e densas para fabricar do que a DRAM (1 transistor + 1 capacitor por bit) ou a memória Flash NAND dos SSDs.'
      },
      {
        enunciado: 'O princípio que explica por que programas tendem a reutilizar dados recém-acessados ou endereços vizinhos na memória chama-se:',
        alternativas: [
          'Princípio da Incerteza de Hardware',
          'Princípio da Localidade (Temporal e Espacial)',
          'Lei da Volatilidade Binária',
          'Efeito Gargalo de Barramento'
        ],
        correta: 1,
        explicacao: 'A Localidade Temporal (um dado acessado agora provavelmente será acessado de novo em breve, como em um loop) e a Localidade Espacial (endereços próximos serão lidos em sequência, como em um vetor) tornam a memória Cache extremamente eficiente.'
      }
    ]
  },
  {
    id: 'sistemas-binarios',
    titulo: 'Sistemas binários',
    etiqueta: 'Lógica & Dados',
    descricao: 'Entenda por que computadores utilizam zeros e uns (bits e bytes) para representar qualquer informação.',
    perguntas: [
      {
        enunciado: 'Por que os computadores digitais modernos utilizam o sistema binário (base 2: dígitos 0 e 1) em seus circuitos internos?',
        alternativas: [
          'Porque os transistores operam de modo muito mais confiável e imune a ruídos distinguindo apenas dois estados físicos: corte (desligado/nível baixo) e saturação (ligado/nível alto).',
          'Porque o sistema binário consome mais energia elétrica que o sistema decimal.',
          'Porque os seres humanos fazem contas de cabeça mais rápido em binário.',
          'Porque cabos de cobre só conseguem conduzir exatamente dois elétrons por vez.'
        ],
        correta: 0,
        explicacao: 'Representar dois estados elétricos distintos (presença ou ausência de tensão acima de um limiar) garante altíssima confiabilidade, velocidade de chaveamento nos transistores MOSFET e imunidade a pequenas variações de tensão.'
      },
      {
        enunciado: 'Quantos valores distintos podem ser representados por 1 Byte (conjunto padrão de 8 bits)?',
        alternativas: [
          '8 valores distintos (de 0 a 7)',
          '16 valores distintos (de 0 a 15)',
          '128 valores distintos (de 0 a 127)',
          '256 valores distintos (de 0 a 255 em inteiros sem sinal)'
        ],
        correta: 3,
        explicacao: 'Com n bits é possível representar 2^n combinações. Para 1 Byte (8 bits), temos 2^8 = 256 combinações diferentes (de 00000000 a 11111111, correspondendo aos decimais 0 a 255).'
      },
      {
        enunciado: 'Qual representação é padrão na arquitetura de computadores para armazenar números inteiros negativos em binário, facilitando a operação de subtração na ULA?',
        alternativas: [
          'Complemento de 2 (Two’s Complement)',
          'Código Morse Binário',
          'Ponto Flutuante ASCII',
          'Numeração Romana Digital'
        ],
        correta: 0,
        explicacao: 'O Complemento de 2 (inverter todos os bits e somar 1) é usado universalmente nas CPUs porque permite que a ULA realize subtrações usando o mesmo circuito somador dos números positivos, além de possuir apenas uma representação para o zero.'
      }
    ]
  },
  {
    id: 'conversao-bases',
    titulo: 'Sistemas de numeração e conversão',
    etiqueta: 'Lógica & Dados',
    descricao: 'Pratique a conversão entre as bases Binária (base 2), Decimal (base 10) e Hexadecimal (base 16).',
    perguntas: [
      {
        enunciado: 'Qual é o valor em Decimal (base 10) correspondente ao número binário 1101₂?',
        alternativas: [
          '11',
          '13',
          '14',
          '15'
        ],
        correta: 1,
        explicacao: 'Em 1101₂, somamos as potências de 2 onde há bit 1: (1 × 2³) + (1 × 2²) + (0 × 2¹) + (1 × 2⁰) = 8 + 4 + 0 + 1 = 13.'
      },
      {
        enunciado: 'Como o número decimal 25₁₀ é representado no sistema binário de 5 bits?',
        alternativas: [
          '10101₂',
          '11001₂',
          '11100₂',
          '10011₂'
        ],
        correta: 1,
        explicacao: 'Decompondo 25 em potências de 2: 16 (2⁴) + 8 (2³) + 0 (2²) + 0 (2¹) + 1 (2⁰) = 25. Portanto, a representação binária é 11001₂.'
      },
      {
        enunciado: 'Por que o sistema Hexadecimal (base 16, dígitos 0-9 e A-F) é amplamente usado para exibir endereços de memória, e qual é o valor hexadecimal do byte binário 11110000₂?',
        alternativas: [
          'Porque cada dígito hexadecimal agrupa exatamente 4 bits; o valor de 11110000₂ é F0₁₆.',
          'Porque o processador executa contas internamente em base 16; o valor é A0₁₆.',
          'Porque ocupa mais espaço na tela; o valor é 99₁₆.',
          'Porque substitui o sistema binário nos discos rígidos; o valor é 0F₁₆.'
        ],
        correta: 0,
        explicacao: 'Como 16 = 2⁴, cada grupo de 4 bits (um nibble) converte-se diretamente em um único dígito hexadecimal. Em 1111 0000₂, o primeiro grupo 1111₂ vale 15 (F em hexadecimal) e 0000₂ vale 0, resultando em 0xF0.'
      }
    ]
  },
  {
    id: 'registradores',
    titulo: 'Registradores',
    etiqueta: 'CPU & Controle',
    descricao: 'Conheça as memórias internas do processador, como o Contador de Programa (PC) e o Registrador de Instrução (IR).',
    perguntas: [
      {
        enunciado: 'O que são os Registradores na arquitetura de um processador?',
        alternativas: [
          'Pequenas posições de memória de altíssima velocidade localizadas dentro da própria CPU para manter operandos, endereços e estados imediatos.',
          'Arquivos de texto salvos na pasta do sistema operacional.',
          'Cabos que ligam a fonte de alimentação à placa de vídeo.',
          'Sensores térmicos instalados nas ventoinhas do gabinete.'
        ],
        correta: 0,
        explicacao: 'Os registradores estão no nível mais alto da hierarquia de memória, dentro do núcleo do processador. A ULA opera diretamente sobre os valores contidos nos registradores.'
      },
      {
        enunciado: 'Qual é a função do registrador especial chamado PC (Program Counter ou Contador de Programa)?',
        alternativas: [
          'Contar quantas horas o computador está ligado desde a compra.',
          'Guardar o endereço de memória da próxima instrução que deverá ser buscada e executada pela CPU.',
          'Armazenar a senha da conta Google do usuário.',
          'Medir a potência em Watts consumida pela placa de vídeo.'
        ],
        correta: 1,
        explicacao: 'O Program Counter (PC), também chamado de Instruction Pointer (IP) na arquitetura x86, aponta sempre para o endereço na memória RAM onde está a próxima instrução a ser buscada no ciclo de execução.'
      },
      {
        enunciado: 'Qual registrador armazena temporariamente a instrução que acabou de ser buscada da memória enquanto a Unidade de Controle a decodifica?',
        alternativas: [
          'Registrador de Instrução (IR — Instruction Register)',
          'Registrador de Áudio (AR)',
          'Memória Virtual de Paginação',
          'Barramento PCI Express'
        ],
        correta: 0,
        explicacao: 'Assim que a instrução é lida da memória, ela é colocada no Registrador de Instrução (IR), permitindo que a Unidade de Controle analise seus bits (opcode e operandos).'
      }
    ]
  },
  {
    id: 'barramentos',
    titulo: 'Barramentos',
    etiqueta: 'Comunicação',
    descricao: 'Entenda como os barramentos de Dados, Endereços e Controle transportam sinais entre CPU, memória e periféricos.',
    perguntas: [
      {
        enunciado: 'No modelo clássico de barramentos do sistema, quais são os três tipos de barramentos que conectam a CPU à memória e aos módulos de E/S?',
        alternativas: [
          'Barramento de Vídeo, Barramento de Áudio e Barramento de Rede.',
          'Barramento de Dados, Barramento de Endereços e Barramento de Controle.',
          'Barramento Positivo, Barramento Negativo e Barramento Terra.',
          'Barramento L1, Barramento L2 e Barramento L3.'
        ],
        correta: 1,
        explicacao: 'O Barramento de Endereços indica "onde" ler/escrever; o Barramento de Dados transporta a informação em si ("o quê"); e o Barramento de Controle transmite sinais de comando e sincronismo ("como/quando", ex.: Read/Write).'
      },
      {
        enunciado: 'Qual das afirmações abaixo descreve corretamente a direcionalidade do Barramento de Endereços e do Barramento de Dados?',
        alternativas: [
          'O Barramento de Endereços é unidirecional (a CPU envia o endereço desejado) e o Barramento de Dados é bidirecional (dados fluem na leitura e na escrita).',
          'Ambos são exclusivamente unidirecionais da memória para o teclado.',
          'O Barramento de Dados só transmite endereços de páginas da internet.',
          'Nenhum barramento permite que a CPU escreva dados na memória RAM.'
        ],
        correta: 0,
        explicacao: 'A CPU define o endereço a ser acessado (fluxo unidirecional CPU → Memória/E/S), enquanto os dados precisam tanto entrar na CPU (leitura) quanto sair da CPU para a memória (escrita), tornando o Barramento de Dados bidirecional.'
      },
      {
        enunciado: 'Nos computadores modernos, qual barramento de alta velocidade na placa-mãe é utilizado prioritariamente para conectar placas de vídeo dedicadas e SSDs NVMe?',
        alternativas: [
          'Barramento IDE Paralelo',
          'Barramento PCI Express (PCIe)',
          'Porta Serial RS-232',
          'Barramento PS/2'
        ],
        correta: 1,
        explicacao: 'O PCI Express (PCIe 3.0, 4.0, 5.0) utiliza pistas seriais de alta velocidade (lanes, como x4 para SSDs NVMe e x16 para placas de vídeo) para comunicação direta e de baixa latência com o processador e o chipset.'
      }
    ]
  },
  {
    id: 'ciclo-instrucao',
    titulo: 'Ciclo de busca, decodificação e execução',
    etiqueta: 'CPU & Execução',
    descricao: 'Acompanhe passo a passo o ciclo Fetch-Decode-Execute que o processador repete bilhões de vezes por segundo.',
    perguntas: [
      {
        enunciado: 'Qual é a ordem correta das três etapas principais do ciclo de instrução em um processador?',
        alternativas: [
          'Execução (Execute) → Busca (Fetch) → Decodificação (Decode)',
          'Busca (Fetch) → Decodificação (Decode) → Execução (Execute)',
          'Decodificação (Decode) → Formatação → Desligamento',
          'Armazenamento → Impressão → Busca (Fetch)'
        ],
        correta: 1,
        explicacao: 'Primeiro a CPU busca (Fetch) a instrução na memória usando o endereço do PC; em seguida a Unidade de Controle interpreta (Decode) o código da operação; por fim a instrução é realizada (Execute) pela ULA ou unidades de transferência.'
      },
      {
        enunciado: 'O que acontece especificamente durante a etapa de Busca (Fetch)?',
        alternativas: [
          'A CPU lê a instrução no endereço apontado pelo Contador de Programa (PC), carrega-a no Registrador de Instrução (IR) e incrementa o PC para a próxima instrução.',
          'A ULA multiplica dois números de ponto flutuante e apaga a memória RAM.',
          'O sistema operacional solicita que o usuário digite uma senha no teclado.',
          'A fonte de alimentação reduz a tensão do processador para economizar energia.'
        ],
        correta: 0,
        explicacao: 'Na fase de Fetch, o endereço contido no PC é enviado ao barramento de endereços, a instrução vem pelo barramento de dados até o IR, e o PC é atualizado automaticamente para apontar para a instrução seguinte.'
      },
      {
        enunciado: 'Como a técnica de Pipelining melhora o desempenho do ciclo de busca, decodificação e execução?',
        alternativas: [
          'Eliminando a etapa de decodificação de todas as instruções.',
          'Permitindo sobrepor etapas de instruções diferentes (como uma linha de montagem): enquanto uma instrução é executada, a seguinte já está sendo decodificada e uma terceira está sendo buscada.',
          'Diminuindo a quantidade de transistores do processador pela metade.',
          'Fazendo com que o SSD execute as instruções no lugar da CPU.'
        ],
        correta: 1,
        explicacao: 'O pipeline divide o caminho de dados em estágios independentes, de forma semelhante a uma linha de produção industrial, aumentando drasticamente a vazão (throughput) de instruções concluídas por segundo.'
      }
    ]
  },
  {
    id: 'entrada-e-saida',
    titulo: 'Entrada e saída',
    etiqueta: 'Comunicação',
    descricao: 'Compreenda como periféricos se comunicam com o sistema via interrupções, controladores de E/S e DMA.',
    perguntas: [
      {
        enunciado: 'Por que periféricos de Entrada e Saída (teclado, mouse, rede, armazenamento) não são conectados diretamente aos pinos internos da CPU sem uma interface ou controlador?',
        alternativas: [
          'Porque os periféricos operam em velocidades, formatos de dados e sinais elétricos muito diferentes dos barramentos internos do processador.',
          'Porque a CPU só aceita conexões feitas por cabos de fibra óptica.',
          'Porque periféricos de entrada e saída não utilizam energia elétrica.',
          'Porque o monitor substitui todos os controladores da placa-mãe.'
        ],
        correta: 0,
        explicacao: 'Módulos e controladores de E/S (como controladoras USB, SATA e de áudio) fazem a tradução de protocolos, bufferização de dados e casamento de velocidade entre dispositivos externos e o barramento do sistema.'
      },
      {
        enunciado: 'Qual mecanismo evita que o processador fique consultando repetidamente um periférico lento (polling), permitindo que o dispositivo avise a CPU apenas quando precisa de atenção?',
        alternativas: [
          'Overclocking de Memória',
          'E/S dirigida por Interrupção (Interrupt-Driven I/O)',
          'Desfragmentação de Registradores',
          'Formatação Binária'
        ],
        correta: 1,
        explicacao: 'Com interrupções de hardware (IRQ), o processador continua executando programas normalmente e só pausa para atender o periférico quando o controlador emite um sinal elétrico de interrupção.'
      },
      {
        enunciado: 'Qual é a grande vantagem da técnica de DMA (Direct Memory Access — Acesso Direto à Memória) em transferências de grandes volumes de dados (como leitura de um SSD)?',
        alternativas: [
          'O controlador de DMA transfere o bloco de dados diretamente entre o periférico e a memória RAM, liberando a CPU e notificando-a apenas ao concluir toda a transferência.',
          'O DMA apaga a memória Cache para que o processador trabalhe mais devagar.',
          'O DMA obriga que cada byte passe manualmente pelo registrador acumulador da CPU.',
          'O DMA dispensa o uso de memória RAM no computador.'
        ],
        correta: 0,
        explicacao: 'Sem DMA, a CPU ficaria ocupada copiando palavra por palavra do disco para a RAM. Com o DMA, a CPU apenas solicita a transferência do bloco e fica livre para processar outras tarefas até receber a interrupção de conclusão.'
      }
    ]
  },
  {
    id: 'von-neumann',
    titulo: 'Arquitetura de Von Neumann',
    etiqueta: 'Fundamentos',
    descricao: 'Estude o modelo clássico de computador de programa armazenado proposto por John von Neumann e seu famoso gargalo.',
    perguntas: [
      {
        enunciado: 'Qual é o conceito central que caracteriza a Arquitetura de Von Neumann, base dos computadores modernos de uso geral?',
        alternativas: [
          'Instruções de programa e dados são armazenados juntos na mesma memória principal (conceito de Programa Armazenado) e acessados por um barramento único.',
          'O computador não possui memória e precisa ser reconstruído fisicamente com cabos a cada novo cálculo.',
          'Cada programa exige uma placa-mãe diferente para poder iniciar.',
          'Os dados ficam exclusivamente no monitor e as instruções ficam na fonte de alimentação.'
        ],
        correta: 0,
        explicacao: 'Antes da arquitetura de Von Neumann, reprogramar máquinas exigia alterar chaves e cabos fisicamente. O conceito de programa armazenado trata instruções como códigos binários guardados na mesma memória RAM que os dados.'
      },
      {
        enunciado: 'O que é conhecido na literatura técnica como o "Gargalo de Von Neumann" (Von Neumann Bottleneck)?',
        alternativas: [
          'O aquecimento da fonte de alimentação quando o gabinete está fechado.',
          'A limitação de taxa de transferência causada pelo compartilhamento do mesmo barramento para buscar instruções e ler/escrever dados na memória principal.',
          'A impossibilidade de conectar mais de um monitor na placa de vídeo.',
          'O limite físico de 8 teclas em teclados antigos.'
        ],
        correta: 1,
        explicacao: 'Como instruções e dados dividem o mesmo caminho entre a CPU e a RAM, o processador rápido muitas vezes precisa esperar o barramento ficar livre. Memórias Cache L1 separadas para instruções (I-Cache) e dados (D-Cache) ajudam a mitigar esse gargalo.'
      },
      {
        enunciado: 'Quais são os blocos funcionais clássicos definidos no modelo de Von Neumann?',
        alternativas: [
          'Unidade Central de Processamento (composta por Unidade de Controle e ULA), Unidade de Memória e Unidades de Entrada/Saída.',
          'Placa de Vídeo 3D, Placa de Som Bluetooth e Roteador Wi-Fi.',
          'Apenas Teclado, Mouse e Impressora.',
          'Transformador Elétrico, Cooler Hidráulico e Gabinete de Vidro.'
        ],
        correta: 0,
        explicacao: 'O modelo clássico de Von Neumann estrutura o computador em Memória Principal, Unidade Aritmética e Lógica (ULA), Unidade de Controle (UC) e mecanismos de Entrada e Saída (E/S) interligados por barramentos.'
      }
    ]
  }
];

Object.assign(window.Konoha, {
  TEMAS_ARQUITETURA
});
})();

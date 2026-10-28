// ==========================================
// AVENTURA PELO CORAÇÃO 💗
// Jogo educativo — versão atualizada
// ==========================================

const $ = (id) => document.getElementById(id);

const canvas = $("game");
const ctx = canvas.getContext("2d");

// Elementos do HTML
const cadastro = $("cadastro");
const nomeJogadorInput = $("nomeJogador");
const btnComecar = $("comecar");

const informacoes = $("informacoes");
const nomeAtual = $("nomeAtual");
const vidasTexto = $("vidas");
const pontosTexto = $("pontos");
const faseTexto = $("fase");

const mensagem = $("mensagem");

const perguntaTela = $("pergunta");
const tituloPergunta = $("tituloPergunta");
const textoPergunta = $("textoPergunta");
const opcoes = $("opcoes");
const feedback = $("feedback");

const resultado = $("resultado");
const tituloResultado = $("tituloResultado");
const resumo = $("resumo");
const pontuacaoFinal = $("pontuacaoFinal");
const detalhesPartida = $("detalhesPartida");

const btnProximo = $("proximo");
const btnVerRanking = $("verRanking");

const rankingTela = $("rankingTela");
const listaRanking = $("listaRanking");
const btnNovoJogador = $("novoJogador");
const btnLimparRanking = $("limparRanking");

const btnEsquerda = $("esquerda");
const btnDireita = $("direita");
const btnPular = $("pular");

// ==========================================
// CONFIGURAÇÕES
// ==========================================

const LARGURA = canvas.width;
const ALTURA = canvas.height;

const CHAO = ALTURA - 55;
const MUNDO = 2300;

const TOTAL_PERGUNTAS = 5;
const VELOCIDADE = 4.2;
const FORCA_PULO = -12.5;
const GRAVIDADE = 0.58;

let cameraX = 0;
let jogoRodando = false;
let jogoPausado = true;
let jogoFinalizado = false;

let nomeJogador = "";
let pontos = 0;
let vidas = 3;
let fase = 1;

let indicePergunta = 0;
let perguntasDaPartida = [];
let respostasCorretas = 0;
let respostasErradas = 0;

let teclas = {};
let tempoAnimacao = 0;
let ultimaResposta = null;

let particulas = [];
let decoracoes = [];
let historicoRespostas = [];

const jogador = {
    x: 70,
    y: CHAO - 48,
    w: 34,
    h: 44,
    vx: 0,
    vy: 0,
    noChao: true,
    olhando: 1,
    invulneravel: 0
};

// ==========================================
// BANCO DE PERGUNTAS
// ==========================================

const bancoPerguntas = [
    {
        pergunta: "Qual órgão bombeia o sangue pelo corpo?",
        opcoes: ["Pulmão", "Coração", "Estômago", "Cérebro"],
        correta: 1,
        explicacao: "O coração bombeia o sangue para todo o organismo."
    },
    {
        pergunta: "Qual é a principal função do sangue?",
        opcoes: [
            "Produzir pensamentos",
            "Transportar substâncias pelo corpo",
            "Quebrar os ossos",
            "Controlar os músculos sozinho"
        ],
        correta: 1,
        explicacao: "O sangue transporta oxigênio, nutrientes e outras substâncias."
    },
    {
        pergunta: "Qual componente do sangue transporta oxigênio?",
        opcoes: ["Hemácias", "Plaquetas", "Plasma apenas", "Saliva"],
        correta: 0,
        explicacao: "As hemácias contêm hemoglobina, que transporta oxigênio."
    },
    {
        pergunta: "Qual órgão é responsável pelas trocas gasosas?",
        opcoes: ["Rins", "Pulmões", "Fígado", "Pâncreas"],
        correta: 1,
        explicacao: "Nos pulmões, o oxigênio entra no sangue e o gás carbônico é eliminado."
    },
    {
        pergunta: "O que o coração faz quando bate?",
        opcoes: [
            "Filtra a urina",
            "Bombeia o sangue",
            "Produz os ossos",
            "Digere os alimentos"
        ],
        correta: 1,
        explicacao: "As contrações do coração impulsionam o sangue."
    },
    {
        pergunta: "Qual vaso sanguíneo leva o sangue para fora do coração?",
        opcoes: ["Veia", "Artéria", "Capilar linfático", "Nervo"],
        correta: 1,
        explicacao: "As artérias levam o sangue para longe do coração."
    },
    {
        pergunta: "Qual vaso sanguíneo geralmente leva sangue ao coração?",
        opcoes: ["Veia", "Artéria", "Bronquíolo", "Tendão"],
        correta: 0,
        explicacao: "As veias transportam o sangue de volta ao coração."
    },
    {
        pergunta: "Onde acontece a maior parte das trocas entre sangue e tecidos?",
        opcoes: ["Artérias grandes", "Capilares", "Ossos", "Tendões"],
        correta: 1,
        explicacao: "Os capilares têm paredes finas que permitem trocas de substâncias."
    },
    {
        pergunta: "Qual é a função das plaquetas?",
        opcoes: [
            "Transportar oxigênio",
            "Ajudar na coagulação",
            "Produzir ar",
            "Digestionar proteínas"
        ],
        correta: 1,
        explicacao: "As plaquetas participam da formação de coágulos para conter sangramentos."
    },
    {
        pergunta: "Qual é a parte líquida do sangue?",
        opcoes: ["Plasma", "Hemácia", "Plaqueta", "Cartilagem"],
        correta: 0,
        explicacao: "O plasma é a parte líquida que transporta várias substâncias."
    },
    {
        pergunta: "Qual lado do coração bombeia sangue para os pulmões?",
        opcoes: ["Lado direito", "Lado esquerdo", "Os rins", "Nenhum lado"],
        correta: 0,
        explicacao: "O lado direito envia sangue aos pulmões para receber oxigênio."
    },
    {
        pergunta: "Qual lado do coração envia sangue oxigenado ao corpo?",
        opcoes: ["Lado direito", "Lado esquerdo", "Somente as veias", "Nenhum lado"],
        correta: 1,
        explicacao: "O lado esquerdo bombeia sangue oxigenado para a circulação do corpo."
    },
    {
        pergunta: "Qual é o nome da circulação entre coração e pulmões?",
        opcoes: [
            "Circulação pulmonar",
            "Circulação digestiva",
            "Circulação óssea",
            "Circulação muscular"
        ],
        correta: 0,
        explicacao: "A circulação pulmonar leva sangue do coração aos pulmões e de volta."
    },
    {
        pergunta: "Qual é o nome da circulação que atende ao restante do corpo?",
        opcoes: [
            "Circulação pulmonar",
            "Circulação sistêmica",
            "Circulação gástrica",
            "Circulação externa"
        ],
        correta: 1,
        explicacao: "A circulação sistêmica distribui sangue entre o coração e os tecidos."
    },
    {
        pergunta: "Qual órgão filtra o sangue para produzir urina?",
        opcoes: ["Coração", "Rim", "Pulmão", "Baço"],
        correta: 1,
        explicacao: "Os rins filtram o sangue e ajudam a regular água e sais do organismo."
    },
    {
        pergunta: "O que significa frequência cardíaca?",
        opcoes: [
            "Número de respirações por dia",
            "Número de batimentos do coração por minuto",
            "Quantidade de ossos",
            "Temperatura do sangue"
        ],
        correta: 1,
        explicacao: "A frequência cardíaca indica quantas vezes o coração bate por minuto."
    },
    {
        pergunta: "O que pode acontecer com a frequência cardíaca durante exercícios?",
        opcoes: [
            "Pode aumentar",
            "Sempre chega a zero",
            "Não pode mudar",
            "O coração para normalmente"
        ],
        correta: 0,
        explicacao: "Durante exercícios, o corpo costuma precisar de mais oxigênio, e a frequência pode aumentar."
    },
    {
        pergunta: "Qual gás usamos na respiração celular?",
        opcoes: ["Oxigênio", "Hélio", "Neônio", "Hidrogênio puro"],
        correta: 0,
        explicacao: "As células usam oxigênio para obter energia a partir dos nutrientes."
    },
    {
        pergunta: "Qual gás é eliminado em maior quantidade na expiração?",
        opcoes: ["Oxigênio", "Gás carbônico", "Hélio", "Ozônio"],
        correta: 1,
        explicacao: "O gás carbônico é produzido pelo metabolismo e eliminado pelos pulmões."
    },
    {
        pergunta: "Qual estrutura impede que alimentos entrem nas vias respiratórias durante a deglutição?",
        opcoes: ["Epiglote", "Rim", "Ventrículo", "Hemácia"],
        correta: 0,
        explicacao: "A epiglote ajuda a proteger a entrada da via respiratória durante a deglutição."
    },
    {
        pergunta: "Qual é a função dos glóbulos brancos?",
        opcoes: [
            "Defesa do organismo",
            "Produção de bile",
            "Transporte exclusivo de oxigênio",
            "Formação dos dentes"
        ],
        correta: 0,
        explicacao: "Os glóbulos brancos fazem parte do sistema de defesa do corpo."
    },
    {
        pergunta: "O que é pressão arterial?",
        opcoes: [
            "A pressão do sangue nas paredes das artérias",
            "A temperatura dos pulmões",
            "A força dos ossos",
            "A quantidade de saliva"
        ],
        correta: 0,
        explicacao: "A pressão arterial representa a força que o sangue exerce nas paredes das artérias."
    },
    {
        pergunta: "Qual cavidade do coração recebe sangue que vem do corpo?",
        opcoes: [
            "Átrio direito",
            "Ventrículo esquerdo",
            "Átrio esquerdo",
            "Ventrículo direito"
        ],
        correta: 0,
        explicacao: "O átrio direito recebe o sangue que retorna do corpo."
    },
    {
        pergunta: "Qual cavidade bombeia sangue para a circulação do corpo?",
        opcoes: [
            "Átrio direito",
            "Ventrículo esquerdo",
            "Átrio esquerdo",
            "Veia cava"
        ],
        correta: 1,
        explicacao: "O ventrículo esquerdo bombeia sangue para a artéria aorta."
    },
    {
        pergunta: "Qual é a maior artéria do corpo humano?",
        opcoes: ["Aorta", "Veia cava", "Artéria pulmonar", "Carótida"],
        correta: 0,
        explicacao: "A aorta é a principal artéria que distribui sangue para o corpo."
    },
    {
        pergunta: "Qual vaso leva sangue do coração aos pulmões?",
        opcoes: [
            "Artéria pulmonar",
            "Veia pulmonar",
            "Veia cava",
            "Artéria renal"
        ],
        correta: 0,
        explicacao: "A artéria pulmonar leva sangue do coração até os pulmões."
    },
    {
        pergunta: "Qual vaso traz sangue dos pulmões para o coração?",
        opcoes: [
            "Artéria aorta",
            "Veia pulmonar",
            "Artéria renal",
            "Veia porta"
        ],
        correta: 1,
        explicacao: "As veias pulmonares levam sangue oxigenado aos átrios esquerdos."
    },
    {
        pergunta: "Qual é a principal função das válvulas cardíacas?",
        opcoes: [
            "Impedir o refluxo do sangue",
            "Produzir células sanguíneas",
            "Aquecer o ar",
            "Filtrar a urina"
        ],
        correta: 0,
        explicacao: "As válvulas ajudam a manter o sangue fluindo na direção correta."
    },
    {
        pergunta: "Qual estrutura separa as cavidades direita e esquerda do coração?",
        opcoes: ["Septo", "Traqueia", "Diafragma", "Pelve"],
        correta: 0,
        explicacao: "O septo separa os lados direito e esquerdo do coração."
    },
    {
        pergunta: "Qual músculo é muito importante para a respiração?",
        opcoes: ["Diafragma", "Bíceps", "Masseter", "Trapézio"],
        correta: 0,
        explicacao: "O diafragma se contrai e relaxa, ajudando a movimentar o ar."
    },
    {
        pergunta: "Onde ficam os alvéolos pulmonares?",
        opcoes: [
            "Nos pulmões",
            "No estômago",
            "Nos rins",
            "No coração"
        ],
        correta: 0,
        explicacao: "Os alvéolos são pequenas estruturas pulmonares onde ocorrem trocas gasosas."
    },
    {
        pergunta: "O que é anemia, de forma geral?",
        opcoes: [
            "Uma condição que reduz a capacidade do sangue de transportar oxigênio",
            "Uma fratura óssea",
            "Uma inflamação do estômago em todos os casos",
            "Um tipo de músculo"
        ],
        correta: 0,
        explicacao: "A anemia pode envolver redução de hemoglobina ou de glóbulos vermelhos, entre outras causas."
    },
    {
        pergunta: "Qual hábito ajuda a cuidar do sistema cardiovascular?",
        opcoes: [
            "Praticar atividade física adequada",
            "Fumar",
            "Dormir sempre muito pouco",
            "Evitar toda forma de movimento"
        ],
        correta: 0,
        explicacao: "Atividade física adequada, alimentação equilibrada e acompanhamento de saúde ajudam na prevenção."
    },
    {
        pergunta: "O que é um pulso arterial?",
        opcoes: [
            "A expansão rítmica de uma artéria causada pelos batimentos cardíacos",
            "O movimento dos pulmões apenas",
            "O som da digestão",
            "A contração dos ossos"
        ],
        correta: 0,
        explicacao: "O pulso pode ser percebido em artérias próximas à superfície do corpo."
    },
    {
        pergunta: "Qual é a função da hemoglobina?",
        opcoes: [
            "Ajudar a transportar oxigênio",
            "Produzir urina",
            "Quebrar os alimentos no estômago",
            "Formar cartilagem"
        ],
        correta: 0,
        explicacao: "A hemoglobina presente nas hemácias se liga ao oxigênio."
    },
    {
        pergunta: "O que acontece com o sangue nos capilares dos tecidos?",
        opcoes: [
            "Pode trocar gases e nutrientes com as células",
            "Transforma-se em osso",
            "Deixa de circular para sempre",
            "Vira ar"
        ],
        correta: 0,
        explicacao: "Os capilares permitem trocas de substâncias entre o sangue e os tecidos."
    },
    {
        pergunta: "Qual órgão produz a bile, que ajuda na digestão de gorduras?",
        opcoes: ["Fígado", "Coração", "Pulmão", "Rim"],
        correta: 0,
        explicacao: "O fígado produz a bile, que é armazenada na vesícula biliar."
    },
    {
        pergunta: "Qual é a função principal do sistema circulatório?",
        opcoes: [
            "Transportar sangue e substâncias pelo organismo",
            "Produzir todos os hormônios",
            "Controlar somente a visão",
            "Formar os alimentos"
        ],
        correta: 0,
        explicacao: "O sistema circulatório transporta oxigênio, nutrientes, hormônios e resíduos."
    },
    {
        pergunta: "O sangue rico em oxigênio é chamado de:",
        opcoes: [
            "Sangue oxigenado",
            "Sangue sem células",
            "Plasma puro",
            "Linfa óssea"
        ],
        correta: 0,
        explicacao: "Sangue oxigenado é aquele com maior concentração de oxigênio."
    },
    {
        pergunta: "Qual componente do sangue é formado principalmente por água e substâncias dissolvidas?",
        opcoes: ["Plasma", "Hemácia", "Plaqueta", "Neurônio"],
        correta: 0,
        explicacao: "O plasma contém água, proteínas, sais e outras substâncias dissolvidas."
    },
    {
        pergunta: "Qual estrutura conduz o ar da laringe até os brônquios?",
        opcoes: ["Traqueia", "Esôfago", "Aorta", "Ureter"],
        correta: 0,
        explicacao: "A traqueia conduz o ar até os brônquios."
    },
    {
        pergunta: "Qual é a função dos brônquios?",
        opcoes: [
            "Conduzir o ar para dentro dos pulmões",
            "Bombear sangue",
            "Filtrar a urina",
            "Produzir glóbulos vermelhos"
        ],
        correta: 0,
        explicacao: "Os brônquios levam o ar da traqueia para os pulmões."
    },
    {
        pergunta: "O que é a circulação sanguínea?",
        opcoes: [
            "O movimento do sangue pelo corpo",
            "A digestão dos alimentos",
            "O crescimento dos cabelos",
            "A produção de suor apenas"
        ],
        correta: 0,
        explicacao: "A circulação é o percurso do sangue pelo coração e pelos vasos sanguíneos."
    },
    {
        pergunta: "Por que o coração tem paredes musculares?",
        opcoes: [
            "Para se contrair e bombear sangue",
            "Para produzir ar",
            "Para armazenar alimentos",
            "Para fabricar ossos"
        ],
        correta: 0,
        explicacao: "O músculo cardíaco se contrai para impulsionar o sangue."
    },
    {
        pergunta: "Qual é o nome do músculo do coração?",
        opcoes: ["Miocárdio", "Diafragma", "Bíceps", "Tendão"],
        correta: 0,
        explicacao: "O miocárdio é o tecido muscular responsável pelas contrações cardíacas."
    },
    {
        pergunta: "Qual estrutura registra a atividade elétrica do coração?",
        opcoes: [
            "Eletrocardiograma",
            "Radiografia do pé",
            "Teste de visão",
            "Ultrassom dos rins apenas"
        ],
        correta: 0,
        explicacao: "O eletrocardiograma registra a atividade elétrica cardíaca."
    },
    {
        pergunta: "O que o sistema linfático também ajuda a fazer?",
        opcoes: [
            "Participar da defesa do organismo e devolver líquido aos vasos sanguíneos",
            "Bombear sangue como o coração",
            "Produzir ar nos pulmões",
            "Substituir todos os rins"
        ],
        correta: 0,
        explicacao: "O sistema linfático participa da defesa e do equilíbrio dos líquidos corporais."
    },
    {
        pergunta: "Qual atitude é importante se alguém apresentar dor forte no peito e dificuldade para respirar?",
        opcoes: [
            "Procurar ajuda médica de emergência",
            "Ignorar os sintomas",
            "Continuar fazendo esforço",
            "Esperar vários dias sem contar a ninguém"
        ],
        correta: 0,
        explicacao: "Esses sintomas podem indicar uma emergência e precisam de avaliação imediata."
    },
    {
        pergunta: "Qual é a função das válvulas nas veias de algumas regiões do corpo?",
        opcoes: [
            "Ajudar a impedir o retorno do sangue",
            "Produzir oxigênio",
            "Criar células nervosas",
            "Realizar a digestão"
        ],
        correta: 0,
        explicacao: "As válvulas venosas ajudam o sangue a seguir em direção ao coração."
    },
    {
        pergunta: "O que pode ajudar a manter a saúde do coração?",
        opcoes: [
            "Alimentação equilibrada, movimento e acompanhamento de saúde",
            "Fumar diariamente",
            "Evitar dormir adequadamente",
            "Não beber água nunca"
        ],
        correta: 0,
        explicacao: "Hábitos saudáveis e acompanhamento profissional contribuem para a saúde cardiovascular."
    },
    {
        pergunta: "Qual é a função do sangue na regulação da temperatura corporal?",
        opcoes: [
            "Distribuir calor pelo corpo",
            "Transformar calor em ossos",
            "Parar a circulação",
            "Impedir toda transpiração"
        ],
        correta: 0,
        explicacao: "O sangue ajuda a distribuir calor e participa da regulação da temperatura."
    }
];

// ==========================================
// OBSTÁCULOS DO MUNDO
// ==========================================

const obstaculos = [
    { x: 190, w: 42, h: 30, tipo: "coagulo" },
    { x: 500, w: 48, h: 38, tipo: "rocha" },
    { x: 655, w: 38, h: 28, tipo: "coagulo" },
    { x: 940, w: 48, h: 35, tipo: "rocha" },
    { x: 1100, w: 42, h: 28, tipo: "coagulo" },
    { x: 1370, w: 52, h: 40, tipo: "rocha" },
    { x: 1530, w: 40, h: 28, tipo: "coagulo" },
    { x: 1770, w: 48, h: 35, tipo: "rocha" },
    { x: 1910, w: 42, h: 28, tipo: "coagulo" },
    { x: 2140, w: 52, h: 36, tipo: "rocha" }
];

// ==========================================
// INICIALIZAÇÃO
// ==========================================

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function iniciarJogo() {
    const nomeDigitado = nomeJogadorInput?.value.trim();

    if (!nomeDigitado) {
        alert("Digite seu nome para começar! 💗");
        nomeJogadorInput?.focus();
        return;
    }

    nomeJogador = nomeDigitado;

    pontos = 0;
    vidas = 3;
    fase = 1;

    indicePergunta = 0;
    respostasCorretas = 0;
    respostasErradas = 0;

    historicoRespostas = [];
    perguntasDaPartida = embaralhar(bancoPerguntas).slice(0, TOTAL_PERGUNTAS);

    jogador.x = 70;
    jogador.y = CHAO - jogador.h;
    jogador.vx = 0;
    jogador.vy = 0;
    jogador.noChao = true;
    jogador.olhando = 1;
    jogador.invulneravel = 0;

    cameraX = 0;
    tempoAnimacao = 0;
    particulas = [];

    jogoFinalizado = false;
    jogoRodando = true;
    jogoPausado = false;

    esconder(cadastro);
    esconder(resultado);
    esconder(rankingTela);
    esconder(perguntaTela);
    esconder(mensagem);

    mostrar(informacoes);
    atualizarPainel();

    criarDecoracoes();
    criarParticulas(jogador.x + 20, jogador.y + 20, "#ff7eae", 15);

    requestAnimationFrame(loopJogo);
}

function atualizarPainel() {
    if (nomeAtual) nomeAtual.textContent = nomeJogador;
    if (vidasTexto) vidasTexto.textContent = "❤️".repeat(Math.max(0, vidas));
    if (pontosTexto) pontosTexto.textContent = pontos;
    if (faseTexto) faseTexto.textContent = `${Math.min(indicePergunta + 1, TOTAL_PERGUNTAS)}/${TOTAL_PERGUNTAS}`;
}

// ==========================================
// ELEMENTOS VISUAIS
// ==========================================

function criarDecoracoes() {
    decoracoes = [];

    for (let i = 0; i < 85; i++) {
        decoracoes.push({
            x: Math.random() * MUNDO,
            y: 20 + Math.random() * (CHAO - 70),
            tamanho: 2 + Math.random() * 5,
            tipo: Math.random() > 0.5 ? "bolinha" : "brilho",
            cor: ["#ffc2d7", "#ff8fb8", "#d9c2ff", "#fff0a8"][Math.floor(Math.random() * 4)]
        });
    }
}

function criarParticulas(x, y, cor, quantidade = 12) {
    for (let i = 0; i < quantidade; i++) {
        particulas.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.8) * 5,
            tamanho: 2 + Math.random() * 5,
            vida: 25 + Math.random() * 20,
            cor
        });
    }
}

function desenharParticulas() {
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vida--;

        ctx.globalAlpha = Math.max(0, p.vida / 40);
        ctx.fillStyle = p.cor;
        ctx.beginPath();
        ctx.arc(p.x - cameraX, p.y, p.tamanho, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.vida <= 0) {
            particulas.splice(i, 1);
        }
    }
}

function desenharFundo() {
    const gradiente = ctx.createLinearGradient(0, 0, 0, ALTURA);

    gradiente.addColorStop(0, "#fce8f2");
    gradiente.addColorStop(0.55, "#f7d8ec");
    gradiente.addColorStop(1, "#e7d9ff");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // Vasos sanguíneos decorativos ao fundo
    ctx.lineCap = "round";
    ctx.lineWidth = 9;
    ctx.strokeStyle = "rgba(226, 91, 143, 0.15)";

    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.bezierCurveTo(220, 30, 330, 180, 520, 105);
    ctx.bezierCurveTo(700, 40, 820, 150, 1000, 80);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";

    ctx.beginPath();
    ctx.moveTo(0, 105);
    ctx.bezierCurveTo(220, 35, 330, 185, 520, 110);
    ctx.bezierCurveTo(700, 45, 820, 155, 1000, 85);
    ctx.stroke();

    // Brilhos do cenário
    for (const d of decoracoes) {
        const telaX = d.x - cameraX * 0.35;

        if (telaX < -10 || telaX > LARGURA + 10) continue;

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = d.cor;

        if (d.tipo === "bolinha") {
            ctx.beginPath();
            ctx.arc(telaX, d.y, d.tamanho, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.font = `${d.tamanho * 3}px Arial`;
            ctx.fillText("✦", telaX, d.y);
        }
    }

    ctx.globalAlpha = 1;

    // Nuvens fofinhas
    desenharNuvem(120 - cameraX * 0.15, 70, 1);
    desenharNuvem(460 - cameraX * 0.15, 110, 0.8);
    desenharNuvem(790 - cameraX * 0.15, 60, 1.1);
}

function desenharNuvem(x, y, escala) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(escala, escala);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath();
    ctx.arc(0, 10, 17, 0, Math.PI * 2);
    ctx.arc(22, 0, 22, 0, Math.PI * 2);
    ctx.arc(44, 11, 17, 0, Math.PI * 2);
    ctx.arc(23, 16, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function desenharChao() {
    ctx.fillStyle = "#d6b2e7";
    ctx.fillRect(0, CHAO, LARGURA, ALTURA - CHAO);

    ctx.fillStyle = "#bde7cf";
    ctx.fillRect(0, CHAO, LARGURA, 8);

    ctx.fillStyle = "#9ed9b8";
    ctx.fillRect(0, CHAO + 8, LARGURA, 5);

    // Pequenas marcas no chão
    for (let x = -20; x < LARGURA + 30; x += 45) {
        const px = x - (cameraX % 45);

        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.ellipse(px, CHAO + 27, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function desenharObstaculos() {
    for (const o of obstaculos) {
        const x = o.x - cameraX;
        const y = CHAO - o.h;

        if (x < -100 || x > LARGURA + 100) continue;

        // Sombra
        ctx.fillStyle = "rgba(90, 49, 98, 0.16)";
        ctx.beginPath();
        ctx.ellipse(x + o.w / 2, CHAO + 2, o.w * 0.55, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (o.tipo === "coagulo") {
            // Obstáculo parecido com um coágulo
            ctx.fillStyle = "#c73e6d";

            ctx.beginPath();
            ctx.arc(x + o.w * 0.28, y + o.h * 0.56, o.h * 0.35, 0, Math.PI * 2);
            ctx.arc(x + o.w * 0.52, y + o.h * 0.36, o.h * 0.39, 0, Math.PI * 2);
            ctx.arc(x + o.w * 0.76, y + o.h * 0.58, o.h * 0.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ff93b6";
            ctx.beginPath();
            ctx.arc(x + o.w * 0.42, y + o.h * 0.32, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#8f2851";
            ctx.beginPath();
            ctx.arc(x + o.w * 0.68, y + o.h * 0.65, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Obstáculo parecido com uma pedra
            ctx.fillStyle = "#8d78ae";
            ctx.beginPath();
            ctx.moveTo(x + 2, CHAO);
            ctx.lineTo(x + 5, y + 14);
            ctx.lineTo(x + o.w * 0.36, y);
            ctx.lineTo(x + o.w * 0.76, y + 5);
            ctx.lineTo(x + o.w - 2, y + 20);
            ctx.lineTo(x + o.w - 4, CHAO);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#b9a4d5";
            ctx.beginPath();
            ctx.moveTo(x + 9, y + 15);
            ctx.lineTo(x + o.w * 0.38, y + 5);
            ctx.lineTo(x + o.w * 0.5, y + 16);
            ctx.closePath();
            ctx.fill();
        }
    }
}

function desenharPerguntas() {
    for (let i = 0; i < TOTAL_PERGUNTAS; i++) {
        const x = posicoesPerguntas[i] - cameraX;
        const y = CHAO - 115;

        if (x < -60 || x > LARGURA + 60) continue;

        const respondida = i < indicePergunta;

        ctx.save();

        ctx.fillStyle = respondida ? "#a9e6c4" : "#fff5b5";
        ctx.strokeStyle = respondida ? "#55b985" : "#e7a63d";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#7c4c87";
        ctx.font = "bold 23px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(respondida ? "✓" : "?", x, y + 1);

        ctx.restore();
    }
}

const posicoesPerguntas = [350, 790, 1250, 1690, 2020];

function desenharJogador() {
    const x = jogador.x - cameraX;
    const y = jogador.y;

    const andando = Math.abs(jogador.vx) > 0.2 && jogador.noChao;
    const balanco = andando ? Math.sin(tempoAnimacao * 0.22) * 3 : 0;

    ctx.save();

    if (jogador.invulneravel > 0 && Math.floor(jogador.invulneravel / 5) % 2 === 0) {
        ctx.globalAlpha = 0.45;
    }

    // Sombra do personagem
    ctx.fillStyle = "rgba(95, 51, 110, 0.2)";
    ctx.beginPath();
    ctx.ellipse(x + jogador.w / 2, CHAO + 2, 19, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Perninhas
    ctx.strokeStyle = "#754a86";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x + 12, y + 32);
    ctx.lineTo(x + 10 + balanco, y + 41);

    ctx.moveTo(x + 23, y + 32);
    ctx.lineTo(x + 24 - balanco, y + 41);
    ctx.stroke();

    // Braços
    ctx.strokeStyle = "#ffb6c9";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(x + 5, y + 18);
    ctx.lineTo(x + 1, y + 26 + balanco);

    ctx.moveTo(x + 29, y + 18);
    ctx.lineTo(x + 33, y + 25 - balanco);
    ctx.stroke();

    // Corpo
    const corpo = ctx.createLinearGradient(x, y + 12, x + jogador.w, y + 35);
    corpo.addColorStop(0, "#ff8fb8");
    corpo.addColorStop(1, "#e65c9c");

    ctx.fillStyle = corpo;
    ctx.beginPath();
    ctx.roundRect(x + 5, y + 12, 24, 23, 9);
    ctx.fill();

    // Cabeça
    ctx.fillStyle = "#ffd7bd";
    ctx.beginPath();
    ctx.arc(x + 17, y + 10, 14, 0, Math.PI * 2);
    ctx.fill();

    // Cabelo
    ctx.fillStyle = "#74486f";
    ctx.beginPath();
    ctx.arc(x + 16, y + 6, 14, Math.PI, Math.PI * 2);
    ctx.lineTo(x + 30, y + 13);
    ctx.quadraticCurveTo(x + 25, y + 4, x + 23, y + 5);
    ctx.fill();

    // Olhos
    ctx.fillStyle = "#4e3659";
    ctx.beginPath();
    ctx.arc(x + 12, y + 11, 1.8, 0, Math.PI * 2);
    ctx.arc(x + 22, y + 11, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Bochechas
    ctx.fillStyle = "#f69bb1";
    ctx.beginPath();
    ctx.arc(x + 8, y + 16, 3, 0, Math.PI * 2);
    ctx.arc(x + 26, y + 16, 3, 0, Math.PI * 2);
    ctx.fill();

    // Sorriso
    ctx.strokeStyle = "#9e536f";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + 17, y + 15, 4, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // Coração na roupa
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("♥", x + 17, y + 27);

    ctx.restore();
}

function desenharProgresso() {
    const larguraBarra = 210;
    const alturaBarra = 10;
    const progresso = Math.min(indicePergunta / TOTAL_PERGUNTAS, 1);

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.roundRect(LARGURA - larguraBarra - 20, 18, larguraBarra, 25, 12);
    ctx.fill();

    ctx.fillStyle = "#e9c4f7";
    ctx.beginPath();
    ctx.roundRect(LARGURA - larguraBarra - 12, 25, larguraBarra - 16, alturaBarra, 6);
    ctx.fill();

    if (progresso > 0) {
        ctx.fillStyle = "#e85e9e";
        ctx.beginPath();
        ctx.roundRect(
            LARGURA - larguraBarra - 12,
            25,
            (larguraBarra - 16) * progresso,
            alturaBarra,
            6
        );
        ctx.fill();
    }

    ctx.fillStyle = "#704a80";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("AVENTURA PELO CORAÇÃO", 18, 25);
}

function desenhar() {
    desenharFundo();
    desenharChao();
    desenharObstaculos();
    desenharPerguntas();
    desenharParticulas();
    desenharJogador();
    desenharProgresso();
}

// ==========================================
// FÍSICA E COLISÕES
// ==========================================

function atualizar() {
    if (jogoPausado || jogoFinalizado) return;

    tempoAnimacao++;

    if (jogador.invulneravel > 0) {
        jogador.invulneravel--;
    }

    const anteriorX = jogador.x;
    const anteriorY = jogador.y;
    const anteriorBase = anteriorY + jogador.h;

    let movimento = 0;

    if (teclas.ArrowLeft || teclas.a || teclas.A || teclas.esquerda) {
        movimento -= 1;
    }

    if (teclas.ArrowRight || teclas.d || teclas.D || teclas.direita) {
        movimento += 1;
    }

    jogador.vx = movimento * VELOCIDADE;

    if (movimento !== 0) {
        jogador.olhando = movimento;
    }

    jogador.x += jogador.vx;
    jogador.x = Math.max(0, Math.min(MUNDO - jogador.w, jogador.x));

    // Gravidade
    jogador.vy += GRAVIDADE;
    jogador.y += jogador.vy;

    jogador.noChao = false;

    // Colisão com o chão
    if (jogador.y + jogador.h >= CHAO) {
        jogador.y = CHAO - jogador.h;
        jogador.vy = 0;
        jogador.noChao = true;
    }

    // Colisões com obstáculos
    for (const o of obstaculos) {
        const esquerdaO = o.x;
        const direitaO = o.x + o.w;
        const topoO = CHAO - o.h;

        const sobrepoeHorizontal =
            jogador.x + jogador.w > esquerdaO &&
            jogador.x < direitaO;

        const sobrepoeVertical =
            jogador.y + jogador.h > topoO &&
            jogador.y < CHAO;

        if (!sobrepoeHorizontal || !sobrepoeVertical) continue;

        // Caiu em cima do obstáculo
        if (
            anteriorBase <= topoO + 10 &&
            jogador.vy >= 0
        ) {
            jogador.y = topoO - jogador.h;
            jogador.vy = 0;
            jogador.noChao = true;
        } else {
            // Bateu na lateral: volta para antes da colisão
            if (anteriorX + jogador.w <= esquerdaO) {
                jogador.x = esquerdaO - jogador.w;
            } else if (anteriorX >= direitaO) {
                jogador.x = direitaO;
            } else {
                jogador.x = anteriorX;
            }

            // Perde vida ao encostar no obstáculo
            if (jogador.invulneravel <= 0) {
                perderVida();
            }
        }
    }

    // Evita sair dos limites do mundo
    jogador.x = Math.max(0, Math.min(MUNDO - jogador.w, jogador.x));

    // Câmera acompanha o personagem
    cameraX = jogador.x - LARGURA * 0.32;
    cameraX = Math.max(0, Math.min(MUNDO - LARGURA, cameraX));

    // Detecta chegada à pergunta
    if (
        indicePergunta < TOTAL_PERGUNTAS &&
        jogador.x + jogador.w >= posicoesPerguntas[indicePergunta]
    ) {
        abrirPergunta();
    }

    atualizarPainel();
}

function pular() {
    if (!jogoRodando || jogoPausado || jogoFinalizado) return;

    if (jogador.noChao) {
        jogador.vy = FORCA_PULO;
        jogador.noChao = false;
        criarParticulas(jogador.x + jogador.w / 2, jogador.y + jogador.h, "#ffffff", 7);
    }
}

function perderVida() {
    if (jogador.invulneravel > 0 || jogoPausado) return;

    vidas--;
    jogador.invulneravel = 75;
    jogador.vy = -5;

    criarParticulas(jogador.x + jogador.w / 2, jogador.y + jogador.h / 2, "#ff5f87", 12);

    atualizarPainel();

    if (vidas <= 0) {
        finalizarJogo(false);
    }
}

// ==========================================
// PERGUNTAS E RESPOSTAS
// ==========================================

function abrirPergunta() {
    if (jogoPausado || jogoFinalizado) return;

    jogoPausado = true;

    const questao = perguntasDaPartida[indicePergunta];

    if (!questao) {
        finalizarJogo(true);
        return;
    }

    if (tituloPergunta) {
        tituloPergunta.textContent = `Pergunta ${indicePergunta + 1} de ${TOTAL_PERGUNTAS}`;
    }

    if (textoPergunta) {
        textoPergunta.textContent = questao.pergunta;
    }

    if (opcoes) {
        opcoes.innerHTML = "";

        questao.opcoes.forEach((opcao, i) => {
            const botao = document.createElement("button");

            botao.type = "button";
            botao.className = "opcao-resposta";
            botao.textContent = `${String.fromCharCode(65 + i)}. ${opcao}`;

            botao.addEventListener("click", () => responderPergunta(i));

            opcoes.appendChild(botao);
        });
    }

    if (feedback) {
        feedback.textContent = "";
        feedback.className = "";
    }

    mostrar(perguntaTela);
}

function responderPergunta(indiceEscolhido) {
    if (!jogoPausado || jogoFinalizado) return;

    const questao = perguntasDaPartida[indicePergunta];

    if (!questao) return;

    const acertou = indiceEscolhido === questao.correta;

    ultimaResposta = acertou;

    if (opcoes) {
        const botoes = opcoes.querySelectorAll("button");

        botoes.forEach((botao, i) => {
            botao.disabled = true;

            if (i === questao.correta) {
                botao.classList.add("correta");
            } else if (i === indiceEscolhido && !acertou) {
                botao.classList.add("incorreta");
            }
        });
    }

    if (acertou) {
        pontos += 100;
        respostasCorretas++;

        if (feedback) {
            feedback.textContent = `Muito bem! 💗 ${questao.explicacao}`;
            feedback.className = "feedback-correto";
        }

        criarParticulas(jogador.x + 15, jogador.y, "#ff70ad", 18);
    } else {
        respostasErradas++;

        if (feedback) {
            feedback.textContent =
                `Quase! A resposta certa é: ${questao.opcoes[questao.correta]}. ${questao.explicacao}`;
            feedback.className = "feedback-errado";
        }
    }

    historicoRespostas.push({
        pergunta: questao.pergunta,
        acertou
    });

    atualizarPainel();

    // O mesmo botão pode funcionar como "continuar"
    const botoes = opcoes?.querySelectorAll("button");

    if (botoes) {
        const continuar = document.createElement("button");

        continuar.type = "button";
        continuar.className = "botao-continuar";
        continuar.textContent =
            indicePergunta + 1 >= TOTAL_PERGUNTAS
                ? "Ver resultado ✨"
                : "Continuar ➜";

        continuar.addEventListener("click", continuarAventura);
        opcoes.appendChild(continuar);
    }
}

function continuarAventura() {
    esconder(perguntaTela);

    indicePergunta++;

    atualizarPainel();

    if (indicePergunta >= TOTAL_PERGUNTAS) {
        finalizarJogo(true);
        return;
    }

    // Mantém o personagem depois do ponto da pergunta já respondida
    jogador.x = Math.max(jogador.x, posicoesPerguntas[indicePergunta - 1] + 35);
    jogador.vy = 0;

    if (jogador.y + jogador.h > CHAO) {
        jogador.y = CHAO - jogador.h;
    }

    jogoPausado = false;
}

// ==========================================
// RESULTADO E RANKING
// ==========================================

function finalizarJogo(venceu) {
    jogoFinalizado = true;
    jogoPausado = true;
    jogoRodando = false;

    esconder(perguntaTela);
    esconder(mensagem);

    if (tituloResultado) {
        tituloResultado.textContent = venceu
            ? "Aventura concluída! 💖"
            : "Fim da aventura 💗";
    }

    if (resumo) {
        resumo.textContent = venceu
            ? `Parabéns, ${nomeJogador}! Você chegou ao final da sua aventura.`
            : `${nomeJogador}, você ficou sem vidas. Tente novamente para melhorar sua pontuação!`;
    }

    if (pontuacaoFinal) {
        pontuacaoFinal.textContent = `Pontuação: ${pontos}`;
    }

    if (detalhesPartida) {
        detalhesPartida.innerHTML = `
            <p>✅ Respostas corretas: <strong>${respostasCorretas}</strong></p>
            <p>❌ Respostas incorretas: <strong>${respostasErradas}</strong></p>
            <p>❤️ Vidas restantes: <strong>${vidas}</strong></p>
            <p>📚 Perguntas respondidas: <strong>${historicoRespostas.length}/${TOTAL_PERGUNTAS}</strong></p>
        `;
    }

    salvarRanking();

    mostrar(resultado);
}

function obterRanking() {
    try {
        const dados = localStorage.getItem("rankingCoracao");
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Não foi possível ler o ranking:", erro);
        return [];
    }
}

function salvarRanking() {
    const ranking = obterRanking();

    ranking.push({
        nome: nomeJogador,
        pontos,
        acertos: respostasCorretas,
        data: new Date().toLocaleDateString("pt-BR")
    });

    ranking.sort((a, b) => b.pontos - a.pontos);

    try {
        localStorage.setItem("rankingCoracao", JSON.stringify(ranking.slice(0, 10)));
    } catch (erro) {
        console.error("Não foi possível salvar o ranking:", erro);
    }
}

function abrirRanking() {
    esconder(resultado);
    esconder(cadastro);
    esconder(informacoes);
    esconder(perguntaTela);
    mostrar(rankingTela);

    renderizarRanking();
}

function renderizarRanking() {
    if (!listaRanking) return;

    const ranking = obterRanking();

    listaRanking.innerHTML = "";

    if (ranking.length === 0) {
        listaRanking.innerHTML = "<p>Ainda não há partidas registradas. Seja a primeira pessoa a jogar! 💗</p>";
        return;
    }

    ranking.forEach((jogadorRanking, indice) => {
        const item = document.createElement("div");
        item.className = "item-ranking";

        const medalha = ["🥇", "🥈", "🥉"][indice] || "🏅";

        const nome = document.createElement("strong");
        nome.textContent = `${medalha} ${indice + 1}º — ${jogadorRanking.nome}`;

        const pontuacao = document.createElement("span");
        pontuacao.textContent = `${jogadorRanking.pontos} pontos`;

        const data = document.createElement("small");
        data.textContent = jogadorRanking.data || "";

        item.append(nome, pontuacao, data);
        listaRanking.appendChild(item);
    });
}

function novoJogador() {
    jogoRodando = false;
    jogoPausado = true;
    jogoFinalizado = false;

    esconder(rankingTela);
    esconder(resultado);
    esconder(informacoes);
    esconder(perguntaTela);
    mostrar(cadastro);

    if (nomeJogadorInput) {
        nomeJogadorInput.value = "";
        nomeJogadorInput.focus();
    }
}

function limparRanking() {
    const confirmar = confirm("Tem certeza de que deseja apagar todo o ranking deste navegador?");

    if (!confirmar) return;

    localStorage.removeItem("rankingCoracao");
    renderizarRanking();
}

// ==========================================
// LOOP DO JOGO
// ==========================================

function loopJogo() {
    if (!jogoRodando) return;

    atualizar();
    desenhar();

    if (jogoRodando) {
        requestAnimationFrame(loopJogo);
    }
}

// ==========================================
// CONTROLES DO TECLADO
// ==========================================

document.addEventListener("keydown", (evento) => {
    teclas[evento.key] = true;

    if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(evento.key)
    ) {
        evento.preventDefault();
    }

    if (
        evento.key === "ArrowUp" ||
        evento.key === " " ||
        evento.key === "w" ||
        evento.key === "W"
    ) {
        pular();
    }
});

document.addEventListener("keyup", (evento) => {
    teclas[evento.key] = false;
});

// ==========================================
// CONTROLES PARA CELULAR
// ==========================================

function configurarBotaoSegurar(botao, tecla) {
    if (!botao) return;

    const pressionar = (evento) => {
        evento.preventDefault();
        teclas[tecla] = true;
    };

    const soltar = (evento) => {
        evento.preventDefault();
        teclas[tecla] = false;
    };

    botao.addEventListener("pointerdown", pressionar);
    botao.addEventListener("pointerup", soltar);
    botao.addEventListener("pointerleave", soltar);
    botao.addEventListener("pointercancel", soltar);
}

configurarBotaoSegurar(btnEsquerda, "esquerda");
configurarBotaoSegurar(btnDireita, "direita");

if (btnPular) {
    btnPular.addEventListener("pointerdown", (evento) => {
        evento.preventDefault();
        pular();
    });
}

// ==========================================
// BOTÕES DO HTML
// ==========================================

btnComecar?.addEventListener("click", iniciarJogo);

nomeJogadorInput?.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        iniciarJogo();
    }
});

btnProximo?.addEventListener("click", novoJogador);
btnVerRanking?.addEventListener("click", abrirRanking);
btnNovoJogador?.addEventListener("click", novoJogador);
btnLimparRanking?.addEventListener("click", limparRanking);

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function mostrar(elemento) {
    if (elemento) {
        elemento.classList.remove("escondido");
        elemento.style.display = "";
    }
}

function esconder(elemento) {
    if (elemento) {
        elemento.classList.add("escondido");
        elemento.style.display = "none";
    }
}

// ==========================================
// PREPARAÇÃO DA TELA
// ==========================================

criarDecoracoes();

esconder(informacoes);
esconder(perguntaTela);
esconder(resultado);
esconder(rankingTela);

// Desenha o cenário antes de começar
desenhar();
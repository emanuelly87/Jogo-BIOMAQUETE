
"use strict";

/* =====================================
   AVENTURA PELO CORAÇÃO
   Salvamento local sem banco de dados
===================================== */

const $ = id => document.getElementById(id);

const canvas = $("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const CHAO = H - 55;
const MUNDO = 2300;
const TOTAL = 5;

const CHAVE_RANKING = "aventuraCoracaoRanking";
const CHAVE_PARTIDAS = "aventuraCoracaoPartidas";

const cadastro = $("cadastro");
const formCadastro = $("formCadastro");
const nomeInput = $("nomeJogador");
const informacoes = $("informacoes");
const perguntaTela = $("pergunta");
const resultado = $("resultado");
const rankingTela = $("rankingTela");

const teclas = {};
let nomeJogador = "";
let pontos = 0;
let vidas = 3;
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let perguntas = [];
let respostaFeita = false;
let jogoPausado = true;
let jogoFinalizado = false;
let partidaSalva = false;
let cameraX = 0;
let tempo = 0;
let particulas = [];
let decoracoes = [];
let telaAnteriorRanking = "resultado";

const jogador = {
    x: 70,
    y: CHAO - 44,
    w: 34,
    h: 44,
    vx: 0,
    vy: 0,
    noChao: true,
    invulneravel: 0
};

const posicoesPerguntas = [350, 790, 1250, 1690, 2020];

const bancoPerguntas = [
    {
        pergunta: "Qual é o nome do músculo do coração?",
        opcoes: ["Miocárdio", "Diafragma", "Bíceps", "Tendão"],
        correta: 0,
        explicacao: "O miocárdio é o tecido muscular responsável pelas contrações cardíacas."
    },
    {
        pergunta: "Qual órgão bombeia o sangue pelo corpo?",
        opcoes: ["Pulmão", "Coração", "Estômago", "Cérebro"],
        correta: 1,
        explicacao: "O coração bombeia o sangue para todo o organismo."
    },
    {
        pergunta: "Qual componente do sangue transporta oxigênio?",
        opcoes: ["Hemácias", "Plaquetas", "Saliva", "Neurônios"],
        correta: 0,
        explicacao: "As hemácias contêm hemoglobina, que transporta oxigênio."
    },
    {
        pergunta: "Qual é a função das plaquetas?",
        opcoes: ["Transportar oxigênio", "Ajudar na coagulação", "Produzir ar", "Digestionar alimentos"],
        correta: 1,
        explicacao: "As plaquetas participam da coagulação do sangue."
    },
    {
        pergunta: "Qual é a parte líquida do sangue?",
        opcoes: ["Plasma", "Hemácia", "Plaqueta", "Miocárdio"],
        correta: 0,
        explicacao: "O plasma é a parte líquida do sangue."
    },
    {
        pergunta: "Qual órgão realiza as trocas gasosas?",
        opcoes: ["Rins", "Pulmões", "Fígado", "Estômago"],
        correta: 1,
        explicacao: "Nos pulmões, o oxigênio entra no sangue e o gás carbônico é eliminado."
    },
    {
        pergunta: "Qual vaso sanguíneo leva o sangue para fora do coração?",
        opcoes: ["Veia", "Artéria", "Nervo", "Tendão"],
        correta: 1,
        explicacao: "As artérias levam o sangue para longe do coração."
    },
    {
        pergunta: "Qual vaso sanguíneo geralmente leva sangue de volta ao coração?",
        opcoes: ["Veia", "Artéria", "Brônquio", "Traqueia"],
        correta: 0,
        explicacao: "As veias transportam o sangue de volta ao coração."
    },
    {
        pergunta: "Qual é a função dos glóbulos brancos?",
        opcoes: ["Defender o organismo", "Transportar oxigênio", "Formar os ossos", "Produzir bile"],
        correta: 0,
        explicacao: "Os glóbulos brancos participam da defesa do organismo."
    },
    {
        pergunta: "Qual órgão filtra o sangue e ajuda a produzir urina?",
        opcoes: ["Coração", "Rim", "Pulmão", "Baço"],
        correta: 1,
        explicacao: "Os rins filtram o sangue e ajudam a regular a água e os sais."
    },
    {
        pergunta: "O que significa frequência cardíaca?",
        opcoes: ["Batimentos por minuto", "Número de ossos", "Temperatura do corpo", "Quantidade de ar"],
        correta: 0,
        explicacao: "A frequência cardíaca indica quantas vezes o coração bate por minuto."
    },
    {
        pergunta: "Qual gás usamos na respiração celular?",
        opcoes: ["Oxigênio", "Hélio", "Neônio", "Ozônio"],
        correta: 0,
        explicacao: "As células usam oxigênio para obter energia."
    },
    {
        pergunta: "Qual gás eliminamos ao expirar?",
        opcoes: ["Gás carbônico", "Hélio", "Neônio", "Hidrogênio"],
        correta: 0,
        explicacao: "O gás carbônico produzido pelo organismo é eliminado pelos pulmões."
    },
    {
        pergunta: "Qual músculo é importante para a respiração?",
        opcoes: ["Diafragma", "Bíceps", "Masseter", "Trapézio"],
        correta: 0,
        explicacao: "O diafragma ajuda a movimentar o ar durante a respiração."
    },
    {
        pergunta: "Onde ficam os alvéolos pulmonares?",
        opcoes: ["Nos pulmões", "Nos rins", "No estômago", "No coração"],
        correta: 0,
        explicacao: "Os alvéolos são estruturas pulmonares onde ocorrem trocas gasosas."
    },
    {
        pergunta: "Qual é a maior artéria do corpo humano?",
        opcoes: ["Aorta", "Veia cava", "Carótida", "Artéria renal"],
        correta: 0,
        explicacao: "A aorta é a principal artéria que distribui sangue ao corpo."
    },
    {
        pergunta: "Qual é a função das válvulas cardíacas?",
        opcoes: ["Impedir o refluxo do sangue", "Produzir células", "Filtrar urina", "Aquecer o ar"],
        correta: 0,
        explicacao: "As válvulas ajudam o sangue a seguir na direção correta."
    },
    {
        pergunta: "O que é pressão arterial?",
        opcoes: [
            "Pressão do sangue nas paredes das artérias",
            "Temperatura dos pulmões",
            "Força dos ossos",
            "Quantidade de saliva"
        ],
        correta: 0,
        explicacao: "A pressão arterial representa a força do sangue nas paredes das artérias."
    },
    {
        pergunta: "Qual estrutura conduz o ar até os brônquios?",
        opcoes: ["Traqueia", "Esôfago", "Aorta", "Ureter"],
        correta: 0,
        explicacao: "A traqueia conduz o ar até os brônquios."
    },
    {
        pergunta: "Qual é a função principal do sistema circulatório?",
        opcoes: ["Transportar sangue e substâncias", "Controlar somente a visão", "Produzir hormônios", "Formar alimentos"],
        correta: 0,
        explicacao: "O sistema circulatório transporta oxigênio, nutrientes e outras substâncias."
    },
    {
        pergunta: "Qual lado do coração bombeia sangue para os pulmões?",
        opcoes: ["Lado direito", "Lado esquerdo", "Somente as veias", "Nenhum lado"],
        correta: 0,
        explicacao: "O lado direito envia sangue aos pulmões para receber oxigênio."
    },
    {
        pergunta: "Qual lado do coração envia sangue oxigenado para o corpo?",
        opcoes: ["Lado direito", "Lado esquerdo", "Somente os pulmões", "Nenhum lado"],
        correta: 1,
        explicacao: "O lado esquerdo bombeia sangue oxigenado para o corpo."
    },
    {
        pergunta: "Qual é a função da hemoglobina?",
        opcoes: ["Ajudar a transportar oxigênio", "Produzir urina", "Formar cartilagem", "Digestionar alimentos"],
        correta: 0,
        explicacao: "A hemoglobina presente nas hemácias se liga ao oxigênio."
    },
    {
        pergunta: "O que acontece nos capilares sanguíneos?",
        opcoes: ["Trocas de substâncias com os tecidos", "O sangue vira osso", "O ar é produzido", "Os alimentos são mastigados"],
        correta: 0,
        explicacao: "Os capilares permitem trocas de gases e nutrientes entre sangue e tecidos."
    },
    {
        pergunta: "Qual hábito ajuda a cuidar do coração?",
        opcoes: ["Praticar atividade física adequada", "Fumar", "Dormir pouco sempre", "Evitar todo movimento"],
        correta: 0,
        explicacao: "Hábitos saudáveis ajudam a cuidar da saúde cardiovascular."
    },
    {
        pergunta: "Qual órgão produz a bile?",
        opcoes: ["Fígado", "Coração", "Pulmão", "Rim"],
        correta: 0,
        explicacao: "O fígado produz a bile, que ajuda na digestão das gorduras."
    },
    {
        pergunta: "Qual estrutura separa os lados direito e esquerdo do coração?",
        opcoes: ["Septo", "Traqueia", "Diafragma", "Pelve"],
        correta: 0,
        explicacao: "O septo separa os lados direito e esquerdo do coração."
    },
    {
        pergunta: "Qual cavidade recebe sangue que retorna do corpo?",
        opcoes: ["Átrio direito", "Ventrículo esquerdo", "Átrio esquerdo", "Aorta"],
        correta: 0,
        explicacao: "O átrio direito recebe o sangue que retorna do corpo."
    },
    {
        pergunta: "O que fazer diante de dor forte no peito e dificuldade para respirar?",
        opcoes: ["Procurar ajuda médica de emergência", "Ignorar", "Continuar fazendo esforço", "Esperar vários dias"],
        correta: 0,
        explicacao: "Esses sintomas podem indicar uma emergência e precisam de avaliação imediata."
    },
    {
        pergunta: "Qual é uma função do sangue?",
        opcoes: ["Transportar oxigênio e nutrientes", "Produzir os ossos diretamente", "Substituir os pulmões", "Digestionar alimentos na boca"],
        correta: 0,
        explicacao: "O sangue transporta oxigênio, nutrientes, hormônios e resíduos."
    }
];

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

/* ---------- Salvamento ---------- */

function lerDados(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave) || "[]");
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        console.error("Erro ao ler dados:", erro);
        return [];
    }
}

function guardarDados(chave, dados) {
    try {
        localStorage.setItem(chave, JSON.stringify(dados));
        return true;
    } catch (erro) {
        console.error("Erro ao guardar dados:", erro);
        alert("Não foi possível salvar. Verifique o espaço disponível no navegador.");
        return false;
    }
}

function guardarPartida(partida) {
    const partidas = lerDados(CHAVE_PARTIDAS);

    if (partidas.some(item => item.id === partida.id)) return;

    partidas.push(partida);

    if (!guardarDados(CHAVE_PARTIDAS, partidas)) return;

    const ranking = lerDados(CHAVE_RANKING);

    ranking.push({
        id: partida.id,
        nome: partida.nome,
        pontos: partida.pontos,
        acertos: partida.acertos,
        erros: partida.erros,
        data: partida.data
    });

    ranking.sort((a, b) => b.pontos - a.pontos);

    guardarDados(CHAVE_RANKING, ranking.slice(0, 100));
}

/* ---------- Telas ---------- */

function mostrar(elemento) {
    elemento.classList.remove("escondido");
}

function esconder(elemento) {
    elemento.classList.add("escondido");
}

function atualizarPainel() {
    $("nomeAtual").textContent = nomeJogador;
    $("vidas").textContent = "❤️".repeat(Math.max(0, vidas));
    $("pontos").textContent = pontos;
    $("fase").textContent = `${Math.min(indicePergunta + 1, TOTAL)}/${TOTAL}`;
}

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

/* ---------- Iniciar ---------- */

function iniciarJogo(evento) {
    evento.preventDefault();

    const nome = nomeInput.value.trim();

    if (!nome) {
        alert("Digite seu nome para começar! 💗");
        nomeInput.focus();
        return;
    }

    nomeJogador = nome.slice(0, 24);
    pontos = 0;
    vidas = 3;
    indicePergunta = 0;
    acertos = 0;
    erros = 0;
    respostaFeita = false;
    jogoFinalizado = false;
    partidaSalva = false;
    cameraX = 0;
    tempo = 0;
    particulas = [];

    perguntas = embaralhar(bancoPerguntas).slice(0, TOTAL);

    jogador.x = 70;
    jogador.y = CHAO - jogador.h;
    jogador.vx = 0;
    jogador.vy = 0;
    jogador.noChao = true;
    jogador.invulneravel = 0;

    esconder(cadastro);
    esconder(resultado);
    esconder(rankingTela);
    esconder(perguntaTela);
    mostrar(informacoes);

    criarDecoracoes();
    atualizarPainel();
    limparTeclas();
    jogoPausado = false;
}

/* ---------- Cenário ---------- */

function criarDecoracoes() {
    decoracoes = [];

    for (let i = 0; i < 85; i++) {
        decoracoes.push({
            x: Math.random() * MUNDO,
            y: 20 + Math.random() * (CHAO - 70),
            tamanho: 2 + Math.random() * 5,
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

function desenharFundo() {
    const gradiente = ctx.createLinearGradient(0, 0, 0, H);
    gradiente.addColorStop(0, "#fce8f2");
    gradiente.addColorStop(0.55, "#f7d8ec");
    gradiente.addColorStop(1, "#e7d9ff");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(226,91,143,0.15)";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.bezierCurveTo(220, 30, 330, 180, 520, 105);
    ctx.bezierCurveTo(700, 40, 820, 150, 1000, 80);
    ctx.stroke();

    decoracoes.forEach(d => {
        const x = d.x - cameraX * 0.35;

        if (x < -10 || x > W + 10) return;

        ctx.fillStyle = d.cor;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, d.y, d.tamanho, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.globalAlpha = 1;

    [120, 460, 790].forEach((x, i) => {
        const nx = x - cameraX * 0.15;
        const ny = [70, 110, 60][i];

        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath();
        ctx.arc(nx, ny, 18, 0, Math.PI * 2);
        ctx.arc(nx + 22, ny - 8, 23, 0, Math.PI * 2);
        ctx.arc(nx + 45, ny, 18, 0, Math.PI * 2);
        ctx.fill();
    });
}

function desenharChao() {
    ctx.fillStyle = "#d6b2e7";
    ctx.fillRect(0, CHAO, W, H - CHAO);

    ctx.fillStyle = "#bde7cf";
    ctx.fillRect(0, CHAO, W, 8);

    ctx.fillStyle = "#9ed9b8";
    ctx.fillRect(0, CHAO + 8, W, 5);

    for (let x = -20; x < W + 30; x += 45) {
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.ellipse(x - (cameraX % 45), CHAO + 27, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function desenharObstaculos() {
    obstaculos.forEach(o => {
        const x = o.x - cameraX;
        const y = CHAO - o.h;

        if (x < -100 || x > W + 100) return;

        ctx.fillStyle = "rgba(90,49,98,0.16)";
        ctx.beginPath();
        ctx.ellipse(x + o.w / 2, CHAO + 2, o.w * 0.55, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (o.tipo === "coagulo") {
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
        } else {
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
    });
}

function desenharPerguntas() {
    for (let i = 0; i < TOTAL; i++) {
        const x = posicoesPerguntas[i] - cameraX;
        const y = CHAO - 115;

        if (x < -60 || x > W + 60) continue;

        ctx.fillStyle = i < indicePergunta ? "#a9e6c4" : "#fff5b5";
        ctx.strokeStyle = i < indicePergunta ? "#55b985" : "#e7a63d";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#7c4c87";
        ctx.font = "bold 23px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i < indicePergunta ? "✓" : "?", x, y + 1);
    }
}

function desenharJogador() {
    const x = jogador.x - cameraX;
    const y = jogador.y;
    const andando = Math.abs(jogador.vx) > 0.2 && jogador.noChao;
    const balanco = andando ? Math.sin(tempo * 0.22) * 3 : 0;

    ctx.save();

    if (jogador.invulneravel > 0 && Math.floor(jogador.invulneravel / 5) % 2 === 0) {
        ctx.globalAlpha = 0.45;
    }

    ctx.fillStyle = "rgba(95,51,110,0.2)";
    ctx.beginPath();
    ctx.ellipse(x + jogador.w / 2, CHAO + 2, 19, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#754a86";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 32);
    ctx.lineTo(x + 10 + balanco, y + 41);
    ctx.moveTo(x + 23, y + 32);
    ctx.lineTo(x + 24 - balanco, y + 41);
    ctx.stroke();

    ctx.strokeStyle = "#ffb6c9";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 18);
    ctx.lineTo(x + 1, y + 26 + balanco);
    ctx.moveTo(x + 29, y + 18);
    ctx.lineTo(x + 33, y + 25 - balanco);
    ctx.stroke();

    const corpo = ctx.createLinearGradient(x, y + 12, x + jogador.w, y + 35);
    corpo.addColorStop(0, "#ff8fb8");
    corpo.addColorStop(1, "#e65c9c");

    ctx.fillStyle = corpo;
    ctx.beginPath();
    ctx.roundRect(x + 5, y + 12, 24, 23, 9);
    ctx.fill();

    ctx.fillStyle = "#ffd7bd";
    ctx.beginPath();
    ctx.arc(x + 17, y + 10, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#74486f";
    ctx.beginPath();
    ctx.arc(x + 16, y + 6, 14, Math.PI, Math.PI * 2);
    ctx.lineTo(x + 30, y + 13);
    ctx.fill();

    ctx.fillStyle = "#4e3659";
    ctx.beginPath();
    ctx.arc(x + 12, y + 11, 1.8, 0, Math.PI * 2);
    ctx.arc(x + 22, y + 11, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f69bb1";
    ctx.beginPath();
    ctx.arc(x + 8, y + 16, 3, 0, Math.PI * 2);
    ctx.arc(x + 26, y + 16, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#9e536f";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + 17, y + 15, 4, 0.15, Math.PI - 0.15);
    ctx.stroke();

    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("♥", x + 17, y + 27);

    ctx.restore();
}

function desenharProgresso() {
    const largura = 210;
    const progresso = indicePergunta / TOTAL;

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.roundRect(W - largura - 20, 18, largura, 25, 12);
    ctx.fill();

    ctx.fillStyle = "#e9c4f7";
    ctx.beginPath();
    ctx.roundRect(W - largura - 12, 25, largura - 16, 10, 6);
    ctx.fill();

    if (progresso > 0) {
        ctx.fillStyle = "#e85e9e";
        ctx.beginPath();
        ctx.roundRect(W - largura - 12, 25, (largura - 16) * progresso, 10, 6);
        ctx.fill();
    }

    ctx.fillStyle = "#704a80";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("AVENTURA PELO CORAÇÃO", 18, 25);
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

        if (p.vida <= 0) particulas.splice(i, 1);
    }
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

/* ---------- Física ---------- */

function atualizar() {
    if (jogoPausado || jogoFinalizado) return;

    tempo++;

    if (jogador.invulneravel > 0) jogador.invulneravel--;

    const anteriorX = jogador.x;
    const anteriorBase = jogador.y + jogador.h;

    let movimento = 0;

    if (teclas.esquerda) movimento--;
    if (teclas.direita) movimento++;

    jogador.vx = movimento * 4.2;
    jogador.x += jogador.vx;
    jogador.x = Math.max(0, Math.min(MUNDO - jogador.w, jogador.x));

    jogador.vy += 0.58;
    jogador.y += jogador.vy;
    jogador.noChao = false;

    if (jogador.y + jogador.h >= CHAO) {
        jogador.y = CHAO - jogador.h;
        jogador.vy = 0;
        jogador.noChao = true;
    }

    for (const o of obstaculos) {
        const topo = CHAO - o.h;
        const horizontal = jogador.x + jogador.w > o.x && jogador.x < o.x + o.w;
        const vertical = jogador.y + jogador.h > topo && jogador.y < CHAO;

        if (!horizontal || !vertical) continue;

        if (anteriorBase <= topo + 10 && jogador.vy >= 0) {
            jogador.y = topo - jogador.h;
            jogador.vy = 0;
            jogador.noChao = true;
        } else {
            if (anteriorX + jogador.w <= o.x) {
                jogador.x = o.x - jogador.w;
            } else if (anteriorX >= o.x + o.w) {
                jogador.x = o.x + o.w;
            }

            if (jogador.invulneravel <= 0) perderVida();
        }
    }

    cameraX = Math.max(0, Math.min(MUNDO - W, jogador.x - W * 0.32));

    if (
        indicePergunta < TOTAL &&
        jogador.x + jogador.w >= posicoesPerguntas[indicePergunta]
    ) {
        abrirPergunta();
    }

    atualizarPainel();
}

function pular() {
    if (jogoPausado || jogoFinalizado || !jogador.noChao) return;

    jogador.vy = -12.5;
    jogador.noChao = false;

    criarParticulas(jogador.x + jogador.w / 2, jogador.y + jogador.h, "#ffffff", 7);
}

function perderVida() {
    if (jogador.invulneravel > 0 || jogoPausado || jogoFinalizado) return;

    vidas--;
    jogador.invulneravel = 75;
    jogador.vy = -5;

    criarParticulas(jogador.x + jogador.w / 2, jogador.y + jogador.h / 2, "#ff5f87", 12);
    atualizarPainel();

    if (vidas <= 0) finalizarJogo(false);
}

/* ---------- Perguntas ---------- */

function abrirPergunta() {
    if (jogoPausado || jogoFinalizado) return;

    jogoPausado = true;
    respostaFeita = false;

    const questao = perguntas[indicePergunta];

    $("tituloPergunta").textContent = `Pergunta ${indicePergunta + 1} de ${TOTAL}`;
    $("textoPergunta").textContent = questao.pergunta;
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("opcoes").replaceChildren();

    questao.opcoes.forEach((opcao, i) => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "opcao-resposta";
        botao.textContent = `${String.fromCharCode(65 + i)}. ${opcao}`;
        botao.addEventListener("click", () => responderPergunta(i));

        $("opcoes").appendChild(botao);
    });

    mostrar(perguntaTela);
}

function responderPergunta(escolhida) {
    if (!jogoPausado || jogoFinalizado || respostaFeita) return;

    const questao = perguntas[indicePergunta];
    const acertou = escolhida === questao.correta;

    respostaFeita = true;

    $("opcoes").querySelectorAll("button").forEach((botao, i) => {
        botao.disabled = true;

        if (i === questao.correta) {
            botao.classList.add("correta");
        } else if (i === escolhida) {
            botao.classList.add("incorreta");
        }
    });

    if (acertou) {
        pontos += 100;
        acertos++;

        $("feedback").textContent = `Muito bem! 💗 ${questao.explicacao}`;
        $("feedback").className = "feedback feedback-correto";

        criarParticulas(jogador.x + 15, jogador.y, "#ff70ad", 18);
    } else {
        erros++;

        $("feedback").textContent =
            `Quase! A resposta certa é: ${questao.opcoes[questao.correta]}. ${questao.explicacao}`;
        $("feedback").className = "feedback feedback-errado";
    }

    atualizarPainel();
}

function continuarAventura() {
    if (perguntaTela.classList.contains("escondido")) return;

    if (!respostaFeita) {
        $("feedback").textContent = "Escolha uma resposta antes de continuar! 💗";
        $("feedback").className = "feedback feedback-errado";
        return;
    }

    esconder(perguntaTela);
    indicePergunta++;
    atualizarPainel();

    if (indicePergunta >= TOTAL) {
        finalizarJogo(true);
        return;
    }

    jogador.x = Math.max(jogador.x, posicoesPerguntas[indicePergunta - 1] + 35);
    jogador.vy = 0;

    if (jogador.y + jogador.h > CHAO) {
        jogador.y = CHAO - jogador.h;
    }

    respostaFeita = false;
    jogoPausado = false;
}

/* ---------- Resultado e gravação ---------- */

function criarIdPartida() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `partida_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function finalizarJogo(venceu) {
    if (jogoFinalizado) return;

    jogoFinalizado = true;
    jogoPausado = true;
    esconder(perguntaTela);

    $("tituloResultado").textContent = venceu
        ? "Aventura concluída! 💖"
        : "Fim da aventura 💗";

    $("resumo").textContent = venceu
        ? `Parabéns, ${nomeJogador}! Você concluiu a aventura.`
        : `${nomeJogador}, você ficou sem vidas. Tente novamente para melhorar sua pontuação!`;

    $("pontuacaoFinal").textContent = `Pontuação: ${pontos}`;

    const detalhes = $("detalhesPartida");
    detalhes.replaceChildren();

    [
        `✅ Respostas corretas: ${acertos}`,
        `❌ Respostas incorretas: ${erros}`,
        `❤️ Vidas restantes: ${vidas}`,
        `📚 Perguntas respondidas: ${Math.min(indicePergunta + 1, TOTAL)}/${TOTAL}`
    ].forEach(texto => {
        const p = document.createElement("p");
        p.textContent = texto;
        detalhes.appendChild(p);
    });

    if (!partidaSalva) {
        partidaSalva = true;

        guardarPartida({
            id: criarIdPartida(),
            nome: nomeJogador,
            pontos,
            acertos,
            erros,
            data: new Date().toLocaleDateString("pt-BR")
        });
    }

    mostrar(resultado);
}

/* ---------- Ranking ---------- */

function mostrarRanking() {
    const lista = $("listaRanking");
    const status = $("statusRanking");

    lista.replaceChildren();

    const ranking = lerDados(CHAVE_RANKING)
        .sort((a, b) => b.pontos - a.pontos);

    status.textContent = "Partidas guardadas neste navegador.";

    if (ranking.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "ranking-vazio";
        vazio.textContent = "Ainda não existem partidas registradas. Seja o primeiro a jogar! 💗";
        lista.appendChild(vazio);
        return;
    }

    ranking.forEach((jogador, indice) => {
        const item = document.createElement("div");
        item.className = "item-ranking";

        const nome = document.createElement("strong");
        const medalhas = ["🥇", "🥈", "🥉"];
        nome.textContent = `${medalhas[indice] || "🏅"} ${indice + 1}º — ${jogador.nome}`;

        const pontos = document.createElement("span");
        pontos.textContent = `${jogador.pontos} pontos`;

        const data = document.createElement("small");
        data.textContent = jogador.data || "";

        item.append(nome, pontos, data);
        lista.appendChild(item);
    });
}

function abrirRanking(origem = "resultado") {
    telaAnteriorRanking = origem;

    esconder(cadastro);
    esconder(informacoes);
    esconder(perguntaTela);
    esconder(resultado);

    esconder($("voltarResultado"));
    if (origem === "resultado") mostrar($("voltarResultado"));

    mostrar(rankingTela);
    mostrarRanking();
}

function voltarDoRanking() {
    esconder(rankingTela);

    if (telaAnteriorRanking === "resultado") {
        mostrar(resultado);
    } else {
        novoJogador();
    }
}

function limparRanking() {
    if (!confirm("Apagar o ranking e o histórico de partidas deste navegador?")) {
        return;
    }

    localStorage.removeItem(CHAVE_RANKING);
    localStorage.removeItem(CHAVE_PARTIDAS);
    mostrarRanking();
}

function novoJogador() {
    jogoPausado = true;
    jogoFinalizado = false;

    esconder(rankingTela);
    esconder(resultado);
    esconder(informacoes);
    esconder(perguntaTela);
    mostrar(cadastro);

    nomeInput.value = "";
    nomeInput.focus();
}

/* ---------- Controles ---------- */

function limparTeclas() {
    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });
}

document.addEventListener("keydown", evento => {
    const tecla = evento.key;

    if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(tecla)) {
        evento.preventDefault();
    }

    if (tecla === "ArrowLeft" || tecla.toLowerCase() === "a") {
        teclas.esquerda = true;
    }

    if (tecla === "ArrowRight" || tecla.toLowerCase() === "d") {
        teclas.direita = true;
    }

    if (tecla === "ArrowUp" || tecla === " " || tecla.toLowerCase() === "w") {
        pular();
    }
});

document.addEventListener("keyup", evento => {
    const tecla = evento.key;

    if (tecla === "ArrowLeft" || tecla.toLowerCase() === "a") {
        teclas.esquerda = false;
    }

    if (tecla === "ArrowRight" || tecla.toLowerCase() === "d") {
        teclas.direita = false;
    }
});

window.addEventListener("blur", limparTeclas);

function configurarBotaoMovimento(id, direcao) {
    const botao = $(id);

    botao.addEventListener("pointerdown", evento => {
        evento.preventDefault();
        teclas[direcao] = true;

        if (botao.setPointerCapture) {
            botao.setPointerCapture(evento.pointerId);
        }
    });

    ["pointerup", "pointercancel", "lostpointercapture"].forEach(tipo => {
        botao.addEventListener(tipo, () => {
            teclas[direcao] = false;
        });
    });
}

configurarBotaoMovimento("esquerda", "esquerda");
configurarBotaoMovimento("direita", "direita");

$("pular").addEventListener("pointerdown", evento => {
    evento.preventDefault();
    pular();
});

$("formCadastro").addEventListener("submit", iniciarJogo);
$("proximo").addEventListener("click", continuarAventura);
$("btnResultadoNovo").addEventListener("click", novoJogador);
$("btnResultadoRanking").addEventListener("click", () => abrirRanking("resultado"));
$("novoJogador").addEventListener("click", novoJogador);
$("limparRanking").addEventListener("click", limparRanking);
$("voltarResultado").addEventListener("click", voltarDoRanking);

/* ---------- Loop do jogo ---------- */

function loopJogo() {
    atualizar();
    desenhar();
    requestAnimationFrame(loopJogo);
}

function prepararJogo() {
    criarDecoracoes();
    esconder(informacoes);
    esconder(perguntaTela);
    esconder(resultado);
    esconder(rankingTela);
    desenhar();
}

prepararJogo();
loopJogo();

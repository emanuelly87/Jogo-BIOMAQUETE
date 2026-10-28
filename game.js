
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const $ = id => document.getElementById(id);

const W = 900;
const H = 450;
const CHAO = 390;
const MUNDO = 2300;

let jogador = null;
let camera = 0;
let nome = "";
let pontos = 0;
let vidas = 3;
let checkpoint = 0;
let pausado = true;
let terminou = false;
let aguardando = false;
let teclas = {};
let respostas = [];
let obstaculos = [];
let plataformas = [];
let temporizadorFeedback = null;

const desafios = [
  {
    x: 350,
    fase: "Coração direito",
    titulo: "🫀 Decisão 1: para onde ir?",
    texto: "O sangue pobre em oxigênio chegou ao lado direito do coração. Qual é o próximo caminho?",
    opcoes: [
      {
        texto: "Ir aos pulmões pela artéria pulmonar",
        pontos: 100,
        explicacao: "Correto! O ventrículo direito envia o sangue aos pulmões."
      },
      {
        texto: "Ir ao corpo pela aorta",
        pontos: -25,
        explicacao: "A aorta sai do ventrículo esquerdo. Primeiro, o sangue precisa ir aos pulmões."
      },
      {
        texto: "Voltar pelas veias cavas",
        pontos: 50,
        explicacao: "As veias cavas trazem sangue do corpo ao coração. Agora, ele deve seguir para os pulmões."
      }
    ]
  },
  {
    x: 790,
    fase: "Pulmões",
    titulo: "🫁 Decisão 2: troca gasosa",
    texto: "Você chegou aos pulmões. O que acontece com o sangue?",
    opcoes: [
      {
        texto: "Recebe oxigênio e libera gás carbônico",
        pontos: 100,
        explicacao: "Correto! Nos pulmões, ocorrem as trocas gasosas."
      },
      {
        texto: "Perde todo o oxigênio",
        pontos: -25,
        explicacao: "Nos pulmões, o sangue recebe oxigênio e libera gás carbônico."
      },
      {
        texto: "Recebe oxigênio, que será usado pelos tecidos",
        pontos: 50,
        explicacao: "Isso! O sangue recebe oxigênio. Também é importante lembrar que ele libera gás carbônico nos pulmões."
      }
    ]
  },
  {
    x: 1250,
    fase: "Coração esquerdo",
    titulo: "❤️ Decisão 3: a força do coração",
    texto: "O sangue rico em oxigênio chegou ao ventrículo esquerdo. O que ocorre durante a sístole ventricular?",
    opcoes: [
      {
        texto: "O sangue é bombeado para a aorta e segue ao corpo",
        pontos: 100,
        explicacao: "Correto! A contração do ventrículo esquerdo impulsiona o sangue para a aorta."
      },
      {
        texto: "O sangue retorna aos pulmões pela artéria pulmonar",
        pontos: -25,
        explicacao: "O sangue oxigenado segue do lado esquerdo do coração para o corpo."
      },
      {
        texto: "O ventrículo se contrai para impulsionar o sangue",
        pontos: 50,
        explicacao: "Correto quanto à contração! O próximo passo é a ejeção do sangue para a aorta."
      }
    ]
  },
  {
    x: 1690,
    fase: "Corpo humano",
    titulo: "🩸 Decisão 4: chegada aos tecidos",
    texto: "O sangue chegou aos capilares do corpo. Qual é a função desses vasos?",
    opcoes: [
      {
        texto: "Realizar trocas de gases, nutrientes e resíduos",
        pontos: 100,
        explicacao: "Correto! Os capilares permitem trocas entre o sangue e os tecidos."
      },
      {
        texto: "Bombear o sangue como o coração",
        pontos: -25,
        explicacao: "O coração bombeia o sangue. Os capilares realizam trocas com os tecidos."
      },
      {
        texto: "Permitir que oxigênio e nutrientes cheguem aos tecidos",
        pontos: 50,
        explicacao: "Muito bem! Essa é uma função importante dos capilares. Eles também permitem a troca de resíduos."
      }
    ]
  },
  {
    x: 2020,
    fase: "Retorno venoso",
    titulo: "🔄 Decisão 5: completar o ciclo",
    texto: "Depois de entregar oxigênio aos tecidos, o sangue precisa voltar ao coração. Qual é o caminho?",
    opcoes: [
      {
        texto: "Pelas veias até as veias cavas e o átrio direito",
        pontos: 100,
        explicacao: "Correto! O sangue retorna do corpo pelas veias cavas."
      },
      {
        texto: "Pela aorta diretamente ao átrio direito",
        pontos: -25,
        explicacao: "A aorta leva o sangue do coração para o corpo."
      },
      {
        texto: "Pelas veias em direção ao coração",
        pontos: 50,
        explicacao: "Correto! As veias trazem o sangue de volta ao coração. As veias cavas desembocam no átrio direito."
      }
    ]
  }
];

// Histórico guardado neste navegador.
function lerRanking() {
  try {
    const dados = JSON.parse(
      localStorage.getItem("rankingCoracao") || "[]"
    );
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function salvarRanking(partida) {
  const ranking = lerRanking();
  ranking.push(partida);

  try {
    localStorage.setItem(
      "rankingCoracao",
      JSON.stringify(ranking)
    );
  } catch {
    alert("Não foi possível salvar o ranking neste navegador.");
  }
}

function prepararMundo() {
  obstaculos = [
    { x: 150, y: 350, w: 32, h: 40 },
    { x: 245, y: 335, w: 32, h: 55 },
    { x: 500, y: 350, w: 32, h: 40 },
    { x: 625, y: 330, w: 32, h: 60 },
    { x: 940, y: 350, w: 32, h: 40 },
    { x: 1070, y: 335, w: 32, h: 55 },
    { x: 1400, y: 350, w: 32, h: 40 },
    { x: 1530, y: 330, w: 32, h: 60 },
    { x: 1810, y: 350, w: 32, h: 40 },
    { x: 1900, y: 335, w: 32, h: 55 }
  ];

  plataformas = [
    { x: 190, y: 290, w: 90, h: 14 },
    { x: 560, y: 280, w: 100, h: 14 },
    { x: 970, y: 290, w: 100, h: 14 },
    { x: 1430, y: 280, w: 100, h: 14 },
    { x: 1840, y: 290, w: 100, h: 14 }
  ];
}

function novoJogador() {
  return {
    x: 30,
    y: CHAO - 34,
    w: 34,
    h: 34,
    vx: 0,
    vy: 0,
    velocidade: 4,
    noChao: true
  };
}

function iniciar() {
  const campo = $("nomeJogador").value.trim();

  if (!campo) {
    alert("Digite o nome do jogador antes de começar!");
    $("nomeJogador").focus();
    return;
  }

  if (temporizadorFeedback) {
    clearTimeout(temporizadorFeedback);
    temporizadorFeedback = null;
  }

  nome = campo.slice(0, 30);
  pontos = 0;
  vidas = 3;
  checkpoint = 0;
  camera = 0;
  respostas = [];
  teclas = {};
  pausado = false;
  terminou = false;
  aguardando = false;

  jogador = novoJogador();
  prepararMundo();

  $("nomeAtual").textContent = nome;
  $("pontos").textContent = pontos;
  $("vidas").textContent = vidas;
  $("fase").textContent = "Coração direito";

  $("cadastro").classList.add("escondido");
  $("informacoes").classList.remove("escondido");
  $("mensagem").classList.add("escondido");
  $("pergunta").classList.add("escondido");
  $("resultado").classList.add("escondido");
  $("rankingTela").classList.add("escondido");
}

function atualizarPainel() {
  $("pontos").textContent = pontos;
  $("vidas").textContent = vidas;

  let fase = "Coração direito";

  for (const d of desafios) {
    if (jogador.x >= d.x) fase = d.fase;
  }

  $("fase").textContent = fase;
}

function abrirDesafio() {
  if (checkpoint >= desafios.length || pausado || terminou) {
    return;
  }

  pausado = true;
  aguardando = false;

  const d = desafios[checkpoint];

  $("tituloPergunta").textContent = d.titulo;
  $("textoPergunta").textContent = d.texto;
  $("feedback").textContent = "";

  const caixa = $("opcoes");
  caixa.innerHTML = "";

  d.opcoes.forEach(opcao => {
    const botao = document.createElement("button");
    botao.textContent = opcao.texto;

    botao.addEventListener("click", () => {
      if (!pausado || aguardando || terminou) return;

      aguardando = true;

      // A pontuação não pode ficar abaixo de zero.
      const pontosAntes = pontos;
      pontos = Math.max(0, pontos + opcao.pontos);
      const variacao = pontos - pontosAntes;

      const correta = opcao.pontos === 100;

      if (!correta && opcao.pontos < 0) {
        vidas = Math.max(0, vidas - 1);
      }

      respostas.push({
        pergunta: d.titulo,
        escolha: opcao.texto,
        pontos: variacao,
        explicacao: opcao.explicacao
      });

      atualizarPainel();

      caixa.querySelectorAll("button").forEach(b => {
        b.disabled = true;
      });

      const variacaoTexto =
        variacao > 0 ? `+${variacao}` : `${variacao}`;

      $("feedback").textContent =
        (correta ? "✅ Excelente! " :
          opcao.pontos === 50 ? "🟡 Parcialmente correto! " :
          "❌ Escolha incorreta! ") +
        opcao.explicacao +
        ` (${variacaoTexto} pontos).`;

      temporizadorFeedback = setTimeout(() => {
        temporizadorFeedback = null;
        if (terminou) return;

        checkpoint++;
        jogador.x = d.x + 45;

        $("pergunta").classList.add("escondido");
        aguardando = false;

        if (vidas <= 0) {
          finalizar(false);
          return;
        }

        pausado = false;
        atualizarPainel();
      }, 2200);
    });

    caixa.appendChild(botao);
  });

  $("pergunta").classList.remove("escondido");
}

function finalizar(vitoria) {
  if (terminou) return;

  terminou = true;
  pausado = true;
  teclas = {};

  const acertos = respostas.filter(r => r.pontos >= 100).length;
  const total = respostas.length;

  salvarRanking({
    nome,
    pontos,
    acertos,
    totalPerguntas: total,
    data: new Date().toLocaleString("pt-BR")
  });

  $("pergunta").classList.add("escondido");
  $("resultado").classList.remove("escondido");

  $("tituloResultado").textContent = vitoria
    ? "🏆 Você completou o percurso!"
    : "❤️ Fim de jogo!";

  $("resumo").textContent =
    `${nome}, você respondeu ${total} desafios e teve ` +
    `${acertos} escolhas de 100 pontos. ` +
    (vitoria
      ? "Parabéns por completar a circulação sanguínea!"
      : "Suas vidas acabaram antes do fim do percurso.");

  $("pontuacaoFinal").textContent =
    `Pontuação final: ${pontos} pontos`;

  const detalhes = $("detalhesPartida");
  detalhes.innerHTML = "";

  const titulo = document.createElement("p");
  titulo.textContent = "Suas escolhas:";
  detalhes.appendChild(titulo);

  respostas.forEach(r => {
    const item = document.createElement("p");
    item.textContent =
      `${r.pergunta}: ${r.escolha} (${r.pontos >= 0 ? "+" : ""}${r.pontos} pontos)`;
    detalhes.appendChild(item);
  });
}

function mostrarRanking() {
  const lista = $("listaRanking");
  lista.innerHTML = "";

  const ranking = lerRanking().sort(
    (a, b) => b.pontos - a.pontos
  );

  if (ranking.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Ainda não há partidas registradas.";
    lista.appendChild(item);
  }

  ranking.forEach((partida, indice) => {
    const item = document.createElement("li");

    item.textContent =
      `${indice + 1}º — ${partida.nome}: ` +
      `${partida.pontos} pontos ` +
      `(${partida.acertos}/${partida.totalPerguntas} escolhas de 100 pontos)`;

    lista.appendChild(item);
  });

  $("resultado").classList.add("escondido");
  $("rankingTela").classList.remove("escondido");
}

function colidiu(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function atualizar() {
  if (!jogador || pausado || terminou) return;

  const yAnterior = jogador.y;

  jogador.vx = 0;

  if (teclas.ArrowRight) jogador.vx = jogador.velocidade;
  if (teclas.ArrowLeft) jogador.vx = -jogador.velocidade;

  jogador.x += jogador.vx;
  jogador.x = Math.max(0, Math.min(MUNDO - jogador.w, jogador.x));

  jogador.vy += 0.55;
  jogador.y += jogador.vy;
  jogador.noChao = false;

  if (jogador.y + jogador.h >= CHAO) {
    jogador.y = CHAO - jogador.h;
    jogador.vy = 0;
    jogador.noChao = true;
  }

  for (const p of plataformas) {
    if (
      yAnterior + jogador.h <= p.y &&
      jogador.vy >= 0 &&
      colidiu(jogador, p)
    ) {
      jogador.y = p.y - jogador.h;
      jogador.vy = 0;
      jogador.noChao = true;
    }
  }

  // Os obstáculos precisam ser pulados.
  for (const o of obstaculos) {
    if (!colidiu(jogador, o)) continue;

    if (jogador.vx > 0) jogador.x = o.x - jogador.w;
    if (jogador.vx < 0) jogador.x = o.x + o.w;
  }

  camera = Math.max(
    0,
    Math.min(MUNDO - W, jogador.x - W * 0.35)
  );

  if (
    checkpoint < desafios.length &&
    jogador.x >= desafios[checkpoint].x
  ) {
    jogador.x = desafios[checkpoint].x;
    abrirDesafio();
  }

  if (
    checkpoint >= desafios.length &&
    jogador.x >= MUNDO - 100
  ) {
    finalizar(true);
  }

  atualizarPainel();
}

function desenharFundo() {
  const regioes = [
    { x: 0, nome: "CORAÇÃO DIREITO", cor: "#bdeeff" },
    { x: 500, nome: "PULMÕES", cor: "#d7f5ff" },
    { x: 950, nome: "CORAÇÃO ESQUERDO", cor: "#ffdce5" },
    { x: 1400, nome: "CORPO HUMANO", cor: "#ffedcc" },
    { x: 1850, nome: "RETORNO VENOSO", cor: "#e8d9ff" }
  ];

  let atual = regioes[0];

  for (const r of regioes) {
    if (jogador && jogador.x >= r.x) atual = r;
  }

  ctx.fillStyle = atual.cor;
  ctx.fillRect(0, 0, W, H);

  // Bolhas decorativas com movimento de câmera.
  for (let i = 0; i < 12; i++) {
    const x = ((i * 110 - camera * 0.2) % (W + 80) + W + 80) % (W + 80);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(x, 65 + (i % 3) * 35, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vaso sanguíneo.
  ctx.fillStyle = "#f49ab0";
  ctx.fillRect(0, CHAO, W, H - CHAO);

  ctx.fillStyle = "#c9184a";
  ctx.fillRect(0, CHAO + 8, W, 9);

  ctx.fillStyle = "#ffcad4";
  ctx.fillRect(0, CHAO + 21, W, 7);

  ctx.fillStyle = "#701a32";
  ctx.font = "bold 19px Arial";
  ctx.fillText(atual.nome, 20, 32);
}

function desenharCenario() {
  for (const p of plataformas) {
    const x = p.x - camera;

    ctx.fillStyle = "#8b5e83";
    ctx.fillRect(x, p.y, p.w, p.h);

    ctx.fillStyle = "#d8a7c7";
    ctx.fillRect(x, p.y, p.w, 5);
  }

  for (const o of obstaculos) {
    const x = o.x - camera;

    ctx.fillStyle = "#a46d38";
    ctx.fillRect(x, o.y, o.w, o.h);

    ctx.fillStyle = "#e5b45b";
    ctx.fillRect(x + 5, o.y + 5, o.w - 10, 7);

    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.fillText("!", x + 12, o.y + 26);
  }

  const chegada = MUNDO - 75 - camera;

  ctx.fillStyle = "#218653";
  ctx.fillRect(chegada, CHAO - 85, 7, 85);

  ctx.fillStyle = "#ffe08a";
  ctx.beginPath();
  ctx.moveTo(chegada + 7, CHAO - 85);
  ctx.lineTo(chegada + 55, CHAO - 70);
  ctx.lineTo(chegada + 7, CHAO - 55);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#14532d";
  ctx.font = "bold 13px Arial";
  ctx.fillText("CHEGADA", chegada - 25, CHAO - 96);
}

function desenharJogador() {
  const x = jogador.x - camera + jogador.w / 2;
  const y = jogador.y + jogador.h / 2;

  // Sombra.
  ctx.fillStyle = "rgba(70,0,20,0.2)";
  ctx.beginPath();
  ctx.ellipse(
    x, jogador.y + jogador.h + 2,
    18, 5, 0, 0, Math.PI * 2
  );
  ctx.fill();

  // Hemácia.
  ctx.fillStyle = "#e63950";
  ctx.beginPath();
  ctx.ellipse(x, y, 18, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff8a9b";
  ctx.beginPath();
  ctx.ellipse(x, y, 10, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Olhos.
  ctx.fillStyle = "#4a1020";
  ctx.beginPath();
  ctx.arc(x - 5, y - 3, 2, 0, Math.PI * 2);
  ctx.arc(x + 5, y - 3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Sorriso.
  ctx.strokeStyle = "#4a1020";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 1, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

function desenhar() {
  desenharFundo();
  desenharCenario();

  if (jogador) desenharJogador();
}

function pular() {
  if (!jogador || pausado || terminou) return;

  if (jogador.noChao) {
    jogador.vy = -12;
    jogador.noChao = false;
  }
}

// Teclado.
document.addEventListener("keydown", e => {
  if (
    ["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(e.code)
  ) {
    e.preventDefault();
  }

  teclas[e.code] = true;

  if (
    ["ArrowUp", "Space"].includes(e.code) &&
    !e.repeat
  ) {
    pular();
  }
});

document.addEventListener("keyup", e => {
  teclas[e.code] = false;
});

// Controles de toque.
function controle(id, codigo) {
  const botao = $(id);

  botao.addEventListener("pointerdown", e => {
    e.preventDefault();

    if (botao.setPointerCapture) {
      botao.setPointerCapture(e.pointerId);
    }

    teclas[codigo] = true;

    if (codigo === "ArrowUp") pular();
  });

  const soltar = e => {
    e.preventDefault();
    teclas[codigo] = false;
  };

  botao.addEventListener("pointerup", soltar);
  botao.addEventListener("pointercancel", soltar);
  botao.addEventListener("lostpointercapture", () => {
    teclas[codigo] = false;
  });
}

function limparTeclas() {
  teclas = {};
}

window.addEventListener("blur", limparTeclas);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) limparTeclas();
});

controle("esquerda", "ArrowLeft");
controle("direita", "ArrowRight");
controle("pular", "ArrowUp");

// Botões da interface.
$("comecar").addEventListener("click", iniciar);

$("nomeJogador").addEventListener("keydown", e => {
  if (e.key === "Enter") iniciar();
});

$("proximo").addEventListener("click", () => {
  if (temporizadorFeedback) {
    clearTimeout(temporizadorFeedback);
    temporizadorFeedback = null;
  }

  pausado = true;
  teclas = {};

  $("informacoes").classList.add("escondido");
  $("resultado").classList.add("escondido");
  $("rankingTela").classList.add("escondido");
  $("cadastro").classList.remove("escondido");

  $("nomeJogador").value = "";
  $("nomeJogador").focus();
});

$("verRanking").addEventListener("click", mostrarRanking);

$("novoJogador").addEventListener("click", () => {
  pausado = true;
  $("rankingTela").classList.add("escondido");
  $("cadastro").classList.remove("escondido");
  $("nomeJogador").value = "";
  $("nomeJogador").focus();
});

$("limparRanking").addEventListener("click", () => {
  const confirmar = confirm(
    "Tem certeza de que deseja apagar o ranking deste navegador?"
  );

  if (!confirmar) return;

  localStorage.removeItem("rankingCoracao");
  mostrarRanking();
});

// Prepara o jogo e mantém a animação funcionando.
prepararMundo();
jogador = novoJogador();

function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

loop();


/* =====================================================
   AVENTURA PELO CORAÇÃO
   Jogo educativo sobre o sistema cardiovascular
   50 perguntas no banco; 5 sorteadas por partida
   ===================================================== */

   const canvas = document.getElementById("gameCanvas")
   || document.getElementById("canvas")
   || document.getElementById("jogo");
 
 if (!canvas) {
   document.body.insertAdjacentHTML(
     "afterbegin",
     '<p style="padding:20px;color:red">Não encontrei o canvas do jogo. Confira o id no index.html.</p>'
   );
   throw new Error("Canvas não encontrado.");
 }
 
 const ctx = canvas.getContext("2d");
 
 const W = canvas.width || 900;
 const H = canvas.height || 450;
 const CHAO = H - 60;
 const MUNDO = 2300;
 
 /* Localiza elementos por diferentes nomes de ID */
 function elemento(...ids) {
   for (const id of ids) {
     const encontrado = document.getElementById(id);
     if (encontrado) return encontrado;
   }
   return null;
 }
 
 const telaInicial = elemento("telaInicial", "inicio", "intro");
 const telaPergunta = elemento("telaPergunta", "pergunta", "desafio");
 const telaResultado = elemento("telaResultado", "resultado", "fim");
 const telaRanking = elemento("telaRanking", "ranking");
 const nomeInput = elemento("nomeJogador", "inputNome", "nome");
 const nomePainel = elemento("nomePainel", "nomeAtual", "nomeExibido");
 const vidasPainel = elemento("vidas", "vidasAtual");
 const pontosPainel = elemento("pontos", "pontuacao", "pontosAtuais");
 const fasePainel = elemento("fase", "faseAtual");
 const perguntaTitulo = elemento("perguntaTitulo", "tituloPergunta");
 const perguntaTexto = elemento("perguntaTexto", "textoPergunta");
 const opcoesContainer = elemento("opcoes", "opcoesPergunta", "alternativas");
 const explicacaoEl = elemento("explicacao", "explicacaoPergunta");
 const resultadoTexto = elemento("resultadoTexto", "textoResultado");
 const rankingLista = elemento("rankingLista", "listaRanking");
 
 const botaoJogar = elemento("btnJogar", "jogar", "iniciarJogo");
 const botaoContinuar = elemento("btnContinuar", "continuar");
 const botaoReiniciar = elemento("btnReiniciar", "reiniciar", "jogarNovamente");
 const botaoRanking = elemento("btnRanking", "verRanking");
 const botaoFecharRanking = elemento("btnFecharRanking", "fecharRanking");
 const botaoEsquerda = elemento("btnEsquerda", "esquerda");
 const botaoDireita = elemento("btnDireita", "direita");
 const botaoPular = elemento("btnPular", "pular");
 
 const teclas = {};
 let jogador;
 let cameraX = 0;
 let estado = "inicio";
 let desafios = [];
 let desafioAtual = 0;
 let checkpoint = -1;
 let nomeAtual = "Jogador";
 let pontuacao = 0;
 let vidas = 3;
 let perguntaRespondida = false;
 let resultadoTemporario = "";
 let tempoResultado = 0;
 
 /* =====================================================
    BANCO DE 50 PERGUNTAS
    pontuação: correta = 100, parcialmente correta = 50,
    incorreta = -25
    ===================================================== */
 
 const bancoPerguntas = [
   {
     titulo: "O coração",
     texto: "Qual é a principal função do coração?",
     opcoes: [
       { texto: "Bombear o sangue pelo corpo", pontos: 100, explicacao: "Isso mesmo! O coração impulsiona o sangue pela circulação." },
       { texto: "Produzir todo o sangue do corpo", pontos: 50, explicacao: "O coração participa da circulação, mas as células sanguíneas são produzidas principalmente na medula óssea." },
       { texto: "Filtrar o ar que respiramos", pontos: -25, explicacao: "Quem filtra e conduz o ar são estruturas do sistema respiratório." }
     ]
   },
   {
     titulo: "As hemácias",
     texto: "Qual é a principal função dos glóbulos vermelhos?",
     opcoes: [
       { texto: "Combater todos os micróbios", pontos: 50, explicacao: "A defesa é principalmente função dos glóbulos brancos." },
       { texto: "Transportar oxigênio", pontos: 100, explicacao: "Correto! A hemoglobina das hemácias transporta grande parte do oxigênio." },
       { texto: "Produzir hormônios", pontos: -25, explicacao: "Hormônios são produzidos por órgãos e glândulas específicos." }
     ]
   },
   {
     titulo: "Os glóbulos brancos",
     texto: "Qual é a função dos glóbulos brancos?",
     opcoes: [
       { texto: "Transportar a maior parte do oxigênio", pontos: 50, explicacao: "Essa tarefa é principalmente das hemácias." },
       { texto: "Fazer o sangue coagular", pontos: 50, explicacao: "As plaquetas têm papel importante na coagulação." },
       { texto: "Ajudar na defesa do organismo", pontos: 100, explicacao: "Correto! Os glóbulos brancos participam da defesa contra agentes infecciosos." }
     ]
   },
   {
     titulo: "As plaquetas",
     texto: "O que as plaquetas ajudam a fazer?",
     opcoes: [
       { texto: "Ajudar a estancar sangramentos", pontos: 100, explicacao: "Isso mesmo! Elas participam da formação de coágulos." },
       { texto: "Levar oxigênio aos músculos", pontos: 50, explicacao: "Quem transporta a maior parte do oxigênio são as hemácias." },
       { texto: "Transformar o sangue em ar", pontos: -25, explicacao: "O sangue não se transforma em ar." }
     ]
   },
   {
     titulo: "O plasma",
     texto: "O que é o plasma sanguíneo?",
     opcoes: [
       { texto: "Um tipo de osso", pontos: -25, explicacao: "O plasma é a parte líquida do sangue." },
       { texto: "A parte líquida do sangue", pontos: 100, explicacao: "Correto! O plasma transporta diversas substâncias pelo corpo." },
       { texto: "Uma válvula do coração", pontos: -25, explicacao: "As válvulas ficam no coração e ajudam a orientar o fluxo do sangue." }
     ]
   },
   {
     titulo: "As artérias",
     texto: "Em geral, para onde as artérias levam o sangue?",
     opcoes: [
       { texto: "Sempre para os pulmões", pontos: 50, explicacao: "A artéria pulmonar leva sangue aos pulmões, mas existem outras artérias." },
       { texto: "Para fora do coração", pontos: 100, explicacao: "Correto! Artérias levam o sangue para longe do coração." },
       { texto: "Sempre para dentro do coração", pontos: -25, explicacao: "Os vasos que trazem o sangue de volta ao coração são as veias." }
     ]
   },
   {
     titulo: "As veias",
     texto: "Qual é a função geral das veias?",
     opcoes: [
       { texto: "Levar o sangue de volta ao coração", pontos: 100, explicacao: "Isso mesmo! As veias retornam o sangue ao coração." },
       { texto: "Produzir células sanguíneas", pontos: 50, explicacao: "As células sanguíneas são produzidas principalmente na medula óssea." },
       { texto: "Fazer o ar chegar aos pulmões", pontos: -25, explicacao: "Essa é uma função do sistema respiratório." }
     ]
   },
   {
     titulo: "Os capilares",
     texto: "O que acontece principalmente nos capilares?",
     opcoes: [
       { texto: "O coração bate mais forte", pontos: 50, explicacao: "Os batimentos acontecem no coração." },
       { texto: "O sangue é produzido", pontos: -25, explicacao: "A produção de células sanguíneas ocorre principalmente na medula óssea." },
       { texto: "Há trocas de gases e nutrientes com os tecidos", pontos: 100, explicacao: "Correto! As paredes finas dos capilares permitem essas trocas." }
     ]
   },
   {
     titulo: "As câmaras cardíacas",
     texto: "Quantas cavidades tem o coração humano?",
     opcoes: [
       { texto: "Duas", pontos: 50, explicacao: "O coração possui duas metades, mas cada uma tem duas cavidades." },
       { texto: "Quatro", pontos: 100, explicacao: "Correto! São dois átrios e dois ventrículos." },
       { texto: "Seis", pontos: -25, explicacao: "O coração humano tem quatro cavidades." }
     ]
   },
   {
     titulo: "Os átrios",
     texto: "Qual é a função dos átrios?",
     opcoes: [
       { texto: "Receber o sangue que chega ao coração", pontos: 100, explicacao: "Muito bem! O sangue chega primeiro aos átrios." },
       { texto: "Produzir o oxigênio do sangue", pontos: -25, explicacao: "O oxigênio entra no sangue nos pulmões." },
       { texto: "Filtrar resíduos como os rins", pontos: 50, explicacao: "Os rins filtram o sangue; os átrios recebem o sangue no coração." }
     ]
   },
   {
     titulo: "Os ventrículos",
     texto: "O que os ventrículos fazem?",
     opcoes: [
       { texto: "Recebem o ar da traqueia", pontos: -25, explicacao: "A traqueia pertence ao sistema respiratório." },
       { texto: "Bombeiam o sangue para fora do coração", pontos: 100, explicacao: "Correto! O ventrículo direito bombeia sangue aos pulmões e o esquerdo ao corpo." },
       { texto: "Produzem as plaquetas", pontos: 50, explicacao: "As plaquetas são formadas na medula óssea." }
     ]
   },
   {
     titulo: "O lado direito",
     texto: "Para onde o lado direito do coração bombeia o sangue?",
     opcoes: [
       { texto: "Para o cérebro diretamente", pontos: 50, explicacao: "O cérebro recebe sangue pela circulação do corpo." },
       { texto: "Para o estômago", pontos: -25, explicacao: "O sangue chega ao estômago pela circulação sistêmica." },
       { texto: "Para os pulmões", pontos: 100, explicacao: "Correto! O ventrículo direito envia o sangue aos pulmões." }
     ]
   },
   {
     titulo: "O lado esquerdo",
     texto: "Para onde o lado esquerdo do coração bombeia o sangue?",
     opcoes: [
       { texto: "Para o restante do corpo", pontos: 100, explicacao: "Isso mesmo! O ventrículo esquerdo impulsiona sangue para o corpo." },
       { texto: "Somente para os pulmões", pontos: 50, explicacao: "O lado direito é que envia sangue aos pulmões." },
       { texto: "Para dentro do estômago apenas", pontos: -25, explicacao: "O sangue é distribuído por todo o organismo." }
     ]
   },
   {
     titulo: "A artéria pulmonar",
     texto: "Que tipo de sangue a artéria pulmonar transporta?",
     opcoes: [
       { texto: "Sangue sem nenhuma célula", pontos: -25, explicacao: "O sangue contém células, plasma e outras substâncias." },
       { texto: "Sangue com pouco oxigênio em direção aos pulmões", pontos: 100, explicacao: "Correto! É uma exceção à ideia comum sobre artérias e oxigênio." },
       { texto: "Somente sangue com muito oxigênio", pontos: 50, explicacao: "Esse é o sangue que retorna dos pulmões pelas veias pulmonares." }
     ]
   },
   {
     titulo: "As veias pulmonares",
     texto: "O que as veias pulmonares levam ao coração?",
     opcoes: [
       { texto: "Sangue com pouco oxigênio vindo do corpo", pontos: 50, explicacao: "Esse sangue retorna ao coração pelas veias cavas." },
       { texto: "Ar para os pulmões", pontos: -25, explicacao: "O ar circula pelas vias respiratórias, não pelas veias." },
       { texto: "Sangue rico em oxigênio vindo dos pulmões", pontos: 100, explicacao: "Correto! As veias pulmonares chegam ao átrio esquerdo." }
     ]
   },
   {
     titulo: "A aorta",
     texto: "Qual é a função da aorta?",
     opcoes: [
       { texto: "Levar sangue do coração para o corpo", pontos: 100, explicacao: "Correto! A aorta é a maior artéria do corpo." },
       { texto: "Levar ar para a traqueia", pontos: -25, explicacao: "A aorta é um vaso sanguíneo." },
       { texto: "Levar sangue dos pulmões ao átrio esquerdo", pontos: 50, explicacao: "Essa função é das veias pulmonares." }
     ]
   },
   {
     titulo: "As veias cavas",
     texto: "O que as veias cavas fazem?",
     opcoes: [
       { texto: "Levam sangue do coração aos pulmões", pontos: 50, explicacao: "A artéria pulmonar leva sangue do coração aos pulmões." },
       { texto: "Trazem sangue do corpo para o átrio direito", pontos: 100, explicacao: "Correto! As veias cavas retornam sangue ao coração." },
       { texto: "Levam oxigênio diretamente ao estômago", pontos: -25, explicacao: "O sangue circula por vasos e distribui oxigênio aos tecidos." }
     ]
   },
   {
     titulo: "Circulação pulmonar",
     texto: "Qual caminho descreve a circulação pulmonar?",
     opcoes: [
       { texto: "Coração, pulmões e coração", pontos: 100, explicacao: "Isso mesmo! O sangue vai aos pulmões para realizar trocas gasosas e retorna." },
       { texto: "Coração, pernas e cérebro apenas", pontos: 50, explicacao: "Esses órgãos participam da circulação sistêmica." },
       { texto: "Estômago, rins e intestino, sem passar pelo coração", pontos: -25, explicacao: "A circulação depende do bombeamento do coração." }
     ]
   },
   {
     titulo: "Circulação sistêmica",
     texto: "Qual caminho descreve a circulação sistêmica?",
     opcoes: [
       { texto: "Pulmões, traqueia e nariz", pontos: -25, explicacao: "Esse caminho está relacionado à respiração." },
       { texto: "Coração, corpo e coração", pontos: 100, explicacao: "Correto! O sangue entrega substâncias aos tecidos e retorna ao coração." },
       { texto: "Somente o lado direito do coração", pontos: 50, explicacao: "A circulação sistêmica começa quando o ventrículo esquerdo bombeia sangue para o corpo." }
     ]
   },
   {
     titulo: "O oxigênio",
     texto: "Por que as células precisam de oxigênio?",
     opcoes: [
       { texto: "Para produzir energia a partir dos nutrientes", pontos: 100, explicacao: "Correto! A maioria das células usa oxigênio na respiração celular." },
       { texto: "Para transformar ossos em sangue", pontos: -25, explicacao: "O oxigênio não transforma ossos em sangue." },
       { texto: "Para substituir toda a água do corpo", pontos: 50, explicacao: "O corpo precisa de água e oxigênio para funções diferentes." }
     ]
   },
   {
     titulo: "O gás carbônico",
     texto: "O que acontece com grande parte do gás carbônico produzido pelo corpo?",
     opcoes: [
       { texto: "É guardado para sempre no coração", pontos: -25, explicacao: "O corpo precisa eliminar o excesso de gás carbônico." },
       { texto: "É levado pelo sangue aos pulmões para ser eliminado", pontos: 100, explicacao: "Correto! O gás carbônico passa para os pulmões e sai na expiração." },
       { texto: "Vira osso imediatamente", pontos: -25, explicacao: "O gás carbônico não se transforma diretamente em osso." }
     ]
   },
   {
     titulo: "Os pulmões",
     texto: "Qual é o papel dos pulmões na circulação?",
     opcoes: [
       { texto: "Fabricar todas as células do sangue", pontos: 50, explicacao: "As células sanguíneas são produzidas principalmente na medula óssea." },
       { texto: "Bombear sangue para o corpo", pontos: -25, explicacao: "Quem bombeia o sangue é o coração." },
       { texto: "Permitir que o sangue receba oxigênio e elimine gás carbônico", pontos: 100, explicacao: "Muito bem! As trocas gasosas acontecem nos pulmões." }
     ]
   },
   {
     titulo: "Os alvéolos",
     texto: "Onde ocorrem as trocas gasosas nos pulmões?",
     opcoes: [
       { texto: "Nos alvéolos pulmonares", pontos: 100, explicacao: "Correto! Os alvéolos têm paredes finas e ficam próximos dos capilares." },
       { texto: "Nas válvulas cardíacas", pontos: -25, explicacao: "As válvulas cardíacas controlam o fluxo do sangue." },
       { texto: "Nos ossos das pernas", pontos: -25, explicacao: "As trocas gasosas acontecem nos pulmões." }
     ]
   },
   {
     titulo: "Os batimentos",
     texto: "O que representa um batimento cardíaco?",
     opcoes: [
       { texto: "Uma respiração completa", pontos: 50, explicacao: "Respiração e batimento cardíaco são processos diferentes." },
       { texto: "A atividade de contração e relaxamento do coração", pontos: 100, explicacao: "Correto! O ciclo cardíaco envolve fases de contração e relaxamento." },
       { texto: "O movimento dos alimentos no estômago", pontos: -25, explicacao: "A digestão é uma função diferente." }
     ]
   },
   {
     titulo: "Sístole",
     texto: "O que acontece durante a sístole ventricular?",
     opcoes: [
       { texto: "Os ventrículos se contraem e ejetam sangue", pontos: 100, explicacao: "Correto! A contração dos ventrículos impulsiona o sangue para as artérias." },
       { texto: "Os pulmões param de funcionar", pontos: -25, explicacao: "A sístole é uma fase do ciclo cardíaco." },
       { texto: "O sangue deixa de circular", pontos: 50, explicacao: "O sangue continua circulando durante o ciclo cardíaco." }
     ]
   },
   {
     titulo: "Diástole",
     texto: "O que acontece durante a diástole?",
     opcoes: [
       { texto: "O coração fica permanentemente parado", pontos: -25, explicacao: "A diástole é uma fase normal do ciclo, não uma parada cardíaca." },
       { texto: "O coração relaxa e suas cavidades se enchem de sangue", pontos: 100, explicacao: "Correto! O relaxamento permite o enchimento das cavidades." },
       { texto: "As artérias se transformam em veias", pontos: -25, explicacao: "Artérias e veias são tipos diferentes de vasos." }
     ]
   },
   {
     titulo: "O pulso",
     texto: "O que você percebe quando mede o pulso no punho?",
     opcoes: [
       { texto: "A passagem de ondas de pressão nas artérias", pontos: 100, explicacao: "Correto! Essas ondas estão relacionadas aos batimentos do coração." },
       { texto: "O ar entrando nos pulmões", pontos: 50, explicacao: "A respiração pode mudar junto com o pulso, mas são medidas diferentes." },
       { texto: "A digestão dos alimentos", pontos: -25, explicacao: "O pulso está ligado à circulação sanguínea." }
     ]
   },
   {
     titulo: "A cor do sangue",
     texto: "Qual afirmação sobre a cor do sangue humano está correta?",
     opcoes: [
       { texto: "O sangue dentro das veias é azul", pontos: -25, explicacao: "O sangue humano é vermelho; a aparência azulada das veias vem de efeitos da luz na pele." },
       { texto: "O sangue é sempre verde", pontos: -25, explicacao: "O sangue humano é vermelho." },
       { texto: "O sangue é vermelho, mas pode ter tons diferentes conforme a oxigenação", pontos: 100, explicacao: "Correto! O sangue com mais oxigênio tende a ser vermelho mais vivo." }
     ]
   },
   {
     titulo: "O sangue",
     texto: "Como o sangue é classificado no corpo humano?",
     opcoes: [
       { texto: "Como um tecido líquido", pontos: 100, explicacao: "Isso mesmo! O sangue é um tecido formado por plasma e elementos celulares." },
       { texto: "Como um osso líquido", pontos: -25, explicacao: "O sangue é um tecido, mas não é osso." },
       { texto: "Como um órgão sólido", pontos: 50, explicacao: "O sangue é um tecido líquido, não um órgão sólido." }
     ]
   },
   {
     titulo: "De onde vem o oxigênio?",
     texto: "Como o oxigênio entra no sangue?",
     opcoes: [
       { texto: "Pelos alimentos diretamente para as veias", pontos: 50, explicacao: "Os alimentos fornecem nutrientes, mas o oxigênio vem do ar respirado." },
       { texto: "Pelas trocas gasosas nos pulmões", pontos: 100, explicacao: "Correto! O oxigênio passa dos alvéolos para o sangue." },
       { texto: "É fabricado pelo coração", pontos: -25, explicacao: "O coração bombeia sangue; não fabrica oxigênio." }
     ]
   },
   {
     titulo: "Os nutrientes",
     texto: "Como os nutrientes chegam às células do corpo?",
     opcoes: [
       { texto: "São transportados pelo sangue", pontos: 100, explicacao: "Correto! O sangue distribui nutrientes absorvidos pelo sistema digestório." },
       { texto: "São transportados somente pelo ar", pontos: 50, explicacao: "O ar fornece oxigênio; muitos nutrientes são levados pelo sangue." },
       { texto: "São produzidos pelas artérias", pontos: -25, explicacao: "As artérias transportam sangue, não produzem nutrientes." }
     ]
   },
   {
     titulo: "Os hormônios",
     texto: "Qual é uma função do sangue relacionada aos hormônios?",
     opcoes: [
       { texto: "Destruir todos os hormônios", pontos: -25, explicacao: "Os hormônios são mensageiros químicos importantes." },
       { texto: "Transportar hormônios até órgãos e tecidos", pontos: 100, explicacao: "Isso mesmo! O sangue ajuda a levar hormônios pelo organismo." },
       { texto: "Transformar hormônios em ossos", pontos: -25, explicacao: "Hormônios não se transformam em ossos." }
     ]
   },
   {
     titulo: "A temperatura",
     texto: "Como a circulação ajuda a regular a temperatura corporal?",
     opcoes: [
       { texto: "Distribuindo calor pelo corpo e ajustando o fluxo de sangue na pele", pontos: 100, explicacao: "Correto! Os vasos sanguíneos ajudam o corpo a trocar calor com o ambiente." },
       { texto: "Parando todos os batimentos", pontos: -25, explicacao: "O coração precisa continuar bombeando sangue." },
       { texto: "Transformando o sangue em gelo", pontos: -25, explicacao: "O sangue permanece líquido nas condições normais do corpo." }
     ]
   },
   {
     titulo: "A coagulação",
     texto: "Por que a coagulação do sangue é importante?",
     opcoes: [
       { texto: "Para ajudar a reduzir a perda de sangue em ferimentos", pontos: 100, explicacao: "Correto! A coagulação ajuda a controlar o sangramento." },
       { texto: "Para impedir o coração de bater", pontos: -25, explicacao: "A coagulação normal ajuda a estancar sangramentos." },
       { texto: "Para levar ar às células", pontos: -25, explicacao: "O oxigênio é transportado pelo sangue, principalmente ligado à hemoglobina." }
     ]
   },
   {
     titulo: "O músculo cardíaco",
     texto: "Como se chama o tecido muscular do coração?",
     opcoes: [
       { texto: "Epiderme", pontos: -25, explicacao: "A epiderme é a camada mais externa da pele." },
       { texto: "Miocárdio", pontos: 100, explicacao: "Correto! O miocárdio é o músculo responsável pela contração do coração." },
       { texto: "Cartilagem", pontos: 50, explicacao: "O coração é formado por vários tecidos, incluindo o músculo cardíaco chamado miocárdio." }
     ]
   },
   {
     titulo: "O septo cardíaco",
     texto: "Qual é a função do septo do coração?",
     opcoes: [
       { texto: "Separar o lado direito do lado esquerdo do coração", pontos: 100, explicacao: "Correto! O septo separa as duas metades do coração." },
       { texto: "Produzir oxigênio", pontos: -25, explicacao: "O oxigênio vem do ar e passa para o sangue nos pulmões." },
       { texto: "Ligar o coração ao estômago", pontos: -25, explicacao: "O septo é uma estrutura interna do coração." }
     ]
   },
   {
     titulo: "As válvulas",
     texto: "Qual é a função das válvulas cardíacas?",
     opcoes: [
       { texto: "Impedir que o sangue volte na direção errada", pontos: 100, explicacao: "Muito bem! As válvulas ajudam a manter o fluxo em uma direção." },
       { texto: "Produzir células brancas", pontos: 50, explicacao: "As células sanguíneas são produzidas principalmente na medula óssea." },
       { texto: "Permitir a entrada de ar no coração", pontos: -25, explicacao: "O coração bombeia sangue; o ar não circula dentro dele." }
     ]
   },
   {
     titulo: "A válvula tricúspide",
     texto: "Onde fica a válvula tricúspide?",
     opcoes: [
       { texto: "Entre o átrio direito e o ventrículo direito", pontos: 100, explicacao: "Correto! Ela ajuda a impedir o refluxo do sangue para o átrio direito." },
       { texto: "Entre o átrio esquerdo e o ventrículo esquerdo", pontos: 50, explicacao: "Essa posição é da válvula mitral." },
       { texto: "Dentro dos pulmões", pontos: -25, explicacao: "A válvula tricúspide fica no coração." }
     ]
   },
   {
     titulo: "A válvula mitral",
     texto: "Onde fica a válvula mitral?",
     opcoes: [
       { texto: "Entre os dois pulmões", pontos: -25, explicacao: "A válvula mitral fica no coração." },
       { texto: "Entre o átrio esquerdo e o ventrículo esquerdo", pontos: 100, explicacao: "Correto! A válvula mitral também é chamada de bicúspide." },
       { texto: "Entre o átrio direito e o ventrículo direito", pontos: 50, explicacao: "Essa posição é da válvula tricúspide." }
     ]
   },
   {
     titulo: "A válvula pulmonar",
     texto: "Onde fica a válvula pulmonar?",
     opcoes: [
       { texto: "Na saída do ventrículo direito, em direção à artéria pulmonar", pontos: 100, explicacao: "Correto! Ela ajuda a impedir que o sangue retorne ao ventrículo direito." },
       { texto: "Na saída do ventrículo esquerdo, em direção à aorta", pontos: 50, explicacao: "Essa é a posição da válvula aórtica." },
       { texto: "Dentro do estômago", pontos: -25, explicacao: "As válvulas cardíacas ficam no coração." }
     ]
   },
   {
     titulo: "A válvula aórtica",
     texto: "Onde fica a válvula aórtica?",
     opcoes: [
       { texto: "Entre o átrio direito e o ventrículo direito", pontos: 50, explicacao: "Essa é a posição da válvula tricúspide." },
       { texto: "Na saída do ventrículo esquerdo, em direção à aorta", pontos: 100, explicacao: "Correto! Ela controla a passagem de sangue para a aorta." },
       { texto: "Na entrada dos pulmões", pontos: -25, explicacao: "A válvula aórtica fica na saída do ventrículo esquerdo." }
     ]
   },
   {
     titulo: "Frequência cardíaca",
     texto: "O que significa frequência cardíaca?",
     opcoes: [
       { texto: "A quantidade de respirações por dia", pontos: 50, explicacao: "Isso se refere à frequência respiratória." },
       { texto: "A quantidade de batimentos do coração por minuto", pontos: 100, explicacao: "Correto! A frequência cardíaca é normalmente expressa em batimentos por minuto." },
       { texto: "A quantidade de ossos do corpo", pontos: -25, explicacao: "A frequência cardíaca mede os batimentos do coração." }
     ]
   },
   {
     titulo: "Exercício físico",
     texto: "Por que o coração costuma bater mais rápido durante exercícios?",
     opcoes: [
       { texto: "Porque os músculos precisam de mais oxigênio e nutrientes", pontos: 100, explicacao: "Isso mesmo! O coração aumenta o fluxo de sangue para atender à demanda." },
       { texto: "Porque o sangue deixa de circular", pontos: -25, explicacao: "Durante o exercício, a circulação continua e geralmente aumenta." },
       { texto: "Porque os pulmões param de funcionar", pontos: -25, explicacao: "Os pulmões continuam trabalhando durante o exercício." }
     ]
   },
   {
     titulo: "Cuidar do coração",
     texto: "Qual hábito ajuda a manter o coração saudável?",
     opcoes: [
       { texto: "Nunca se movimentar", pontos: -25, explicacao: "Movimentar-se regularmente, respeitando as condições individuais, ajuda a saúde cardiovascular." },
       { texto: "Fazer atividade física adequada regularmente", pontos: 100, explicacao: "Correto! Atividade física regular é um hábito importante para a saúde." },
       { texto: "Dormir muito pouco sempre", pontos: -25, explicacao: "Sono adequado também faz parte dos hábitos saudáveis." }
     ]
   },
   {
     titulo: "O cigarro",
     texto: "Como fumar pode afetar o sistema cardiovascular?",
     opcoes: [
       { texto: "Pode prejudicar os vasos sanguíneos e aumentar riscos cardiovasculares", pontos: 100, explicacao: "Correto! Fumar aumenta o risco de doenças do coração e dos vasos." },
       { texto: "Fortalece sempre as artérias", pontos: -25, explicacao: "Fumar não fortalece as artérias; pode danificá-las." },
       { texto: "Não tem nenhum efeito na circulação", pontos: -25, explicacao: "Fumar afeta a saúde cardiovascular." }
     ]
   },
   {
     titulo: "A água",
     texto: "Por que beber água é importante para o organismo?",
     opcoes: [
       { texto: "Porque substitui o sangue", pontos: -25, explicacao: "A água não substitui o sangue." },
       { texto: "Porque ajuda a manter o equilíbrio de líquidos do corpo", pontos: 100, explicacao: "Correto! A hidratação adequada contribui para o funcionamento do organismo." },
       { texto: "Porque faz o coração parar", pontos: -25, explicacao: "A hidratação adequada ajuda o corpo a funcionar normalmente." }
     ]
   },
   {
     titulo: "Pressão arterial",
     texto: "O que é a pressão arterial?",
     opcoes: [
       { texto: "A força que o sangue exerce contra as paredes das artérias", pontos: 100, explicacao: "Correto! A pressão arterial é medida com valores sistólico e diastólico." },
       { texto: "A temperatura dos pulmões", pontos: -25, explicacao: "Pressão arterial não é uma medida de temperatura." },
       { texto: "A quantidade de ossos do corpo", pontos: -25, explicacao: "A pressão arterial está relacionada à circulação do sangue." }
     ]
   },
   {
     titulo: "Alimentação saudável",
     texto: "Qual escolha costuma ajudar na saúde cardiovascular?",
     opcoes: [
       { texto: "Ter uma alimentação equilibrada e variada", pontos: 100, explicacao: "Correto! Uma alimentação equilibrada contribui para a saúde do coração." },
       { texto: "Comer apenas um tipo de alimento", pontos: -25, explicacao: "O organismo precisa de uma variedade de nutrientes." },
       { texto: "Evitar toda e qualquer atividade física", pontos: -25, explicacao: "A atividade física adequada é benéfica para muitas pessoas." }
     ]
   },
   {
     titulo: "A circulação",
     texto: "Como funciona a circulação do sangue no corpo?",
     opcoes: [
       { texto: "O sangue circula continuamente em um sistema de vasos impulsionado pelo coração", pontos: 100, explicacao: "Muito bem! O coração e os vasos mantêm o sangue em circulação." },
       { texto: "O sangue passa uma única vez e desaparece", pontos: -25, explicacao: "O sangue circula continuamente pelo organismo." },
       { texto: "O sangue circula apenas nos braços", pontos: -25, explicacao: "O sangue chega aos tecidos de todo o corpo." }
     ]
   },
   {
     titulo: "O coração e o cérebro",
     texto: "Por que o cérebro precisa receber sangue continuamente?",
     opcoes: [
       { texto: "Para receber oxigênio e glicose necessários ao seu funcionamento", pontos: 100, explicacao: "Correto! O cérebro precisa de fornecimento contínuo de oxigênio e nutrientes." },
       { texto: "Para transformar sangue em ar", pontos: -25, explicacao: "O sangue leva substâncias importantes ao cérebro." },
       { texto: "Para produzir todos os ossos", pontos: -25, explicacao: "O cérebro não produz todos os ossos do corpo." }
     ]
   },
   {
     titulo: "O sangue e os rins",
     texto: "Qual é uma função dos rins relacionada ao sangue?",
     opcoes: [
       { texto: "Filtrar o sangue e ajudar a eliminar resíduos pela urina", pontos: 100, explicacao: "Correto! Os rins ajudam a regular líquidos e remover resíduos." },
       { texto: "Bombear sangue para os pulmões", pontos: 50, explicacao: "Essa é uma função do coração." },
       { texto: "Transportar o ar até a traqueia", pontos: -25, explicacao: "O transporte do ar acontece no sistema respiratório." }
     ]
   },
   {
     titulo: "O sangue e o intestino",
     texto: "Depois da digestão, como muitos nutrientes chegam ao restante do corpo?",
     opcoes: [
       { texto: "São absorvidos no intestino e transportados pelo sangue", pontos: 100, explicacao: "Correto! Muitos nutrientes atravessam a parede intestinal e entram na circulação." },
       { texto: "São enviados diretamente pelos ossos", pontos: -25, explicacao: "Os ossos não transportam diretamente os nutrientes digeridos." },
       { texto: "São transformados em ar nos pulmões", pontos: -25, explicacao: "Os nutrientes são absorvidos e distribuídos pelo organismo." }
     ]
   },
   {
     titulo: "O sangue nas pernas",
     texto: "O que ajuda o sangue venoso das pernas a retornar ao coração?",
     opcoes: [
       { texto: "As contrações dos músculos e as válvulas das veias", pontos: 100, explicacao: "Correto! Os músculos ajudam a empurrar o sangue, e as válvulas reduzem o refluxo." },
       { texto: "A gravidade sempre empurra o sangue para cima", pontos: -25, explicacao: "A gravidade dificulta o retorno do sangue das pernas; músculos e válvulas ajudam." },
       { texto: "O movimento dos pulmões sozinho", pontos: 50, explicacao: "A respiração pode contribuir, mas músculos e válvulas das veias são importantes." }
     ]
   },
   {
     titulo: "Os vasos sanguíneos",
     texto: "Quais são os três principais tipos de vasos sanguíneos?",
     opcoes: [
       { texto: "Artérias, veias e capilares", pontos: 100, explicacao: "Correto! Esses três tipos formam a rede de vasos do sistema circulatório." },
       { texto: "Nervos, músculos e ossos", pontos: -25, explicacao: "Essas estruturas não são os três tipos de vasos sanguíneos." },
       { texto: "Traqueia, brônquios e alvéolos", pontos: 50, explicacao: "Essas estruturas pertencem ao sistema respiratório." }
     ]
   },
   {
     titulo: "A parede dos capilares",
     texto: "Por que as paredes dos capilares são muito finas?",
     opcoes: [
       { texto: "Para facilitar as trocas entre o sangue e os tecidos", pontos: 100, explicacao: "Correto! A parede fina facilita a passagem de gases e outras substâncias." },
       { texto: "Para impedir todas as trocas", pontos: -25, explicacao: "Os capilares são justamente locais importantes de troca." },
       { texto: "Para armazenar os ossos", pontos: -25, explicacao: "Os capilares são vasos sanguíneos muito pequenos." }
     ]
   },
   {
     titulo: "O coração em repouso",
     texto: "A frequência cardíaca pode mudar de uma pessoa para outra?",
     opcoes: [
       { texto: "Sim, pode variar conforme idade, atividade e outros fatores", pontos: 100, explicacao: "Correto! A frequência varia entre pessoas e conforme a situação." },
       { texto: "Não, todas as pessoas têm exatamente a mesma frequência", pontos: -25, explicacao: "A frequência cardíaca não é igual para todas as pessoas." },
       { texto: "Só muda quando a pessoa está dormindo", pontos: 50, explicacao: "Ela pode mudar durante repouso, sono, exercício, emoções e outras situações." }
     ]
   },
   {
     titulo: "O coração é um músculo",
     texto: "Por que o coração é considerado um órgão muscular?",
     opcoes: [
       { texto: "Porque seu músculo se contrai para bombear sangue", pontos: 100, explicacao: "Correto! O músculo cardíaco realiza contrações involuntárias." },
       { texto: "Porque ele movimenta os braços diretamente", pontos: 50, explicacao: "Os músculos esqueléticos movimentam os braços; o coração bombeia sangue." },
       { texto: "Porque é feito apenas de osso", pontos: -25, explicacao: "O coração não é feito apenas de osso." }
     ]
   },
   {
     titulo: "A circulação completa",
     texto: "Por que dizemos que a circulação humana é dupla?",
     opcoes: [
       { texto: "Porque o sangue passa pelo coração em dois circuitos: pulmonar e sistêmico", pontos: 100, explicacao: "Correto! A circulação humana inclui o circuito pulmonar e o sistêmico." },
       { texto: "Porque temos dois corações", pontos: -25, explicacao: "Os seres humanos têm um coração com quatro cavidades." },
       { texto: "Porque o sangue só circula duas vezes na vida", pontos: -25, explicacao: "A circulação é contínua, não acontece apenas duas vezes." }
     ]
   }
 ];
 
 /* Sorteia 5 perguntas sem repetição na mesma partida */
 function embaralhar(lista) {
   const copia = [...lista];
   for (let i = copia.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [copia[i], copia[j]] = [copia[j], copia[i]];
   }
   return copia;
 }
 
 function selecionarPerguntas() {
   const posicoes = [350, 790, 1250, 1690, 2020];
   return embaralhar(bancoPerguntas)
     .slice(0, 5)
     .map((pergunta, i) => ({
       ...pergunta,
       x: posicoes[i],
       fase: i + 1
     }));
 }
 
 /* =====================================================
    JOGADOR E ESTADO DO JOGO
    ===================================================== */
 
 function criarJogador() {
   return {
     x: 70,
     y: CHAO - 40,
     w: 34,
     h: 34,
     vx: 0,
     vy: 0,
     velocidade: 4,
     forcaPulo: -12,
     noChao: true,
     cor: "#e63946"
   };
 }
 
 function prepararMundo() {
   jogador = criarJogador();
   cameraX = 0;
   desafioAtual = 0;
   checkpoint = -1;
   pontuacao = 0;
   vidas = 3;
   perguntaRespondida = false;
   atualizarPainel();
 }
 
 function iniciar() {
   nomeAtual = nomeInput && nomeInput.value.trim()
     ? nomeInput.value.trim()
     : "Jogador";
 
   desafios = selecionarPerguntas();
   prepararMundo();
   esconderTelas();
   estado = "jogando";
   atualizarPainel();
 }
 
 function esconderTelas() {
   [telaInicial, telaPergunta, telaResultado, telaRanking].forEach(tela => {
     if (tela) tela.style.display = "none";
   });
 }
 
 function mostrarTela(tela) {
   esconderTelas();
   if (tela) tela.style.display = "flex";
 }
 
 function atualizarPainel() {
   if (nomePainel) nomePainel.textContent = nomeAtual;
   if (vidasPainel) vidasPainel.textContent = vidas;
   if (pontosPainel) pontosPainel.textContent = pontuacao;
   if (fasePainel) fasePainel.textContent = Math.min(desafioAtual + 1, 5);
 }
 
 /* =====================================================
    CONTROLES
    ===================================================== */
 
 function pular() {
   if (estado !== "jogando") return;
   if (jogador.noChao) {
     jogador.vy = jogador.forcaPulo;
     jogador.noChao = false;
   }
 }
 
 function controle(direcao, pressionado) {
   teclas[direcao] = pressionado;
 }
 
 window.addEventListener("keydown", e => {
   const tecla = e.key.toLowerCase();
   if (["arrowleft", "arrowright", " ", "arrowup"].includes(tecla)) {
     e.preventDefault();
   }
 
   if (tecla === "arrowleft" || tecla === "a") teclas.esquerda = true;
   if (tecla === "arrowright" || tecla === "d") teclas.direita = true;
   if (tecla === " " || tecla === "arrowup" || tecla === "w") pular();
 });
 
 window.addEventListener("keyup", e => {
   const tecla = e.key.toLowerCase();
   if (tecla === "arrowleft" || tecla === "a") teclas.esquerda = false;
   if (tecla === "arrowright" || tecla === "d") teclas.direita = false;
 });
 
 function limparTeclas() {
   teclas.esquerda = false;
   teclas.direita = false;
 }
 
 window.addEventListener("blur", limparTeclas);
 
 function configurarBotaoToque(botao, direcao) {
   if (!botao) return;
   botao.addEventListener("pointerdown", e => {
     e.preventDefault();
     if (direcao === "pular") pular();
     else controle(direcao, true);
   });
   ["pointerup", "pointerleave", "pointercancel"].forEach(evento => {
     botao.addEventListener(evento, () => {
       if (direcao !== "pular") controle(direcao, false);
     });
   });
 }
 
 configurarBotaoToque(botaoEsquerda, "esquerda");
 configurarBotaoToque(botaoDireita, "direita");
 configurarBotaoToque(botaoPular, "pular");
 
 /* =====================================================
    ATUALIZAÇÃO E MOVIMENTAÇÃO
    ===================================================== */
 
 function atualizar() {
   if (estado !== "jogando") return;
 
   jogador.vx = 0;
   if (teclas.esquerda) jogador.vx = -jogador.velocidade;
   if (teclas.direita) jogador.vx = jogador.velocidade;
 
   jogador.x += jogador.vx;
   jogador.x = Math.max(0, Math.min(MUNDO - jogador.w, jogador.x));
 
   jogador.vy += 0.55;
   jogador.y += jogador.vy;
 
   if (jogador.y + jogador.h >= CHAO) {
     jogador.y = CHAO - jogador.h;
     jogador.vy = 0;
     jogador.noChao = true;
   }
 
   cameraX = Math.max(0, Math.min(MUNDO - W, jogador.x - W * 0.35));
 
   if (desafioAtual < desafios.length) {
     const desafio = desafios[desafioAtual];
     if (jogador.x >= desafio.x) {
       abrirDesafio(desafioAtual);
     }
   }
 
   if (jogador.x >= MUNDO - 100 && desafioAtual >= desafios.length) {
     finalizar();
   }
 
   atualizarPainel();
 }
 
 /* =====================================================
    PERGUNTAS E RESPOSTAS
    ===================================================== */
 
 function abrirDesafio(indice) {
   if (estado !== "jogando") return;
 
   desafioAtual = indice;
   perguntaRespondida = false;
   estado = "pergunta";
 
   const desafio = desafios[indice];
 
   if (perguntaTitulo) {
     perguntaTitulo.textContent = `🩸 ${desafio.titulo}`;
   }
   if (perguntaTexto) perguntaTexto.textContent = desafio.texto;
   if (explicacaoEl) explicacaoEl.textContent = "";
 
   if (opcoesContainer) {
     opcoesContainer.innerHTML = "";
 
     embaralhar(desafio.opcoes).forEach(opcao => {
       const botao = document.createElement("button");
       botao.type = "button";
       botao.className = "opcao-resposta";
       botao.textContent = opcao.texto;
       botao.style.cssText =
         "display:block;width:100%;margin:8px 0;padding:12px;border:0;" +
         "border-radius:10px;cursor:pointer;font-size:16px;";
 
       botao.addEventListener("click", () => responder(opcao));
       opcoesContainer.appendChild(botao);
     });
   }
 
   mostrarTela(telaPergunta);
 }
 
 function responder(opcao) {
   if (estado !== "pergunta" || perguntaRespondida) return;
   perguntaRespondida = true;
 
   pontuacao += opcao.pontos;
   if (pontuacao < 0) pontuacao = 0;
 
   if (opcao.pontos < 0) {
     vidas--;
   }
 
   if (explicacaoEl) {
     explicacaoEl.textContent =
       `${opcao.pontos > 0 ? "Resposta registrada!" : "Ops! Tente aprender com esta resposta."} ` +
       `${opcao.pontos > 0 ? "+" : ""}${opcao.pontos} pontos. ${opcao.explicacao}`;
   }
 
   if (opcoesContainer) {
     opcoesContainer.querySelectorAll("button").forEach(botao => {
       botao.disabled = true;
       botao.style.opacity = "0.7";
     });
   }
 
   atualizarPainel();
 
   if (botaoContinuar) {
     botaoContinuar.textContent =
       vidas <= 0 || desafioAtual >= desafios.length - 1
         ? "Ver resultado"
         : "Continuar";
   }
 }
 
 function continuarJogo() {
   if (estado !== "pergunta" || !perguntaRespondida) return;
 
   if (vidas <= 0) {
     finalizar();
     return;
   }
 
   desafioAtual++;
 
   if (desafioAtual >= desafios.length) {
     estado = "jogando";
     esconderTelas();
     return;
   }
 
   // Avança o jogador para depois do ponto da pergunta anterior.
   jogador.x = Math.max(jogador.x, desafios[desafioAtual - 1].x + 70);
   estado = "jogando";
   esconderTelas();
 }
 
 /* =====================================================
    RESULTADO E RANKING
    ===================================================== */
 
 function lerRanking() {
   try {
     return JSON.parse(localStorage.getItem("rankingCoracao")) || [];
   } catch {
     return [];
   }
 }
 
 function salvarRanking(nome, pontos) {
   const ranking = lerRanking();
 
   ranking.push({
     nome,
     pontos,
     data: new Date().toLocaleDateString("pt-BR")
   });
 
   ranking.sort((a, b) => b.pontos - a.pontos);
   localStorage.setItem("rankingCoracao", JSON.stringify(ranking.slice(0, 10)));
 }
 
 function finalizar() {
   estado = "resultado";
   salvarRanking(nomeAtual, pontuacao);
 
   const respondidas = Math.min(desafioAtual + 1, desafios.length);
   const mensagem = vidas <= 0
     ? "Suas vidas acabaram! Continue estudando e tente novamente."
     : "Parabéns! Você completou a aventura pelo coração!";
 
   if (resultadoTexto) {
     resultadoTexto.textContent =
       `${mensagem} Você fez ${pontuacao} pontos e respondeu aproximadamente ` +
       `${respondidas} pergunta(s) nesta partida.`;
   }
 
   mostrarTela(telaResultado);
   atualizarPainel();
 }
 
 function mostrarRanking() {
   const ranking = lerRanking();
 
   if (rankingLista) {
     rankingLista.innerHTML = "";
 
     if (ranking.length === 0) {
       rankingLista.textContent = "Ainda não há pontuações salvas.";
     } else {
       ranking.forEach((item, indice) => {
         const linha = document.createElement("li");
         linha.textContent =
           `${indice + 1}. ${item.nome} — ${item.pontos} pontos (${item.data})`;
         rankingLista.appendChild(linha);
       });
     }
   }
 
   mostrarTela(telaRanking);
   estado = "ranking";
 }
 
 function voltarInicio() {
   estado = "inicio";
   mostrarTela(telaInicial);
 }
 
 /* =====================================================
    DESENHO DO JOGO
    ===================================================== */
 
 function desenharFundo() {
   const gradiente = ctx.createLinearGradient(0, 0, 0, H);
   gradiente.addColorStop(0, "#dff6ff");
   gradiente.addColorStop(1, "#f8fcff");
   ctx.fillStyle = gradiente;
   ctx.fillRect(0, 0, W, H);
 
   // Vasos sanguíneos decorativos
   ctx.strokeStyle = "rgba(230, 57, 70, 0.14)";
   ctx.lineWidth = 16;
   ctx.beginPath();
   ctx.moveTo(0 - cameraX * 0.15, 90);
   ctx.bezierCurveTo(180, 40, 260, 150, 430, 90);
   ctx.stroke();
 
   ctx.strokeStyle = "rgba(40, 100, 200, 0.13)";
   ctx.lineWidth = 12;
   ctx.beginPath();
   ctx.moveTo(300 - cameraX * 0.15, 190);
   ctx.bezierCurveTo(450, 250, 540, 150, 700, 210);
   ctx.stroke();
 }
 
 function desenharChao() {
   ctx.fillStyle = "#d7f3d0";
   ctx.fillRect(0, CHAO, W, H - CHAO);
 
   ctx.fillStyle = "#75c66b";
   ctx.fillRect(0, CHAO, W, 7);
 
   for (let x = 0; x < W; x += 45) {
     ctx.fillStyle = "#9bdd91";
     ctx.fillRect(x, CHAO + 18, 22, 4);
   }
 }
 
 function desenharJogador() {
   const x = jogador.x - cameraX;
   const y = jogador.y;
 
   // Hemácia estilizada
   ctx.save();
   ctx.translate(x + jogador.w / 2, y + jogador.h / 2);
 
   ctx.fillStyle = "#e63946";
   ctx.beginPath();
   ctx.ellipse(0, 0, 18, 13, -0.15, 0, Math.PI * 2);
   ctx.fill();
 
   ctx.fillStyle = "#b91c35";
   ctx.beginPath();
   ctx.ellipse(0, 0, 9, 6, -0.15, 0, Math.PI * 2);
   ctx.fill();
 
   ctx.fillStyle = "#fff";
   ctx.beginPath();
   ctx.arc(-5, -3, 2.5, 0, Math.PI * 2);
   ctx.arc(5, -3, 2.5, 0, Math.PI * 2);
   ctx.fill();
 
   ctx.strokeStyle = "#6d1020";
   ctx.lineWidth = 1.5;
   ctx.beginPath();
   ctx.arc(0, 2, 5, 0.2, Math.PI - 0.2);
   ctx.stroke();
 
   ctx.restore();
 }
 
 function desenharDesafios() {
   desafios.forEach((desafio, i) => {
     if (i < desafioAtual) return;
 
     const x = desafio.x - cameraX;
     if (x < -40 || x > W + 40) return;
 
     ctx.fillStyle = "#ffcf56";
     ctx.beginPath();
     ctx.arc(x, CHAO - 20, 17, 0, Math.PI * 2);
     ctx.fill();
 
     ctx.fillStyle = "#684500";
     ctx.font = "bold 17px Arial";
     ctx.textAlign = "center";
     ctx.fillText("?", x, CHAO - 14);
 
     ctx.fillStyle = "#27445c";
     ctx.font = "12px Arial";
     ctx.fillText("Pergunta", x, CHAO - 47);
   });
 }
 
 function desenharProgresso() {
   ctx.fillStyle = "rgba(255,255,255,0.85)";
   ctx.fillRect(12, 12, 190, 38);
 
   ctx.fillStyle = "#234";
   ctx.font = "bold 14px Arial";
   ctx.textAlign = "left";
   ctx.fillText(`Fase ${Math.min(desafioAtual + 1, 5)} de 5`, 22, 36);
 
   ctx.fillStyle = "#e63946";
   ctx.fillRect(105, 23, 82 * (desafioAtual / 5), 10);
 
   ctx.strokeStyle = "#e63946";
   ctx.strokeRect(105, 23, 82, 10);
 }
 
 function desenhar() {
   desenharFundo();
   desenharChao();
   desenharDesafios();
   desenharJogador();
   desenharProgresso();
 
   if (estado === "inicio") {
     ctx.fillStyle = "rgba(20, 45, 70, 0.75)";
     ctx.fillRect(0, 0, W, H);
     ctx.fillStyle = "#fff";
     ctx.textAlign = "center";
     ctx.font = "bold 30px Arial";
     ctx.fillText("AVENTURA PELO CORAÇÃO", W / 2, H / 2 - 15);
     ctx.font = "17px Arial";
     ctx.fillText("Aprenda sobre o sistema cardiovascular!", W / 2, H / 2 + 22);
   }
 }
 
 /* =====================================================
    CICLO PRINCIPAL
    ===================================================== */
 
 function loop() {
   if (estado === "jogando") atualizar();
   desenhar();
   requestAnimationFrame(loop);
 }
 
 /* =====================================================
    LIGAÇÃO DOS BOTÕES DO HTML
    ===================================================== */
 
 if (botaoJogar) {
   botaoJogar.addEventListener("click", iniciar);
 }
 
 if (botaoContinuar) {
   botaoContinuar.addEventListener("click", continuarJogo);
 }
 
 if (botaoReiniciar) {
   botaoReiniciar.addEventListener("click", iniciar);
 }
 
 if (botaoRanking) {
   botaoRanking.addEventListener("click", mostrarRanking);
 }
 
 if (botaoFecharRanking) {
   botaoFecharRanking.addEventListener("click", voltarInicio);
 }
 
 /* Estado inicial */
 jogador = criarJogador();
 desafios = selecionarPerguntas();
 mostrarTela(telaInicial);
 loop();
 
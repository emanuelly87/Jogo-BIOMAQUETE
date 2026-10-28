
/* =====================================================
   AVENTURA PELO CORAÇÃO ❤️🩸
   Jogo completo, responsivo e compatível com index.html
   50 perguntas no banco; 5 sorteadas por partida
   Ranking com todas as partidas salvas no navegador
   ===================================================== */

   const $ = id => document.getElementById(id);

   const canvas = $("game");
   const ctx = canvas.getContext("2d");
   
   const W = canvas.width;
   const H = canvas.height;
   const CHAO = H - 60;
   const MUNDO = 2300;
   
   const cadastro = $("cadastro");
   const informacoes = $("informacoes");
   const mensagem = $("mensagem");
   const telaPergunta = $("pergunta");
   const telaResultado = $("resultado");
   const rankingTela = $("rankingTela");
   const controles = $("controles");
   
   const nomeInput = $("nomeJogador");
   const nomePainel = $("nomeAtual");
   const vidasPainel = $("vidas");
   const pontosPainel = $("pontos");
   const fasePainel = $("fase");
   
   const perguntaTitulo = $("tituloPergunta");
   const perguntaTexto = $("textoPergunta");
   const opcoes = $("opcoes");
   const feedback = $("feedback");
   
   const tituloResultado = $("tituloResultado");
   const resumo = $("resumo");
   const pontuacaoFinal = $("pontuacaoFinal");
   const detalhesPartida = $("detalhesPartida");
   
   const listaRanking = $("listaRanking");
   
   const btnComecar = $("comecar");
   const btnProximo = $("proximo");
   const btnVerRanking = $("verRanking");
   const btnProximoJogador = $("proximoJogador");
   const btnNovoJogador = $("novoJogador");
   const btnLimparRanking = $("limparRanking");
   const btnIniciarDoPainel = $("iniciarDoPainel");
   
   const btnEsquerda = $("esquerda");
   const btnDireita = $("direita");
   const btnPular = $("pular");
   
   /* =====================================================
      BANCO DE 50 PERGUNTAS
      Cada opção contém: texto, pontos e explicação.
      ===================================================== */
   
   const bancoPerguntas = [
     {
       tema: "O coração",
       pergunta: "Qual é a principal função do coração?",
       opcoes: [
         ["Bombear o sangue pelo corpo", 100, "O coração impulsiona o sangue pela circulação."],
         ["Produzir todas as células sanguíneas", -25, "As células sanguíneas são produzidas principalmente na medula óssea."],
         ["Filtrar o ar que respiramos", -25, "Essa função pertence ao sistema respiratório."]
       ]
     },
     {
       tema: "As hemácias",
       pergunta: "Qual é a principal função das hemácias?",
       opcoes: [
         ["Transportar oxigênio", 100, "As hemácias transportam grande parte do oxigênio do sangue."],
         ["Combater todos os micróbios", 50, "A defesa do organismo envolve principalmente os glóbulos brancos."],
         ["Bombear o sangue", -25, "Quem bombeia o sangue é o coração."]
       ]
     },
     {
       tema: "Glóbulos brancos",
       pergunta: "Qual é a função dos glóbulos brancos?",
       opcoes: [
         ["Ajudar na defesa do organismo", 100, "Eles participam da defesa contra agentes infecciosos."],
         ["Transportar a maior parte do oxigênio", 50, "Essa função é realizada principalmente pelas hemácias."],
         ["Produzir os batimentos cardíacos", -25, "Os batimentos são produzidos pela atividade elétrica e muscular do coração."]
       ]
     },
     {
       tema: "Plaquetas",
       pergunta: "O que as plaquetas ajudam a fazer?",
       opcoes: [
         ["Ajudar a estancar sangramentos", 100, "As plaquetas participam da coagulação do sangue."],
         ["Levar ar aos pulmões", -25, "O ar passa pelas vias respiratórias."],
         ["Bombear sangue para as pernas", -25, "Essa função é realizada pelo coração."]
       ]
     },
     {
       tema: "Plasma",
       pergunta: "O que é o plasma sanguíneo?",
       opcoes: [
         ["A parte líquida do sangue", 100, "O plasma transporta substâncias como nutrientes e hormônios."],
         ["Um tipo de osso", -25, "O plasma é a parte líquida do sangue."],
         ["Uma cavidade cardíaca", -25, "As cavidades do coração são os átrios e ventrículos."]
       ]
     },
     {
       tema: "Artérias",
       pergunta: "Em geral, para onde as artérias levam o sangue?",
       opcoes: [
         ["Para fora do coração", 100, "As artérias levam o sangue para longe do coração."],
         ["Sempre para dentro do coração", -25, "As veias normalmente trazem o sangue de volta ao coração."],
         ["Somente para os pulmões", 50, "A artéria pulmonar vai aos pulmões, mas existem outras artérias."]
       ]
     },
     {
       tema: "Veias",
       pergunta: "Qual é a função geral das veias?",
       opcoes: [
         ["Levar sangue de volta ao coração", 100, "As veias fazem o retorno do sangue ao coração."],
         ["Produzir células sanguíneas", -25, "As células sanguíneas são produzidas principalmente na medula óssea."],
         ["Levar ar para os pulmões", -25, "O ar circula pelas vias respiratórias."]
       ]
     },
     {
       tema: "Capilares",
       pergunta: "O que acontece principalmente nos capilares?",
       opcoes: [
         ["Trocas de gases, nutrientes e resíduos com os tecidos", 100, "Os capilares permitem trocas entre o sangue e as células."],
         ["O coração produz batimentos", -25, "Os batimentos acontecem no coração."],
         ["O ar é produzido", -25, "O ar não é produzido pelos capilares."]
       ]
     },
     {
       tema: "Cavidades do coração",
       pergunta: "Quantas cavidades tem o coração humano?",
       opcoes: [
         ["Quatro", 100, "São dois átrios e dois ventrículos."],
         ["Duas", 50, "O coração possui dois lados, mas quatro cavidades."],
         ["Seis", -25, "O coração humano tem quatro cavidades."]
       ]
     },
     {
       tema: "Átrios",
       pergunta: "Qual é a função dos átrios?",
       opcoes: [
         ["Receber o sangue que chega ao coração", 100, "O sangue chega primeiro aos átrios."],
         ["Produzir oxigênio", -25, "O oxigênio passa para o sangue nos pulmões."],
         ["Filtrar o sangue como os rins", -25, "Os rins filtram o sangue; os átrios o recebem."]
       ]
     },
     {
       tema: "Ventrículos",
       pergunta: "O que os ventrículos fazem?",
       opcoes: [
         ["Bombeiam o sangue para fora do coração", 100, "O ventrículo direito envia sangue aos pulmões e o esquerdo ao corpo."],
         ["Recebem ar da traqueia", -25, "A traqueia pertence ao sistema respiratório."],
         ["Produzem plaquetas", -25, "As plaquetas são formadas principalmente na medula óssea."]
       ]
     },
     {
       tema: "Coração direito",
       pergunta: "Para onde o lado direito do coração bombeia o sangue?",
       opcoes: [
         ["Para os pulmões", 100, "O ventrículo direito envia sangue aos pulmões para as trocas gasosas."],
         ["Diretamente para todo o corpo", 50, "O lado esquerdo bombeia sangue para a circulação sistêmica."],
         ["Somente para o estômago", -25, "O sangue é distribuído para vários órgãos."]
       ]
     },
     {
       tema: "Coração esquerdo",
       pergunta: "Para onde o lado esquerdo do coração bombeia o sangue?",
       opcoes: [
         ["Para o restante do corpo", 100, "O ventrículo esquerdo bombeia sangue para o organismo."],
         ["Somente para os pulmões", 50, "O lado direito envia sangue aos pulmões."],
         ["Somente para o estômago", -25, "O sangue chega a vários órgãos e tecidos."]
       ]
     },
     {
       tema: "Artéria pulmonar",
       pergunta: "Que tipo de sangue a artéria pulmonar transporta?",
       opcoes: [
         ["Sangue com pouco oxigênio em direção aos pulmões", 100, "A artéria pulmonar é uma exceção: transporta sangue com pouco oxigênio."],
         ["Sangue sem células sanguíneas", -25, "O sangue contém plasma e elementos celulares."],
         ["Sangue rico em oxigênio vindo dos pulmões", 50, "As veias pulmonares trazem sangue rico em oxigênio ao coração."]
       ]
     },
     {
       tema: "Veias pulmonares",
       pergunta: "O que as veias pulmonares levam ao coração?",
       opcoes: [
         ["Sangue rico em oxigênio vindo dos pulmões", 100, "Elas chegam ao átrio esquerdo."],
         ["Sangue com pouco oxigênio vindo do corpo", 50, "Esse sangue retorna pelas veias cavas."],
         ["Ar para o coração", -25, "O ar não circula dentro das veias."]
       ]
     },
     {
       tema: "Aorta",
       pergunta: "Qual é a função da aorta?",
       opcoes: [
         ["Levar sangue do coração para o corpo", 100, "A aorta é a maior artéria do corpo humano."],
         ["Levar ar para os pulmões", -25, "A aorta é um vaso sanguíneo."],
         ["Trazer sangue dos pulmões ao coração", 50, "Essa é a função das veias pulmonares."]
       ]
     },
     {
       tema: "Veias cavas",
       pergunta: "O que as veias cavas fazem?",
       opcoes: [
         ["Trazem sangue do corpo para o átrio direito", 100, "As veias cavas retornam sangue ao coração."],
         ["Levam sangue do coração aos pulmões", 50, "Essa é a função da artéria pulmonar."],
         ["Levam ar ao estômago", -25, "O ar não circula pelos vasos sanguíneos."]
       ]
     },
     {
       tema: "Circulação pulmonar",
       pergunta: "Qual caminho descreve a circulação pulmonar?",
       opcoes: [
         ["Coração, pulmões e coração", 100, "O sangue vai aos pulmões e depois retorna ao coração."],
         ["Coração, pernas e cérebro apenas", 50, "Esses órgãos participam da circulação sistêmica."],
         ["Estômago e rins sem passar pelo coração", -25, "O coração impulsiona o sangue pela circulação."]
       ]
     },
     {
       tema: "Circulação sistêmica",
       pergunta: "Qual caminho descreve a circulação sistêmica?",
       opcoes: [
         ["Coração, corpo e coração", 100, "O sangue vai aos tecidos e depois retorna ao coração."],
         ["Pulmões, traqueia e nariz", -25, "Esse caminho está relacionado à respiração."],
         ["Somente o lado direito do coração", -25, "A circulação sistêmica sai do ventrículo esquerdo."]
       ]
     },
     {
       tema: "Oxigênio",
       pergunta: "Por que as células precisam de oxigênio?",
       opcoes: [
         ["Para ajudar na produção de energia", 100, "Muitas células utilizam oxigênio na respiração celular."],
         ["Para transformar ossos em sangue", -25, "O oxigênio não transforma ossos em sangue."],
         ["Para substituir toda a água do corpo", -25, "Água e oxigênio têm funções diferentes."]
       ]
     },
     {
       tema: "Gás carbônico",
       pergunta: "O que acontece com grande parte do gás carbônico produzido pelo corpo?",
       opcoes: [
         ["É levado aos pulmões para ser eliminado", 100, "O gás carbônico passa para os pulmões e sai na expiração."],
         ["Fica guardado para sempre no coração", -25, "O corpo precisa eliminar o excesso de gás carbônico."],
         ["Vira osso imediatamente", -25, "O gás carbônico não se transforma diretamente em osso."]
       ]
     },
     {
       tema: "Pulmões",
       pergunta: "Qual é o papel dos pulmões na circulação?",
       opcoes: [
         ["Permitir que o sangue receba oxigênio e elimine gás carbônico", 100, "As trocas gasosas acontecem nos pulmões."],
         ["Bombear sangue para todo o corpo", -25, "Quem bombeia o sangue é o coração."],
         ["Produzir todas as células sanguíneas", -25, "As células sanguíneas são produzidas principalmente na medula óssea."]
       ]
     },
     {
       tema: "Alvéolos",
       pergunta: "Onde ocorrem as trocas gasosas nos pulmões?",
       opcoes: [
         ["Nos alvéolos pulmonares", 100, "Os alvéolos ficam próximos dos capilares sanguíneos."],
         ["Nas válvulas cardíacas", -25, "As válvulas controlam o fluxo de sangue."],
         ["Nos ossos das pernas", -25, "As trocas gasosas acontecem nos pulmões."]
       ]
     },
     {
       tema: "Batimentos cardíacos",
       pergunta: "O que representa um batimento cardíaco?",
       opcoes: [
         ["A atividade de contração e relaxamento do coração", 100, "O ciclo cardíaco envolve contração e relaxamento."],
         ["Uma respiração completa", -25, "Respiração e batimento cardíaco são processos diferentes."],
         ["O movimento dos alimentos no estômago", -25, "A digestão é outro processo do corpo."]
       ]
     },
     {
       tema: "Sístole",
       pergunta: "O que acontece durante a sístole ventricular?",
       opcoes: [
         ["Os ventrículos se contraem e ejetam sangue", 100, "A contração impulsiona sangue para as artérias."],
         ["Os pulmões param de funcionar", -25, "A sístole é uma fase do ciclo cardíaco."],
         ["O sangue deixa de circular", -25, "O sangue continua circulando durante o ciclo cardíaco."]
       ]
     },
     {
       tema: "Diástole",
       pergunta: "O que acontece durante a diástole?",
       opcoes: [
         ["O coração relaxa e suas cavidades se enchem", 100, "O relaxamento permite o enchimento das cavidades cardíacas."],
         ["O coração fica permanentemente parado", -25, "A diástole é uma fase normal do ciclo cardíaco."],
         ["As artérias viram veias", -25, "Artérias e veias são vasos sanguíneos diferentes."]
       ]
     },
     {
       tema: "Pulso",
       pergunta: "O que você percebe quando mede o pulso no punho?",
       opcoes: [
         ["Ondas de pressão nas artérias", 100, "Essas ondas estão relacionadas aos batimentos cardíacos."],
         ["O ar entrando nos pulmões", -25, "A respiração e o pulso são processos diferentes."],
         ["A digestão dos alimentos", -25, "O pulso está ligado à circulação."]
       ]
     },
     {
       tema: "Cor do sangue",
       pergunta: "Qual afirmação sobre a cor do sangue humano está correta?",
       opcoes: [
         ["O sangue é vermelho e pode ter tons diferentes", 100, "O sangue com mais oxigênio tende a ser vermelho mais vivo."],
         ["O sangue das veias é azul", -25, "O sangue é vermelho; a pele pode fazer as veias parecerem azuladas."],
         ["O sangue humano é sempre verde", -25, "O sangue humano é vermelho."]
       ]
     },
     {
       tema: "Tecido sanguíneo",
       pergunta: "Como o sangue é classificado no corpo humano?",
       opcoes: [
         ["Como um tecido líquido", 100, "O sangue é formado por plasma e elementos celulares."],
         ["Como um osso líquido", -25, "O sangue é um tecido, não um osso."],
         ["Como um órgão sólido", -25, "O sangue é um tecido líquido."]
       ]
     },
     {
       tema: "Entrada de oxigênio",
       pergunta: "Como o oxigênio entra no sangue?",
       opcoes: [
         ["Pelas trocas gasosas nos pulmões", 100, "O oxigênio passa dos alvéolos para o sangue."],
         ["Pelos alimentos diretamente para as veias", -25, "O oxigênio vem principalmente do ar respirado."],
         ["É fabricado pelo coração", -25, "O coração bombeia sangue, mas não fabrica oxigênio."]
       ]
     },
     {
       tema: "Nutrientes",
       pergunta: "Como muitos nutrientes chegam às células?",
       opcoes: [
         ["São transportados pelo sangue", 100, "O sangue distribui nutrientes absorvidos pelo sistema digestório."],
         ["São transportados somente pelo ar", -25, "O sangue transporta muitos nutrientes e oxigênio."],
         ["São produzidos pelas artérias", -25, "As artérias transportam sangue."]
       ]
     },
     {
       tema: "Hormônios",
       pergunta: "Qual é uma função do sangue relacionada aos hormônios?",
       opcoes: [
         ["Transportar hormônios até órgãos e tecidos", 100, "O sangue ajuda a distribuir hormônios pelo corpo."],
         ["Destruir todos os hormônios", -25, "Os hormônios são mensageiros químicos importantes."],
         ["Transformar hormônios em ossos", -25, "Hormônios não se transformam diretamente em ossos."]
       ]
     },
     {
       tema: "Temperatura corporal",
       pergunta: "Como a circulação ajuda a regular a temperatura do corpo?",
       opcoes: [
         ["Distribuindo calor e ajustando o fluxo sanguíneo na pele", 100, "Os vasos sanguíneos ajudam o corpo a trocar calor com o ambiente."],
         ["Parando todos os batimentos", -25, "O coração precisa continuar bombeando sangue."],
         ["Transformando o sangue em gelo", -25, "O sangue permanece líquido em condições normais."]
       ]
     },
     {
       tema: "Coagulação",
       pergunta: "Por que a coagulação do sangue é importante?",
       opcoes: [
         ["Ajuda a reduzir a perda de sangue em ferimentos", 100, "A coagulação ajuda a controlar sangramentos."],
         ["Impede o coração de bater", -25, "A coagulação normal ajuda a estancar sangramentos."],
         ["Leva ar diretamente às células", -25, "O sangue transporta oxigênio, não ar."]
       ]
     },
     {
       tema: "Miocárdio",
       pergunta: "Como se chama o músculo do coração?",
       opcoes: [
         ["Miocárdio", 100, "O miocárdio é o músculo responsável pela contração cardíaca."],
         ["Epiderme", -25, "A epiderme é a camada mais externa da pele."],
         ["Cartilagem", -25, "O miocárdio é tecido muscular."]
       ]
     },
     {
       tema: "Septo cardíaco",
       pergunta: "Qual é a função do septo do coração?",
       opcoes: [
         ["Separar o lado direito do lado esquerdo", 100, "O septo separa as duas metades do coração."],
         ["Produzir oxigênio", -25, "O oxigênio vem do ar e passa ao sangue nos pulmões."],
         ["Ligar o coração ao estômago", -25, "O septo é uma estrutura interna do coração."]
       ]
     },
     {
       tema: "Válvulas cardíacas",
       pergunta: "Qual é a função das válvulas cardíacas?",
       opcoes: [
         ["Ajudar a impedir que o sangue volte na direção errada", 100, "As válvulas ajudam a manter o fluxo sanguíneo em uma direção."],
         ["Produzir glóbulos brancos", -25, "Os glóbulos brancos são células sanguíneas."],
         ["Permitir que o ar entre no coração", -25, "O ar não circula dentro do coração."]
       ]
     },
     {
       tema: "Válvula tricúspide",
       pergunta: "Onde fica a válvula tricúspide?",
       opcoes: [
         ["Entre o átrio direito e o ventrículo direito", 100, "Ela ajuda a impedir o retorno do sangue ao átrio direito."],
         ["Entre o átrio esquerdo e o ventrículo esquerdo", -25, "Essa é a posição da válvula mitral."],
         ["Dentro dos pulmões", -25, "A válvula tricúspide fica no coração."]
       ]
     },
     {
       tema: "Válvula mitral",
       pergunta: "Onde fica a válvula mitral?",
       opcoes: [
         ["Entre o átrio esquerdo e o ventrículo esquerdo", 100, "A válvula mitral também é chamada de bicúspide."],
         ["Entre o átrio direito e o ventrículo direito", -25, "Essa é a posição da válvula tricúspide."],
         ["Entre os dois pulmões", -25, "A válvula mitral fica no coração."]
       ]
     },
     {
       tema: "Válvula pulmonar",
       pergunta: "Onde fica a válvula pulmonar?",
       opcoes: [
         ["Na saída do ventrículo direito para a artéria pulmonar", 100, "Ela ajuda a impedir que o sangue retorne ao ventrículo."],
         ["Na saída do ventrículo esquerdo para a aorta", -25, "Essa é a posição da válvula aórtica."],
         ["Dentro do estômago", -25, "A válvula pulmonar fica no coração."]
       ]
     },
     {
       tema: "Válvula aórtica",
       pergunta: "Onde fica a válvula aórtica?",
       opcoes: [
         ["Na saída do ventrículo esquerdo para a aorta", 100, "Ela controla a passagem de sangue para a aorta."],
         ["Entre o átrio direito e o ventrículo direito", -25, "Essa é a posição da válvula tricúspide."],
         ["Na entrada dos pulmões", -25, "A válvula aórtica fica na saída do ventrículo esquerdo."]
       ]
     },
     {
       tema: "Frequência cardíaca",
       pergunta: "O que significa frequência cardíaca?",
       opcoes: [
         ["Quantidade de batimentos por minuto", 100, "A frequência cardíaca é expressa em batimentos por minuto."],
         ["Quantidade de respirações por dia", -25, "Isso está relacionado à frequência respiratória."],
         ["Quantidade de ossos do corpo", -25, "A frequência cardíaca mede os batimentos do coração."]
       ]
     },
     {
       tema: "Exercício físico",
       pergunta: "Por que o coração bate mais rápido durante exercícios?",
       opcoes: [
         ["Os músculos precisam de mais oxigênio e nutrientes", 100, "O coração aumenta o fluxo sanguíneo para atender à demanda."],
         ["O sangue deixa de circular", -25, "A circulação continua e geralmente aumenta durante o exercício."],
         ["Os pulmões param de funcionar", -25, "Os pulmões continuam trabalhando durante o exercício."]
       ]
     },
     {
       tema: "Cuidar do coração",
       pergunta: "Qual hábito ajuda a manter o coração saudável?",
       opcoes: [
         ["Fazer atividade física adequada regularmente", 100, "A atividade física regular contribui para a saúde cardiovascular."],
         ["Nunca se movimentar", -25, "Movimentar-se adequadamente beneficia a saúde."],
         ["Dormir sempre muito pouco", -25, "Dormir o suficiente também é importante para a saúde."]
       ]
     },
     {
       tema: "Cigarro",
       pergunta: "Como fumar pode afetar o sistema cardiovascular?",
       opcoes: [
         ["Pode prejudicar os vasos e aumentar riscos cardiovasculares", 100, "Fumar aumenta o risco de doenças do coração e dos vasos."],
         ["Fortalece sempre as artérias", -25, "Fumar pode danificar os vasos sanguíneos."],
         ["Não afeta a circulação", -25, "O tabagismo prejudica a saúde cardiovascular."]
       ]
     },
     {
       tema: "Hidratação",
       pergunta: "Por que beber água é importante para o organismo?",
       opcoes: [
         ["Ajuda a manter o equilíbrio de líquidos do corpo", 100, "A hidratação contribui para o funcionamento do organismo."],
         ["Substitui o sangue", -25, "A água não substitui o sangue."],
         ["Faz o coração parar", -25, "A hidratação adequada ajuda o corpo a funcionar normalmente."]
       ]
     },
     {
       tema: "Pressão arterial",
       pergunta: "O que é a pressão arterial?",
       opcoes: [
         ["A força do sangue contra as paredes das artérias", 100, "A pressão arterial está relacionada ao fluxo do sangue."],
         ["A temperatura dos pulmões", -25, "Pressão arterial não é temperatura."],
         ["A quantidade de ossos", -25, "A pressão arterial está relacionada à circulação."]
       ]
     },
     {
       tema: "Alimentação",
       pergunta: "Qual escolha costuma ajudar na saúde cardiovascular?",
       opcoes: [
         ["Ter alimentação equilibrada e variada", 100, "Uma alimentação equilibrada contribui para a saúde do coração."],
         ["Comer somente um alimento", -25, "O organismo precisa de vários nutrientes."],
         ["Evitar toda atividade física", -25, "A atividade física adequada é benéfica para muitas pessoas."]
       ]
     },
     {
       tema: "Circulação contínua",
       pergunta: "Como o sangue circula pelo corpo?",
       opcoes: [
         ["Continuamente pelos vasos, impulsionado pelo coração", 100, "O coração e os vasos mantêm o sangue em circulação."],
         ["Uma única vez e depois desaparece", -25, "O sangue circula continuamente."],
         ["Somente nos braços", -25, "O sangue chega aos tecidos de todo o corpo."]
       ]
     },
     {
       tema: "Cérebro",
       pergunta: "Por que o cérebro precisa receber sangue continuamente?",
       opcoes: [
         ["Para receber oxigênio e glicose", 100, "O cérebro precisa de oxigênio e nutrientes para funcionar."],
         ["Para transformar sangue em ar", -25, "O sangue transporta substâncias importantes ao cérebro."],
         ["Para produzir todos os ossos", -25, "O cérebro não produz todos os ossos."]
       ]
     },
     {
       tema: "Rins",
       pergunta: "Qual é uma função dos rins relacionada ao sangue?",
       opcoes: [
         ["Filtrar o sangue e ajudar a eliminar resíduos pela urina", 100, "Os rins ajudam a regular líquidos e remover resíduos."],
         ["Bombear sangue aos pulmões", -25, "Essa é uma função do coração."],
         ["Transportar ar pela traqueia", -25, "O ar circula no sistema respiratório."]
       ]
     },
     {
       tema: "Intestino",
       pergunta: "Depois da digestão, como muitos nutrientes chegam ao corpo?",
       opcoes: [
         ["São absorvidos no intestino e transportados pelo sangue", 100, "Muitos nutrientes entram na circulação após a absorção intestinal."],
         ["São enviados diretamente pelos ossos", -25, "Os ossos não transportam diretamente os nutrientes digeridos."],
         ["Transformam-se em ar nos pulmões", -25, "Os nutrientes são absorvidos e distribuídos pelo organismo."]
       ]
     },
     {
       tema: "Sangue nas pernas",
       pergunta: "O que ajuda o sangue das pernas a retornar ao coração?",
       opcoes: [
         ["Contrações musculares e válvulas das veias", 100, "Os músculos ajudam a impulsionar o sangue e as válvulas reduzem o refluxo."],
         ["A gravidade sempre empurra o sangue para cima", -25, "A gravidade dificulta o retorno do sangue das pernas."],
         ["Somente os pulmões", -25, "Os músculos e as válvulas das veias têm um papel importante."]
       ]
     },
     {
       tema: "Tipos de vasos",
       pergunta: "Quais são os três principais tipos de vasos sanguíneos?",
       opcoes: [
         ["Artérias, veias e capilares", 100, "Esses três tipos formam a rede de vasos sanguíneos."],
         ["Nervos, músculos e ossos", -25, "Essas estruturas não são vasos sanguíneos."],
         ["Traqueia, brônquios e alvéolos", -25, "Essas estruturas pertencem ao sistema respiratório."]
       ]
     },
     {
       tema: "Capilares finos",
       pergunta: "Por que as paredes dos capilares são muito finas?",
       opcoes: [
         ["Para facilitar as trocas entre sangue e tecidos", 100, "A parede fina facilita as trocas de gases e substâncias."],
         ["Para impedir todas as trocas", -25, "Os capilares são locais importantes de troca."],
         ["Para armazenar ossos", -25, "Os capilares são vasos sanguíneos muito pequenos."]
       ]
     },
     {
       tema: "Frequência em repouso",
       pergunta: "A frequência cardíaca pode variar de uma pessoa para outra?",
       opcoes: [
         ["Sim, depende de fatores como idade e atividade", 100, "A frequência varia conforme a pessoa e a situação."],
         ["Não, é sempre igual para todo mundo", -25, "A frequência cardíaca não é igual em todas as pessoas."],
         ["Só muda durante o sono", -25, "Ela pode mudar durante exercícios, repouso, sono e emoções."]
       ]
     },
     {
       tema: "Coração muscular",
       pergunta: "Por que o coração é considerado um órgão muscular?",
       opcoes: [
         ["Porque seu músculo se contrai para bombear sangue", 100, "O músculo cardíaco realiza contrações involuntárias."],
         ["Porque movimenta diretamente os braços", -25, "Os músculos esqueléticos movimentam os braços."],
         ["Porque é feito apenas de osso", -25, "O coração não é feito apenas de osso."]
       ]
     },
     {
       tema: "Circulação dupla",
       pergunta: "Por que a circulação humana é chamada de dupla?",
       opcoes: [
         ["Porque possui os circuitos pulmonar e sistêmico", 100, "O sangue passa pelo circuito pulmonar e pelo sistêmico."],
         ["Porque temos dois corações", -25, "Os seres humanos têm um coração com quatro cavidades."],
         ["Porque o sangue circula só duas vezes na vida", -25, "A circulação sanguínea é contínua."]
       ]
     }
   ];
   
   /* =====================================================
      ESTADO DO JOGO
      ===================================================== */
   
   let estado = "inicio";
   let nomeAtual = "";
   let pontuacao = 0;
   let vidas = 3;
   let jogador;
   let cameraX = 0;
   let desafios = [];
   let desafioAtual = 0;
   let respostasPartida = [];
   let teclas = {};
   let partidaSalva = false;
   
   const posicoesPerguntas = [350, 790, 1250, 1690, 2020];
   
   function embaralhar(lista) {
     const copia = [...lista];
   
     for (let i = copia.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [copia[i], copia[j]] = [copia[j], copia[i]];
     }
   
     return copia;
   }
   
   function selecionarPerguntas() {
     return embaralhar(bancoPerguntas)
       .slice(0, 5)
       .map((pergunta, indice) => ({
         tema: pergunta.tema,
         pergunta: pergunta.pergunta,
         opcoes: pergunta.opcoes.map(opcao => ({
           texto: opcao[0],
           pontos: opcao[1],
           explicacao: opcao[2]
         })),
         x: posicoesPerguntas[indice]
       }));
   }
   
   function criarJogador() {
     return {
       x: 70,
       y: CHAO - 32,
       w: 36,
       h: 28,
       vx: 0,
       vy: 0,
       velocidade: 4,
       noChao: true
     };
   }
   
   function mostrar(elemento) {
     if (elemento) elemento.classList.remove("escondido");
   }
   
   function esconder(elemento) {
     if (elemento) elemento.classList.add("escondido");
   }
   
   function esconderTelas() {
     esconder(mensagem);
     esconder(telaPergunta);
     esconder(telaResultado);
     esconder(rankingTela);
   }
   
   function atualizarPainel() {
     nomePainel.textContent = nomeAtual;
     vidasPainel.textContent = vidas;
     pontosPainel.textContent = pontuacao;
   
     const fases = [
       "Coração direito",
       "Pulmões",
       "Coração esquerdo",
       "Corpo humano",
       "Circulação"
     ];
   
     fasePainel.textContent =
       fases[Math.min(desafioAtual, fases.length - 1)];
   }
   
   /* =====================================================
      INICIAR E TROCAR DE JOGADOR
      ===================================================== */
   
   function iniciarJogo() {
     const nomeDigitado = nomeInput.value.trim();
   
     if (!nomeDigitado) {
       nomeInput.focus();
       nomeInput.placeholder = "Digite seu nome para começar!";
       return;
     }
   
     nomeAtual = nomeDigitado.slice(0, 30);
     pontuacao = 0;
     vidas = 3;
     desafioAtual = 0;
     respostasPartida = [];
     partidaSalva = false;
     cameraX = 0;
     jogador = criarJogador();
     desafios = selecionarPerguntas();
     teclas = {};
   
     esconder(cadastro);
     esconderTelas();
     mostrar(informacoes);
     mostrar(controles);
   
     estado = "jogando";
     atualizarPainel();
   }
   
   function novoJogador() {
     esconderTelas();
     esconder(informacoes);
     esconder(controles);
     mostrar(cadastro);
   
     estado = "inicio";
     teclas = {};
     nomeInput.value = "";
     nomeInput.focus();
   }
   
   btnComecar.addEventListener("click", iniciarJogo);
   btnIniciarDoPainel?.addEventListener("click", iniciarJogo);
   btnProximoJogador.addEventListener("click", novoJogador);
   btnNovoJogador.addEventListener("click", novoJogador);
   
   nomeInput.addEventListener("keydown", evento => {
     if (evento.key === "Enter") iniciarJogo();
   });
   
   /* =====================================================
      TECLADO E CONTROLES DE TOQUE
      ===================================================== */
   
   function pular() {
     if (estado === "jogando" && jogador.noChao) {
       jogador.vy = -12;
       jogador.noChao = false;
     }
   }
   
   window.addEventListener("keydown", evento => {
     const tecla = evento.key.toLowerCase();
   
     if (
       ["arrowleft", "arrowright", "arrowup", " "].includes(tecla) &&
       estado === "jogando"
     ) {
       evento.preventDefault();
     }
   
     if (tecla === "arrowleft" || tecla === "a") {
       teclas.esquerda = true;
     }
   
     if (tecla === "arrowright" || tecla === "d") {
       teclas.direita = true;
     }
   
     if (
       (tecla === " " || tecla === "arrowup" || tecla === "w") &&
       !evento.repeat
     ) {
       pular();
     }
   });
   
   window.addEventListener("keyup", evento => {
     const tecla = evento.key.toLowerCase();
   
     if (tecla === "arrowleft" || tecla === "a") {
       teclas.esquerda = false;
     }
   
     if (tecla === "arrowright" || tecla === "d") {
       teclas.direita = false;
     }
   });
   
   window.addEventListener("blur", () => {
     teclas = {};
   });
   
   function configurarBotaoToque(botao, aoPressionar, aoSoltar) {
     botao.addEventListener("pointerdown", evento => {
       evento.preventDefault();
   
       if (estado !== "jogando") return;
   
       botao.setPointerCapture?.(evento.pointerId);
       aoPressionar();
     });
   
     ["pointerup", "pointercancel", "lostpointercapture"].forEach(tipo => {
       botao.addEventListener(tipo, () => aoSoltar());
     });
   }
   
   configurarBotaoToque(
     btnEsquerda,
     () => { teclas.esquerda = true; },
     () => { teclas.esquerda = false; }
   );
   
   configurarBotaoToque(
     btnDireita,
     () => { teclas.direita = true; },
     () => { teclas.direita = false; }
   );
   
   configurarBotaoToque(btnPular, pular, () => {});
   
   /* =====================================================
      PERGUNTAS E RESPOSTAS
      ===================================================== */
   
   function abrirPergunta(indice) {
     if (estado !== "jogando") return;
   
     estado = "pergunta";
     desafioAtual = indice;
     teclas = {};
   
     esconder(controles);
     esconder(mensagem);
     esconder(telaResultado);
     esconder(rankingTela);
     mostrar(telaPergunta);
   
     const desafio = desafios[indice];
   
     perguntaTitulo.textContent =
       `❓ Pergunta ${indice + 1} de ${desafios.length}: ${desafio.tema}`;
   
     perguntaTexto.textContent = desafio.pergunta;
     feedback.textContent = "";
     opcoes.innerHTML = "";
   
     btnProximo.disabled = true;
     btnProximo.textContent = "Escolha uma resposta";
   
     embaralhar(desafio.opcoes).forEach(opcao => {
       const botao = document.createElement("button");
   
       botao.type = "button";
       botao.textContent = opcao.texto;
   
       botao.addEventListener("click", () => {
         responderPergunta(opcao, botao);
       });
   
       opcoes.appendChild(botao);
     });
   }
   
   function responderPergunta(opcaoEscolhida, botaoEscolhido) {
     if (estado !== "pergunta" || !btnProximo.disabled) return;
   
     pontuacao += opcaoEscolhida.pontos;
   
     if (opcaoEscolhida.pontos < 0) {
       vidas = Math.max(0, vidas - 1);
     }
   
     respostasPartida.push({
       pergunta: desafios[desafioAtual].pergunta,
       pontos: opcaoEscolhida.pontos,
       explicacao: opcaoEscolhida.explicacao
     });
   
     opcoes.querySelectorAll("button").forEach(botao => {
       botao.disabled = true;
     });
   
     botaoEscolhido.style.border = "2px solid #c9184a";
     botaoEscolhido.style.opacity = "1";
   
     if (opcaoEscolhida.pontos === 100) {
       feedback.textContent =
         `✅ Correto! +100 pontos. ${opcaoEscolhida.explicacao}`;
     } else if (opcaoEscolhida.pontos === 50) {
       feedback.textContent =
         `🟡 Parcialmente correto! +50 pontos. ${opcaoEscolhida.explicacao}`;
     } else {
       feedback.textContent =
         `❌ Incorreto! −25 pontos e uma vida perdida. ${opcaoEscolhida.explicacao}`;
     }
   
     atualizarPainel();
   
     btnProximo.disabled = false;
     btnProximo.textContent =
       vidas <= 0 || desafioAtual === desafios.length - 1
         ? "Ver resultado"
         : "Continuar aventura";
   }
   
   btnProximo.addEventListener("click", () => {
     if (estado !== "pergunta" || btnProximo.disabled) return;
   
     esconder(telaPergunta);
   
     if (vidas <= 0 || desafioAtual >= desafios.length - 1) {
       finalizarJogo();
       return;
     }
   
     jogador.x = Math.max(
       jogador.x,
       desafios[desafioAtual].x + 45
     );
   
     desafioAtual++;
     estado = "jogando";
   
     mostrar(controles);
     atualizarPainel();
   });
   
   /* =====================================================
      RANKING: TODAS AS PARTIDAS
      ===================================================== */
   
   function lerRanking() {
     try {
       const dados = JSON.parse(
         localStorage.getItem("rankingCoracao") || "[]"
       );
   
       return Array.isArray(dados) ? dados : [];
     } catch (erro) {
       console.error("Não foi possível ler o ranking.", erro);
       return [];
     }
   }
   
   function salvarPontuacao() {
     if (partidaSalva) return;
   
     partidaSalva = true;
   
     const ranking = lerRanking();
   
     ranking.push({
       id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
       nome: nomeAtual,
       pontos: pontuacao,
       data: new Date().toLocaleDateString("pt-BR"),
       horario: new Date().toLocaleTimeString("pt-BR", {
         hour: "2-digit",
         minute: "2-digit"
       })
     });
   
     ranking.sort((a, b) => b.pontos - a.pontos);
   
     try {
       // Guarda TODAS as partidas, sem limitar a 50 registros.
       localStorage.setItem("rankingCoracao", JSON.stringify(ranking));
     } catch (erro) {
       console.error("Não foi possível salvar o ranking.", erro);
       alert("O navegador não conseguiu guardar o ranking. Verifique o espaço disponível.");
     }
   }
   
   function finalizarJogo() {
     if (estado === "resultado") return;
   
     estado = "resultado";
     teclas = {};
   
     salvarPontuacao();
   
     esconderTelas();
     esconder(controles);
     mostrar(telaResultado);
   
     tituloResultado.textContent =
       vidas <= 0 ? "❤️‍🩹 Fim da aventura!" : "🏆 Aventura concluída!";
   
     resumo.textContent = vidas <= 0
       ? `Suas vidas acabaram, ${nomeAtual}. Tente novamente para melhorar sua pontuação!`
       : `Parabéns, ${nomeAtual}! Você completou as cinco perguntas desta aventura.`;
   
     pontuacaoFinal.textContent = `⭐ Pontuação final: ${pontuacao} pontos`;
   
     detalhesPartida.innerHTML = "";
   
     const lista = document.createElement("ol");
   
     respostasPartida.forEach(resposta => {
       const item = document.createElement("li");
   
       const sinal = resposta.pontos > 0 ? "+" : "";
   
       item.textContent =
         `${resposta.pergunta} (${sinal}${resposta.pontos} pontos)`;
   
       lista.appendChild(item);
     });
   
     detalhesPartida.appendChild(lista);
     atualizarPainel();
   }
   
   function mostrarRanking() {
     const ranking = lerRanking();
   
     listaRanking.innerHTML = "";
   
     if (ranking.length === 0) {
       const item = document.createElement("li");
       item.textContent = "Ainda não há partidas registradas.";
       listaRanking.appendChild(item);
     } else {
       ranking.forEach((registro, indice) => {
         const item = document.createElement("li");
   
         item.textContent =
           `${indice + 1}. ${registro.nome} — ${registro.pontos} pontos · ${registro.data || ""} ${registro.horario || ""}`;
   
         listaRanking.appendChild(item);
       });
     }
   
     esconderTelas();
     esconder(controles);
     mostrar(rankingTela);
     estado = "ranking";
   }
   
   btnVerRanking.addEventListener("click", mostrarRanking);
   
   btnLimparRanking.addEventListener("click", () => {
     const confirmar = window.confirm(
       "Tem certeza de que deseja apagar todas as partidas salvas neste navegador?"
     );
   
     if (!confirmar) return;
   
     localStorage.removeItem("rankingCoracao");
     mostrarRanking();
   });
   
   /* =====================================================
      DESENHO DO CENÁRIO
      ===================================================== */
   
   function desenharFundo() {
     const gradiente = ctx.createLinearGradient(0, 0, 0, H);
   
     gradiente.addColorStop(0, "#e7f8ff");
     gradiente.addColorStop(1, "#ffffff");
   
     ctx.fillStyle = gradiente;
     ctx.fillRect(0, 0, W, H);
   
     ctx.lineCap = "round";
     ctx.lineWidth = 20;
     ctx.strokeStyle = "rgba(201,24,74,0.10)";
   
     ctx.beginPath();
     ctx.moveTo(-cameraX * 0.2, 100);
     ctx.bezierCurveTo(180, 20, 250, 160, 430, 90);
     ctx.stroke();
   
     ctx.lineWidth = 15;
     ctx.strokeStyle = "rgba(40,100,200,0.10)";
   
     ctx.beginPath();
     ctx.moveTo(280 - cameraX * 0.15, 220);
     ctx.bezierCurveTo(450, 160, 540, 260, 750, 200);
     ctx.stroke();
   }
   
   function desenharChao() {
     ctx.fillStyle = "#c8f0c2";
     ctx.fillRect(0, CHAO, W, H - CHAO);
   
     ctx.fillStyle = "#73c96a";
     ctx.fillRect(0, CHAO, W, 7);
   }
   
   function desenharJogador() {
     const x = jogador.x - cameraX;
     const y = jogador.y;
   
     ctx.save();
     ctx.translate(x + jogador.w / 2, y + jogador.h / 2);
   
     // Hemácia
     ctx.fillStyle = "#e63946";
     ctx.beginPath();
     ctx.ellipse(0, 0, 19, 14, -0.1, 0, Math.PI * 2);
     ctx.fill();
   
     ctx.fillStyle = "#b71935";
     ctx.beginPath();
     ctx.ellipse(0, 0, 10, 7, -0.1, 0, Math.PI * 2);
     ctx.fill();
   
     ctx.fillStyle = "#ffffff";
     ctx.beginPath();
     ctx.arc(-6, -3, 2.5, 0, Math.PI * 2);
     ctx.arc(6, -3, 2.5, 0, Math.PI * 2);
     ctx.fill();
   
     ctx.strokeStyle = "#6d1020";
     ctx.lineWidth = 1.5;
     ctx.beginPath();
     ctx.arc(0, 2, 5, 0.2, Math.PI - 0.2);
     ctx.stroke();
   
     ctx.restore();
   }
   
   function desenharPerguntas() {
     desafios.forEach((desafio, indice) => {
       if (indice < desafioAtual) return;
   
       const x = desafio.x - cameraX;
   
       if (x < -40 || x > W + 40) return;
   
       ctx.fillStyle = "#ffd166";
       ctx.beginPath();
       ctx.arc(x, CHAO - 23, 17, 0, Math.PI * 2);
       ctx.fill();
   
       ctx.fillStyle = "#754c00";
       ctx.font = "bold 18px Arial";
       ctx.textAlign = "center";
       ctx.fillText("?", x, CHAO - 17);
     });
   }
   
   function desenharProgresso() {
     ctx.fillStyle = "rgba(255,255,255,0.9)";
     ctx.fillRect(12, 12, 150, 34);
   
     ctx.fillStyle = "#273746";
     ctx.font = "bold 14px Arial";
     ctx.textAlign = "left";
   
     const perguntaNumero = Math.min(desafioAtual + 1, 5);
   
     ctx.fillText(`Pergunta ${perguntaNumero} de 5`, 20, 33);
   }
   
   function desenhar() {
     desenharFundo();
     desenharChao();
   
     if (jogador) {
       desenharPerguntas();
       desenharJogador();
   
       if (estado === "jogando") {
         desenharProgresso();
       }
     }
   }
   
   /* =====================================================
      ATUALIZAÇÃO DO JOGO
      ===================================================== */
   
   function atualizar() {
     if (estado !== "jogando") return;
   
     jogador.vx = 0;
   
     if (teclas.esquerda) jogador.vx = -jogador.velocidade;
     if (teclas.direita) jogador.vx = jogador.velocidade;
   
     jogador.x += jogador.vx;
     jogador.x = Math.max(
       0,
       Math.min(MUNDO - jogador.w, jogador.x)
     );
   
     jogador.vy += 0.55;
     jogador.y += jogador.vy;
   
     if (jogador.y + jogador.h >= CHAO) {
       jogador.y = CHAO - jogador.h;
       jogador.vy = 0;
       jogador.noChao = true;
     }
   
     cameraX = Math.max(
       0,
       Math.min(MUNDO - W, jogador.x - W * 0.35)
     );
   
     if (
       desafioAtual < desafios.length &&
       jogador.x >= desafios[desafioAtual].x
     ) {
       abrirPergunta(desafioAtual);
     }
   
     atualizarPainel();
   }
   
   function loop() {
     if (estado === "jogando") atualizar();
   
     desenhar();
     requestAnimationFrame(loop);
   }
   
   /* =====================================================
      TELA INICIAL
      ===================================================== */
   
   function configurarInicio() {
     jogador = criarJogador();
   
     esconderTelas();
     esconder(informacoes);
     esconder(controles);
   
     mostrar(cadastro);
   
     estado = "inicio";
   }
   
   configurarInicio();
   loop();
   
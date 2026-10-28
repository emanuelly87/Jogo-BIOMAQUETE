
/* =====================================================
   AVENTURA PELO CORAÇÃO ❤️🩸
   JavaScript completo
   50 perguntas; 5 sorteadas por partida
   Compatível com o index.html enviado
   ===================================================== */

   const canvas = document.getElementById("game");
   const ctx = canvas.getContext("2d");
   
   const W = canvas.width;
   const H = canvas.height;
   const CHAO = H - 60;
   const MUNDO = 2300;
   
   const $ = id => document.getElementById(id);
   
   const cadastro = $("cadastro");
   const informacoes = $("informacoes");
   const mensagem = $("mensagem");
   const telaPergunta = $("pergunta");
   const telaResultado = $("resultado");
   const rankingTela = $("rankingTela");
   
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
   const btnNovoJogador = $("novoJogador");
   const btnLimparRanking = $("limparRanking");
   
   const btnEsquerda = $("esquerda");
   const btnDireita = $("direita");
   const btnPular = $("pular");
   
   /* =====================================================
      BANCO DE 50 PERGUNTAS
      Cada resposta: [texto, pontos, explicação]
      ===================================================== */
   
   const bancoPerguntas = [
     ["O coração", "Qual é a principal função do coração?", [
       ["Bombear o sangue pelo corpo", 100, "O coração impulsiona o sangue pela circulação."],
       ["Produzir todo o sangue", 50, "As células sanguíneas são produzidas principalmente na medula óssea."],
       ["Filtrar o ar", -25, "Essa função está ligada ao sistema respiratório."]
     ]],
     ["As hemácias", "Qual é a principal função dos glóbulos vermelhos?", [
       ["Transportar oxigênio", 100, "As hemácias transportam grande parte do oxigênio."],
       ["Combater micróbios", 50, "A defesa é principalmente função dos glóbulos brancos."],
       ["Produzir hormônios", -25, "Os hormônios são produzidos por órgãos e glândulas."]
     ]],
     ["Os glóbulos brancos", "Qual é a função dos glóbulos brancos?", [
       ["Ajudar na defesa do organismo", 100, "Eles participam da defesa contra agentes infecciosos."],
       ["Transportar a maior parte do oxigênio", 50, "Essa tarefa é principalmente das hemácias."],
       ["Bombear o coração", -25, "Quem bombeia o sangue é o coração."]
     ]],
     ["As plaquetas", "O que as plaquetas ajudam a fazer?", [
       ["Ajudar a estancar sangramentos", 100, "Elas participam da coagulação."],
       ["Levar oxigênio aos músculos", 50, "As hemácias transportam a maior parte do oxigênio."],
       ["Produzir ar", -25, "O sangue não produz ar."]
     ]],
     ["O plasma", "O que é o plasma sanguíneo?", [
       ["A parte líquida do sangue", 100, "O plasma transporta várias substâncias."],
       ["Um tipo de osso", -25, "O plasma é a parte líquida do sangue."],
       ["Uma válvula do coração", -25, "As válvulas controlam o fluxo do sangue no coração."]
     ]],
     ["As artérias", "Em geral, para onde as artérias levam o sangue?", [
       ["Para fora do coração", 100, "Artérias levam o sangue para longe do coração."],
       ["Sempre para dentro do coração", -25, "As veias trazem o sangue de volta."],
       ["Somente para os pulmões", 50, "A artéria pulmonar vai aos pulmões, mas existem outras artérias."]
     ]],
     ["As veias", "Qual é a função geral das veias?", [
       ["Levar sangue de volta ao coração", 100, "As veias retornam o sangue ao coração."],
       ["Produzir células sanguíneas", 50, "As células são produzidas principalmente na medula óssea."],
       ["Levar ar aos pulmões", -25, "O ar circula pelas vias respiratórias."]
     ]],
     ["Os capilares", "O que acontece principalmente nos capilares?", [
       ["Trocas de gases e nutrientes com os tecidos", 100, "Os capilares permitem trocas entre sangue e tecidos."],
       ["O coração bate", 50, "Os batimentos acontecem no coração."],
       ["O sangue é produzido", -25, "A produção das células ocorre principalmente na medula óssea."]
     ]],
     ["As cavidades", "Quantas cavidades tem o coração humano?", [
       ["Quatro", 100, "São dois átrios e dois ventrículos."],
       ["Duas", 50, "O coração tem duas metades, cada uma com duas cavidades."],
       ["Seis", -25, "O coração humano possui quatro cavidades."]
     ]],
     ["Os átrios", "Qual é a função dos átrios?", [
       ["Receber o sangue que chega ao coração", 100, "O sangue chega primeiro aos átrios."],
       ["Produzir oxigênio", -25, "O oxigênio passa para o sangue nos pulmões."],
       ["Filtrar resíduos como os rins", 50, "Os rins filtram o sangue; os átrios o recebem."]
     ]],
     ["Os ventrículos", "O que os ventrículos fazem?", [
       ["Bombeiam sangue para fora do coração", 100, "O direito envia sangue aos pulmões e o esquerdo ao corpo."],
       ["Recebem ar da traqueia", -25, "A traqueia pertence ao sistema respiratório."],
       ["Produzem plaquetas", 50, "As plaquetas são formadas na medula óssea."]
     ]],
     ["Lado direito", "Para onde o lado direito do coração bombeia o sangue?", [
       ["Para os pulmões", 100, "O ventrículo direito envia sangue aos pulmões."],
       ["Diretamente para o cérebro", 50, "O cérebro recebe sangue pela circulação sistêmica."],
       ["Somente para o estômago", -25, "O sangue é distribuído pelo corpo."]
     ]],
     ["Lado esquerdo", "Para onde o lado esquerdo do coração bombeia o sangue?", [
       ["Para o restante do corpo", 100, "O ventrículo esquerdo bombeia sangue para o organismo."],
       ["Somente para os pulmões", 50, "O lado direito envia sangue aos pulmões."],
       ["Somente para o estômago", -25, "O sangue chega a vários órgãos."]
     ]],
     ["Artéria pulmonar", "Que tipo de sangue a artéria pulmonar transporta?", [
       ["Sangue com pouco oxigênio em direção aos pulmões", 100, "É uma exceção à ideia comum sobre artérias e oxigênio."],
       ["Sangue sem células", -25, "O sangue contém células e plasma."],
       ["Somente sangue rico em oxigênio", 50, "As veias pulmonares trazem sangue rico em oxigênio."]
     ]],
     ["Veias pulmonares", "O que as veias pulmonares levam ao coração?", [
       ["Sangue rico em oxigênio vindo dos pulmões", 100, "Elas chegam ao átrio esquerdo."],
       ["Sangue com pouco oxigênio vindo do corpo", 50, "Esse sangue retorna pelas veias cavas."],
       ["Ar para os pulmões", -25, "O ar não circula pelas veias."]
     ]],
     ["A aorta", "Qual é a função da aorta?", [
       ["Levar sangue do coração para o corpo", 100, "A aorta é a maior artéria do corpo."],
       ["Levar ar à traqueia", -25, "A aorta é um vaso sanguíneo."],
       ["Trazer sangue dos pulmões ao coração", 50, "Essa é a função das veias pulmonares."]
     ]],
     ["Veias cavas", "O que as veias cavas fazem?", [
       ["Trazem sangue do corpo para o átrio direito", 100, "Elas retornam o sangue ao coração."],
       ["Levam sangue do coração aos pulmões", 50, "Essa é a função da artéria pulmonar."],
       ["Levam ar ao estômago", -25, "O ar não circula pelos vasos sanguíneos."]
     ]],
     ["Circulação pulmonar", "Qual caminho descreve a circulação pulmonar?", [
       ["Coração, pulmões e coração", 100, "O sangue vai aos pulmões e depois retorna ao coração."],
       ["Coração, pernas e cérebro apenas", 50, "Esses órgãos participam da circulação sistêmica."],
       ["Estômago e rins sem passar pelo coração", -25, "O coração impulsiona a circulação."]
     ]],
     ["Circulação sistêmica", "Qual caminho descreve a circulação sistêmica?", [
       ["Coração, corpo e coração", 100, "O sangue vai aos tecidos e retorna ao coração."],
       ["Pulmões, traqueia e nariz", -25, "Esse caminho está ligado à respiração."],
       ["Somente o lado direito do coração", 50, "A circulação sistêmica começa no ventrículo esquerdo."]
     ]],
     ["Oxigênio", "Por que as células precisam de oxigênio?", [
       ["Para ajudar a produzir energia", 100, "A maioria das células usa oxigênio na respiração celular."],
       ["Para transformar ossos em sangue", -25, "O oxigênio não transforma ossos em sangue."],
       ["Para substituir toda a água", 50, "Água e oxigênio têm funções diferentes."]
     ]],
     ["Gás carbônico", "O que acontece com grande parte do gás carbônico produzido pelo corpo?", [
       ["É levado aos pulmões para ser eliminado", 100, "Ele passa para os pulmões e sai na expiração."],
       ["Fica guardado para sempre no coração", -25, "O corpo elimina o excesso de gás carbônico."],
       ["Vira osso imediatamente", -25, "O gás carbônico não se transforma diretamente em osso."]
     ]],
     ["Os pulmões", "Qual é o papel dos pulmões na circulação?", [
       ["Permitir que o sangue receba oxigênio e elimine gás carbônico", 100, "As trocas gasosas acontecem nos pulmões."],
       ["Bombear sangue para o corpo", -25, "Quem bombeia o sangue é o coração."],
       ["Produzir todas as células do sangue", 50, "As células sanguíneas são produzidas principalmente na medula óssea."]
     ]],
     ["Os alvéolos", "Onde ocorrem as trocas gasosas nos pulmões?", [
       ["Nos alvéolos pulmonares", 100, "Os alvéolos ficam próximos dos capilares."],
       ["Nas válvulas cardíacas", -25, "As válvulas controlam o fluxo de sangue."],
       ["Nos ossos das pernas", -25, "As trocas gasosas acontecem nos pulmões."]
     ]],
     ["Batimentos", "O que representa um batimento cardíaco?", [
       ["A atividade de contração e relaxamento do coração", 100, "O ciclo cardíaco inclui contração e relaxamento."],
       ["Uma respiração completa", 50, "Respiração e batimento são processos diferentes."],
       ["O movimento dos alimentos no estômago", -25, "A digestão é outra função do corpo."]
     ]],
     ["Sístole", "O que acontece durante a sístole ventricular?", [
       ["Os ventrículos se contraem e ejetam sangue", 100, "A contração impulsiona sangue para as artérias."],
       ["Os pulmões param de funcionar", -25, "A sístole é uma fase do ciclo cardíaco."],
       ["O sangue deixa de circular", -25, "O sangue continua circulando durante o ciclo cardíaco."]
     ]],
     ["Diástole", "O que acontece durante a diástole?", [
       ["O coração relaxa e suas cavidades se enchem", 100, "O relaxamento permite o enchimento das cavidades."],
       ["O coração fica permanentemente parado", -25, "A diástole é uma fase normal do ciclo cardíaco."],
       ["As artérias viram veias", -25, "Artérias e veias são vasos diferentes."]
     ]],
     ["O pulso", "O que você percebe quando mede o pulso no punho?", [
       ["Ondas de pressão nas artérias", 100, "Essas ondas estão relacionadas aos batimentos cardíacos."],
       ["O ar entrando nos pulmões", 50, "Respiração e pulso podem variar juntos, mas são diferentes."],
       ["A digestão dos alimentos", -25, "O pulso está ligado à circulação."]
     ]],
     ["Cor do sangue", "Qual afirmação sobre a cor do sangue humano está correta?", [
       ["É vermelho e pode ter tons diferentes conforme a oxigenação", 100, "O sangue com mais oxigênio tende a ser vermelho mais vivo."],
       ["O sangue das veias é azul", -25, "O sangue é vermelho; a pele pode fazer as veias parecerem azuladas."],
       ["O sangue é sempre verde", -25, "O sangue humano é vermelho."]
     ]],
     ["O sangue", "Como o sangue é classificado no corpo humano?", [
       ["Como um tecido líquido", 100, "É formado por plasma e elementos celulares."],
       ["Como um osso líquido", -25, "O sangue é um tecido, não um osso."],
       ["Como um órgão sólido", 50, "O sangue é um tecido líquido."]
     ]],
     ["Entrada de oxigênio", "Como o oxigênio entra no sangue?", [
       ["Pelas trocas gasosas nos pulmões", 100, "O oxigênio passa dos alvéolos para o sangue."],
       ["Pelos alimentos diretamente para as veias", 50, "O oxigênio vem do ar respirado."],
       ["É fabricado pelo coração", -25, "O coração bombeia sangue, mas não fabrica oxigênio."]
     ]],
     ["Nutrientes", "Como os nutrientes chegam às células?", [
       ["São transportados pelo sangue", 100, "O sangue distribui nutrientes absorvidos pelo sistema digestório."],
       ["São transportados somente pelo ar", 50, "O ar fornece oxigênio; o sangue leva muitos nutrientes."],
       ["São produzidos pelas artérias", -25, "As artérias transportam sangue."]
     ]],
     ["Hormônios", "Qual é uma função do sangue relacionada aos hormônios?", [
       ["Transportar hormônios até órgãos e tecidos", 100, "O sangue ajuda a distribuir hormônios pelo corpo."],
       ["Destruir todos os hormônios", -25, "Os hormônios são mensageiros químicos importantes."],
       ["Transformar hormônios em ossos", -25, "Hormônios não se transformam diretamente em ossos."]
     ]],
     ["Temperatura corporal", "Como a circulação ajuda a regular a temperatura?", [
       ["Distribuindo calor e ajustando o fluxo de sangue na pele", 100, "Os vasos ajudam o corpo a trocar calor com o ambiente."],
       ["Parando todos os batimentos", -25, "O coração precisa continuar bombeando sangue."],
       ["Transformando o sangue em gelo", -25, "O sangue permanece líquido em condições normais."]
     ]],
     ["Coagulação", "Por que a coagulação do sangue é importante?", [
       ["Ajuda a reduzir a perda de sangue em ferimentos", 100, "A coagulação ajuda a controlar o sangramento."],
       ["Impede o coração de bater", -25, "A coagulação normal ajuda a estancar sangramentos."],
       ["Leva ar às células", -25, "O sangue transporta oxigênio, não ar."]
     ]],
     ["Miocárdio", "Como se chama o músculo do coração?", [
       ["Miocárdio", 100, "O miocárdio é o músculo responsável pela contração cardíaca."],
       ["Epiderme", -25, "A epiderme é a camada mais externa da pele."],
       ["Cartilagem", 50, "O coração tem vários tecidos, incluindo o miocárdio."]
     ]],
     ["Septo cardíaco", "Qual é a função do septo do coração?", [
       ["Separar o lado direito do esquerdo", 100, "O septo separa as duas metades do coração."],
       ["Produzir oxigênio", -25, "O oxigênio vem do ar e passa ao sangue nos pulmões."],
       ["Ligar o coração ao estômago", -25, "O septo é uma estrutura interna do coração."]
     ]],
     ["Válvulas", "Qual é a função das válvulas cardíacas?", [
       ["Ajudar a impedir que o sangue volte na direção errada", 100, "As válvulas ajudam a manter o fluxo em uma direção."],
       ["Produzir glóbulos brancos", 50, "Os glóbulos brancos são produzidos principalmente na medula óssea."],
       ["Permitir que o ar entre no coração", -25, "O ar não circula dentro do coração."]
     ]],
     ["Tricúspide", "Onde fica a válvula tricúspide?", [
       ["Entre o átrio direito e o ventrículo direito", 100, "Ela ajuda a impedir o retorno do sangue ao átrio direito."],
       ["Entre o átrio esquerdo e o ventrículo esquerdo", 50, "Essa é a posição da válvula mitral."],
       ["Dentro dos pulmões", -25, "A válvula tricúspide fica no coração."]
     ]],
     ["Mitral", "Onde fica a válvula mitral?", [
       ["Entre o átrio esquerdo e o ventrículo esquerdo", 100, "A válvula mitral também é chamada de bicúspide."],
       ["Entre o átrio direito e o ventrículo direito", 50, "Essa é a posição da válvula tricúspide."],
       ["Entre os dois pulmões", -25, "A válvula mitral fica no coração."]
     ]],
     ["Válvula pulmonar", "Onde fica a válvula pulmonar?", [
       ["Na saída do ventrículo direito para a artéria pulmonar", 100, "Ela ajuda a impedir que o sangue retorne ao ventrículo."],
       ["Na saída do ventrículo esquerdo para a aorta", 50, "Essa é a posição da válvula aórtica."],
       ["Dentro do estômago", -25, "A válvula pulmonar fica no coração."]
     ]],
     ["Válvula aórtica", "Onde fica a válvula aórtica?", [
       ["Na saída do ventrículo esquerdo para a aorta", 100, "Ela controla a passagem de sangue para a aorta."],
       ["Entre o átrio direito e o ventrículo direito", 50, "Essa é a posição da válvula tricúspide."],
       ["Na entrada dos pulmões", -25, "A válvula aórtica fica na saída do ventrículo esquerdo."]
     ]],
     ["Frequência cardíaca", "O que significa frequência cardíaca?", [
       ["Quantidade de batimentos por minuto", 100, "A frequência cardíaca é expressa em batimentos por minuto."],
       ["Quantidade de respirações por dia", 50, "Isso está relacionado à frequência respiratória."],
       ["Quantidade de ossos do corpo", -25, "A frequência cardíaca mede os batimentos do coração."]
     ]],
     ["Exercício físico", "Por que o coração bate mais rápido durante exercícios?", [
       ["Os músculos precisam de mais oxigênio e nutrientes", 100, "O coração aumenta o fluxo sanguíneo para atender à demanda."],
       ["O sangue deixa de circular", -25, "A circulação continua e geralmente aumenta durante o exercício."],
       ["Os pulmões param de funcionar", -25, "Os pulmões continuam trabalhando durante o exercício."]
     ]],
     ["Cuidar do coração", "Qual hábito ajuda a manter o coração saudável?", [
       ["Fazer atividade física adequada regularmente", 100, "A atividade física regular contribui para a saúde cardiovascular."],
       ["Nunca se movimentar", -25, "Movimentar-se adequadamente beneficia a saúde."],
       ["Dormir muito pouco sempre", -25, "Dormir o suficiente também é importante."]
     ]],
     ["Cigarro", "Como fumar pode afetar o sistema cardiovascular?", [
       ["Pode prejudicar os vasos e aumentar riscos cardiovasculares", 100, "Fumar aumenta o risco de doenças do coração e dos vasos."],
       ["Fortalece sempre as artérias", -25, "Fumar pode danificar os vasos sanguíneos."],
       ["Não afeta a circulação", -25, "O tabagismo prejudica a saúde cardiovascular."]
     ]],
     ["Água", "Por que beber água é importante?", [
       ["Ajuda a manter o equilíbrio de líquidos do corpo", 100, "A hidratação contribui para o funcionamento do organismo."],
       ["Substitui o sangue", -25, "A água não substitui o sangue."],
       ["Faz o coração parar", -25, "A hidratação adequada ajuda o corpo a funcionar normalmente."]
     ]],
     ["Pressão arterial", "O que é a pressão arterial?", [
       ["A força do sangue contra as paredes das artérias", 100, "A pressão arterial é medida com valores sistólico e diastólico."],
       ["A temperatura dos pulmões", -25, "Pressão arterial não é temperatura."],
       ["A quantidade de ossos", -25, "A pressão arterial está relacionada à circulação."]
     ]],
     ["Alimentação", "Qual escolha costuma ajudar na saúde cardiovascular?", [
       ["Ter alimentação equilibrada e variada", 100, "Uma alimentação equilibrada contribui para a saúde do coração."],
       ["Comer apenas um alimento", -25, "O organismo precisa de vários nutrientes."],
       ["Evitar toda atividade física", -25, "A atividade física adequada é benéfica para muitas pessoas."]
     ]],
     ["Circulação contínua", "Como o sangue circula no corpo?", [
       ["Continuamente pelos vasos, impulsionado pelo coração", 100, "O coração e os vasos mantêm o sangue em circulação."],
       ["Uma única vez e depois desaparece", -25, "O sangue circula continuamente."],
       ["Somente nos braços", -25, "O sangue chega aos tecidos de todo o corpo."]
     ]],
     ["Cérebro", "Por que o cérebro precisa receber sangue continuamente?", [
       ["Para receber oxigênio e glicose", 100, "O cérebro precisa de oxigênio e nutrientes para funcionar."],
       ["Para transformar sangue em ar", -25, "O sangue transporta substâncias importantes ao cérebro."],
       ["Para produzir todos os ossos", -25, "O cérebro não produz todos os ossos."]
     ]],
     ["Rins", "Qual é uma função dos rins relacionada ao sangue?", [
       ["Filtrar o sangue e ajudar a eliminar resíduos pela urina", 100, "Os rins ajudam a regular líquidos e remover resíduos."],
       ["Bombear sangue aos pulmões", 50, "Essa é uma função do coração."],
       ["Transportar ar pela traqueia", -25, "O ar circula no sistema respiratório."]
     ]],
     ["Intestino", "Depois da digestão, como muitos nutrientes chegam ao corpo?", [
       ["São absorvidos no intestino e transportados pelo sangue", 100, "Muitos nutrientes entram na circulação após a absorção intestinal."],
       ["São enviados diretamente pelos ossos", -25, "Os ossos não transportam diretamente os nutrientes digeridos."],
       ["Viraram ar nos pulmões", -25, "Os nutrientes são absorvidos e distribuídos pelo organismo."]
     ]],
     ["Sangue nas pernas", "O que ajuda o sangue das pernas a retornar ao coração?", [
       ["Contrações musculares e válvulas das veias", 100, "Os músculos ajudam a empurrar o sangue e as válvulas reduzem o refluxo."],
       ["A gravidade sempre empurra o sangue para cima", -25, "A gravidade dificulta o retorno do sangue das pernas."],
       ["Somente os pulmões", 50, "A respiração pode contribuir, mas músculos e válvulas são importantes."]
     ]],
     ["Tipos de vasos", "Quais são os três principais tipos de vasos sanguíneos?", [
       ["Artérias, veias e capilares", 100, "Esses três tipos formam a rede de vasos sanguíneos."],
       ["Nervos, músculos e ossos", -25, "Essas estruturas não são vasos sanguíneos."],
       ["Traqueia, brônquios e alvéolos", 50, "Essas estruturas pertencem ao sistema respiratório."]
     ]],
     ["Paredes dos capilares", "Por que as paredes dos capilares são muito finas?", [
       ["Para facilitar as trocas entre sangue e tecidos", 100, "A parede fina facilita as trocas de gases e substâncias."],
       ["Para impedir todas as trocas", -25, "Os capilares são locais importantes de troca."],
       ["Para armazenar ossos", -25, "Os capilares são vasos sanguíneos muito pequenos."]
     ]],
     ["Coração em repouso", "A frequência cardíaca pode variar entre pessoas?", [
       ["Sim, depende de fatores como idade e atividade", 100, "A frequência varia conforme a pessoa e a situação."],
       ["Não, é igual para todo mundo", -25, "A frequência cardíaca não é igual para todas as pessoas."],
       ["Só muda durante o sono", 50, "Ela pode mudar durante exercício, repouso, sono e emoções."]
     ]],
     ["O coração é músculo", "Por que o coração é considerado um órgão muscular?", [
       ["Porque seu músculo se contrai para bombear sangue", 100, "O músculo cardíaco realiza contrações involuntárias."],
       ["Porque movimenta diretamente os braços", 50, "Os músculos esqueléticos movimentam os braços."],
       ["Porque é feito apenas de osso", -25, "O coração não é feito apenas de osso."]
     ]],
     ["Circulação dupla", "Por que a circulação humana é chamada de dupla?", [
       ["Porque possui os circuitos pulmonar e sistêmico", 100, "O sangue passa pelo circuito pulmonar e pelo sistêmico."],
       ["Porque temos dois corações", -25, "Os seres humanos têm um coração com quatro cavidades."],
       ["Porque o sangue circula só duas vezes na vida", -25, "A circulação é contínua."]
     ]]
   ];
   
   /* =====================================================
      ESTADO DO JOGO
      ===================================================== */
   
   let jogador;
   let cameraX = 0;
   let estado = "inicio";
   let desafios = [];
   let desafioAtual = 0;
   let nomeAtual = "Jogador";
   let pontuacao = 0;
   let vidas = 3;
   let respostasPartida = [];
   let teclas = {};
   
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
       .map((p, i) => ({
         titulo: p[0],
         texto: p[1],
         opcoes: p[2].map(a => ({
           texto: a[0],
           pontos: a[1],
           explicacao: a[2]
         })),
         x: posicoesPerguntas[i],
         fase: i + 1
       }));
   }
   
   function criarJogador() {
     return {
       x: 70,
       y: CHAO - 36,
       w: 36,
       h: 30,
       vx: 0,
       vy: 0,
       velocidade: 4,
       noChao: true
     };
   }
   
   function mostrar(el) {
     if (el) el.classList.remove("escondido");
   }
   
   function esconder(el) {
     if (el) el.classList.add("escondido");
   }
   
   function esconderTodasTelas() {
     esconder(mensagem);
     esconder(telaPergunta);
     esconder(telaResultado);
     esconder(rankingTela);
   }
   
   function atualizarPainel() {
     nomePainel.textContent = nomeAtual;
     vidasPainel.textContent = vidas;
     pontosPainel.textContent = pontuacao;
   
     const nomesFases = [
       "Coração direito",
       "Pulmões",
       "Coração esquerdo",
       "Corpo humano",
       "Circulação"
     ];
   
     fasePainel.textContent =
       nomesFases[Math.min(desafioAtual, nomesFases.length - 1)];
   }
   
   function iniciarJogo() {
     nomeAtual = nomeInput.value.trim() || "Jogador";
     nomeAtual = nomeAtual.slice(0, 30);
   
     pontuacao = 0;
     vidas = 3;
     desafioAtual = 0;
     respostasPartida = [];
     cameraX = 0;
     jogador = criarJogador();
     desafios = selecionarPerguntas();
   
     esconder(cadastro);
     esconderTodasTelas();
     mostrar(informacoes);
   
     estado = "jogando";
     atualizarPainel();
     canvas.focus();
   }
   
   function novoJogador() {
     esconderTodasTelas();
     esconder(informacoes);
     mostrar(cadastro);
     estado = "inicio";
     nomeInput.value = "";
     nomeInput.focus();
   }
   
   btnComecar.addEventListener("click", iniciarJogo);
   
   nomeInput.addEventListener("keydown", e => {
     if (e.key === "Enter") iniciarJogo();
   });
   
   /* =====================================================
      MOVIMENTAÇÃO E CONTROLES
      ===================================================== */
   
   function pular() {
     if (estado === "jogando" && jogador.noChao) {
       jogador.vy = -12;
       jogador.noChao = false;
     }
   }
   
   window.addEventListener("keydown", e => {
     const tecla = e.key.toLowerCase();
   
     if (["arrowleft", "arrowright", "arrowup", " "].includes(tecla)) {
       e.preventDefault();
     }
   
     if (tecla === "arrowleft" || tecla === "a") teclas.esquerda = true;
     if (tecla === "arrowright" || tecla === "d") teclas.direita = true;
   
     if (tecla === " " || tecla === "arrowup" || tecla === "w") {
       if (!e.repeat) pular();
     }
   });
   
   window.addEventListener("keyup", e => {
     const tecla = e.key.toLowerCase();
     if (tecla === "arrowleft" || tecla === "a") teclas.esquerda = false;
     if (tecla === "arrowright" || tecla === "d") teclas.direita = false;
   });
   
   window.addEventListener("blur", () => {
     teclas = {};
   });
   
   function configurarToque(botao, acao, soltar) {
     botao.addEventListener("pointerdown", e => {
       e.preventDefault();
       if (botao.setPointerCapture) botao.setPointerCapture(e.pointerId);
       acao();
     });
   
     ["pointerup", "pointercancel", "lostpointercapture"].forEach(evento => {
       botao.addEventListener(evento, () => {
         if (soltar) soltar();
       });
     });
   }
   
   configurarToque(
     btnEsquerda,
     () => { teclas.esquerda = true; },
     () => { teclas.esquerda = false; }
   );
   
   configurarToque(
     btnDireita,
     () => { teclas.direita = true; },
     () => { teclas.direita = false; }
   );
   
   configurarToque(btnPular, pular);
   
   /* =====================================================
      PERGUNTAS
      ===================================================== */
   
   function abrirPergunta(indice) {
     if (estado !== "jogando") return;
   
     estado = "pergunta";
     desafioAtual = indice;
   
     const pergunta = desafios[indice];
   
     perguntaTitulo.textContent =
       `🩸 Pergunta ${indice + 1}: ${pergunta.titulo}`;
     perguntaTexto.textContent = pergunta.texto;
     feedback.textContent = "";
     opcoes.innerHTML = "";
   
     btnProximo.disabled = true;
     btnProximo.textContent = "Responda para continuar";
   
     embaralhar(pergunta.opcoes).forEach(opcao => {
       const botao = document.createElement("button");
       botao.type = "button";
       botao.className = "opcao-resposta";
       botao.textContent = opcao.texto;
   
       botao.addEventListener("click", () => responderPergunta(opcao, botao));
   
       opcoes.appendChild(botao);
     });
   
     esconder(mensagem);
     esconder(telaResultado);
     esconder(rankingTela);
     mostrar(telaPergunta);
   }
   
   function responderPergunta(opcaoEscolhida, botaoEscolhido) {
     if (estado !== "pergunta") return;
     if (btnProximo.disabled === false) return;
   
     pontuacao = Math.max(0, pontuacao + opcaoEscolhida.pontos);
   
     if (opcaoEscolhida.pontos < 0) vidas--;
   
     respostasPartida.push({
       pergunta: desafios[desafioAtual].texto,
       pontos: opcaoEscolhida.pontos,
       explicacao: opcaoEscolhida.explicacao
     });
   
     const botoes = opcoes.querySelectorAll("button");
     botoes.forEach(b => {
       b.disabled = true;
       b.style.opacity = "0.7";
     });
   
     botaoEscolhido.style.opacity = "1";
     botaoEscolhido.style.fontWeight = "bold";
   
     if (opcaoEscolhida.pontos === 100) {
       feedback.textContent = `✅ Correto! +100 pontos. ${opcaoEscolhida.explicacao}`;
     } else if (opcaoEscolhida.pontos === 50) {
       feedback.textContent = `🟡 Parcialmente correto! +50 pontos. ${opcaoEscolhida.explicacao}`;
     } else {
       feedback.textContent = `❌ Resposta incorreta! -25 pontos e uma vida perdida. ${opcaoEscolhida.explicacao}`;
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
   
     jogador.x = Math.max(jogador.x, desafios[desafioAtual].x + 70);
     desafioAtual++;
     estado = "jogando";
     atualizarPainel();
   });
   
   /* =====================================================
      RESULTADO E RANKING
      ===================================================== */
   
   function lerRanking() {
     try {
       return JSON.parse(localStorage.getItem("rankingCoracao")) || [];
     } catch (erro) {
       return [];
     }
   }
   
   function salvarPontuacao() {
     const ranking = lerRanking();
   
     ranking.push({
       nome: nomeAtual,
       pontos: pontuacao,
       data: new Date().toLocaleDateString("pt-BR")
     });
   
     ranking.sort((a, b) => b.pontos - a.pontos);
   
     try {
       localStorage.setItem(
         "rankingCoracao",
         JSON.stringify(ranking.slice(0, 50))
       );
     } catch (erro) {
       console.warn("Não foi possível salvar o ranking.", erro);
     }
   }
   
   function finalizarJogo() {
     estado = "resultado";
     salvarPontuacao();
   
     tituloResultado.textContent =
       vidas <= 0 ? "❤️‍🩹 Fim da aventura!" : "🏆 Aventura concluída!";
   
     resumo.textContent = vidas <= 0
       ? `As suas vidas acabaram, ${nomeAtual}. Continue estudando e tente novamente!`
       : `Parabéns, ${nomeAtual}! Você percorreu o sistema cardiovascular.`;
   
     pontuacaoFinal.textContent = `⭐ Pontuação final: ${pontuacao} pontos`;
   
     detalhesPartida.innerHTML = "";
   
     const lista = document.createElement("ol");
   
     respostasPartida.forEach(resposta => {
       const item = document.createElement("li");
       item.textContent =
         `${resposta.pergunta} — ${resposta.pontos > 0 ? "+" : ""}${resposta.pontos} pontos`;
       lista.appendChild(item);
     });
   
     detalhesPartida.appendChild(lista);
   
     esconderTodasTelas();
     mostrar(telaResultado);
     atualizarPainel();
   }
   
   function mostrarRanking() {
     const ranking = lerRanking();
     listaRanking.innerHTML = "";
   
     if (ranking.length === 0) {
       const item = document.createElement("li");
       item.textContent = "Nenhuma pontuação salva ainda.";
       listaRanking.appendChild(item);
     } else {
       ranking.forEach((registro, indice) => {
         const item = document.createElement("li");
         item.textContent =
           `${indice + 1}. ${registro.nome} — ${registro.pontos} pontos (${registro.data})`;
         listaRanking.appendChild(item);
       });
     }
   
     esconderTodasTelas();
     mostrar(rankingTela);
     estado = "ranking";
   }
   
   btnVerRanking.addEventListener("click", mostrarRanking);
   btnNovoJogador.addEventListener("click", novoJogador);
   
   btnLimparRanking.addEventListener("click", () => {
     const confirmar = window.confirm("Deseja apagar todas as pontuações deste navegador?");
     if (!confirmar) return;
   
     localStorage.removeItem("rankingCoracao");
     mostrarRanking();
   });
   
   btnNovoJogador.addEventListener("click", novoJogador);
   
   /* O botão de ranking também permite iniciar outra partida ao voltar. */
   btnVerRanking.addEventListener("click", () => {
     estado = "ranking";
   });
   
   function voltarParaCadastro() {
     esconderTodasTelas();
     esconder(informacoes);
     mostrar(cadastro);
     estado = "inicio";
   }
   
   function configurarInicio() {
     mostrar(cadastro);
     mostrar(mensagem);
     esconder(informacoes);
     esconder(telaPergunta);
     esconder(telaResultado);
     esconder(rankingTela);
   }
   
   /* =====================================================
      DESENHO DO JOGO
      ===================================================== */
   
   function desenharFundo() {
     const gradiente = ctx.createLinearGradient(0, 0, 0, H);
     gradiente.addColorStop(0, "#e7f8ff");
     gradiente.addColorStop(1, "#ffffff");
   
     ctx.fillStyle = gradiente;
     ctx.fillRect(0, 0, W, H);
   
     // Vasos decorativos
     ctx.lineCap = "round";
     ctx.lineWidth = 20;
     ctx.strokeStyle = "rgba(201,24,74,0.12)";
     ctx.beginPath();
     ctx.moveTo(-cameraX * 0.2, 100);
     ctx.bezierCurveTo(180, 20, 250, 160, 430, 90);
     ctx.stroke();
   
     ctx.lineWidth = 15;
     ctx.strokeStyle = "rgba(40,100,200,0.12)";
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
   
     ctx.fillStyle = "rgba(60,150,60,0.25)";
     for (let x = 0; x < W; x += 45) {
       ctx.fillRect(x, CHAO + 20, 20, 4);
     }
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
   
     ctx.fillStyle = "#fff";
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
   
       ctx.font = "12px Arial";
       ctx.fillStyle = "#24445b";
       ctx.fillText("Pergunta", x, CHAO - 48);
     });
   }
   
   function desenharProgresso() {
     ctx.fillStyle = "rgba(255,255,255,0.9)";
     ctx.fillRect(12, 12, 170, 38);
   
     ctx.fillStyle = "#273746";
     ctx.font = "bold 14px Arial";
     ctx.textAlign = "left";
     ctx.fillText(`Pergunta ${Math.min(desafioAtual + 1, 5)} de 5`, 22, 36);
   
     ctx.fillStyle = "#e63946";
     ctx.fillRect(110, 23, 58 * (desafioAtual / 5), 9);
   
     ctx.strokeStyle = "#e63946";
     ctx.strokeRect(110, 23, 58, 9);
   }
   
   function desenhar() {
     desenharFundo();
     desenharChao();
     desenharPerguntas();
     desenharJogador();
     desenharProgresso();
   }
   
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
   
     if (
       desafioAtual < desafios.length &&
       jogador.x >= desafios[desafioAtual].x
     ) {
       abrirPergunta(desafioAtual);
     }
   
     if (jogador.x >= MUNDO - 100 && desafioAtual >= desafios.length) {
       finalizarJogo();
     }
   
     atualizarPainel();
   }
   
   function loop() {
     if (estado === "jogando") atualizar();
     desenhar();
     requestAnimationFrame(loop);
   }
   
   /* =====================================================
      INICIALIZAÇÃO
      ===================================================== */
   
   jogador = criarJogador();
   desafios = selecionarPerguntas();
   configurarInicio();
   loop();
   
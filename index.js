var jogadores = [];
var intervalo;
var sorteioEmAndamento = false;
var numerosSorteadosGlobal = []; // Renomeado para clareza

function gerarNumerosAleatorios(quantidade, min, max) {
    var numeros = [];
    while (numeros.length < quantidade) {
        var aleatorio = Math.floor(Math.random() * (max - min + 1) + min);
        if (!numeros.includes(aleatorio)) {
            numeros.push(aleatorio);
        }
    }
    return numeros;
}

function gerarCartela() {
    if (sorteioEmAndamento) {
        alert("ERRO: O sorteio está em andamento!");
        return;
    }

    var nomeJogador = prompt("Digite o nome do jogador:");
    if (!nomeJogador || nomeJogador.trim() === "") return;

    // Validação simples de nome
    if (jogadores.find(j => j.nomeJogador === nomeJogador)) {
        alert("Este nome já está em uso!");
        return;
    }

    // Gerando colunas padrão Bingo (B: 1-15, I: 16-30...)
    var cartela = [
        gerarNumerosAleatorios(5, 1, 15),
        gerarNumerosAleatorios(5, 16, 30),
        gerarNumerosAleatorios(5, 31, 45),
        gerarNumerosAleatorios(5, 46, 60),
        gerarNumerosAleatorios(5, 61, 75)
    ];

    jogadores.push({ nomeJogador: nomeJogador, cartela: cartela });
    desenharCartela(nomeJogador, cartela);
}

function desenharCartela(nome, cartela) {
    var div = document.getElementById("espaco-cartelas");
    var jogadorDiv = document.createElement("div");
    jogadorDiv.classList.add("jogador");
    jogadorDiv.innerHTML = `<h3>${nome}</h3>`;

    var tabela = document.createElement("table");
    tabela.classList.add("cartela");

    // Cabeçalho BINGO
    var thead = document.createElement("thead");
    thead.innerHTML = "<tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr>";
    tabela.appendChild(thead);

    // Corpo da Cartela
    for (var i = 0; i < 5; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < 5; j++) {
            var td = document.createElement("td");
            if (i === 2 && j === 2) {
                td.innerText = "X";
                td.classList.add("sorteado"); // O centro já começa marcado
            } else {
                td.innerText = cartela[j][i];
            }
            tr.appendChild(td);
        }
        tabela.appendChild(tr);
    }

    jogadorDiv.appendChild(tabela);
    div.appendChild(jogadorDiv);
}

function iniciarJogo() {
    if (jogadores.length < 2) {
        alert("É necessário pelo menos 2 jogadores!");
        return;
    }
    if (sorteioEmAndamento) return;

    sorteioEmAndamento = true;
    var painelSorteio = document.getElementById("numeros-sorteados");
    painelSorteio.innerHTML = "";
    numerosSorteadosGlobal = [];

    intervalo = setInterval(function() {
        if (numerosSorteadosGlobal.length >= 75) {
            clearInterval(intervalo);
            return;
        }

        var numeroSorteado;
        do {
            numeroSorteado = Math.floor(Math.random() * 75) + 1;
        } while (numerosSorteadosGlobal.includes(numeroSorteado));

        numerosSorteadosGlobal.push(numeroSorteado);
        
        // Criar elemento visual da bola
        var bola = document.createElement("div");
        bola.classList.add("numero-sorteado");
        bola.innerText = numeroSorteado;
        painelSorteio.appendChild(bola);

        marcarNumeroSorteado(numeroSorteado);

        var ganhadores = verificarGanhadores();
        if (ganhadores.length > 0) {
            clearInterval(intervalo);
            sorteioEmAndamento = false;
            alert("BINGO! Vencedores: " + ganhadores.map(g => g.nomeJogador).join(", "));
        }
    }, 500); // 500ms para dar tempo de ver a marcação
}

function marcarNumeroSorteado(numero) {
    var tds = document.querySelectorAll(".cartela td");
    tds.forEach(td => {
        if (td.innerText == numero) {
            td.classList.add("sorteado");
        }
    });
}

function verificarGanhadores() {
    var vencedores = [];
    
    jogadores.forEach(jogador => {
        var totalMarcados = 0;
        // Percorre a cartela 5x5
        for (var col = 0; col < 5; col++) {
            for (var lin = 0; lin < 5; lin++) {
                var num = jogador.cartela[col][lin];
                // Se for o centro (X) ou se o número já foi sorteado
                if ((col === 2 && lin === 2) || numerosSorteadosGlobal.includes(num)) {
                    totalMarcados++;
                }
            }
        }
        if (totalMarcados === 25) {
            vencedores.push(jogador);
        }
    });
    return vencedores;
}

function reiniciarJogo() {
    clearInterval(intervalo);
    jogadores = [];
    numerosSorteadosGlobal = [];
    sorteioEmAndamento = false;
    document.getElementById("espaco-cartelas").innerHTML = "";
    document.getElementById("numeros-sorteados").innerHTML = "";
}

  jogadores = [];
  numerosCartela = [];

  var numerosCartelaDiv = document.getElementById("numeros-sorteados");
  numerosCartelaDiv.innerHTML = "";

  var espacoCartelasDiv = document.getElementById("espaco-cartelas");
  espacoCartelasDiv.innerHTML = "";

  console.log("Jogo reiniciado.");

  sorteioEmAndamento = false;
}

function marcarNumeroSorteado(numero) {
  var cartelas = document.getElementsByClassName("cartela");

  for (var i = 0; i < cartelas.length; i++) {
    var celulas = cartelas[i].getElementsByTagName("td");

    for (var j = 0; j < celulas.length; j++) {
      if (celulas[j].innerText === numero.toString()) {
        celulas[j].classList.add("sorteado");
      }
    }
  }
}

function verificarGanhadores() {
  var ganhadores = [];

  if (numerosCartela.length < 25) {
    return ganhadores;
  }

  jogadores.forEach(function(jogador) {
    var ganhou = true;

    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        if (!numerosCartela.includes(jogador.cartela[i][j])) {
          ganhou = false;
          break;
        }
      }

      if (!ganhou) {
        break;
      }
    }

    if (ganhou) {
      ganhadores.push(jogador);
    }
  });

  return ganhadores;
}
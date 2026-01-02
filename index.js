var jogadores = [];
var intervalo;
var sorteioEmAndamento = false;
var numerosSorteadosGlobal = [];

function tocarSom() {
    const som = document.getElementById("som-sorteio");
    if (som) {
        som.currentTime = 0;
        som.play().catch(e => console.log("Som bloqueado pelo navegador"));
    }
}

function gerarNumerosAleatorios(quantidade, min, max) {
    var numeros = [];
    while (numeros.length < quantidade) {
        var aleatorio = Math.floor(Math.random() * (max - min + 1) + min);
        if (!numeros.includes(aleatorio)) numeros.push(aleatorio);
    }
    return numeros;
}

function gerarCartela() {
    if (sorteioEmAndamento) return alert("Jogo em andamento!");
    
    var nome = prompt("Nome do Jogador:");
    if (!nome || nome.trim() === "") return;
    if (jogadores.find(j => j.nome === nome)) return alert("Nome já existe!");

    var cartela = [
        gerarNumerosAleatorios(5, 1, 15),
        gerarNumerosAleatorios(5, 16, 30),
        gerarNumerosAleatorios(5, 31, 45),
        gerarNumerosAleatorios(5, 46, 60),
        gerarNumerosAleatorios(5, 61, 75)
    ];

    jogadores.push({ nome: nome, cartela: cartela });
    desenharCartela(nome, cartela);
}

function desenharCartela(nome, cartela) {
    var div = document.getElementById("espaco-cartelas");
    var html = `<div class="jogador"><h3>${nome}</h3><table class="cartela"><thead><tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr></thead><tbody>`;
    
    for (var i = 0; i < 5; i++) {
        html += "<tr>";
        for (var j = 0; j < 5; j++) {
            if (i === 2 && j === 2) {
                html += `<td class="sorteado">X</td>`;
            } else {
                html += `<td>${cartela[j][i]}</td>`;
            }
        }
        html += "</tr>";
    }
    html += "</tbody></table></div>";
    div.innerHTML += html;
}

function sortearUm() {
    if (jogadores.length < 2) return alert("Mínimo de 2 jogadores!");
    if (numerosSorteadosGlobal.length >= 75) return alert("Fim do jogo!");

    var num;
    do { num = Math.floor(Math.random() * 75) + 1; } 
    while (numerosSorteadosGlobal.includes(num));

    numerosSorteadosGlobal.push(num);
    tocarSom();

    var painel = document.getElementById("numeros-sorteados");
    painel.innerHTML += `<div class="numero-sorteado">${num}</div>`;

    marcarNoDOM(num);
    verificarVencedores();
}

function marcarNoDOM(num) {
    var tds = document.querySelectorAll(".cartela td");
    tds.forEach(td => {
        if (td.innerText == num) td.classList.add("sorteado");
    });
}

function verificarVencedores() {
    var vencedores = [];
    jogadores.forEach(j => {
        var marcados = 0;
        for (var col = 0; col < 5; col++) {
            for (var lin = 0; lin < 5; lin++) {
                if ((col === 2 && lin === 2) || numerosSorteadosGlobal.includes(j.cartela[col][lin])) {
                    marcados++;
                }
            }
        }
        if (marcados === 25) vencedores.push(j.nome);
    });

    if (vencedores.length > 0) {
        clearInterval(intervalo);
        sorteioEmAndamento = false;
        alert("BINGO! Vencedor(es): " + vencedores.join(", "));
    }
}

function iniciarJogo() {
    if (sorteioEmAndamento || jogadores.length < 2) return;
    sorteioEmAndamento = true;
    intervalo = setInterval(() => {
        if (!sorteioEmAndamento) return;
        sortearUm();
    }, 2000);
}

function reiniciarJogo() {
    clearInterval(intervalo);
    jogadores = [];
    numerosSorteadosGlobal = [];
    sorteioEmAndamento = false;
    document.getElementById("espaco-cartelas").innerHTML = "";
    document.getElementById("numeros-sorteados").innerHTML = "";
}
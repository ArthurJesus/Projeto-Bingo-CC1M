var jogadores = [];
var intervalo;
var sorteioEmAndamento = false;
var numerosSorteadosGlobal = [];

function tocarSom() {
    const som = document.getElementById("som-sorteio");
    if (som) { som.currentTime = 0; som.play().catch(() => {}); }
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
    if (sorteioEmAndamento) return alert("O sorteio já começou!");
    var nome = prompt("Nome do Jogador:");
    if (!nome || nome.trim() === "") return;
    
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
    var container = document.createElement("div");
    container.className = "jogador";
    
    var html = `<h3>${nome}</h3><table class="cartela"><thead><tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr></thead><tbody>`;
    for (var i = 0; i < 5; i++) {
        html += "<tr>";
        for (var j = 0; j < 5; j++) {
            let num = (i === 2 && j === 2) ? "X" : cartela[j][i];
            let classe = (num === "X") ? "sorteado" : "";
            // Adicionamos um evento de clique para marcação manual
            html += `<td class="${classe}" onclick="marcarManual(this)">${num}</td>`;
        }
        html += "</tr>";
    }
    html += "</tbody></table>";
    container.innerHTML = html;
    div.appendChild(container);
}

// Opção de marcar clicando na célula
function marcarManual(celula) {
    if (celula.innerText === "X") return;
    let num = parseInt(celula.innerText);
    // Só permite marcar se o número já tiver sido sorteado
    if (numerosSorteadosGlobal.includes(num)) {
        celula.classList.toggle("sorteado");
        verificarVencedores();
    } else {
        alert("Este número ainda não foi sorteado!");
    }
}

function sortearUm() {
    if (jogadores.length < 1) return alert("Gere ao menos uma cartela!");
    if (numerosSorteadosGlobal.length >= 75) return alert("Fim do globo!");

    var num;
    do { num = Math.floor(Math.random() * 75) + 1; } while (numerosSorteadosGlobal.includes(num));

    numerosSorteadosGlobal.push(num);
    tocarSom();

    document.getElementById("numeros-sorteados").innerHTML += `<div class="numero-sorteado">${num}</div>`;

    // Se a opção "Marcar Auto" estiver ativa
    if (document.getElementById("marcar-auto").checked) {
        marcarNoDOM(num);
    }
    
    verificarVencedores();
}

function marcarNoDOM(num) {
    document.querySelectorAll(".cartela td").forEach(td => {
        if (td.innerText == num) td.classList.add("sorteado");
    });
}

function verificarVencedores() {
    var vencedores = [];
    document.querySelectorAll(".jogador").forEach((div, index) => {
        let marcados = div.querySelectorAll(".sorteado").length;
        if (marcados === 25) vencedores.push(jogadores[index].nome);
    });

    if (vencedores.length > 0) {
        sorteioEmAndamento = false;
        clearInterval(intervalo);
        setTimeout(() => alert("BINGO! Vencedor(es): " + vencedores.join(", ")), 100);
    }
}

function iniciarJogo() {
    if (sorteioEmAndamento || jogadores.length < 1) return;
    sorteioEmAndamento = true;
    let vel = document.getElementById("velocidade").value;
    intervalo = setInterval(() => {
        if (!sorteioEmAndamento) return;
        sortearUm();
    }, vel);
}

function reiniciarJogo() {
    clearInterval(intervalo);
    jogadores = [];
    numerosSorteadosGlobal = [];
    sorteioEmAndamento = false;
    document.getElementById("espaco-cartelas").innerHTML = "";
    document.getElementById("numeros-sorteados").innerHTML = "";
}
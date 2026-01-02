var jogadores = [];
var intervalo;
var sorteioEmAndamento = false;
var numerosSorteadosGlobal = [];

function alternarModo() {
    const isAuto = document.getElementById("modo-auto").checked;
    const body = document.body;
    
    if (isAuto) {
        body.classList.add("modo-auto-ativo");
        if (numerosSorteadosGlobal.length > 0) {
            numerosSorteadosGlobal.forEach(num => marcarNoDOM(num));
        }
    } else {
        body.classList.remove("modo-auto-ativo");
    }
}

function marcarManual(celula) {
    if (document.getElementById("modo-auto").checked) return;
    celula.classList.toggle("sorteado");
}

function gritarBingo() {
    if (jogadores.length === 0) return;
    
    let houveGanhadorReal = false;
    let nomesGanhadores = [];

    document.querySelectorAll(".jogador").forEach((div, index) => {
        let celulasMarcadas = div.querySelectorAll(".sorteado");
        
        // Verifica se tem 25 marcações (incluindo o X)
        if (celulasMarcadas.length === 25) {
            let erroEncontrado = false;

            celulasMarcadas.forEach(td => {
                let txt = td.innerText;
                if (txt !== "X") {
                    let num = parseInt(txt);
                    if (!numerosSorteadosGlobal.includes(num)) {
                        erroEncontrado = true;
                    }
                }
            });

            if (!erroEncontrado) {
                houveGanhadorReal = true;
                nomesGanhadores.push(jogadores[index].nome);
            }
        }
    });

    if (houveGanhadorReal) {
        finalizarJogo(nomesGanhadores);
    } else {
        alert("❌ BINGO FALSO! ❌\nSua cartela possui marcações erradas ou está incompleta. Continue jogando!");
    }
}

function finalizarJogo(nomes) {
    sorteioEmAndamento = false;
    clearInterval(intervalo);
    tocarSomVitoria(); // Opcional: adicionar um som diferente
    alert("🎉 BINGO VALIDADO! 🎉\nParabéns: " + nomes.join(", "));
}

function sortearUm() {
    if (jogadores.length < 1) return alert("Gere uma cartela!");
    if (numerosSorteadosGlobal.length >= 75) return alert("Fim das bolas!");

    var num;
    do { num = Math.floor(Math.random() * 75) + 1; } while (numerosSorteadosGlobal.includes(num));

    numerosSorteadosGlobal.push(num);
    tocarSom();

    document.getElementById("numeros-sorteados").innerHTML += `<div class="numero-sorteado">${num}</div>`;

    if (document.getElementById("modo-auto").checked) {
        marcarNoDOM(num);
        verificarVencedoresAuto(); // No modo auto, o sistema grita por você
    }
}

function verificarVencedoresAuto() {
    // Mesma lógica do gritarBingo, mas sem o alerta de "erro"
    document.querySelectorAll(".jogador").forEach((div, index) => {
        let marcados = div.querySelectorAll(".sorteado").length;
        if (marcados === 25) {
            finalizarJogo([jogadores[index].nome]);
        }
    });
}

function marcarNoDOM(num) {
    document.querySelectorAll(".cartela td").forEach(td => {
        if (td.innerText == num) td.classList.add("sorteado");
    });
}

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
    if (sorteioEmAndamento) return alert("Sorteio rolando!");
    var nome = prompt("Seu Nome:");
    if (!nome) return;
    var cartela = [
        gerarNumerosAleatorios(5, 1, 15), gerarNumerosAleatorios(5, 16, 30),
        gerarNumerosAleatorios(5, 31, 45), gerarNumerosAleatorios(5, 46, 60),
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
            let num = (i === 2 && j === 2) ? "X" : cartela[j][i];
            let classe = (num === "X") ? "sorteado" : "";
            html += `<td class="${classe}" onclick="marcarManual(this)">${num}</td>`;
        }
        html += "</tr>";
    }
    html += "</tbody></table></div>";
    div.innerHTML += html;
}

function iniciarJogo() {
    if (jogadores.length < 1 || sorteioEmAndamento) return;
    sorteioEmAndamento = true;
    let vel = document.getElementById("velocidade").value;
    intervalo = setInterval(() => { if (sorteioEmAndamento) sortearUm(); }, vel);
}

function reiniciarJogo() {
    if(!confirm("Reiniciar?")) return;
    clearInterval(intervalo);
    jogadores = [];
    numerosSorteadosGlobal = [];
    sorteioEmAndamento = false;
    document.getElementById("espaco-cartelas").innerHTML = "";
    document.getElementById("numeros-sorteados").innerHTML = "";
}
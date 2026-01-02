var jogadores = [];
var intervalo = null;
var sorteioEmAndamento = false;
var numerosSorteadosGlobal = [];

// Alterna o visual e lógica do modo automático/manual
function alternarModo() {
    const isAuto = document.getElementById("modo-auto").checked;
    if (isAuto) {
        document.body.classList.add("modo-auto-ativo");
        if (numerosSorteadosGlobal.length > 0) {
            numerosSorteadosGlobal.forEach(num => marcarNoDOM(num));
        }
    } else {
        document.body.classList.remove("modo-auto-ativo");
    }
}

// Permite marcar/desmarcar na cartela (apenas modo manual)
function marcarManual(celula) {
    const isAuto = document.getElementById("modo-auto").checked;
    if (isAuto) return; 
    celula.classList.toggle("sorteado");
}

// Lógica do botão principal: Iniciar ou Parar o sorteio
function toggleAutoSorteio() {
    const btn = document.getElementById("btn-auto");
    
    if (sorteioEmAndamento) {
        pararAutoSorteio();
        btn.innerText = "Iniciar Auto";
        btn.style.backgroundColor = "#e74c3c"; // Vermelho original
    } else {
        if (jogadores.length < 1) return alert("Gera uma cartela primeiro!");
        if (numerosSorteadosGlobal.length >= 75) return alert("Fim do jogo! Todas as bolas já saíram.");
        
        sorteioEmAndamento = true;
        btn.innerText = "Parar Sorteio";
        btn.style.backgroundColor = "#2c3e50"; // Cor escura para indicar pausa
        
        let vel = document.getElementById("velocidade").value;
        intervalo = setInterval(() => {
            sortearUm();
        }, parseInt(vel));
    }
}

function pararAutoSorteio() {
    sorteioEmAndamento = false;
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }
}

// Sorteia um número e valida se o jogo deve terminar
function sortearUm() {
    if (numerosSorteadosGlobal.length >= 75) {
        pararAutoSorteio();
        document.getElementById("btn-auto").innerText = "Fim do Jogo";
        alert("Fim do globo! Todas as 75 bolas foram sorteadas.");
        return;
    }

    let num;
    do { 
        num = Math.floor(Math.random() * 75) + 1; 
    } while (numerosSorteadosGlobal.includes(num));

    numerosSorteadosGlobal.push(num);
    tocarSom();

    const painel = document.getElementById("numeros-sorteados");
    painel.innerHTML += `<div class="numero-sorteado">${num}</div>`;

    if (document.getElementById("modo-auto").checked) {
        marcarNoDOM(num);
        verificarVencedoresAuto();
    }
}

// Verifica vitória no modo Automático
function verificarVencedoresAuto() {
    let vencedoresEncontrados = [];
    document.querySelectorAll(".jogador").forEach((div, index) => {
        let marcados = div.querySelectorAll(".sorteado").length;
        if (marcados === 25) {
            vencedoresEncontrados.push(jogadores[index].nome);
        }
    });

    if (vencedoresEncontrados.length > 0) {
        pararAutoSorteio();
        document.getElementById("btn-auto").innerText = "Iniciar Auto";
        alert("🎉 BINGO AUTOMÁTICO! 🎉\nVencedor(es): " + vencedoresEncontrados.join(", "));
    }
}

// Validação rigorosa para o botão "Gritar Bingo" (Modo Manual)
function gritarBingo() {
    if (jogadores.length === 0) return alert("Cria uma cartela primeiro!");
    
    let nomesGanhadores = [];

    document.querySelectorAll(".jogador").forEach((div, index) => {
        let celulasMarcadas = div.querySelectorAll(".sorteado");
        
        if (celulasMarcadas.length === 25) {
            let erroEncontrado = false;
            celulasMarcadas.forEach(td => {
                let txt = td.innerText;
                if (txt !== "X") {
                    let num = parseInt(txt);
                    if (!numerosSorteadosGlobal.includes(num)) erroEncontrado = true;
                }
            });

            if (!erroEncontrado) nomesGanhadores.push(jogadores[index].nome);
        }
    });

    if (nomesGanhadores.length > 0) {
        pararAutoSorteio();
        alert("🎉 BINGO VALIDADO! 🎉\nParabéns: " + nomesGanhadores.join(", "));
    } else {
        alert("❌ BINGO FALSO! ❌\nVerifica as tuas marcações. Tens números marcados que ainda não foram sorteados!");
    }
}

function marcarNoDOM(num) {
    document.querySelectorAll(".cartela td").forEach(td => {
        if (td.innerText == num) td.classList.add("sorteado");
    });
}

function tocarSom() {
    try {
        const som = document.getElementById("som-sorteio");
        if (som) {
            som.currentTime = 0;
            som.play();
        }
    } catch (e) { console.error("Erro ao tocar som:", e); }
}

function gerarNumerosAleatorios(quantidade, min, max) {
    let numeros = [];
    while (numeros.length < quantidade) {
        let aleatorio = Math.floor(Math.random() * (max - min + 1) + min);
        if (!numeros.includes(aleatorio)) numeros.push(aleatorio);
    }
    return numeros;
}

function gerarCartela() {
    if (sorteioEmAndamento) return alert("O jogo está a decorrer!");
    let nome = prompt("Nome do Jogador:");
    if (!nome || nome.trim() === "") return;
    
    let cartela = [
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
    const div = document.getElementById("espaco-cartelas");
    let html = `<div class="jogador"><h3>${nome}</h3><table class="cartela"><thead><tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr></thead><tbody>`;
    for (let i = 0; i < 5; i++) {
        html += "<tr>";
        for (let j = 0; j < 5; j++) {
            let num = (i === 2 && j === 2) ? "X" : cartela[j][i];
            let classe = (num === "X") ? "sorteado" : "";
            html += `<td class="${classe}" onclick="marcarManual(this)">${num}</td>`;
        }
        html += "</tr>";
    }
    html += "</tbody></table></div>";
    div.innerHTML += html;
}

function reiniciarJogo() {
    if(!confirm("Queres reiniciar tudo?")) return;
    pararAutoSorteio();
    jogadores = [];
    numerosSorteadosGlobal = [];
    document.getElementById("btn-auto").innerText = "Iniciar Auto";
    document.getElementById("btn-auto").style.backgroundColor = "#e74c3c";
    document.getElementById("espaco-cartelas").innerHTML = "";
    document.getElementById("numeros-sorteados").innerHTML = "";
}
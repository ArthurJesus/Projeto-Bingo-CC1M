var jogadores = [];
var intervalo;
var sorteioEmAndamento = false;
var numerosSorteadosGlobal = [];

// Função para esconder/mostrar botões dependendo do papel
function alternarPapel() {
    const papel = document.getElementById("papel-usuario").value;
    const btnJogador = document.getElementById("grupo-jogador");
    const btnSorteador = document.getElementById("grupo-sorteador");
    const painelSorteio = document.getElementById("painel-sorteio");
    const configVel = document.getElementById("div-velocidade");
    const configAuto = document.getElementById("label-marcar-auto");

    if (papel === "jogador") {
        btnJogador.classList.remove("hidden");
        btnSorteador.classList.add("hidden");
        configVel.classList.add("hidden");
        configAuto.classList.remove("hidden"); // Jogador pode querer marcação auto
    } else if (papel === "sorteador") {
        btnJogador.classList.add("hidden");
        btnSorteador.classList.remove("hidden");
        configVel.classList.remove("hidden");
        configAuto.classList.add("hidden");
    } else {
        // Modo Completo/Mestre
        btnJogador.classList.remove("hidden");
        btnSorteador.classList.remove("hidden");
        configVel.classList.remove("hidden");
        configAuto.classList.remove("hidden");
    }
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
    if (sorteioEmAndamento) return alert("O sorteio já começou!");
    
    // No modo jogador único, podemos limitar a 1 cartela
    const papel = document.getElementById("papel-usuario").value;
    if (papel === "jogador" && jogadores.length >= 1) {
        return alert("No modo Jogador, você só pode ter 1 cartela.");
    }

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
            html += `<td class="${classe}" onclick="marcarManual(this)">${num}</td>`;
        }
        html += "</tr>";
    }
    html += "</tbody></table>";
    container.innerHTML = html;
    div.appendChild(container);
}

function marcarManual(celula) {
    if (celula.innerText === "X") return;
    let num = parseInt(celula.innerText);
    // Mesmo no modo manual, o sistema confere se o número já "saiu"
    if (numerosSorteadosGlobal.includes(num)) {
        celula.classList.toggle("sorteado");
        verificarVencedores();
    } else {
        alert("Este número ainda não foi sorteado!");
    }
}

function sortearUm() {
    // Se for apenas sorteador, não precisa checar jogadores.length
    const papel = document.getElementById("papel-usuario").value;
    if (papel !== "sorteador" && jogadores.length < 1) return alert("Gere uma cartela primeiro!");
    
    if (numerosSorteadosGlobal.length >= 75) return alert("Fim do globo!");

    var num;
    do { num = Math.floor(Math.random() * 75) + 1; } while (numerosSorteadosGlobal.includes(num));

    numerosSorteadosGlobal.push(num);
    tocarSom();

    document.getElementById("numeros-sorteados").innerHTML += `<div class="numero-sorteado">${num}</div>`;

    if (document.getElementById("marcar-auto").checked) {
        document.querySelectorAll(".cartela td").forEach(td => {
            if (td.innerText == num) td.classList.add("sorteado");
        });
    }
    verificarVencedores();
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
        setTimeout(() => {
            alert("🎉 BINGO! 🎉\nVencedor: " + vencedores.join(", "));
        }, 200);
    }
}

function iniciarJogo() {
    const papel = document.getElementById("papel-usuario").value;
    if (papel !== "sorteador" && jogadores.length < 1) return alert("Gere uma cartela primeiro!");
    
    if (sorteioEmAndamento) return;
    sorteioEmAndamento = true;
    let vel = document.getElementById("velocidade").value;
    intervalo = setInterval(() => {
        if (!sorteioEmAndamento) return;
        sortearUm();
    }, vel);
}

function reiniciarJogo() {
    if(!confirm("Deseja reiniciar o jogo?")) return;
    clearInterval(intervalo);
    jogadores = [];
    numerosSorteadosGlobal = [];
    sorteioEmAndamento = false;
    document.getElementById("espaco-cartelas").innerHTML = "";
    document.getElementById("numeros-sorteados").innerHTML = "";
}

// Inicializa o papel ao carregar
window.onload = alternarPapel;
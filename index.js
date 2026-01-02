var jogadores = [];
var intervalo = null;
var sorteioEmAndamento = false;
var numerosSorteadosGlobal = [];

// NOVA FUNÇÃO: Alterna entre Iniciar e Parar
function toggleAutoSorteio() {
    const btn = document.getElementById("btn-auto");
    
    if (sorteioEmAndamento) {
        // Se já está rodando, a gente para
        pararAutoSorteio();
        btn.innerText = "Iniciar Auto";
        btn.style.backgroundColor = "#e74c3c"; // Vermelho
    } else {
        // Se está parado, a gente inicia
        if (jogadores.length < 1) return alert("Gere uma cartela primeiro!");
        if (numerosSorteadosGlobal.length >= 75) return alert("Todas as bolas já saíram!");
        
        sorteioEmAndamento = true;
        btn.innerText = "Parar Auto";
        btn.style.backgroundColor = "#2c3e50"; // Cor escura para indicar "Parar"
        
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

function sortearUm() {
    // Verificação Crítica: Se chegar em 75, para TUDO imediatamente
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

function verificarVencedoresAuto() {
    let vencedoresEncontrados = [];
    document.querySelectorAll(".jogador").forEach((div, index) => {
        let marcados = div.querySelectorAll(".sorteado").length;
        if (marcados === 25) {
            vencedoresEncontrados.push(jogadores[index].nome);
        }
    });

    if (vencedoresEncontrados.length > 0) {
        pararAutoSorteio(); // Para o intervalo antes de mandar o alert
        document.getElementById("btn-auto").innerText = "Iniciar Auto";
        alert("🎉 BINGO AUTOMÁTICO! 🎉\nVencedor(es): " + vencedoresEncontrados.join(", "));
    }
}

// Atualize sua função de Reiniciar para resetar o botão também
function reiniciarJogo() {
    if(!confirm("Deseja reiniciar tudo?")) return;
    pararAutoSorteio();
    jogadores = [];
    numerosSorteadosGlobal = [];
    document.getElementById("btn-auto").innerText = "Iniciar Auto";
    document.getElementById("btn-auto").style.backgroundColor = "#e74c3c";
    document.getElementById("espaco-cartelas").innerHTML = "";
    document.getElementById("numeros-sorteados").innerHTML = "";
}

// Remova a função iniciarJogo antiga para não dar conflito com a toggleAutoSorteio
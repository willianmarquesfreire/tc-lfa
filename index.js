/**
 * Autômato finito determinístico
 * <Σ, S, S0, δ, F>
 * Alfabeto de entrada, 
 * Conj. de estados, 
 * Estado inicial, 
 * Função de transição, 
 * Conjunto de estados finais
 */
function afd(str, automato) {
    let cadeia = str.split('');
    let estadoAtual = automato.estadoInicial;
    cadeia.forEach((simbolo, index) => {
        console.log(estadoAtual + "," + simbolo)
        estadoAtual = automato.funcoes[estadoAtual + "," + simbolo];
        if (estadoAtual == null) return 'REJEITA'
    });
    if (automato.estadosFinais.includes(estadoAtual)) return 'ACEITA'
    else return 'REJEITA'
}

// Quantidade par de a's sob o alfabeto {a,b}
let automato = {
    alfabeto: ['a', 'b'],
    estados: ['0', '1'],
    estadoInicial: '0',
    funcoes: {
        '0,a': '1',
        '0,b': '0',
        '1,a': '0',
        '1,b': '1'
    },
    estadosFinais: ['0']
}

console.log("AFD: ", afd('aa', automato))



function afnd(str, automato) {
    let cadeia = str.split('');
    let estadosAtuais = automato.estadosIniciais;
    cadeia.forEach((simbolo, index) => {
        let novosEstados = [];
        estadosAtuais.forEach(estadoAtual => {
            console.log(estadoAtual + "," + simbolo)
            let novoEstado = automato.funcoes[estadoAtual + "," + simbolo];
            if (novoEstado) {
                novosEstados = novosEstados.concat(novoEstado);
            }
        })
        estadosAtuais = novosEstados;
        if (novosEstados == null || novosEstados.length <= 0 ) return 'REJEITA'
    })
    if (estadosAtuais && automato.estadosFinais.includes(estadosAtuais[0])) return 'ACEITA'
    else return 'REJEITA'
}

// Quantidade par de a's sob o alfabeto {a,b}
let automatoafn = {
    alfabeto: ['a', 'b', 'c'],
    estados: ['0', '1', '2', '3'],
    estadosIniciais: ['0'],
    funcoes: {
        '0,a': ['1', '2'],
        '1,b': '3',
        '2,c': '3'
    },
    estadosFinais: ['3']
}

console.log("AFND: ", afnd('ab', automatoafn))
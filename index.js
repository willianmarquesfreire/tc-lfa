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

let automato = {
    alfabeto: ['h', 'l', 'c', 'r'],
    estados: ['0', '1', '2', '3a', '3b', '4a', '4b', '5', '6', '7'],
    estadoInicial: '0',
    funcoes: {
        '0,c': '1',
        '1,h': '2',
        '2,l': '3a',
        '2,r': '3b',
        '3a,c': '4a',
        '3b,c': '4b',
        '4a,r': '5',
        '4b,l': '5',
        '5,h': '6',
        '6,c': 'c'
    },
    estadosFinais: ['c']
}

console.log(afd('chlcrhc', automato))
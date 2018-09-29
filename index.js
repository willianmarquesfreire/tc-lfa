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
        if (novosEstados == null || novosEstados.length <= 0) return 'REJEITA'
    })
    if (estadosAtuais && estadosAtuais.filter(e => automato.estadosFinais.includes(e).length > 0)) return 'ACEITA'
    else return 'REJEITA'
}

function removeTransicoesNaoUsadas(automato) {
    Object.keys(automato.funcoes)
        .forEach((funcao, ia) => {
            let contem = false;
            Object.keys(automato.funcoes)
                .forEach((subfuncao, ib) => {
                    if (funcao.split(',')[0] == automato.funcoes[subfuncao] && ia != ib) {
                        contem = true;
                    }
                })
            if (!contem) {
                delete automato.funcoes[funcao]
            }
        })
}

function transformaAFND(automato) {
    let novosEstados = {};
    if (automato.estadosIniciais.length > 1) {
        funcoesAdicionar.push(automato.estadosIniciais)
    }
    Object.keys(automato.funcoes).forEach(key => {
        if (automato.funcoes[key].length > 1) {
            novosEstados[automato.funcoes[key].toString()] = {};
        }
    })

    for (let index = 0; index <= Object.keys(novosEstados).length + 1; index++) {
        let estado = Object.keys(novosEstados)[index];
        if (estado) {
            let estados = estado.split(",");
            automato.alfabeto.forEach(simbolo => {
                let adicionar = [];
                estados.forEach(est => {
                    if (automato.funcoes[est + "," + simbolo])
                        adicionar = adicionar.concat(automato.funcoes[est + "," + simbolo]);
                })

                if (adicionar.length > 1) {
                    novosEstados[estado][estado + "," + simbolo] = adicionar.toString();
                    if (!Object.keys(novosEstados).includes(adicionar.toString())) {
                        novosEstados[adicionar.toString()] = {};
                    }
                }
            })
        } else {
            break;
        }
    }

    automato.estadoInicial = automato.estadosIniciais.toString();
    Object.keys(automato.funcoes)
        .forEach(aut => {
            automato.funcoes[aut] = automato.funcoes[aut].toString();
        })

    Object.keys(novosEstados)
        .forEach(key => {
            Object.keys(novosEstados[key])
                .forEach(estado => {
                    automato.funcoes[estado] = novosEstados[key][estado]
                })
        });

    

    delete automato.estadosIniciais;
    removeTransicoesNaoUsadas(automato)

    return automato;
}



function minimizaAFD(automato) {
    let finais = automato.estadosFinais;
    let naoFinais = automato.estados.filter(estado => !automato.estadosFinais.includes(estado));

    let marcacao = {};
    automato.estados.forEach(estado => {
        automato.estados.forEach((trivialNaoEq, index) => {
            if (estado != trivialNaoEq && (marcacao[trivialNaoEq + '-' + estado] == null || marcacao[trivialNaoEq + '-' + estado] == undefined)) {
                marcacao[estado + '-' + trivialNaoEq] = finais.includes(estado) && naoFinais.includes(trivialNaoEq) || finais.includes(trivialNaoEq) && naoFinais.includes(estado);
            }
        })
    })

    let lista = []

    Object.keys(marcacao)
        .forEach(key => {
            let obj = marcacao[key];
            if (!obj) {
                automato.alfabeto.forEach(simbolo => {
                    let est1 = automato.funcoes[key.split("-")[0] + ',' + simbolo];
                    let est2 = automato.funcoes[key.split("-")[1] + ',' + simbolo];
                    if (est1 != est2 && marcacao[est1 + "-" + est2]) {
                        marcacao[key] = true;
                        lista.forEach((elm, index) => {
                            if (elm[1] == key) {
                                marcacao[elm[0]] = true;
                                lista.splice(index, 1)
                            }
                        });
                    } else {
                        if (est1 != est2) {
                            lista.push([
                                key,
                                est1 + "-" + est2,
                                simbolo
                            ]);
                        }
                    }
                })
            }
        })

    let novasTransicoes = {};
    let novosEstados = [];

    Object.keys(marcacao)
        .forEach(key => {
            if (!marcacao[key]) {
                let est1 = key.split("-")[0];
                let est2 = key.split("-")[1];
                automato.alfabeto.forEach(simbolo => {
                    novasTransicoes[key + "," + simbolo] = [];
                    novosEstados.push(key);
                    Object.keys(automato.funcoes)
                        .forEach(fn => {
                            if ((fn == est1 + "," + simbolo) || (fn == est2 + "," + simbolo)) {
                                novasTransicoes[key + "," + simbolo].push(automato.funcoes[fn]);
                                if (fn.split(',')[0] != automato.estadoInicial)
                                    delete automato.funcoes[fn]
                            }
                        })
                });

            }
        });

    Object.keys(novasTransicoes)
        .forEach(key => {
            novasTransicoes[key].forEach((estado, index) => {
                let res = novosEstados.filter(e => e.includes(estado));
                if (novasTransicoes[key].includes(res[0])) novasTransicoes[key].splice(index, 1)
                else novasTransicoes[key][index] = res[0]
            })
            if (novasTransicoes[key][0])
                automato.funcoes[key] = novasTransicoes[key][0]
        })

        // removeTransicoesNaoUsadas(automato)

    return automato;
}


let automato = {
    alfabeto: ['a', 'b'],
    estados: ['s0', 's1', 's2'],
    estadosIniciais: ['s0'],
    funcoes: {
        's0,a': ['s2'],
        's0,b': ['s0', 's1'],
        's1,a': ['s1'],
        's2,b': ['s2'],
        's2,a': ['s0']
    },
    estadosFinais: ['s1']
}

console.log("TESTA AFND", afnd("aab", automato))

automato = transformaAFND(automato);
console.log("Transforma AFND: ", automato)

automato = minimizaAFD(automato);
console.log("Minimiza AFND: ", automato)

 automato = {
    alfabeto: ['a'],
    estados: ['s0', 's1'],
    estadoInicial: 's0',
    funcoes: {
        's0,a': 's1',
        's1,a': 's0'
    },
    estadosFinais: ['s0','s1']
}

automato = minimizaAFD(automato);
console.log("Minimiza AFD: ", automato)
// ==================================================
// ESTOQUE
// ==================================================


let produtosEstoque = [];


// ==================================================
// ELEMENTOS
// ==================================================

let buscaEstoque;
let filtroEstoque;
let listaEstoque;

let totalProdutos;
let totalUnidades;
let estoqueBaixo;
let validadeProxima;


// ==================================================
// CONFIGURAÇÕES
// ==================================================

const ESTOQUE_MINIMO = 5;

const DIAS_VALIDADE = 7;


// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        buscaEstoque =
            document.getElementById(
                "buscaEstoque"
            );

        filtroEstoque =
            document.getElementById(
                "filtroEstoque"
            );

        listaEstoque =
            document.getElementById(
                "listaEstoque"
            );

        totalProdutos =
            document.getElementById(
                "totalProdutos"
            );

        totalUnidades =
            document.getElementById(
                "totalUnidades"
            );

        estoqueBaixo =
            document.getElementById(
                "estoqueBaixo"
            );

        validadeProxima =
            document.getElementById(
                "validadeProxima"
            );


        if (buscaEstoque) {

            buscaEstoque.addEventListener(
                "input",
                atualizarEstoque
            );

        }


        if (filtroEstoque) {

            filtroEstoque.addEventListener(
                "change",
                atualizarEstoque
            );

        }

    }
);


// ==================================================
// CARREGAR
// ==================================================

async function carregarEstoque() {

    if (!bancoEstaPronto()) {

        return;

    }


    try {

        produtosEstoque =
            await buscarTodosProdutos();


        atualizarResumo();

        atualizarEstoque();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar estoque:",
            erro
        );

    }

}


// ==================================================
// RESUMO
// ==================================================

function atualizarResumo() {

    const unidades =
        produtosEstoque.reduce(
            function (total, produto) {

                return (
                    total +
                    Number(
                        produto.estoque
                    )
                );

            },
            0
        );


    const baixo =
        produtosEstoque.filter(
            function (produto) {

                return (
                    Number(
                        produto.estoque
                    ) > 0 &&
                    Number(
                        produto.estoque
                    ) <= ESTOQUE_MINIMO
                );

            }
        ).length;


    const proximos =
        produtosEstoque.filter(
            function (produto) {

                return (
                    verificarValidade(
                        produto
                    ) === "proxima"
                );

            }
        ).length;


    totalProdutos.textContent =
        produtosEstoque.length;


    totalUnidades.textContent =
        unidades;


    estoqueBaixo.textContent =
        baixo;


    validadeProxima.textContent =
        proximos;

}


// ==================================================
// ATUALIZAR LISTA
// ==================================================

function atualizarEstoque() {

    if (!listaEstoque) {

        return;

    }


    const busca =
        buscaEstoque
            ? buscaEstoque.value
                .trim()
                .toLowerCase()
            : "";


    const filtro =
        filtroEstoque
            ? filtroEstoque.value
            : "todos";


    const filtrados =
        produtosEstoque.filter(
            function (produto) {

                const nome =
                    produto.nome
                        .toLowerCase();


                const codigo =
                    produto.codigo
                        .toLowerCase();


                if (
                    busca &&
                    !nome.includes(busca) &&
                    !codigo.includes(busca)
                ) {

                    return false;

                }


                const status =
                    obterStatus(
                        produto
                    );


                const validade =
                    verificarValidade(
                        produto
                    );


                if (
                    filtro === "baixo"
                ) {

                    return status ===
                        "baixo";

                }


                if (
                    filtro === "vencendo"
                ) {

                    return validade ===
                        "proxima";

                }


                if (
                    filtro === "vencido"
                ) {

                    return validade ===
                        "vencido";

                }


                return true;

            }
        );


    if (
        filtrados.length === 0
    ) {

        listaEstoque.innerHTML = `

            <div class="estoque-vazio">

                <h3>
                    📦 Nenhum produto encontrado
                </h3>

                <p>
                    Não existem produtos nessa categoria.
                </p>

            </div>

        `;

        return;

    }


    listaEstoque.innerHTML =
        filtrados
            .map(
                criarItemEstoque
            )
            .join("");

}


// ==================================================
// ITEM
// ==================================================

function criarItemEstoque(produto) {

    const status =
        obterStatus(
            produto
        );


    const validade =
        verificarValidade(
            produto
        );


    let textoStatus =
        "NORMAL";


    if (
        status === "baixo"
    ) {

        textoStatus =
            "ESTOQUE BAIXO";

    }


    if (
        status === "zerado"
    ) {

        textoStatus =
            "SEM ESTOQUE";

    }


    let textoValidade =
        "Sem validade";


    if (
        produto.validade
    ) {

        textoValidade =
            formatarData(
                produto.validade
            );

    }


    if (
        validade === "vencido"
    ) {

        textoValidade =
            "⚠️ Vencido - " +
            textoValidade;

    }


    if (
        validade === "proxima"
    ) {

        textoValidade =
            "⏳ " +
            textoValidade;

    }


    return `

        <div class="estoque-item">

            <div>

                <h3>
                    ${escaparHTML(
                        produto.nome
                    )}
                </h3>

                <p>
                    Código:
                    <strong>
                        ${escaparHTML(
                            produto.codigo
                        )}
                    </strong>
                </p>

            </div>


            <div>

                <span>
                    Quantidade
                </span>

                <strong>
                    ${produto.estoque}
                </strong>

                <small>
                    ${textoStatus}
                </small>

            </div>


            <div>

                <span>
                    Preço
                </span>

                <strong>
                    ${formatarMoeda(
                        produto.precoVenda
                    )}
                </strong>

            </div>


            <div>

                <span>
                    Validade
                </span>

                <strong>
                    ${textoValidade}
                </strong>

            </div>

        </div>

    `;

}


// ==================================================
// STATUS
// ==================================================

function obterStatus(produto) {

    const quantidade =
        Number(
            produto.estoque
        );


    if (
        quantidade <= 0
    ) {

        return "zerado";

    }


    if (
        quantidade <=
        ESTOQUE_MINIMO
    ) {

        return "baixo";

    }


    return "normal";

}


// ==================================================
// VALIDADE
// ==================================================

function verificarValidade(produto) {

    if (
        !produto.validade
    ) {

        return "normal";

    }


    const hoje =
        new Date();


    hoje.setHours(
        0,
        0,
        0,
        0
    );


    const validade =
        new Date(
            produto.validade +
            "T00:00:00"
        );


    const diferenca =
        Math.ceil(
            (
                validade.getTime() -
                hoje.getTime()
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (
        diferenca < 0
    ) {

        return "vencido";

    }


    if (
        diferenca <=
        DIAS_VALIDADE
    ) {

        return "proxima";

    }


    return "normal";

}


// ==================================================
// MOEDA
// ==================================================

function formatarMoedaEstoque(valor) {

    return Number(
        valor
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ==================================================
// DATA
// ==================================================

function formatarDataEstoque(data) {

    if (!data) {

        return "";

    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// ==================================================
// SEGURANÇA
// ==================================================

function escaparHTMLEstoque(texto) {

    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
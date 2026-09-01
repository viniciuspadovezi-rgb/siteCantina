// ==================================================
// RELATÓRIOS
// ==================================================


// ==================================================
// ELEMENTOS
// ==================================================

let relatorioVendas;
let relatorioFaturamento;
let listaRelatorios;


// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        relatorioVendas =
            document.getElementById(
                "relatorioVendas"
            );

        relatorioFaturamento =
            document.getElementById(
                "relatorioFaturamento"
            );

        listaRelatorios =
            document.getElementById(
                "listaRelatorios"
            );

    }
);


// ==================================================
// CARREGAR
// ==================================================

async function carregarRelatorios() {

    if (!bancoEstaPronto()) {

        return;

    }


    try {

        const vendas =
            await buscarTodasVendas();


        // ==================================================
        // RESUMO
        // ==================================================

        const faturamento =
            vendas.reduce(
                function (total, venda) {

                    return (
                        total +
                        Number(
                            venda.total
                        )
                    );

                },
                0
            );


        relatorioVendas.textContent =
            vendas.length;


        relatorioFaturamento.textContent =
            formatarMoedaRelatorio(
                faturamento
            );


        mostrarVendas(
            vendas
        );

    }

    catch (erro) {

        console.error(
            "Erro nos relatórios:",
            erro
        );

    }

}


// ==================================================
// MOSTRAR VENDAS
// ==================================================

function mostrarVendas(vendas) {

    if (
        vendas.length === 0
    ) {

        listaRelatorios.innerHTML = `

            <div class="relatorio-vazio">

                <h3>
                    📊 Nenhuma venda registrada
                </h3>

                <p>
                    As vendas aparecerão aqui.
                </p>

            </div>

        `;

        return;

    }


    // Mais recentes primeiro

    vendas.sort(
        function (a, b) {

            return (
                new Date(b.data) -
                new Date(a.data)
            );

        }
    );


    listaRelatorios.innerHTML =
        vendas
            .map(
                criarRelatorioVenda
            )
            .join("");

}


// ==================================================
// VENDA
// ==================================================

function criarRelatorioVenda(venda) {

    const data =
        new Date(
            venda.data
        );


    const dataFormatada =
        data.toLocaleString(
            "pt-BR"
        );


    const pagamento =
        traduzirPagamento(
            venda.pagamento
        );


    const itens =
        venda.itens
            .map(
                function (item) {

                    return `

                        <div class="relatorio-item">

                            <span>
                                ${escaparHTMLRelatorio(
                                    item.nome
                                )}
                                x${item.quantidade}
                            </span>

                            <strong>
                                ${formatarMoedaRelatorio(
                                    item.subtotal
                                )}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");


    return `

        <div class="relatorio-venda">

            <div class="relatorio-venda-top">

                <div>

                    <strong>
                        Venda #${venda.id}
                    </strong>

                    <span>
                        ${dataFormatada}
                    </span>

                </div>

                <div>

                    <span>
                        ${pagamento}
                    </span>

                    <strong>
                        ${formatarMoedaRelatorio(
                            venda.total
                        )}
                    </strong>

                </div>

            </div>


            <div class="relatorio-itens">

                ${itens}

            </div>

        </div>

    `;

}


// ==================================================
// PAGAMENTO
// ==================================================

function traduzirPagamento(
    pagamento
) {

    switch (pagamento) {

        case "dinheiro":
            return "💵 Dinheiro";

        case "pix":
            return "📱 PIX";

        case "cartao":
            return "💳 Cartão";

        default:
            return pagamento;

    }

}


// ==================================================
// MOEDA
// ==================================================

function formatarMoedaRelatorio(
    valor
) {

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
// SEGURANÇA
// ==================================================

function escaparHTMLRelatorio(
    texto
) {

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
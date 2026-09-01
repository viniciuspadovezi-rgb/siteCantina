
// ==================================================
// VENDAS
// ==================================================


// ==================================================
// TOTAL DE VENDAS
// ==================================================

async function obterTotalVendas() {

    try {

        const vendas =
            await buscarTodasVendas();


        return vendas.length;

    }

    catch (erro) {

        console.error(
            "Erro ao obter vendas:",
            erro
        );

        return 0;

    }

}


// ==================================================
// FATURAMENTO
// ==================================================

async function obterFaturamento() {

    try {

        const vendas =
            await buscarTodasVendas();


        return vendas.reduce(
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

    }

    catch (erro) {

        console.error(
            "Erro ao obter faturamento:",
            erro
        );

        return 0;

    }

}
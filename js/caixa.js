// ==================================================
// CAIXA
// ==================================================

let carrinho = [];

let formaPagamento = null;


// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarCaixa
);


function iniciarCaixa() {

    const campoCodigo =
        document.getElementById("codigoProduto");


    const botaoAdicionar =
        document.getElementById("btnAdicionarCodigo");


    const botaoFinalizar =
        document.getElementById("btnFinalizarVenda");


    const botaoCancelar =
        document.getElementById("btnCancelarVenda");


    if (campoCodigo) {

        campoCodigo.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    adicionarProdutoPorCodigo();

                }

            }
        );

    }


    if (botaoAdicionar) {

        botaoAdicionar.addEventListener(
            "click",
            adicionarProdutoPorCodigo
        );

    }


    if (botaoFinalizar) {

        botaoFinalizar.addEventListener(
            "click",
            finalizarVenda
        );

    }


    if (botaoCancelar) {

        botaoCancelar.addEventListener(
            "click",
            cancelarVenda
        );

    }


    document
        .querySelectorAll(".pagamento-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    selecionarPagamento(
                        this.dataset.pagamento
                    );

                }
            );

        });


    atualizarCarrinho();

}


// ==================================================
// ADICIONAR PRODUTO PELO CÓDIGO
// ==================================================

async function adicionarProdutoPorCodigo() {

    const campo =
        document.getElementById("codigoProduto");


    const codigo =
        campo.value.trim();


    if (!codigo) {

        campo.focus();

        return;

    }


    try {

        const produto =
            await buscarProdutoPorCodigo(codigo);


        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            campo.select();

            return;

        }


        if (produto.quantidade <= 0) {

            alert(
                "Esse produto está sem estoque."
            );

            campo.select();

            return;

        }


        adicionarAoCarrinho(produto);


        campo.value = "";

        campo.focus();


    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao buscar produto."
        );

    }

}


// ==================================================
// ADICIONAR AO CARRINHO
// ==================================================

function adicionarAoCarrinho(produto) {

    const existente =
        carrinho.find(
            item => item.produtoId === produto.id
        );


    if (existente) {

        if (
            existente.quantidade <
            produto.quantidade
        ) {

            existente.quantidade++;

        } else {

            alert(
                "Quantidade máxima disponível no estoque."
            );

        }

    } else {

        carrinho.push({

            produtoId: produto.id,

            codigo: produto.codigo,

            nome: produto.nome,

            preco: produto.precoVenda,

            quantidade: 1,

            estoqueDisponivel:
                produto.quantidade

        });

    }


    atualizarCarrinho();

}


// ==================================================
// ALTERAR QUANTIDADE
// ==================================================

function alterarQuantidade(
    produtoId,
    novaQuantidade
) {

    const item =
        carrinho.find(
            item => item.produtoId === produtoId
        );


    if (!item) {

        return;

    }


    if (novaQuantidade <= 0) {

        removerDoCarrinho(produtoId);

        return;

    }


    if (
        novaQuantidade >
        item.estoqueDisponivel
    ) {

        alert(
            "Quantidade maior que o estoque disponível."
        );

        return;

    }


    item.quantidade =
        novaQuantidade;


    atualizarCarrinho();

}


// ==================================================
// REMOVER
// ==================================================

function removerDoCarrinho(produtoId) {

    carrinho =
        carrinho.filter(
            item =>
                item.produtoId !== produtoId
        );


    atualizarCarrinho();

}


// ==================================================
// ATUALIZAR CARRINHO
// ==================================================

function atualizarCarrinho() {

    const container =
        document.getElementById("carrinho");


    const vazio =
        document.getElementById("carrinhoVazio");


    const quantidade =
        document.getElementById(
            "quantidadeItensCarrinho"
        );


    const resumoQuantidade =
        document.getElementById(
            "resumoQuantidade"
        );


    const resumoTotal =
        document.getElementById(
            "resumoTotal"
        );


    const finalizar =
        document.getElementById(
            "btnFinalizarVenda"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    let quantidadeTotal = 0;

    let total = 0;


    if (carrinho.length === 0) {

        container.appendChild(
            criarCarrinhoVazio()
        );

    } else {

        carrinho.forEach(item => {

            quantidadeTotal +=
                item.quantidade;


            total +=
                item.preco *
                item.quantidade;


            container.appendChild(
                criarItemCarrinho(item)
            );

        });

    }


    quantidade.textContent =
        quantidadeTotal +
        (
            quantidadeTotal === 1
                ? " item"
                : " itens"
        );


    resumoQuantidade.textContent =
        quantidadeTotal;


    resumoTotal.textContent =
        formatarMoeda(total);


    finalizar.disabled =
        carrinho.length === 0 ||
        !formaPagamento;

}


// ==================================================
// CARRINHO VAZIO
// ==================================================

function criarCarrinhoVazio() {

    const div =
        document.createElement("div");


    div.className =
        "carrinho-vazio";


    div.innerHTML = `

        <div>🛒</div>

        <h3>
            Carrinho vazio
        </h3>

        <p>
            Digite o código de um produto
            para começar.
        </p>

    `;


    return div;

}


// ==================================================
// ITEM
// ==================================================

function criarItemCarrinho(item) {

    const div =
        document.createElement("div");


    div.className =
        "carrinho-item";


    const subtotal =
        item.preco *
        item.quantidade;


    div.innerHTML = `

        <div class="carrinho-item-info">

            <strong>
                ${escaparHTML(item.nome)}
            </strong>

            <span>
                Código: ${escaparHTML(item.codigo)}
            </span>

        </div>


        <div class="quantidade-controle">

            <button
                onclick="alterarQuantidade(
                    ${item.produtoId},
                    ${item.quantidade - 1}
                )"
            >
                −
            </button>

            <span>
                ${item.quantidade}
            </span>

            <button
                onclick="alterarQuantidade(
                    ${item.produtoId},
                    ${item.quantidade + 1}
                )"
            >
                +
            </button>

        </div>


        <div class="carrinho-item-preco">

            ${formatarMoeda(subtotal)}

        </div>


        <button
            class="remover-item"
            onclick="removerDoCarrinho(
                ${item.produtoId}
            )"
            title="Remover"
        >
            🗑️
        </button>

    `;


    return div;

}


// ==================================================
// PAGAMENTO
// ==================================================

function selecionarPagamento(tipo) {

    formaPagamento = tipo;


    document
        .querySelectorAll(".pagamento-button")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    const selecionado =
        document.querySelector(
            `[data-pagamento="${tipo}"]`
        );


    if (selecionado) {

        selecionado.classList.add(
            "selected"
        );

    }


    atualizarCarrinho();

}


// ==================================================
// FINALIZAR VENDA
// ==================================================

async function finalizarVenda() {

    if (carrinho.length === 0) {

        alert(
            "O carrinho está vazio."
        );

        return;

    }


    if (!formaPagamento) {

        alert(
            "Selecione uma forma de pagamento."
        );

        return;

    }


    const total =
        carrinho.reduce(
            (soma, item) =>
                soma +
                item.preco *
                item.quantidade,
            0
        );


    const confirmar =
        confirm(
            `Finalizar venda de ${formatarMoeda(total)}?`
        );


    if (!confirmar) {

        return;

    }


    try {

        // ------------------------------------------
        // VERIFICAR ESTOQUE NOVAMENTE
        // ------------------------------------------

        for (const item of carrinho) {

            const produto =
                await buscarProdutoPorCodigo(
                    item.codigo
                );


            if (!produto) {

                throw new Error(
                    `Produto ${item.nome} não encontrado.`
                );

            }


            if (
                produto.quantidade <
                item.quantidade
            ) {

                throw new Error(
                    `Estoque insuficiente para ${item.nome}.`
                );

            }

        }


        // ------------------------------------------
        // REGISTRAR VENDA
        // ------------------------------------------

        const venda = {

            data:
                new Date().toISOString(),

            itens:
                carrinho.map(item => ({

                    produtoId:
                        item.produtoId,

                    codigo:
                        item.codigo,

                    nome:
                        item.nome,

                    quantidade:
                        item.quantidade,

                    precoUnitario:
                        item.preco,

                    subtotal:
                        item.preco *
                        item.quantidade

                })),

            total: total,

            pagamento:
                formaPagamento

        };


        await registrarVenda(venda);


        // ------------------------------------------
        // BAIXAR ESTOQUE
        // ------------------------------------------

        for (const item of carrinho) {

            const produto =
                await buscarProdutoPorCodigo(
                    item.codigo
                );


            produto.quantidade -=
                item.quantidade;


            await atualizarProduto(
                produto
            );


            // Registrar movimentação

            await registrarMovimentacao({

                produtoId:
                    produto.id,

                tipo:
                    "saida",

                quantidade:
                    item.quantidade,

                motivo:
                    "Venda",

                data:
                    new Date().toISOString()

            });

        }


        // ------------------------------------------
        // FINALIZAR
        // ------------------------------------------

        alert(
            "Venda registrada com sucesso!"
        );


        carrinho = [];

        formaPagamento = null;


        document
            .querySelectorAll(".pagamento-button")
            .forEach(button => {

                button.classList.remove(
                    "selected"
                );

            });


        atualizarCarrinho();


        if (
            typeof carregarEstoque ===
            "function"
        ) {

            carregarEstoque();

        }


    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível registrar a venda:\n\n" +
            erro.message
        );

    }

}


// ==================================================
// CANCELAR
// ==================================================

function cancelarVenda() {

    if (
        carrinho.length === 0
    ) {

        return;

    }


    const confirmar =
        confirm(
            "Cancelar a venda atual?"
        );


    if (!confirmar) {

        return;

    }


    carrinho = [];

    formaPagamento = null;


    document
        .querySelectorAll(".pagamento-button")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    atualizarCarrinho();


    document
        .getElementById(
            "codigoProduto"
        )
        ?.focus();

}


// ==================================================
// UTILIDADES
// ==================================================

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}
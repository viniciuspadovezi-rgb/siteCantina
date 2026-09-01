// ==================================================
// PRODUTOS
// ==================================================


let produtosAtuais = [];

let produtoEditando = null;


// ==================================================
// ELEMENTOS
// ==================================================

let produtoForm;
let produtoNome;
let produtoCodigo;
let produtoValidade;
let produtoCusto;
let produtoLucro;
let produtoQuantidade;
let listaProdutos;


// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        produtoForm =
            document.getElementById(
                "produtoForm"
            );

        produtoNome =
            document.getElementById(
                "produtoNome"
            );

        produtoCodigo =
            document.getElementById(
                "produtoCodigo"
            );

        produtoValidade =
            document.getElementById(
                "produtoValidade"
            );

        produtoCusto =
            document.getElementById(
                "produtoCusto"
            );

        produtoLucro =
            document.getElementById(
                "produtoLucro"
            );

        produtoQuantidade =
            document.getElementById(
                "produtoQuantidade"
            );

        listaProdutos =
            document.getElementById(
                "listaProdutos"
            );


        if (!produtoForm) {

            return;

        }


        produtoForm.addEventListener(
            "submit",
            salvarProduto
        );


        produtoCusto.addEventListener(
            "input",
            atualizarPrecoPreview
        );


        produtoLucro.addEventListener(
            "input",
            atualizarPrecoPreview
        );

    }
);


// ==================================================
// CARREGAR
// ==================================================

async function carregarProdutos() {

    if (!bancoEstaPronto()) {

        return;

    }


    try {

        produtosAtuais =
            await buscarTodosProdutos();


        produtosAtuais.sort(
            function (a, b) {

                return a.nome.localeCompare(
                    b.nome
                );

            }
        );


        mostrarProdutos();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

    }

}


// ==================================================
// CALCULAR PREÇO
// ==================================================

function calcularPrecoVenda(
    custo,
    lucro
) {

    return (
        Number(custo) *
        (
            1 +
            Number(lucro) / 100
        )
    );

}


// ==================================================
// PREVIEW
// ==================================================

function atualizarPrecoPreview() {

    // O HTML atual não possui campo de preço de venda.
    // O preço é calculado no momento do cadastro.

}


// ==================================================
// SALVAR
// ==================================================

async function salvarProduto(evento) {

    evento.preventDefault();


    const nome =
        produtoNome.value.trim();


    const codigo =
        produtoCodigo.value.trim();


    const validade =
        produtoValidade.value;


    const custo =
        Number(
            produtoCusto.value
        );


    const lucro =
        Number(
            produtoLucro.value
        );


    const quantidade =
        Number(
            produtoQuantidade.value
        );


    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    if (!nome) {

        alert(
            "Digite o nome do produto."
        );

        produtoNome.focus();

        return;

    }


    if (!codigo) {

        alert(
            "Digite o código do produto."
        );

        produtoCodigo.focus();

        return;

    }


    if (
        Number.isNaN(custo) ||
        custo < 0
    ) {

        alert(
            "Digite um preço de custo válido."
        );

        produtoCusto.focus();

        return;

    }


    if (
        Number.isNaN(lucro) ||
        lucro < 0
    ) {

        alert(
            "Digite uma porcentagem de lucro válida."
        );

        produtoLucro.focus();

        return;

    }


    if (
        Number.isNaN(quantidade) ||
        quantidade < 0 ||
        !Number.isInteger(quantidade)
    ) {

        alert(
            "A quantidade precisa ser um número inteiro maior ou igual a zero."
        );

        produtoQuantidade.focus();

        return;

    }


    // ==================================================
    // VERIFICAR CÓDIGO
    // ==================================================

    try {

        const existente =
            await buscarProdutoPorCodigo(
                codigo
            );


        if (
            existente &&
            (
                !produtoEditando ||
                existente.id !==
                produtoEditando.id
            )
        ) {

            alert(
                "Já existe um produto com esse código."
            );

            produtoCodigo.focus();

            return;

        }


        // ==================================================
        // PRODUTO
        // ==================================================

        const precoVenda =
            calcularPrecoVenda(
                custo,
                lucro
            );


        const produto = {

            nome: nome,

            codigo: codigo,

            validade:
                validade ||
                null,

            precoCusto:
                custo,

            margemLucro:
                lucro,

            precoVenda:
                Number(
                    precoVenda.toFixed(2)
                ),

            estoque:
                quantidade

        };


        // ==================================================
        // NOVO
        // ==================================================

        if (!produtoEditando) {

            const id =
                await adicionarProduto(
                    produto
                );


            console.log(
                "Produto cadastrado:",
                id
            );


            alert(
                "Produto cadastrado com sucesso!"
            );

        }


        // ==================================================
        // EDITAR
        // ==================================================

        else {

            produto.id =
                produtoEditando.id;


            await atualizarProduto(
                produto
            );


            alert(
                "Produto atualizado com sucesso!"
            );


            produtoEditando =
                null;

        }


        // ==================================================
        // LIMPAR
        // ==================================================

        produtoForm.reset();


        await carregarProdutos();


        // Atualizar estoque

        if (
            typeof carregarEstoque ===
            "function"
        ) {

            await carregarEstoque();

        }

    }

    catch (erro) {

        console.error(
            "Erro ao salvar produto:",
            erro
        );


        alert(
            "Erro ao salvar o produto: " +
            erro.message
        );

    }

}


// ==================================================
// MOSTRAR PRODUTOS
// ==================================================

function mostrarProdutos() {

    if (
        produtosAtuais.length === 0
    ) {

        listaProdutos.innerHTML = `

            <div class="lista-vazia">

                <h3>
                    Nenhum produto cadastrado
                </h3>

                <p>
                    Cadastre o primeiro produto.
                </p>

            </div>

        `;

        return;

    }


    listaProdutos.innerHTML =
        produtosAtuais
            .map(
                criarCardProduto
            )
            .join("");

}


// ==================================================
// CARD
// ==================================================

function criarCardProduto(produto) {

    return `

        <div class="produto-card">

            <div class="produto-card-info">

                <h3>
                    ${escaparHTML(produto.nome)}
                </h3>

                <p>
                    Código:
                    <strong>
                        ${escaparHTML(produto.codigo)}
                    </strong>
                </p>

                <p>
                    Estoque:
                    <strong>
                        ${produto.estoque}
                    </strong>
                </p>

                <p>
                    Custo:
                    ${formatarMoeda(produto.precoCusto)}
                </p>

                <p>
                    Venda:
                    <strong>
                        ${formatarMoeda(produto.precoVenda)}
                    </strong>
                </p>

                <p>
                    Lucro:
                    ${produto.margemLucro}%
                </p>

                ${
                    produto.validade
                        ? `
                            <p>
                                Validade:
                                ${formatarData(produto.validade)}
                            </p>
                        `
                        : ""
                }

            </div>

            <div class="produto-card-acoes">

                <button
                    type="button"
                    onclick="editarProduto(${produto.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    onclick="excluirProdutoTela(${produto.id})"
                >
                    🗑️ Excluir
                </button>

            </div>

        </div>

    `;

}


// ==================================================
// EDITAR
// ==================================================

async function editarProduto(id) {

    const produto =
        produtosAtuais.find(
            item =>
                item.id === id
        );


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    produtoEditando =
        produto;


    produtoNome.value =
        produto.nome;


    produtoCodigo.value =
        produto.codigo;


    produtoValidade.value =
        produto.validade || "";


    produtoCusto.value =
        produto.precoCusto;


    produtoLucro.value =
        produto.margemLucro;


    produtoQuantidade.value =
        produto.estoque;


    produtoNome.focus();

}


// ==================================================
// EXCLUIR
// ==================================================

async function excluirProdutoTela(id) {

    const produto =
        produtosAtuais.find(
            item =>
                item.id === id
        );


    if (!produto) {

        return;

    }


    const confirmar =
        confirm(
            `Deseja excluir "${produto.nome}"?`
        );


    if (!confirmar) {

        return;

    }


    try {

        await excluirProduto(
            id
        );


        alert(
            "Produto excluído."
        );


        await carregarProdutos();


        if (
            typeof carregarEstoque ===
            "function"
        ) {

            await carregarEstoque();

        }

    }

    catch (erro) {

        console.error(
            erro
        );

        alert(
            "Não foi possível excluir o produto."
        );

    }

}


// ==================================================
// MOEDA
// ==================================================

function formatarMoeda(valor) {

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

function formatarData(data) {

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
// SEGURANÇA HTML
// ==================================================

function escaparHTML(texto) {

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
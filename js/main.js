// ==================================================
// MAIN
// ==================================================


// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            await abrirBanco();

            console.log(
                "Sistema iniciado corretamente."
            );


            // Atualiza as telas

            if (
                typeof carregarProdutos ===
                "function"
            ) {

                await carregarProdutos();

            }


            if (
                typeof carregarEstoque ===
                "function"
            ) {

                await carregarEstoque();

            }


            if (
                typeof carregarRelatorios ===
                "function"
            ) {

                await carregarRelatorios();

            }

        }

        catch (erro) {

            console.error(
                "Erro ao iniciar:",
                erro
            );

            alert(
                "Não foi possível iniciar o banco de dados."
            );

        }

    }
);


// ==================================================
// NAVEGAÇÃO
// ==================================================

document.addEventListener(
    "click",
    function (evento) {

        const botao =
            evento.target.closest(
                ".menu-button"
            );


        if (!botao) {

            return;

        }


        const tela =
            botao.dataset.screen;


        // Remove ativo

        document
            .querySelectorAll(
                ".menu-button"
            )
            .forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


        // Ativa botão

        botao.classList.add(
            "active"
        );


        // Esconde telas

        document
            .querySelectorAll(
                ".screen"
            )
            .forEach(
                screen => {

                    screen.classList.remove(
                        "active"
                    );

                }
            );


        // Mostra tela

        const telaSelecionada =
            document.getElementById(
                "screen-" + tela
            );


        if (telaSelecionada) {

            telaSelecionada.classList.add(
                "active"
            );

        }


        // ==================================================
        // ATUALIZAÇÕES
        // ==================================================

        if (
            tela === "caixa" &&
            typeof atualizarCaixa ===
            "function"
        ) {

            atualizarCaixa();

        }


        if (
            tela === "produtos" &&
            typeof carregarProdutos ===
            "function"
        ) {

            carregarProdutos();

        }


        if (
            tela === "estoque" &&
            typeof carregarEstoque ===
            "function"
        ) {

            carregarEstoque();

        }


        if (
            tela === "relatorios" &&
            typeof carregarRelatorios ===
            "function"
        ) {

            carregarRelatorios();

        }

    }
);
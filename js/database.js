// ==================================================
// DATABASE
// ==================================================

const DATABASE_NAME = "CantinaEscolarDB";
const DATABASE_VERSION = 5;

let db = null;


// ==================================================
// ABRIR BANCO
// ==================================================

function abrirBanco() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DATABASE_NAME,
            DATABASE_VERSION
        );


        // ==================================================
        // ATUALIZAÇÃO / CRIAÇÃO
        // ==================================================

        request.onupgradeneeded = function (event) {

            const banco = event.target.result;
            const transaction = event.target.transaction;


            // ==================================================
            // PRODUTOS
            // ==================================================

            let produtos;

            if (!banco.objectStoreNames.contains("produtos")) {

                produtos = banco.createObjectStore(
                    "produtos",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            } else {

                produtos =
                    transaction.objectStore("produtos");

            }


            if (
                !produtos.indexNames.contains("codigo")
            ) {

                produtos.createIndex(
                    "codigo",
                    "codigo",
                    {
                        unique: true
                    }
                );

            }


            // ==================================================
            // VENDAS
            // ==================================================

            let vendas;

            if (!banco.objectStoreNames.contains("vendas")) {

                vendas = banco.createObjectStore(
                    "vendas",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            } else {

                vendas =
                    transaction.objectStore("vendas");

            }


            if (
                !vendas.indexNames.contains("data")
            ) {

                vendas.createIndex(
                    "data",
                    "data",
                    {
                        unique: false
                    }
                );

            }


            if (
                !vendas.indexNames.contains("pagamento")
            ) {

                vendas.createIndex(
                    "pagamento",
                    "pagamento",
                    {
                        unique: false
                    }
                );

            }


            // ==================================================
            // MOVIMENTAÇÕES
            // ==================================================

            let movimentacoes;

            if (
                !banco.objectStoreNames.contains(
                    "movimentacoes"
                )
            ) {

                movimentacoes =
                    banco.createObjectStore(
                        "movimentacoes",
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

            } else {

                movimentacoes =
                    transaction.objectStore(
                        "movimentacoes"
                    );

            }


            if (
                !movimentacoes.indexNames.contains(
                    "produtoId"
                )
            ) {

                movimentacoes.createIndex(
                    "produtoId",
                    "produtoId",
                    {
                        unique: false
                    }
                );

            }


            if (
                !movimentacoes.indexNames.contains(
                    "data"
                )
            ) {

                movimentacoes.createIndex(
                    "data",
                    "data",
                    {
                        unique: false
                    }
                );

            }

        };


        // ==================================================
        // SUCESSO
        // ==================================================

        request.onsuccess = function (event) {

            db = event.target.result;

            console.log(
                "Banco iniciado:",
                DATABASE_NAME,
                "versão:",
                DATABASE_VERSION
            );

            resolve(db);

        };


        // ==================================================
        // ERRO
        // ==================================================

        request.onerror = function () {

            console.error(
                "Erro no banco:",
                request.error
            );

            reject(request.error);

        };


        // ==================================================
        // BLOQUEADO
        // ==================================================

        request.onblocked = function () {

            console.warn(
                "Banco bloqueado. Feche outras abas do sistema."
            );

        };

    });

}


// ==================================================
// VERIFICAR BANCO
// ==================================================

function bancoEstaPronto() {

    return (
        db !== null &&
        db !== undefined
    );

}


// ==================================================
// PRODUTOS
// ==================================================

function adicionarProduto(produto) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "produtos",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "produtos"
            );

        const request =
            store.add(produto);


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}


// ==================================================
// BUSCAR POR CÓDIGO
// ==================================================

function buscarProdutoPorCodigo(codigo) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "produtos",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "produtos"
            );

        const index =
            store.index("codigo");

        const request =
            index.get(codigo);


        request.onsuccess = function () {

            resolve(
                request.result || null
            );

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}


// ==================================================
// BUSCAR TODOS
// ==================================================

function buscarTodosProdutos() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "produtos",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "produtos"
            );

        const request =
            store.getAll();


        request.onsuccess = function () {

            resolve(
                request.result
            );

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}


// ==================================================
// ATUALIZAR
// ==================================================

function atualizarProduto(produto) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "produtos",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "produtos"
            );

        const request =
            store.put(produto);


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}


// ==================================================
// EXCLUIR
// ==================================================

function excluirProduto(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "produtos",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "produtos"
            );

        const request =
            store.delete(id);


        request.onsuccess = function () {

            resolve();

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}


// ==================================================
// VENDAS
// ==================================================

function registrarVenda(venda) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "vendas",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "vendas"
            );

        const request =
            store.add(venda);


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}


// ==================================================
// BUSCAR VENDAS
// ==================================================

function buscarTodasVendas() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "vendas",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "vendas"
            );

        const request =
            store.getAll();


        request.onsuccess = function () {

            resolve(
                request.result
            );

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}


// ==================================================
// MOVIMENTAÇÃO
// ==================================================

function registrarMovimentacao(
    movimentacao
) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "movimentacoes",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "movimentacoes"
            );

        const request =
            store.add(movimentacao);


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}
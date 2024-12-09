<script>
    import { onMount } from "svelte";
    let usuarios = [];
    var usuarioSelecionado = null;
    let mostrarPopup = false;
    var id=0;
    let usuario_atr = '';  // Variável para armazenar o nome de usuário
    let nome = '';
    let arroba = '';
    let mostrarConfirmacaoExclusao = false; // Controle do popup de exclusão

    // Função para buscar os dados dos usuários do endpoint
    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/pegar_usuarios_apk');
            if (response.ok) {
                usuarios = await response.json();
            } else {
                console.error('Erro ao buscar dados:', response.statusText);
            }
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    // Função para excluir usuário
    const excluirUsuario = async (id) => {
        try {
            const response = await fetch('http://localhost:3000/usuario-apk/apagar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }), // Envia o ID no corpo da requisição
            });
            if (response.ok) {
                // Atualiza a lista de usuários após a exclusão
                usuarios = usuarios.filter(usuario => usuario.id !== id);
                fecharPopup();
                mostrarConfirmacaoExclusao = false; // Fecha o popup de confirmação
            } else {
                console.error('Erro ao excluir:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    // Função para abrir o popup de edição
    const abrirPopup = (usuario) => {
        usuarioSelecionado = usuario;
        nome = usuario.nome;
        usuario_atr = usuario.usuario; // Definindo o valor da variável usuario_atr
        arroba = usuario.arroba;   // Definindo o valor da variável arroba
        id= usuario.id;
        mostrarPopup = true;
        console.log(id, nome, usuario_atr, arroba)
    };

    // Função para abrir o popup de exclusão
    const abrirConfirmacaoExclusao = (usuario) => {
        usuarioSelecionado = usuario;
        mostrarConfirmacaoExclusao = true; // Exibe o popup de exclusão
    };

    // Função para fechar o popup
    const fecharPopup = () => {
        usuarioSelecionado = null;
        nome = '';
        usuario_atr = '';  // Resetando a variável usuario_atr
        arroba = '';
        mostrarPopup = false;
    };

    // Função para editar o usuário
    const editarUsuario = async () => {
        try {
            const response = await fetch(`http://localhost:3000/alterar_usuario/${usuarioSelecionado.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    usuario: usuario_atr,  // Usando usuario_atr como campo do nome de usuário
                    arroba,
                }),
            });
            if (response.ok) {
                // Atualiza a lista de usuários após a edição
                const usuarioEditado = await response.json();
                usuarios = usuarios.map(usuario => usuario.id === usuarioEditado.id ? usuarioEditado : usuario);
                fecharPopup();
                fetchUsuarios();
            } else {
                console.error('Erro ao editar:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao editar:', error);
        }
    };

    // Chama a função ao carregar o componente
    onMount(() => {
        fetchUsuarios();
    });
</script>

<style>
    /* Estilos do CRUD e dos elementos */
    .crud_adm {
        border-radius: 16px;
        border: 1px solid black;
        padding: 1%;
        width: 80%;
        margin: auto;
        margin-top: 3%;
    }
    .crud_titulo {
        display: flex;
        justify-content: space-between;
        padding: 1%;
    }
    .crud_elementos {
        display: flex;
        justify-content: space-between;
        border: 1px solid black;
        border-radius: 16px;
        padding: 5px;
        margin-bottom: 10px;
    }
    .icons {
        display: flex;
        justify-content: space-between;
    }
    .icons button {
        border: 0;
        background-color: transparent;
    }
    .icons img {
        width: 25px;
        background-color: aquamarine;
        border-radius: 5px;
        padding: 3px;
        margin-left: 5px;
    }
    /* Estilos do popup */
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
    }
    .popup-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        min-width: 300px;
    }
    .popup-content button {
        margin: 10px;
    }
    /* Estilo do formulário */
    .formulario {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .formulario input {
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }
</style>

<!-- Componente principal -->
<div class="crud_adm">
    <div class="crud_titulo">
        <div class="item_titulo">
            <p>Nome</p>
        </div>
        <div class="item_titulo">
            <p>Ações</p>
        </div>
    </div>

    {#each usuarios as usuario}
        <div class="crud_elementos">
            <div class="elemento_item">
                {usuario.nome}
            </div>
            <div class="elemento_item">
                <div class="icons">
                    <div class="delete">
                        <button on:click={() => abrirConfirmacaoExclusao(usuario)}>
                            <img src="img/adm/lata-de-lixo.png" alt="Lata de Lixo">
                        </button>
                    </div>
                    <div class="edit">
                        <button on:click={() => abrirPopup(usuario)}>
                            <img src="img/adm/editar.png" alt="Editar">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>

<!-- Popup de confirmação de exclusão -->
{#if mostrarConfirmacaoExclusao}
    <div class="popup">
        <div class="popup-content">
            <h3>Tem certeza que deseja excluir este usuário?</h3>
            <div>
                <button on:click={() => excluirUsuario(usuarioSelecionado.id)}>Confirmar</button>
                <button on:click={() => mostrarConfirmacaoExclusao = false}>Cancelar</button>
            </div>
        </div>
    </div>
{/if}

<!-- Popup de edição -->
{#if mostrarPopup}
    <div class="popup">
        <div class="popup-content">
            <h3>Editar Usuário</h3>
            <div class="formulario">
                <label for="nome">Nome</label>
                <input type="text" id="nome" bind:value={nome} />

                <label for="usuario">Usuário</label>
                <input type="text" id="usuario" bind:value={usuario_atr} />

                <label for="arroba">Arroba</label>
                <input type="text" id="arroba" bind:value={arroba} />

                <div>
                    <button on:click={editarUsuario}>Salvar</button>
                    <button on:click={fecharPopup}>Cancelar</button>
                </div>
            </div>
        </div>
    </div>
{/if}

<script>
    import { onMount } from "svelte";
    let usuarios = [];
    let usuarioSelecionado = null;
    let mostrarPopup = false;
    let nome = '';
    let email = '';
    let descricao = '';

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
        email = usuario.email;
        descricao = usuario.descricao;
        mostrarPopup = true;
    };

    // Função para fechar o popup
    const fecharPopup = () => {
        usuarioSelecionado = null;
        nome = '';
        email = '';
        descricao = '';
        mostrarPopup = false;
    };

    // Função para editar o usuário
    const editarUsuario = async () => {
        try {
            const response = await fetch('http://localhost:3000/usuario-apk/editar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: usuarioSelecionado.id,
                    nome,
                    email,
                    descricao,
                }),
            });
            if (response.ok) {
                // Atualiza a lista de usuários após a edição
                const usuarioEditado = await response.json();
                usuarios = usuarios.map(usuario => usuario.id === usuarioEditado.id ? usuarioEditado : usuario);
                fecharPopup();
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
                        <button on:click={() => abrirPopup(usuario)}>
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

<!-- Popup de edição -->
{#if mostrarPopup}
    <div class="popup">
        <div class="popup-content">
            <h3>Editar Usuário</h3>
            <div class="formulario">
                <label for="nome">Nome</label>
                <input type="text" id="nome" bind:value={nome} />
                
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} />

                <label for="descricao">Descrição</label>
                <input type="text" id="descricao" bind:value={descricao} />

                <div>
                    <button on:click={editarUsuario}>Salvar</button>
                    <button on:click={fecharPopup}>Cancelar</button>
                </div>
            </div>
        </div>
    </div>
{/if}

<link rel="stylesheet" href="landding/styles/styles.css">

<style>

    .body {
        display: flex;
        height: 100vh;
        width: 100vw;
        flex-direction: column;
        justify-content: space-between;
    }
    .second {
        display: flex;
    }
    .menu_adm {
        background-color:var(--color-primary-1);
        width: 25%;
        min-height: 75vh;
        
        margin: 1%;
        border-radius: 16px;
        padding: 10px;
    }
    .menu_item {
        display: flex;
        border: 1px solid black;
        border-radius: 16px;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 5px;
        cursor: pointer;
        background-color: white;
        transition: background-color 0.3s;
        flex-direction: column;
    }
    .menu_item:hover {
        background-color: lightgray;
    }
    .menu_item.active {
        background-color: var(--color-primary-6);
        color: white;
    }
    .titulo {
        display: flex;
        text-align: center;
        flex-direction: column;
        justify-content: space-between;
    }
    .menu_titulo {
        text-align: center;
        margin-bottom: 25px;
    }
    #usuario_container, #servicos_container, #comentarios_container {
        width: 70%;
    }
    .icon img {
        width: 35px;
    }
    .usuario_cadastro {
        display: flex;
        flex-direction: column;
    }
    .usuario_cadastro input {
        margin-top: 10px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .btn {
        height: 35px;
        width: 100%;
        margin-top: 10px;
        background-color: darkviolet;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .btn:hover {
        background-color: violet;
    }
    .hidden {
        display: none;
    }
    /* From Uiverse.io by vinodjangid07 */
    .file-upload-form {
        width: fit-content;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .file-upload-label input {
        display: none;
    }
    .file-upload-label {
        cursor: pointer;
        background-color: #ddd;
        padding: 30px 70px;
        border-radius: 40px;
        border: 2px dashed rgb(82, 82, 82);
        box-shadow: 0px 0px 200px -50px rgba(0, 0, 0, 0.719);
    }
    .browse-button {
        background-color: rgb(82, 82, 82);
        padding: 5px 15px;
        border-radius: 10px;
        color: white;
        transition: all 0.3s;
    }
    .browse-button:hover {
        background-color: rgb(14, 14, 14);
    }
    .label_input {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        margin-top: 10px;
    }
    .label_input input {
        margin: 0;
    }
    .superior_menu {
        display: flex;
        justify-content: space-between;
    }
</style>
<script>
    import Nav from "../componentes/Nav.svelte";
    import AdmAudit from "../componentes/user_audit/AdmAudit.svelte";
    import ListaUsuarios from "../componentes/adm/ListaUsuarios.svelte";
    import ListaServicosEdit from "../componentes/adm/ListaServicosEdit.svelte";
    import ListaRotativa from "../componentes/ListaRotativa.svelte";
    import Avaliacoes from "../componentes/adm/Avaliacoes.svelte";
    import CadastroServico from "../componentes/adm/CadastroServico.svelte";

    let activeComponent = 'usuarios';
    let nome = '';
    let email = '';
    let instagram = '';
    let senha = '';
    let confirmarSenha = '';
    let errorMessage = '';
    
    function setActive(component) {
        activeComponent = component;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        // Validação do formulário
        if (senha !== confirmarSenha) {
            errorMessage = "As senhas não coincidem!";
            return;
        }

        // Verificando se os dados estão corretos antes de enviar
        console.log({ nome, email, instagram, senha }); 

        const userData = {
            nome,
            email,
            instagram,
            senha
        };

        try {
            const response = await fetch('http://localhost:3000/cadastro_usuario', { // URL do backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const result = await response.json();
                alert("Usuário cadastrado com sucesso!");
                // Aqui você pode adicionar lógica para limpar os campos ou mostrar uma mensagem de sucesso
            } else {
                console.error('Erro ao cadastrar usuário:', response.statusText);
                errorMessage = 'Erro ao cadastrar usuário, tente novamente.';
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            errorMessage = 'Erro de rede, tente novamente mais tarde.';
        }
    }
</script>

<AdmAudit />

<div class="body">
    <Nav />
    <div class="second">
        <div class="menu_adm">
            <div class="menu_titulo">
                <h3>Menu de Administrador</h3>
            </div>
            
            <div class="menu_item {activeComponent === 'usuarios' ? 'active' : ''}" on:click={() => setActive('usuarios')}>
                <div class="titulo">
                    <p>Usuários</p>
                    {#if activeComponent === 'usuarios'}
                    <div class="usuario_cadastro">
                        
                        

                        <!-- Formulário de Cadastro -->
                        
                    </div>
                    {/if}
                </div>
                <div class="icon">
                    <img src="icon/profile_icon.png" alt="U">
                </div>
            </div>
    
            <div class="menu_item {activeComponent === 'servicos' ? 'active' : ''}" on:click={() => setActive('servicos')}>
                <div class="titulo">
                    <div class="superior_menu">
                        <p>Serviços</p>
                        <div class="icon">
                            <img src="icon/servicos_icon.png" alt="S">
                        </div>
                    </div>
                    
                    {#if activeComponent === 'servicos'}
                    <div class="usuario_cadastro">
                        <CadastroServico />
                    </div>
                    {/if}
                </div>
            </div>
    
            <div class="menu_item {activeComponent === 'comentarios' ? 'active' : ''}" on:click={() => setActive('comentarios')}>
                <div class="titulo">
                    <p>Comentários</p>
                </div>
                <div class="icon">
                    <img src="icon/comentarios_icon.png" alt="">
                </div>
            </div>
        </div>
    
        <!-- Conteúdo dinâmico baseado no componente ativo -->
        <div id="usuario_container" style:display={activeComponent === 'usuarios' ? 'block' : 'none'}>
            <ListaUsuarios />
        </div>
        <div id="servicos_container" style:display={activeComponent === 'servicos' ? 'block' : 'none'}>
            <ListaServicosEdit />
        </div>
        <div id="comentarios_container" style:display={activeComponent === 'comentarios' ? 'block' : 'none'}>
            <Avaliacoes />
        </div>
    </div>
    <div></div>
</div>

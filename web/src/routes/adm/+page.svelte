<script>
    import Nav from "../componentes/Nav.svelte";
    import AdmAudit from "../componentes/user_audit/AdmAudit.svelte";
    import ListaUsuarios from "../componentes/adm/ListaUsuarios.svelte";
    import ListaServicosEdit from "../componentes/adm/ListaServicosEdit.svelte";


    let activeComponent = 'usuarios';

    function setActive(component) {
        activeComponent = component;
    }
</script>

<link rel="stylesheet" href="landding/styles/styles.css">

<style>
    .body {
        display: flex;
    }
    .menu_adm {
        background-color: blueviolet;
        width: 25%;
        height: 75vh;
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
    }
    .menu_item:hover {
        background-color: lightgray;
    }
    .menu_item.active {
        background-color: darkviolet;
        color: white;
    }
    .menu_titulo {
        text-align: center;
        margin-bottom: 25px;
    }
    #usuario_container, #servicos_container, #comentarios_container {
        width: 70%;
    }
    .icon img{
        width: 35px;
    }
</style>

<AdmAudit />
<Nav />
<div class="body">
    <div class="menu_adm">
        <div class="menu_titulo">
            <h3>Menu de Administrador</h3>
        </div>
        <div class="menu_item {activeComponent === 'usuarios' ? 'active' : ''}" on:click={() => setActive('usuarios')}>
            <div class="titulo">
                <p>Usuários</p>
            </div>
            <div class="icon">
                <img src="icon/profile_icon.png" alt="U">
            </div>
        </div>
        <div 
            class="menu_item {activeComponent === 'servicos' ? 'active' : ''}" 
            on:click={() => setActive('servicos')}>
            <div class="titulo">
                <p>Serviços</p>
            </div>
            <div class="icon">
                <img src="icon/servicos_icon.png" alt="S">
            </div>
        </div>
        <div 
            class="menu_item {activeComponent === 'comentarios' ? 'active' : ''}" 
            on:click={() => setActive('comentarios')}>
            <div class="titulo">
                <p>Comentários</p>
            </div>
            <div class="icon">
                <img src="icon/comentarios_icon.png" alt="C">
            </div>
        </div>
    </div>

    <!-- Conteúdo dinâmico baseado no componente ativo -->
    <div id="usuario_container" style:display={activeComponent === 'usuarios' ? 'block' : 'none'}>
        <ListaUsuarios />
    </div>
    <div id="servicos_container" style:display={activeComponent === 'servicos' ? 'block' : 'none'}>
        <ListaServicosEdit/>
    </div>
    <div id="comentarios_container" style:display={activeComponent === 'comentarios' ? 'block' : 'none'}>
        
    </div>
</div>

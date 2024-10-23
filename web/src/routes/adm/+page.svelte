<script>
    import Nav from "../componentes/Nav.svelte";
    
    import AdmAudit from "../componentes/user_audit/AdmAudit.svelte";
</script>
<link rel="stylesheet" href="landding/styles/styles.css">
<style>
.crud_adm{
    border-radius: 16px;
    border: 1px solid black;
    padding: 1%;
    width: 80%;
    margin: auto;
    margin-top: 3%;
}
.crud_titulo{
    display: flex;
    justify-content: space-between;
    padding: 1%;
}
.crud_elementos{
    display: flex;
    justify-content: space-between;
    border: 1px solid black;
    border-radius: 16px;
    padding: 5px;
    
}
.icons{
    display: flex;
    justify-content: space-between;
}
.icons button{
    border: 0;
    background-color: transparent;
}
.icons img{
    width: 25px;
    background-color: aquamarine;
    border-radius: 5px;
    padding: 3px;
    
}
.body{
    display: flex;
}
.menu_adm{
    background-color: blueviolet;
    width: 25%;
    height: 75vh;
    margin: 1%;
    border-radius: 16px;
}
.menu_item{
    display: flex;
    border: 1px black solid;
    border-radius: 16px;
    justify-content: space-evenly;

}
.menu_adm{
    padding: 10px;
}
</style>

<AdmAudit/>
<Nav/>
<div class="body">
    <div class="menu_adm">
        <div class="menu_item">
            <div class="titulo">
                <p>Usuários</p>
            </div>
            <div class="icon">
                <img src="" alt="U">
            </div>
        </div>

    </div>
    <div class="crud_adm">
        <div class="crud_titulo">
            <div class="item_titulo">
                <p>Nome</p>
            </div>
            <div class="item_titulo">
                <p>Ações</p>
            </div>
        </div>
        <div class="crud_elementos">
            <div class="elemento_item">
                Adeilton dos Santos Silva Filho
            </div>
            <div class="elemento_item">
                <div class="icons">
                    <div class="delete">
                        <button>
                            <img src="img/adm/lata-de-lixo.png" alt="Lata de Lixo">
                        </button>
                        
                    </div>
                    <div class="edit">
                        <button>
                            <img src="img/adm/editar.png" alt="">
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

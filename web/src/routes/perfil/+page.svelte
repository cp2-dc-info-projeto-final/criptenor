<script lang="ts">
    import { onMount } from 'svelte';
    import Nav from "../componentes/Nav.svelte";
    import UserAudit from "../componentes/user_audit/UserAudit.svelte";

    let totalCredito = 0; // Inicialize a variável
    let custo_analise_simples = 20;
    let usuarioPerfil = {
        nome: '',
        usuario: '',
        arroba: '',
        path_foto: ''
    }; // Objeto para armazenar dados do perfil do usuário

    // Função para buscar o total de créditos do usuário
    async function buscarTotalCredito() {
        const access_token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://localhost:3000/total_credito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log('Total de crédito disponível:', data.saldoTotal);
                totalCredito = data.saldoTotal; // Atualiza o total de crédito
            } else {
                console.error('Erro ao buscar total de crédito ou token inválido.');
                totalCredito = 0; // Define como 0 em caso de erro
            }
        } catch (error) {
            console.error('Erro ao buscar total de crédito:', error);
            totalCredito = 0; // Define como 0 em caso de erro
        }
    }

    // Função para buscar informações do perfil do usuário
    async function buscarUsuarioPerfil() {
        const access_token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://localhost:3000/usuario_perfil', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': access_token || '',
                },
            });

            if (response.ok) {
                const { data } = await response.json();
                console.log('Perfil do usuário:', data);
                usuarioPerfil = data; // Atualiza os dados do perfil do usuário
            } else {
                console.error('Erro ao buscar informações do perfil do usuário.');
            }
        } catch (error) {
            console.error('Erro ao buscar informações do perfil:', error);
        }
    }

    // Verificar créditos ao clicar no cadeado
    function verificarCredito(e: Event, index: number) {
        e.preventDefault();
        if (totalCredito >= 20) {
            const div = document.querySelectorAll('.info_i')[index];
            div?.classList.add('aberta'); // Adiciona uma classe para indicar que está aberta
        } else {
            alert('Você precisa de pelo menos 20 créditos para acessar esta informação.');
        }
    }

    let valorDeposito: number = 0;

    // Função para abrir o popup
    function abrirPopup() {
        const popup = document.querySelector('.popup-deposito');
        if (popup) popup.style.display = 'block';
    }

    // Função para fechar o popup
    function fecharPopup() {
        const popup = document.querySelector('.popup-deposito');
        if (popup) popup.style.display = 'none';
    }

    // Função para realizar o depósito
    async function realizarDeposito() {
        const access_token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://localhost:3000/realizar_deposito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    valor: valorDeposito,
                    access_token: access_token || '',
                }),
            });

            if (response.ok) {
                alert('Depósito realizado com sucesso!');
                fecharPopup();
            } else {
                alert('Erro ao realizar o depósito. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao realizar o depósito:', error);
            alert('Erro ao realizar o depósito. Tente novamente mais tarde.');
        }
    }

    let mostrarInput = false;

    function handleFileChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            usuarioPerfil.path_foto = e.target.result;
        };

        reader.readAsDataURL(file);
        
    }

    onMount(() => {
        // ... (seu código onMount)

        const imgPerfil = document.querySelector('.img-perfil');
        if (imgPerfil) {
            imgPerfil.addEventListener('click', () => {
                const input = document.querySelector('.perfil_foto input[type="file"]'); 
                if (input) {
                    input.click(); 
                }
            });
        }
    });

    // Carrega o total de créditos e o perfil do usuário ao montar o componente
    onMount(async () => {
        await buscarTotalCredito();
        await buscarUsuarioPerfil();
        
    });

    // Função para salvar as alterações do perfil
    async function salvarAlteracoes() {
    const access_token = localStorage.getItem('access_token');
    const input = document.querySelector('.perfil_foto input[type="file"]');

    try {
        const formData = new FormData();
        formData.append('access_token', access_token);
        formData.append('nome', usuarioPerfil.nome);
        formData.append('usuario', usuarioPerfil.usuario);
        formData.append('arroba', usuarioPerfil.arroba);

        // Adiciona a imagem ao FormData se foi selecionada
        if (input.files[0]) {
            formData.append('foto', input.files[0]);
        }

        const response = await fetch('http://localhost:3000/alterar_informacoes_perfil', {
            method: 'POST',
            // Remove o Content-Type dos headers
            body: formData 
        });

        if (response.ok) {
            const data = await response.json(); // pega a resposta do servidor com o path_foto
            usuarioPerfil.path_foto = data.path_foto; // atualiza a URL da imagem no seu componente
            buscarUsuarioPerfil();
        } else {
            console.error('Erro ao salvar as alterações');
            alert('Erro ao salvar as alterações. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert('Erro ao salvar as alterações. Tente novamente.');
    }
}

// Variáveis para o popup de senha
let showSenhaPopup = false;
let novaSenha = '';
let confirmarSenha = '';

// Função para abrir o popup de senha
function abrirPopupSenha() {
     novaSenha = '';
     confirmarSenha = '';
    showSenhaPopup = true;
}

// Função para fechar o popup de senha
function fecharPopupSenha() {
    showSenhaPopup = false;
    novaSenha = '';
    confirmarSenha = '';
}
async function alterarSenha() {
    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    const access_token = localStorage.getItem('access_token');

    // Exemplo de requisição:
    const response = await fetch('http://localhost:3000/alterar_senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_token,
            senha:novaSenha,
        }),
    });
    if (response.ok){
        fecharPopupSenha()
    }

    // ... (tratamento da resposta)
}



</script>

<link rel="stylesheet" href="landding/styles/styles.css">
<link rel="stylesheet" href="landding/styles/dash.css">

<UserAudit />
<Nav />

<body>
    <div class="container-perfil">
        
        <div class="info_perfil_container">
            <h1 class="titulo_perfil">
                Perfil
            </h1>
            <div class="perfil_foto img-perfil" style=" background-image: url('{usuarioPerfil.path_foto}');">
                <input type="file" style="display: none;" accept="image/*" on:change={handleFileChange}> 
                <img src="img/adm/editar.png" alt="Foto do perfil" class="editfoto"> 
            </div>
            
            <div class="mais_info">
                <input class="input" type="text" placeholder="arroba instagram" bind:value="{usuarioPerfil.arroba}" />
                <input class="input" type="text" name="" placeholder="Nome:" bind:value="{usuarioPerfil.nome}" />
                <input class="input" type="text" placeholder="Usuário:" bind:value="{usuarioPerfil.usuario}" />
                <button class="alterar_senha" on:click="{abrirPopupSenha}">Alterar Senha</button>
                <button  on:click="{salvarAlteracoes}" class="salvar_alteracoes">Salvar alterações</button>
            </div>
        </div>
        <div class="carteira_master">
            <h2>CARTEIRA CRIPTENOR</h2>
            <div class="container_carteira">
                <div class="visa-card">
                    <div class="logoContainer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="23"
                            height="23"
                            viewBox="0 0 48 48"
                            class="svgLogo"
                        >
                            <path
                                fill="#ff9800"
                                d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                            ></path>
                            <path
                                fill="#d50000"
                                d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                            ></path>
                            <path
                                fill="#ff3d00"
                                d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                            ></path>
                        </svg>
                    </div>
                    <div class="number-container">
                        <label class="input-label" for="cardNumber">TENORCOIN</label>
                        <input
                            class="inputstyle"
                            id="cardNumber"
                            placeholder=""
                            name="cardNumber"
                            type="text"
                        />
                    </div>
    
                    <div class="name-date-cvv-container">
                        <div class="name-wrapper">
                            <label class="input-label" for="holderName">Creditos</label>
                            <input
                                class="inputstyle"
                                id="holderName"
                                placeholder="R$10,00"
                                type="text"
                                bind:value="{totalCredito}"
                            />
                        </div>
    
                        <div class="expiry-wrapper">
                            <label class="input-label" for="expiry">Validade</label>
                            <input class="inputstyle" id="expiry" placeholder="01/30" type="text" />
                        </div>
                    </div>
                </div>
            </div>
            <button class="salvar_alteracoes" on:click={() =>abrirPopup()}>Realizar depositos</button>
            

        </div>

        
    </div>
    <div class="overlay popup-deposito" style="display: none;">
        <div class="popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
            <h2>Depósito</h2>
            <input type="number" class="input" placeholder="Digite o valor" bind:value={valorDeposito} />
            <button class="salvar_alteracoes" on:click={realizarDeposito}>Confirmar Depósito</button>
            <button class="salvar_alteracoes" on:click={fecharPopup}>Cancelar</button>
        </div>

    </div>

    {#if showSenhaPopup}
    <div class="overlay">
        <div class="popup senha-popup">
            <h2>Alterar Senha</h2>
            
            <input autocomplete="off" class="input" type="password" placeholder="Nova Senha" bind:value={novaSenha} />
            <input autocomplete="off" id="senha" class="input" type="password" placeholder="Confirmar Senha" bind:value={confirmarSenha} />
            <button on:click={alterarSenha}>Confirmar</button>
            <button on:click={fecharPopupSenha}>Cancelar</button>
        </div>

    </div>
   

    {/if}
    
</body>



<style>
    /* Popup de deposito*/
    .popup{
        width: 250px;
        height: 400px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
    .senha-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
    .overlay{
    display: none;
    position: fixed; /* Garante que cubra toda a tela */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* Fundo semi-transparente */
    z-index: 1000; /* Garante que fique acima de outros elementos */
    display: flex; /* Para centralizar o conteúdo */
    justify-content: center;
    align-items: center;
    }

    .img-perfil{
        width: 150px;
        height: 150px;
    }
    body{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .container-perfil{
        width: 99vw;
        padding: 5%;
        justify-content: space-around;
        
        display: flex;
    }
    .container-perfil .perfil_foto{
        width: 150px;
        height: 150px;
        background-color: antiquewhite;
    }
    .carteira_master{
        height: 60vh;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        border: 1px solid black;
        border-radius: 18px;
        padding: 20px;
        text-align: center;
    }
    .titulo_perfil{
        margin: 10px;
    }
    button{
        margin:10px;
    }
    .email_nome{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .info_perfil_container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 25px;
        border-radius: 18px;
        border: solid 1px;
        width: 350px;

    }
    .mais_info{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .perfil_foto{
        border-radius: 100%;
        border: 3px solid black;
        background-size: 100%;
    }

    .editfoto{
        margin: 20px;
        width: 17.5px;
        
        
    }
            .inputstyle::placeholder {
        color: black !important;
        }

        .inputstyle {
        color: black !important;
        }
    .editfoto img{
        margin: 17.5px;
        width: 100%;
    }
    .input{
        width: 100%;
        margin: 15px 0px;
        border-radius: 0.375rem;
        border: 1px solid rgba(55, 65, 81, 1);
        outline: 0;
        padding: 0.75rem 1rem;
        
        }
    .alterar_senha, .salvar_alteracoes{
        order: none;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-primary-5);
        border-radius: 12px;
        padding: 10px 14px;
        font-weight: 600;
        width: 90%;       
        cursor: pointer;
        transition: background-color .3s ease;
    }
    
    
    .visa-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    width: 300px;
    height: 180px;
    background-image: radial-gradient(
        circle 897px at 9% 80.3%,
        rgba(55, 60, 245, 1) 0%,
        rgba(234, 161, 15, 0.9) 100.2%
    );
    border-radius: 10px;
    padding: 20px;
    font-family: Arial, Helvetica, sans-serif;
    position: relative;
    gap: 15px;
    }
    .logoContainer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: fit-content;
    position: absolute;
    top: 0;
    left: 0;
    padding: 18px;
    
    }
    .svgLogo {
    height: 40px;
    width: auto;
    }
    .inputstyle::placeholder {
    color: black;
    }
    .inputstyle {
    background-color: transparent;
    border: none;
    outline: none;
    color: black;
    caret-color: red;
    font-size: 13px;
    height: 25px;
    text-align: center;
    letter-spacing: 1.5px;
    }
    .number-container {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    }
    #cardNumber {
    width: 100%;
    height: 25px;
    }
    .name-date-cvv-container {
    width: 100%;
    height: 25px;
    display: flex;
    gap: 10px;
    }
    .name-wrapper {
    width: 60%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    }
    .expiry-wrapper,
    .cvv-wrapper {
    width: 30%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    }
    .cvv-wrapper {
    width: 10%;
    }
    #expiry,
    #cvv {
    width: 100%;
    }
    .input-label {
    font-size: 8px;
    letter-spacing: 1.5px;
    color: #e2e2e2;
    width: 100%;
    }


</style>

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let userId = null;
  let totalCredito = 0; // Inicialize a variável

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
        console.log('Total de crédito disponível:', data.totalCredito);
        return data.totalCredito;
      } else {
        console.error('Erro ao buscar total de crédito ou token inválido.');
        return 0; // Retorna 0 caso falhe
      }
    } catch (error) {
      console.error('Erro ao buscar total de crédito:', error);
      return 0; // Retorna 0 caso ocorra erro
    }
  }

  async function conferirCredencial() {
    let token;
    token=localStorage.getItem("access_token")
    console.log(token);
    try {
      const response = await fetch('http://localhost:3000/conferir-credencial-adm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: token }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.user_id;
      } else {
        console.error('Token inválido ou erro na verificação.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao verificar credencial:', error);
      return null;
    }
  }

  onMount(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const verifiedUserId = await conferirCredencial(token);
        if (verifiedUserId) {
          userId = verifiedUserId;
          console.log('Usuário autenticado com ID:', verifiedUserId);

          // Atualize o total de crédito
          totalCredito = await buscarTotalCredito();
        } else {
          console.log('Token inválido. Redirecionando para login.');
          goto('/login');
        }
      } catch (error) {
        console.error('Erro ao processar o token do usuário:', error);
        goto('/login');
      }
    } else {
      console.log('Nenhum token encontrado. Redirecionando para login.');
      goto('/login');
    }
  });

  function logout() {
    localStorage.removeItem('access_token');
    userId = null;
    totalCredito = 0;
    goto('/login');
  }
</script>


<style>
  header {
    width: 100%;
    padding: 28px 8%;
    position: sticky;
    top: 0;
    background-color: var(--color-primary-1);
    z-index: 3;
  }

  #navbar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #nav_logo {
    font-size: 24px;
    color: var(--color-primary-6);
  }

  #nav_list {
    display: flex;
    list-style: none;
    gap: 48px;
  }

  .nav-item a {
    text-decoration: none;
    color: #1d1d1dad;
    font-weight: 600;
  }

  .nav-item.active a {
    color: var(--color-neutral-1);
    border-bottom: 3px solid var(--color-primary-4);
  }
  .info-user-nav{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .info-user-nav p{
    margin-right: 15px;
    margin-left: 7.5;
  }
  .img-tenorcoin{
    width: 35px;
    height: 35px;
  }
  .img-tenorcoin img{
    width: 100%;
  }

  .btn-default {
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  #mobile_btn {
    display: none;
  }

  #mobile_menu {
    display: none;
  }

  @media screen and (max-width: 1170px) {
    #nav_list,
    #navbar .btn-default {
      display: none;
    }

    #mobile_btn {
      display: block;
      border: none;
      background-color: transparent;
      font-size: 1.5rem;
      cursor: pointer;
    }

    #mobile_menu.active {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #mobile_nav_list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 12px 0px;
    }

    #mobile_nav_list .nav-item {
      list-style: none;
      text-align: center;
    } 
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  a {
    text-decoration: none;
  }

  .button_analise {
    text-decoration: none;
  }
</style>

<header>
  <nav id="navbar">
    <a href="/">
      <div class="logo">
        <img src="criptenor.png" width="30" height="30" alt="Logo Criptenor">
        <span id="nav_logo">CRIPTENOR</span>
      </div>
    </a>

    <ul id="nav_list">
      <li class="nav-item active">
        <a href="/#home">Início</a>
      </li>
      <li class="nav-item">
        <a href="/#menu">Serviços</a>
      </li>
      <li class="nav-item">
        <a href="/#testimonials">Avaliações</a>
      </li>

      {#if userId === 1}
        <li class="nav-item">
          <a href="/adm">Administração</a>
        </li>
      {/if}
      <li class="nav-item">
        <a href="/dashboard">Dashboard</a>
      </li>
    </ul>

    <!-- Botão Entrar/Sair -->
    {#if userId}
    <div class="info-user-nav">
      <div class="img-tenorcoin">
        <img src="icon/moedas.png" alt="">
      </div>
      
        <p>{totalCredito}</p>

      
      

      <button class="btn-default" on:click={logout}>
        Sair
      </button>

    </div>
  
    {:else}
      <a class="button_analise" href="/login">
        <button class="btn-default">
          Entrar
        </button>
      </a>
    {/if}

    <button id="mobile_btn">
      <i class="fa-solid fa-bars"></i>
    </button>
  </nav>

  <div id="mobile_menu">
    <ul id="mobile_nav_list">
      <li class="nav-item">
        <a href="#home">Início</a>
      </li>
      <li class="nav-item">
        <a href="#menu">Cardápio</a>
      </li>
      <li class="nav-item">
        <a href="#testimonials">Avaliações</a>
      </li>

      {#if userId}
        <li class="nav-item">
          <button class="btn btn-link" on:click={logout}>Sair</button>
        </li>
      {:else}
        <li class="nav-item">
          <a href="/login">Entrar</a>
        </li>
      {/if}
    </ul>

    <button class="btn-default">
      Peça aqui
    </button>
  </div>
</header>

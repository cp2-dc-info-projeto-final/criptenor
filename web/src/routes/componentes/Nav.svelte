<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let userId = null;

  // Executa assim que o componente é montado
  onMount(() => {
    const userData = sessionStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.user?.id) {
          userId = parsedUser.user.id;
        }
      } catch (error) {
        console.error('Erro ao fazer parsing dos dados do usuário', error);
      }
    }
  });

  // Função para fazer logout
  function logout() {
    sessionStorage.removeItem('user'); // Limpa a sessão
    goto('/login'); // Redireciona para a página de login
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

  .btn-default {
    background-color: transparent;
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
  .logo{
    display: flex;
  }
  .button_analise{
    text-decoration: none;
  }
</style>

<header>
  <nav id="navbar">
    <div class="logo">
      <img src="criptenor.png" width="30" height="30" alt="Logo Criptenor">
      <span id="nav_logo">CRIPTENOR</span>
    </div>

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
    <a class="button_analise" href="/dashboard">
      <button class="btn-default">
        Começar Análise
      </button>
    </a>
    

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

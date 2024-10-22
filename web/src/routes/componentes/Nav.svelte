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
  .nav_item {
    margin: 10px;
  }
</style>

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

<nav class="navbar navbar-light bg-light">
  <a class="navbar-brand" href="/">
    <img src="criptenor.png" width="30" height="30" class="d-inline-block align-top" alt="">
    Criptenor
  </a>
  <a class="nav_item" href="/adm">Administração</a>

  {#if userId}
    <button class="btn btn-link nav_item" on:click={logout}>Sair</button>
  {:else}
    <a class="nav_item" href="/login">Entrar</a>
  {/if}
</nav>

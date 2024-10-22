<script>
  import { onMount } from 'svelte'; // Certifique-se de importar onMount corretamente
  import { goto } from '$app/navigation'; // Importa o goto para redirecionamento

  let userId = null;

  // Executa assim que o componente é montado
  onMount(() => {
    const userData = sessionStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.user?.id) {
          userId = parsedUser.user.id;
          console.log('Usuário autenticado com ID:', parsedUser.user.id);
        } else {
          console.log('ID do usuário não encontrado');
          goto('/login'); // Redireciona para /login se o ID não for encontrado
        }
      } catch (error) {
        console.error('Erro ao fazer parsing dos dados do usuário', error);
        goto('/login'); // Redireciona para /login em caso de erro
      }
    } else {
      console.log('Nenhum dado de usuário encontrado no sessionStorage');
      goto('/login'); // Redireciona para /login se não houver dados
    }
  });
</script>


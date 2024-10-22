<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let userId = null;
    let isAdmin = false;
  
    onMount(() => {
      const userData = sessionStorage.getItem('user');
  
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.user?.id) {
            userId = parsedUser.user.id;
            // Verifica se o ID do usuário é igual a 1
            if (userId === 1) {
              isAdmin = true; // O usuário é um administrador
            } else {
              // Se não for administrador, redireciona para a raiz
              goto('/');
            }
          }
        } catch (error) {
          console.error('Erro ao fazer parsing dos dados do usuário', error);
        }
      } else {
        // Se não estiver logado, redireciona para a página de login
        goto('/login');
      }
    });
  </script>
  

  

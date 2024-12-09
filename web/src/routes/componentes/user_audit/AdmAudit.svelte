<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let isAdmin = false;

  async function checkAdminAccess(token) {
    try {
      console.log('Token enviado:', token);

      const response = await fetch('http://localhost:3000/conferir-credencial-adm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: token }),
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data);

      if (response.ok && data?.adm === true) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar o access_token:', error);
      return false;
    }
  }

  onMount(async () => {
    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        if (token) {
          const isAdminUser = await checkAdminAccess(token);

          if (isAdminUser) {
            isAdmin = true;
          } else {
            console.log('Acesso negado. Redirecionando para login.');
            goto('/login');
          }
        } else {
          console.log('Token de acesso não encontrado. Redirecionando para login.');
          goto('/login');
        }
      } catch (error) {
        console.error('Erro ao processar os dados do usuário:', error);
        goto('/login');
      }
    } else {
      console.log('Nenhum dado de usuário encontrado no sessionStorage. Redirecionando para login.');
      goto('/login');
    }
  });
</script>

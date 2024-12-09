<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let userId = null;

  // Função para verificar o token e obter dados do usuário
  async function checkAccessToken() {
    let token=localStorage.getItem('access_token');
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
        console.log(data.user_id, "Usuário credenciado a partir desse ID");
        return data; // Retorna todos os dados do usuário
      } else {
        console.error('Token inválido ou erro na verificação.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao verificar o access_token:', error);
      return null;
    }
  }

  onMount(async () => {
    
    

    if (true) {
      try {
        const userData = await checkAccessToken();

        if (userData) {
          userId = userData.user_id;
          console.log('Usuário autenticado com ID:', userId, userData.email_confirmado);

          // Verifica se o e-mail foi confirmado
          if (userData.email_confirmado == false) {
            console.log('E-mail não confirmado. Redirecionando para confirmar_email.');
            goto('/confirm_email');
          }
        } else {
          console.log('Token inválido. Redirecionando para login.');
          goto('/login');
        }
      } catch (error) {
        console.error('Erro ao processar os dados do usuário:', error);
        goto('/login');
      }
    } else {
      console.log('Nenhum token encontrado. Redirecionando para login.');
      goto('/login');
    }
  });
</script>

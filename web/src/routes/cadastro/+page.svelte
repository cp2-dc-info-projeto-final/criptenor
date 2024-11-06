
<script>
  import Nav from "../componentes/Nav.svelte";
  
  let cadastroFeito = false; // Estado para mostrar o card de feedback

  async function handleCadastro(event) {
      event.preventDefault();
      
      const form = event.target;
      const email = form.email.value;
      const senha = form.senha.value;
      const nome = form.nome.value;
      const arroba = form.arroba.value;
      const confirmSenha = form.confirmSenha.value;

      if (senha !== confirmSenha) {
          alert('As senhas não coincidem');
          return;
      }

      try {
          const cadastroResponse = await fetch('http://localhost:3000/cadastro_usuario', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: email,
                  senha: senha,
                  nome: nome,
                  arroba: arroba,
              }),
          });

          const cadastroData = await cadastroResponse.json();

          if (cadastroResponse.ok) {
              cadastroFeito = true; // Mostra o card de confirmação se o cadastro foi bem-sucedido
          } else {
              alert(cadastroData.error || 'Erro ao fazer cadastro');
          }
      } catch (error) {
          console.error('Erro ao fazer cadastro:', error);
          alert('Erro ao fazer cadastro, tente novamente mais tarde.');
      }
  }

  // Função para redirecionar ao login
  function fazerLogin() {
      window.location.href = '/login';
  }
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cookie-card {
    max-width: 320px;
    padding: 1rem;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .overlay.hidden {
    display: none;
  }

  .body {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-container {
    width: 420px;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
    margin-top: 10%;
  }
  
  .body{
  display: flex;
  align-items: center;
  justify-content: center;
} 
.form-container {
width: 420px;
border-radius: 0.75rem;
background-color: rgba(17, 24, 39, 1);
padding: 2rem;
color: rgba(243, 244, 246, 1);
margin-top: 10%;
}

.title {
text-align: center;
font-size: 1.5rem;
line-height: 2rem;
font-weight: 700;
}

.form {
margin-top: 1.5rem;
}

.input-group {
margin-top: 0.25rem;
font-size: 0.875rem;
line-height: 1.25rem;
}

.input-group label {
display: block;
color: rgba(156, 163, 175, 1);
margin-bottom: 4px;
}

.input-group input {
width: 90%;
border-radius: 0.375rem;
border: 1px solid rgba(55, 65, 81, 1);
outline: 0;
background-color: rgba(17, 24, 39, 1);
padding: 0.75rem 1rem;
color: rgba(243, 244, 246, 1);
display: block;
}

.input-group input:focus {
border-color: rgba(167, 139, 250);
}

.forgot {
display: flex;
justify-content: flex-end;
font-size: 0.75rem;
line-height: 1rem;
color: rgba(156, 163, 175,1);
margin: 8px 0 14px 0;
}

.forgot a,.signup a {
color: rgba(243, 244, 246, 1);
text-decoration: none;
font-size: 14px;
}

.forgot a:hover, .signup a:hover {
text-decoration: underline rgba(167, 139, 250, 1);
}

.sign {
display: block;
width: 100%;
background-color: rgba(167, 139, 250, 1);
padding: 0.75rem;
text-align: center;
color: rgba(17, 24, 39, 1);
border: none;
border-radius: 0.375rem;
font-weight: 600;
}

.social-message {
display: flex;
align-items: center;
padding-top: 1rem;
}

.line {
height: 1px;
flex: 1 1 0%;
background-color: rgba(55, 65, 81, 1);
}

.social-message .message {
padding-left: 0.75rem;
padding-right: 0.75rem;
font-size: 0.875rem;
line-height: 1.25rem;
color: rgba(156, 163, 175, 1);
}

.social-icons {
display: flex;
justify-content: center;
}

.social-icons .icon {
border-radius: 0.125rem;
padding: 0.75rem;
border: none;
background-color: transparent;
margin-left: 8px;
}

.social-icons .icon svg {
height: 1.25rem;
width: 1.25rem;
fill: #fff;
}

.signup {
text-align: center;
font-size: 0.75rem;
line-height: 1rem;
color: rgba(156, 163, 175, 1);
}
/* From Uiverse.io by Yaya12085 */ 
.cookie-card {
  max-width: 320px;
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, .05);
}

.title {
  font-weight: 600;
  color: rgb(31 41 55);
}

.description {
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(75 85 99);
}

.description a {
  --tw-text-opacity: 1;
  color: rgb(59 130 246);
}

.description a:hover {
  -webkit-text-decoration-line: underline;
  text-decoration-line: underline;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  -moz-column-gap: 1rem;
  column-gap: 1rem;
  flex-shrink: 0;
}

.pref {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(31 41 55 );
  -webkit-text-decoration-line: underline;
  text-decoration-line: underline;
  transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  background-color: transparent;
}

.pref:hover {
  color: rgb(156 163 175);
}

.pref:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.accept {
  font-size: 0.75rem;
  line-height: 1rem;
  background-color: rgb(17 24 39);
  font-weight: 500;
  border-radius: 0.5rem;
  color: #fff;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  border: none;
  transition: all .15s cubic-bezier(0.4, 0, 0.2, 1);
}

.accept:hover {
  background-color: rgb(55 65 81);
}

.accept:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

</style>

<Nav/>
<div class="body">
  <div class="form-container">
    <p class="title">Cadastre-se</p>
    <form class="form" on:submit={handleCadastro}>
      <!-- Formulário de cadastro -->
      <div class="input-group" style="display: block;">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Digite seu email" required>
      </div>
      <div class="input-group">
        <label for="nome">Nome</label>
        <input type="text" name="nome" id="nome" placeholder="Adeilton ..." required>
      </div>
      <div class="input-group">
        <label for="arroba">Arroba Instagram</label>
        <input type="text" name="arroba" id="arroba" placeholder="@usuario" required>
      </div>
      <div class="input-group">
        <label for="senha">Senha</label>
        <input type="password" name="senha" id="senha" placeholder="Digite sua senha" required>
      </div>
      <div class="input-group">
        <label for="confirmSenha">Confirmar Senha</label>
        <input type="password" name="confirmSenha" id="confirmSenha" placeholder="Confirme sua senha" required>
      </div>
      <button class="sign" type="submit">Cadastrar</button>
    </form>
  </div>
</div>

{#if cadastroFeito}
  <!-- Overlay com o card de confirmação -->
  <div class="overlay">
    <div class="cookie-card">
      <span class="title">Cadastro Feito com Sucesso</span>
      <p class="description">
        Você pode prosseguir de maneira anônima <a href="#">Modo Anônimo</a>.
      </p>
      <div class="actions">
        <button class="pref" on:click={() => (cadastroFeito = false)}>Fechar</button>
        <button class="accept" on:click={fazerLogin}>Entrar</button>
      </div>
    </div>
  </div>
{/if}

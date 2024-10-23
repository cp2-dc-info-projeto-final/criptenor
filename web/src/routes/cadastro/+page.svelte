
<script>
  import Nav from "../componentes/Nav.svelte";
  
  // Função para enviar o formulário de cadastro
  async function handleCadastro(event) {
      event.preventDefault(); // Evita o envio padrão do formulário
      
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

      // Realiza o cadastro
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
              // Se o cadastro for bem-sucedido, faz o login automaticamente
              await fazerLogin(email, senha);
          } else {
              alert(cadastroData.error || 'Erro ao fazer cadastro');
          }
      } catch (error) {
          console.error('Erro ao fazer cadastro:', error);
          alert('Erro ao fazer cadastro, tente novamente mais tarde.');
      }
  }

  // Função para realizar o login
  async function fazerLogin(email, senha) {
      try {
          const loginResponse = await fetch('http://localhost:3000/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: email,
                  senha: senha,
              }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
              // Armazena a sessão ou os dados do usuário
              sessionStorage.setItem('user', JSON.stringify(loginData));

              // Redireciona para a página inicial
              window.location.href = '/';
          } else {
              alert(loginData.error || 'Erro ao fazer login');
          }
      } catch (error) {
          console.error('Erro ao fazer login:', error);
          alert('Erro ao fazer login, tente novamente mais tarde.');
      }
  }
</script>
<style>
  /* From Uiverse.io by Yaya12085 */ 
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

</style>

<Nav/>
<div class="body">
<div class="form-container">
  <p class="title">Cadastre-se</p>
  <!-- O formulário de cadastro agora chama a função handleCadastro -->
  <form class="form" on:submit={handleCadastro}>
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
      <div class="forgot">
        <a rel="noopener noreferrer" href="#">Esqueceu a senha?</a>
      </div>
    </div>
    <button class="sign" type="submit">Cadastrar</button>
  </form>
</div>
</div>

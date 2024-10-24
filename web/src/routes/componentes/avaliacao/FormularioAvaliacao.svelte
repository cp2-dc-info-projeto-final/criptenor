<link rel="stylesheet" href="landding/styles/avaliacao.css">

<style>
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
    
    .input-group input, .input-group textarea {
      width: 90%;
      border-radius: 0.375rem;
      border: 1px solid rgba(55, 65, 81, 1);
      outline: 0;
      background-color: rgba(17, 24, 39, 1);
      padding: 0.75rem 1rem;
      color: rgba(243, 244, 246, 1);
      display: block;
      margin: 10px;
    }
    .radio{
        margin: 10px;
    }
    
    .input-group input:focus, .input-group textarea:focus {
      border-color: rgba(167, 139, 250);
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
    
    .textarea {
      height: 100px;
      resize: none;
    }
    input{
        margin-top: 10px;
    }
    .rating{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    </style>
    <link rel="stylesheet" href="landding/styles/styles.css">
    


<div class="form-container" id="avaliacao_form">
  <p class="title">Faça sua avaliação</p>
  <!-- O campo action aponta para o endpoint do servidor -->
  <form class="form" method="post" action="http://localhost:3000/inserir_avaliacao">
    <div class="input-group">
      <label for="nome">Seu nome</label>
      <input type="text" name="avaliador" id="nome" placeholder="Nome do serviço" required>
    </div>
    <div class="input-group">
      <label for="descricao">Escreva sua avaliação</label>
      <textarea name="resposta" id="descricao" class="textarea" placeholder="Escreva sua avaliação" required></textarea>
    </div>
          
      <div class="rating">
        <input value="5" name="pontos" id="star5" type="radio">
        <label for="star5"></label>
        <input value="4" name="pontos" id="star4" type="radio">
        <label for="star4"></label>
        <input value="3" name="pontos" id="star3" type="radio">
        <label for="star3"></label>
        <input value="2" name="pontos" id="star2" type="radio">
        <label for="star2"></label>
        <input value="1" name="pontos" id="star1" type="radio">
        <label for="star1"></label>
      </div>

    
    <button type="submit" class="sign">Enviar</button>  
    
  </form>
</div>

    
    
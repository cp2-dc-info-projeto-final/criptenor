

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
    </style>
    <link rel="stylesheet" href="landding/styles/styles.css">
    
    <div class="form-container">
      <p class="title">Cadastrar Serviço</p>
      <!-- O campo action aponta para o endpoint do servidor -->
      <form class="form" method="post" action="http://localhost:3000/cadastro_servico">
        <div class="input-group">
          <label for="nome">Nome do Serviço</label>
          <input type="text" name="nome" id="nome" placeholder="Nome do serviço" required>
        </div>
        <div class="input-group">
          <label for="descricao">Descrição</label>
          <textarea name="descricao" id="descricao" class="textarea" placeholder="Descreva o serviço" required></textarea>
        </div>
        <div class="input-group">
          <label for="avaliacao">Avaliação (0-5)</label>
          <input type="number" name="avaliacao" id="avaliacao" min="0" max="5" step="0.1" placeholder="Avaliação do serviço" required>
        </div>
        <div class="input-group">
          <label for="valor">Valor (R$)</label>
          <input type="number" name="valor" id="valor" placeholder="Valor do serviço" required>
        </div>
        <button class="sign" type="submit">Cadastrar Serviço</button>
      </form>
    </div>
    
    
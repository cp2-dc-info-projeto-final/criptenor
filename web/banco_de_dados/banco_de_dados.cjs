// Importar as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://vkjrrppgjzgtastjzgyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZranJycHBnanpndGFzdGp6Z3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NDE5MTgsImV4cCI6MjA0MTMxNzkxOH0.GD8FVXFpKJ1mHXjKWS4PC8xXtpTca6MqY527Q6hr1Cg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Inicializar o Express
const app = express();
const PORT = 3000;

// Habilitar CORS
app.use(cors());

// Rota para buscar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuario') // Troque para o nome correto da sua tabela
      .select('*');

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para buscar um usuário específico por arroba
app.get('/usuario/:arroba', async (req, res) => {
  const { arroba } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('usuario') // Troque para o nome correto da sua tabela
      .select('*')
      .eq('arroba', arroba); // Supondo que a coluna no banco de dados se chama 'arroba'
      

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar o usuário' });
    }
    

    if (data.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para analisar um perfil por arroba
// Rota para analisar um perfil por arroba
// Rota para analisar um perfil por arroba
app.get('/analise-perfil/:param_arroba', async (req, res) => {
  const { param_arroba } = req.params;

  if (!param_arroba) {
    return res.status(400).json({ error: 'Parâmetro arroba é obrigatório' });
  }

  try {
    // Chamar a função RPC 'analise_de_um_perfil' no Supabase
    const { data, error } = await supabase.rpc('analise_de_um_perfil', {
      param_arroba: param_arroba // Passando o parâmetro para a função RPC
    });
    console.log(data);

    // Verificar se houve erro na chamada da função
    if (error) {
      console.error('Erro ao analisar o perfil:', error);
      return res.status(500).json({ error: 'Erro ao analisar o perfil' });
    }

    // Verificar se nenhum dado foi retornado
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    // Retornar os dados do perfil como jsonb
    res.status(200).json(data); // Aqui o data[0] será um objeto jsonb
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const session = require('express-session'); // Para gerenciar sessões de usuário

// Configurações do Supabase
const supabaseUrl = 'https://vkjrrppgjzgtastjzgyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZranJycHBnanpndGFzdGp6Z3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NDE5MTgsImV4cCI6MjA0MTMxNzkxOH0.GD8FVXFpKJ1mHXjKWS4PC8xXtpTca6MqY527Q6hr1Cg';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3000;

// Configuração do CORS para permitir o localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // Especifique a origem permitida
  credentials: true // Permitir envio de cookies e credenciais
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
  secret: 'segredo_super_secreto', // Substitua por uma string forte e segura
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Mude para 'true' em produção, se usar HTTPS
}));

// Rota para obter a sessão
app.get('/session', (req, res) => {
  if (req.session.userId) {
    return res.status(200).json({
      loggedIn: true,
      userId: req.session.userId,
      userEmail: req.session.userEmail,
      userArroba: req.session.arroba
    });
  } else {
    return res.status(200).json({ loggedIn: false });
  }
});

// Rota POST para cadastrar um novo usuário
app.post('/cadastro_usuario', async (req, res) => {
  const { email, arroba, senha } = req.body;

  if (!email || !arroba || !senha) {
    return res.status(400).json({ error: 'Email, arroba e senha são obrigatórios' });
  }

  try {
    // Verificar se o email ou arroba já existe no banco de dados
    const { data: existingUser, error: checkError } = await supabase
      .from('usuario_apk')
      .select('*')
      .or(`usuario.eq.${email},arroba.eq.${arroba}`);

    if (checkError) {
      return res.status(500).json({ error: 'Erro ao verificar usuário existente' });
    }

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Usuário já cadastrado com esse email ou arroba' });
    }

    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir o novo usuário no banco de dados
    const { data, error } = await supabase
      .from('usuario_apk')
      .insert([{ 
        usuario: email, 
        arroba: arroba, 
        senha: hashedPassword // Armazenando a senha criptografada
      }]);

    if (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar o usuário' });
    }

    // Redirecionar para a página inicial após o sucesso do cadastro
    res.redirect('http://localhost:5173/');
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Configuração da sessão


app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Verifica se os campos obrigatórios estão presentes
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Buscar o usuário pelo email no banco de dados
    const { data: user, error } = await supabase
      .from('usuario_apk')
      .select('*')
      .eq('usuario', email)
      .single(); // Usamos single() porque esperamos que apenas um usuário seja retornado

    if (error || !user) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Comparar a senha fornecida com a senha armazenada no banco de dados (hash)
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Login bem-sucedido, definir variáveis de sessão
    req.session.userId = user.id; // Definindo o ID do usuário na sessão
    req.session.userEmail = user.email; // Opcional, dependendo do que você quer armazenar na sessão
    req.session.arroba = user.arroba;
    console.log(req.session.userId);

    // Retorna o status de sucesso e as informações do usuário
    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: { id: user.id, email: user.email } // Opcional: Retorne mais informações do usuário, se necessário
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



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

// Rota para buscar um usuário específico por ID
// Rota para buscar o usuário interno pela sessão
app.get('/usuario_interno', async (req, res) => {
  // Verifica se o usuário está logado
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const userId = req.session.userId; // Obtém o ID do usuário da sessão
  
  try {
    const { data, error } = await supabase
      .from('usuario_apk') // Altere para o nome correto da sua tabela se necessário
      .select('*')
      .eq('id', userId) // Usando o ID da sessão
      .single(); // Usamos single() porque esperamos apenas um usuário

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar o usuário' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(data); // Retornar os dados do usuário
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


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
    // Retornar os dados do perfil como jsonb
    res.status(200).json(data); // Aqui o data[0] será um objeto jsonb
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para buscar arroba pelo ID
app.get('/usuario-apk/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ error: 'Parâmetro ID é obrigatório' });
  }

  try {
      // Consulta na tabela usuario_apk para obter o arroba pelo ID
      const { data, error } = await supabase
          .from('usuario_apk')
          .select('arroba')
          .eq('id', id)
          .single(); // Usando .single() para obter um único registro

      if (error || !data) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Retornar o arroba como JSON
      res.status(200).json(data);
  } catch (err) {
      console.error('Erro interno do servidor:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para analisar perfil por ID do usuário
app.get('/analise-perfil-por-id/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Parâmetro ID é obrigatório' });
  }

  try {
    // Consulta na tabela usuario_apk para obter o arroba pelo ID
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('arroba')
      .eq('id', id)
      .single(); // Usando .single() para obter um único registro

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const arroba = user.arroba;

    // Chamar a função RPC 'analise_de_um_perfil' no Supabase
    const { data: analiseData, error: analiseError } = await supabase.rpc('analise_de_um_perfil', {
      param_arroba: arroba // Passando o parâmetro para a função RPC
    });

    if (analiseError) {
      console.error('Erro ao chamar a função de análise:', analiseError);
      return res.status(500).json({ error: 'Erro ao realizar análise de perfil' });
    }

    // Retornar os dados da análise do perfil como jsonb
    res.status(200).json(analiseData); // Aqui o analiseData será um objeto jsonb
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota POST para cadastrar um novo serviço
app.post('/cadastro_servico', async (req, res) => {
  const { nome, descricao, avaliacao, valor } = req.body;

  // Verificar se os campos obrigatórios estão presentes
  if (!nome || !descricao || !avaliacao || !valor) {
    return res.status(400).json({ error: 'Nome, descrição, avaliação e valor são obrigatórios' });
  }

  try {
    // Inserir o novo serviço na tabela 'servico'
    const { data, error } = await supabase
      .from('servicos')
      .insert([{ 
        nome: nome,
        descricao: descricao,
        avaliacao: avaliacao,
        valor: valor
      }]);

    if (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar o serviço' });
    }

    
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para buscar todos os serviços prestados
app.get('/servicos', async (req, res) => {
  try {
    // Consulta todos os serviços na tabela 'servicos'
    const { data, error } = await supabase
      .from('servicos') // Certifique-se de que o nome da tabela está correto
      .select('*');

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar serviços' });
    }

    // Retorna todos os serviços como JSON
    res.status(200).json(data);
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Método para pegar todos os registros da tabela usuario_apk
app.get('/pegar_usuarios_apk', async (req, res) => {
  try {
    // Consulta ao banco de dados para pegar todos os usuários da tabela usuario_apk
    const { data, error } = await supabase
      .from('usuario_apk') // Certifique-se de que este é o nome correto da tabela
      .select('*'); // Seleciona todas as colunas

    if (error) {
      // Retorna um erro 500 se ocorrer algum erro na consulta
      return res.status(500).json({ error: 'Erro ao buscar os usuários' });
    }

    // Retorna os dados obtidos da consulta
    return res.status(200).json(data);
  } catch (err) {
    // Em caso de erro interno no servidor, retornar erro 500
    console.error('Erro interno do servidor:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota POST para apagar um usuário, passando o ID no corpo da requisição
app.post('/usuario-apk/apagar', async (req, res) => {
  const { id } = req.body; // Obtém o ID do corpo da requisição

  if (!id) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório' });
  }

  try {
    // Deletar o usuário pelo ID
    const { data, error } = await supabase
      .from('usuario_apk')
      .delete()
      .eq('id', id); // Deletar onde o ID corresponde ao parâmetro passado

    if (error) {
      return res.status(500).json({ error: 'Erro ao apagar o usuário' });
    }

    if (!data.length) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário apagado com sucesso' });
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

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
// Rota para logout
app.post('/logout', (req, res) => {
  // Verifica se o usuário está logado
  if (req.session.userId) {
    // Destrói a sessão do usuário
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao realizar logout' });
      }

      // Redireciona ou envia resposta de sucesso
      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
  } else {
    return res.status(400).json({ error: 'Usuário não está logado' });
  }
});

// Rota POST para cadastrar um novo usuário
app.post('/cadastro_usuario', async (req, res) => {
  const { email, nome, arroba, senha } = req.body;

  if (!email || !arroba || !senha || !nome) {
    return res.status(400).json({ error: 'Email, arroba, nome e senha são obrigatórios' });
  }

  try {
    // Verificar se o email ou arroba já existe no banco de dados
    const { data: existingUser, error: checkError } = await supabase
      .from('usuario_apk')
      .select('*')
      .or(`usuario.eq.${email},arroba.eq.${arroba}`);

    if (checkError) {
      console.error(checkError); // Logar o erro para depuração
      return res.status(500).json({ error: 'Erro ao verificar usuário existente' });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ error: 'Usuário já cadastrado com esse email ou arroba' });
    }

    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir o novo usuário no banco de dados
    const { data, error } = await supabase
      .from('usuario_apk')
      .insert([{ 
        nome: nome,
        usuario: email, 
        arroba: arroba, 
        senha: hashedPassword // Armazenando a senha criptografada
      }]);

    if (error) {
      console.error(error); // Logar o erro para depuração
      return res.status(500).json({ error: 'Erro ao cadastrar o usuário' });
    }

    // Responder com sucesso em vez de redirecionar
    res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error(err); // Logar o erro para depuração
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Rota POST para inserir uma nova avaliação
// Rota POST para inserir uma nova avaliação
app.post('/inserir_avaliacao', async (req, res) => {
  const { resposta, pontos, avaliador } = req.body;

  // Validação básica
  if (!resposta || !pontos || !avaliador) {
    return res.status(400).json({ error: 'Todos os campos (resposta, pontos, avaliador) são obrigatórios' });
  }

  try {
    // Inserir a nova avaliação na tabela 'avaliacao'
    const { data, error } = await supabase
      .from('avaliacao')
      .insert([{ 
        resposta: resposta,
        pontos: pontos,
        avaliador: avaliador
      }]);

    // Verifica se ocorreu algum erro na inserção
    if (error) {
      return res.status(500).json({ error: 'Erro ao inserir avaliação' });
    }

    // Redireciona para a raiz após inserção bem-sucedida
    res.redirect('http://localhost:5173/#avaliacao_form');
    
  } catch (err) {
    console.error('Erro interno do servidor:', err);
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


// Rota GET para obter todas as avaliações
app.get('/avaliacoes', async (req, res) => {
  try {
    // Consulta todas as avaliações da tabela 'avaliacao'
    const { data, error } = await supabase
      .from('avaliacao')
      .select('*'); // Usa '*' para selecionar todas as colunas

    // Verifica se ocorreu algum erro na consulta
    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }

    // Retorna as avaliações encontradas
    res.status(200).json(data);
    
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Rota POST para cadastrar um novo serviço
app.post('/cadastro_servico', async (req, res) => {
  const { nome, descricao, avaliacao, valor, path_img } = req.body;

  // Declare avaliacao_padrao fora do bloco condicional
  let avaliacao_padrao;

  // Verifique se avaliacao é um número
  if (isNaN(avaliacao)) {
    avaliacao_padrao = 5; // Valor padrão se avaliacao não for um número
  } else {
    avaliacao_padrao = avaliacao; // Use o valor fornecido
  }

  try {
    // Inserir o novo serviço na tabela 'servicos'
    const { data, error } = await supabase
      .from('servicos')
      .insert([{ 
        nome: nome,
        descricao: descricao,
        avaliacao: avaliacao_padrao,
        valor: valor,
        path_foto: path_img
      }]);

    if (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar o serviço' });
    }

    // Resposta de sucesso (opcional)
    return res.status(200).json();
    
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

    

    res.status(200).json({ message: 'Usuário apagado com sucesso' });
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    
  }
});
// Rota DELETE para apagar uma avaliação pelo ID
app.delete('/avaliacao/:id', async (req, res) => {
  const { id } = req.params;

  // Validação básica
  if (!id) {
    return res.status(400).json({ error: 'ID da avaliação é obrigatório' });
  }

  try {
    // Deletar a avaliação da tabela 'avaliacao'
    const { data, error } = await supabase
      .from('avaliacao')
      .delete()
      .eq('id', id);

   

    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: 'Avaliação apagada com sucesso' });
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota DELETE para apagar uma avaliação pelo ID
app.post('/servicos_delete', async (req, res) => {
  const { id } = req.body;  // O id vem no corpo da requisição

  // Validação básica
  if (!id) {
    return res.status(400).json({ error: 'ID da avaliação é obrigatório' });
  }

  try {
    // Deletar o serviço da tabela 'servicos'
    const { data, error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);

    
    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: 'Serviço apagado com sucesso' });
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Rota PUT para atualizar um serviço específico pelo ID
// Método para alterar o serviço
app.post('/alterar_servico', async (req, res) => {
  const { id, nome, descricao, valor, path_foto } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID do serviço é obrigatório' });
  }

  // Define um objeto para armazenar os campos a serem atualizados
  const camposAtualizados = {};

  // Adiciona os campos enviados no corpo da requisição ao objeto de atualização
  if (nome) camposAtualizados.nome = nome;
  if (descricao) camposAtualizados.descricao = descricao;
  if (valor) camposAtualizados.valor = valor;
  if (path_foto) camposAtualizados.path_foto

  try {
    // Atualiza o serviço no banco de dados usando o Supabase
    const { data, error } = await supabase
      .from('servicos') // Nome da tabela no banco de dados
      .update(camposAtualizados) // Campos a serem atualizados dinamicamente
      .eq('id', id); // Condição para localizar o registro correto

    if (error) {
      return res.status(500).json({ error: 'Erro ao atualizar o serviço' });
    }

    // Retorna uma resposta de sucesso
    res.status(200).json({ message: 'Serviço atualizado com sucesso', data });
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


const multer = require('multer');
const path = require('path');

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB
    storage: multer.memoryStorage() // Armazenamento na memória
});


// Rota de upload de imagem
app.post('/upload-imagem', upload.single('imagem'), async (req, res) => {
  

  try {
    if (req.file) {
      console.log(req.file); // Verifique se os dados da imagem estão corretos

      const { data: uploadData} = await supabase
          .storage
          .from('app') // Verifique se é o bucket correto
          .upload(`servicos/${req.file.originalname}`, req.file.buffer, {
              contentType: req.file.mimetype
          });
          console.log(uploadData.path);
          let path=uploadData.path;
          
          
          
          const {data} = await supabase
          .storage
          .from('app')
          .getPublicUrl(path);
          console.log(data)
          var linkPublico=data.publicUrl;
      }
      // Faz o upload da imagem para o Supabase Storage (bucket)
      

      

      // Extrai os dados do corpo da requisição
      const { id, nome, descricao, valor } = req.body;
      console.log(id, nome, descricao, valor, linkPublico)

      // Verifica se o ID foi passado
      

      // Atualiza os dados na tabela 'servicos'
      const { data: updateData, error: updateError } = await supabase
          .from('servicos')
          .update({
              ...(nome && { nome }), // Atualiza apenas se existir
              ...(descricao && { descricao }), // Atualiza apenas se existir
              ...(valor && { valor }), // Atualiza apenas se existir
              ...(path && { path_foto: linkPublico})
          })
          .eq('id', id)
          .select('*'); // Retorna o registro atualizado

      if (updateError) {
          console.error('Erro ao atualizar o serviço:', updateError);
          return res.status(500).json({ error: 'Erro ao atualizar o serviço.' });
      }

      res.status(200).json({ message: 'Serviço atualizado com sucesso.', data: updateData });
  } catch (error) {
      console.error('Erro interno do servidor:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


app.post('/cadastro_servico', upload.single('imagem'), async (req, res) => {
  const { nome, descricao, valor } = req.body;
  console.log('Dados recebidos:', req.body); // Debugging
  
  

  let avaliacao_padrao = isNaN(avaliacao) ? 5 : parseFloat(avaliacao);

  try {
    // Realizando o upload da imagem para o Supabase
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('app')
      .upload(`servicos/${req.file.originalname}`, req.file.buffer, {
        contentType: req.file.mimetype
      });

   
    // Obtendo o link público da imagem
    const { data } = await supabase
      .storage
      .from('app')
      .getPublicUrl(uploadData.path);

    const linkPublico = data.publicUrl;

    // Inserir o novo serviço na tabela 'servicos'
    const { data: serviceData, error: insertError } = await supabase
      .from('servicos')
      .insert([{
        nome,
        descricao,
        avaliacao: avaliacao_padrao,
        valor,
        path_foto: linkPublico
      }]);

 

    return res.status(200).json({
      message: 'Serviço cadastrado com sucesso.',
      data: serviceData
    });

  } catch (err) {
    console.error('Erro interno do servidor:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/carrinho/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Buscando os itens do carrinho com detalhes do serviço associado
    const { data, error } = await supabase
      .from('carrinho')
      .select('id_servico, servicos(nome, descricao, valor)')  // Aqui estamos trazendo os detalhes do serviço
      .eq('id_usuario', userId); // Garantindo que estamos pegando os itens do carrinho do usuário correto

 

    
    console.log(data)
    res.json({ data});
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar itens do carrinho');
  }
});



app.post('/cadastrar_servico_no_carrinho', async (req, res) => {
  const { id_usuario, id_servico } = req.body;

  if (!id_usuario || !id_servico) {
    return res.status(400).json({ error: 'id_usuario e id_servico são obrigatórios' });
  }

  try {
    const { data, error } = await supabase
      .from('carrinho') // Substitua pelo nome real da sua tabela de carrinho
      .insert([{ id_usuario, id_servico }]);

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'Serviço adicionado ao carrinho com sucesso', data });
  } catch (error) {
    console.error('Erro ao cadastrar serviço no carrinho:', error);
    res.status(500).json({ error: 'Erro ao cadastrar serviço no carrinho' });
  }
});



// Rota para alterar os dados de um usuário pelo ID usando POST
app.post('/alterar_usuario/:id', async (req, res) => {
  const { id } = req.params; // ID do usuário a ser alterado
  const { nome, arroba, email, senha } = req.body; // Novos dados para atualização

  // Prepara um objeto para armazenar os dados a serem atualizados
  const updatedData = {};

  // Verifica se cada campo foi fornecido e, em caso afirmativo, adiciona ao objeto de dados a serem atualizados
  if (nome) {
    updatedData.nome = nome;
  }

  if (arroba) {
    updatedData.arroba = arroba;
  }

  if (email) {
    updatedData.usuario = email;
  }

  if (senha) {
    // Se a senha for fornecida, geramos o hash
    const hashedPassword = await bcrypt.hash(senha, 10);
    updatedData.senha = hashedPassword;
  }

  try {
    // Atualiza os dados do usuário no banco de dados
    const { data, error } = await supabase
      .from('usuario_apk') // Troque pelo nome da tabela correta se necessário
      .update(updatedData)
      .eq('id', id); // Filtra pelo ID do usuário

 

    // Responde com sucesso após atualização
    res.status(200).json({ message: 'Usuário alterado com sucesso'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});














// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

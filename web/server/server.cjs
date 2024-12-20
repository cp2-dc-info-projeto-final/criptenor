const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const session = require('express-session'); // Para gerenciar sessões de usuário
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Importa o uuid


const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB
    storage: multer.memoryStorage() // Armazenamento na memória
});


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


// Nova lógica de login


//Email
const nodemailer = require('nodemailer');

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port:465,
  secure: true,
  service: 'gmail', // Você pode trocar o serviço conforme necessário
  auth: {
    user: 'criptenor@gmail.com', // Seu e-mail
    pass: 'bbsl cezk hmae guai' // Senha ou App Password
  }
});



const crypto = require('crypto'); // Para gerar o hash seguro

/**
 * Método de login via POST.
 * Recebe email e senha no corpo da requisição, gera um access_token e o retorna.
 */
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    console.log(email);
    console.log(senha);

    try {
        // Buscar o usuário no banco de dados
        const { data: usuarios, error } = await supabase
            .from('usuario_apk')
            .select('id, senha')
            .eq('usuario', email)
            .limit(1);

        console.log(usuarios)
        const usuario = usuarios[0];
        

        // Verificar a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha inválida.' });
        }

        // Gerar o access_token
        const accessToken = crypto.randomBytes(32).toString('hex');

        // Atualizar o access_token no banco de dados
        const { error: updateError } = await supabase
            .from('usuario_apk')
            .update({ access_token: accessToken })
            .eq('id', usuario.id);



        // Retornar o access_token
        return res.status(200).json({ access_token: accessToken });
    } catch (err) {
        console.error('Erro inesperado no login:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

app.post('/logout', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
      return res.status(400).json({ error: 'Access token é obrigatório.' });
  }

  try {
      // Remover o access_token do banco de dados
      const { error } = await supabase
          .from('usuario_apk')
          .update({ access_token: null })
          .eq('access_token', access_token);

      if (error) {
          return res.status(500).json({ error: 'Erro ao remover o access_token.' });
      }

      // Confirmar logout
      return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
      console.error('Erro inesperado no logout:', err);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.post('/enviar-email-de-confirmacao', async (req, res) => {
  const { access_token } = req.body;

  try {
    // Verificar se o usuário existe no banco de dados
    const { data: usuarios, error } = await supabase
      .from('usuario_apk')
      .select('id, usuario, email_confirmado')
      .eq('access_token', access_token)
      .limit(1);

   
    if (usuarios[0].email_confirmado == true){
      return res.status(200).json({ message: 'E-mail de confirmação enviado com sucesso.' });
    }

    const usuario = usuarios[0];
    const email = usuario.usuario;

    // Gerar o código de confirmação de 4 dígitos
    const codigoConfirmacao = Math.floor(1000 + Math.random() * 9000).toString();

    // Atualizar o código de confirmação no banco de dados
    const { error: updateError } = await supabase
      .from('usuario_apk')
      .update({ codigo_confirmacao: codigoConfirmacao })
      .eq('id', usuario.id);

    
    // Template HTML com interpolação
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Código de Confirmação</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                  color: #333;
              }
              .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #4CAF50;
                  color: #ffffff;
                  text-align: center;
                  padding: 20px;
              }
              .header img {
                  max-width: 150px;
                  margin-bottom: 10px;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  padding: 20px;
              }
              .content h2 {
                  color: #4CAF50;
                  font-size: 20px;
              }
              .content p {
                  font-size: 16px;
                  line-height: 1.6;
              }
              .code {
                  font-size: 24px;
                  font-weight: bold;
                  text-align: center;
                  margin: 20px 0;
                  padding: 10px;
                  background-color: #f4f4f4;
                  border-radius: 5px;
                  border: 1px dashed #4CAF50;
                  color: #4CAF50;
              }
              .footer {
                  background-color: #f4f4f4;
                  text-align: center;
                  padding: 10px;
                  font-size: 14px;
                  color: #666;
              }
              .footer a {
                  color: #4CAF50;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <img src="https://vkjrrppgjzgtastjzgyg.supabase.co/storage/v1/object/public/app/criptenor.png?t=2024-12-09T03%3A29%3A40.991Z" alt="CRIPTENOR Logo">
                  <h1>CRIPTENOR</h1>
              </div>
              <div class="content">
                  <h2>Olá, ${email}!</h2>
                  <p>Esperamos que esteja tudo bem com você. Estamos enviando o seu código de confirmação para garantir a segurança da sua conta. Por favor, não compartilhe este código com ninguém.</p>
                  <div class="code">${codigoConfirmacao}</div>
                  <p>Se você não solicitou este código, entre em contato com nossa equipe de suporte imediatamente.</p>
                  <p>Atenciosamente,<br>Equipe CRIPTENOR</p>
              </div>
              <div class="footer">
                  <p>Esta mensagem foi enviada por CRIPTENOR. Para dúvidas ou suporte, acesse nosso <a href="https://criptenor.com">site oficial</a>.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Configurar o e-mail
    const mailOptions = {
      from: 'criptenor@gmail.com',
      to: email,
      subject: 'Código de Confirmação',
      html: html, // Template HTML
    };

    // Enviar o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar o e-mail:', error);
        return res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
      }

      console.log('E-mail enviado:', info.response);
      return res.status(200).json({ message: 'E-mail de confirmação enviado com sucesso.' });
    });
  } catch (err) {
    console.error('Erro inesperado ao enviar o e-mail de confirmação:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});


app.post('/confirmar-pin', async (req, res) => {
  const { access_token, pin } = req.body;

  try {
    // Verificar se o access_token e o pin estão corretos
    const { data: usuario, error: fetchError } = await supabase
      .from('usuario_apk')
      .select('id, codigo_confirmacao, email_confirmado')
      .eq('access_token', access_token)
      .limit(1)
      .single();
      console.log(usuario.codigo_confirmacao, pin)


    // Verificar se o PIN corresponde
    if (usuario.codigo_confirmacao != pin) {
      console.log('PIN incorreto.');
      return res.status(401).json({ error: 'PIN incorreto.' });
    }

    // Atualizar o campo email_confirmado
    const { data:dataUsuario, error: updateError } = await supabase
      .from('usuario_apk')
      .update({ email_confirmado: true })
      .eq('id', usuario.id);
      console.log(dataUsuario);


    
    console.log('E-mail confirmado com sucesso para o usuário:', usuario.id);
    return res.status(200).json({ message: 'E-mail confirmado com sucesso!' });
  } catch (err) {
    
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});




app.post('/conferir-credencial-adm', async (req, res) => {
  const { access_token } = req.body;
  console.log('Token recebido no servidor:', access_token);

  try {
    const { data: usuarios, error } = await supabase
      .from('usuario_apk')
      .select('id, adm, email_confirmado, path_foto')
      .eq('access_token', access_token)
      
      .limit(1);

    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado ou não é administrador.' });
    }

    const usuario = usuarios[0];

    return res.status(200).json({ 
      message: 'Access token válido e usuário é administrador.', 
      user_id: usuario.id,
      adm: usuario.adm,
      email_confirmado:usuario.email_confirmado,
      path_foto:usuario.path_foto
    });
  } catch (err) {
    console.error('Erro inesperado ao conferir credencial:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
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
        senha: hashedPassword, // Armazenando a senha criptografada
        email_confirmado:false
      }]);
      

      const { data1, error1 } = await supabase
      .from('usuario')
      .insert([{ 
        
        arroba: arroba, 
        
      }]);

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






// Middleware para upload da imagem
app.post('/alterar_informacoes_perfil', upload.single('foto'), async (req, res) => {
  const { access_token, nome, usuario, arroba } = req.body;

  try {
    // Verificar o usuário pelo access token
    const { data: userExists, error: userError } = await supabase
      .from('usuario_apk')
      .select('*')
      .eq('access_token', access_token)
      .single();

    if (userError) {
      console.error(userError);
      return res.status(500).json({ error: 'Erro ao verificar usuário' });
    }

    if (!userExists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o novo usuário já está em uso por outro usuário
    const { data: existingUser, error: checkError } = await supabase
      .from('usuario_apk')
      .select('*')
      .eq('usuario', usuario)
      .neq('access_token', access_token);

    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ error: 'Erro ao verificar usuário' });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ error: 'Usuário já está em uso' });
    }

    let path_foto = null;

    // Se a imagem for enviada, faça o upload para o Supabase
    if (req.file) {
      const hash = crypto.createHash('sha256').update(req.file.originalname + Date.now()).digest('hex');
      const uniqueName = `${hash}_${req.file.originalname}`;

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('app')
        .upload(`/foto_de_perfil/${uniqueName}`, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error('Erro no upload da imagem:', uploadError);
        return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
      }

      const { data: publicData } = await supabase
        .storage
        .from('foto_de_perfil')
        .getPublicUrl(uploadData.path);

      path_foto = "https://vkjrrppgjzgtastjzgyg.supabase.co/storage/v1/object/public/app/foto_de_perfil/"+uniqueName;
      console.log(path_foto);
    }

    // Atualizar as informações do usuário no banco de dados
    const updatedFields = { nome, usuario, arroba };

    if (path_foto) {
      updatedFields.path_foto = path_foto;
    }

    const { error: updateError } = await supabase
      .from('usuario_apk')
      .update(updatedFields)
      .eq('access_token', access_token);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ error: 'Erro ao atualizar perfil do usuário' });
    }

    res.status(200).json({
      message: 'Perfil atualizado com sucesso',
      path_foto
    });
  } catch (err) {
    console.error('Erro interno:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
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
    
    // Retornar os dados do perfil como jsonb
    res.status(200).json(data); // Aqui o data[0] será um objeto jsonb
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para buscar arroba pelo ID
app.get('/usuario-apk/:access_token', async (req, res) => {
  const { access_token } = req.params;

  if (!access_token) {
      return res.status(400).json({ error: 'Parâmetro access_token é obrigatório' });
  }

  try {
      // Consulta na tabela usuario_apk para obter o arroba pelo access_token
      const { data, error } = await supabase
          .from('usuario_apk')
          .select('arroba')
          .eq('access_token', access_token)
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
app.get('/analise-perfil-por-token', async (req, res) => {
  const { access_token } = req.query; // Obtendo o token do query parameter

  if (!access_token) {
    return res.status(400).json({ error: 'O parâmetro access_token é obrigatório' });
  }

  try {
    // Consulta na tabela usuario_apk para obter o arroba pelo access_token
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('arroba')
      .eq('access_token', access_token)
      .single(); // Usando .single() para obter um único registro

    

    const arroba = user.arroba;
    console.log(user);

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



// Rota para buscar todos os serviços prestados
app.get('/servicos', async (req, res) => {
  try {
    // Consulta todos os serviços na tabela 'servicos'
    const { data, error } = await supabase
      .from('servicos') // Certifique-se de que o nome da tabela está correto
      .select('*')
      .neq('id', 1);

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




// Rota de upload de imagem
app.post('/upload-imagem', upload.single('imagem'), async (req, res) => {
  try {
    if (req.file) {
      // Gerar um nome único para a imagem
      const uniqueName = `${uuidv4()}_${req.file.originalname}`;
      
      // Upload da imagem com nome único
      const { data: uploadData } = await supabase
        .storage
        .from('app') // Verifique se é o bucket correto
        .upload(`servicos/${uniqueName}`, req.file.buffer, {
          contentType: req.file.mimetype
        });
      
      let path = uploadData.path;

      const { data } = await supabase
        .storage
        .from('app')
        .getPublicUrl(path);
      
      var linkPublico = data.publicUrl;

      // Faz o upload da imagem para o Supabase Storage (bucket)
    }

    // Extrai os dados do corpo da requisição
    const { id, nome, descricao, valor } = req.body;

    // Verifica se o ID foi passado

    // Atualiza os dados na tabela 'servicos'
    const { data: updateData, error: updateError } = await supabase
      .from('servicos')
      .update({
        ...(nome && { nome }), // Atualiza apenas se existir
        ...(descricao && { descricao }), // Atualiza apenas se existir
        ...(valor && { valor }), // Atualiza apenas se existir
        ...(path && { path_foto: linkPublico })
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

// Rota para o cadastro de serviço
app.post('/cadastro_servico', upload.single('imagem'), async (req, res) => {
  const { nome, descricao, valor, avaliacao } = req.body;

  let avaliacao_padrao = isNaN(avaliacao) ? 5 : parseFloat(avaliacao);

  try {
    // Verifica se uma imagem foi enviada
    if (!req.file) {
      return res.status(400).json({ error: 'Imagem não fornecida' });
    }

    // Gerar um nome único para a imagem
    const uniqueName = `${uuidv4()}_${req.file.originalname}`;

    // Upload da imagem para o Supabase com o nome único
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('app')
      .upload(`servicos/${uniqueName}`, req.file.buffer, {
        contentType: req.file.mimetype
      });

    if (uploadError) {
      console.error('Erro no upload da imagem:', uploadError);
      return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }

    // Obtendo o link público da imagem
    const { data: publicData } = supabase
      .storage
      .from('app')
      .getPublicUrl(uploadData.path);

    const linkPublico = publicData.publicUrl;

    // Inserir os dados no banco de dados Supabase
    const { data: serviceData, error: insertError } = await supabase
      .from('servicos')
      .insert([{
        nome,
        descricao,
        valor: parseFloat(valor),
        avaliacao: avaliacao_padrao,
        path_foto: linkPublico
      }]);

    if (insertError) {
      console.error('Erro ao inserir serviço:', insertError);
      return res.status(500).json({ error: 'Erro ao inserir serviço no banco de dados' });
    }

    // Retornar sucesso
    res.status(201).json({ message: 'Serviço cadastrado com sucesso', data: serviceData });
  } catch (error) {
    console.error('Erro no processamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/carrinho', async (req, res) => {
  const { access_token } = req.headers;

  if (!access_token) {
    return res.status(400).send('Access token é obrigatório');
  }

  try {
    // Buscar o usuário pelo access_token na tabela usuario_apk
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('id')
      .eq('access_token', access_token)
      .single();

    if (userError || !user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const userId = user.id;

    // Buscar os itens do carrinho associados ao usuário
    const { data: carrinho, error: carrinhoError } = await supabase
      .from('carrinho')
      .select('id_servico, servicos(nome, descricao, valor)')
      .eq('id_usuario', userId);

    if (carrinhoError) {
      return res.status(500).send('Erro ao buscar itens do carrinho');
    }

    // Agrupar os serviços e somar as quantidades
    const carrinhoAgrupado = carrinho.reduce((acc, item) => {
      const { id_servico, servicos } = item;

      if (acc[id_servico]) {
        acc[id_servico].quantidade += 1;
      } else {
        acc[id_servico] = {
          id_servico,
          nome: servicos.nome,
          descricao: servicos.descricao,
          valor: servicos.valor,
          quantidade: 1
        };
      }

      return acc;
    }, {});

    const carrinhoFinal = Object.values(carrinhoAgrupado);

    // Calcular o valor total do carrinho
    const valorTotal = carrinhoFinal.reduce((total, item) => {
      return total + item.valor * item.quantidade;
    }, 0);

    res.json({
      data: carrinhoFinal,
      valorTotal: valorTotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao processar a solicitação');
  }
});

app.get('/usuario_perfil', async (req, res) => {
  const { access_token } = req.headers;

  if (!access_token) {
    return res.status(400).send('Access token é obrigatório');
  }

  try {
    // Buscar o usuário pelo access_token na tabela usuario_apk
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select("*") // Deve ser um array ou uma string
      .eq('access_token', access_token)
      .single();

    if (userError) {
      return res.status(404).send('Usuário não encontrado');
    }

    return res.status(200).json({
      message: 'Perfil do usuário encontrado com sucesso',
      data: user
    });
  } catch (err) {
    console.error(err);
    
  }
});





app.post('/cadastrar_servico_no_carrinho', async (req, res) => {
  const { access_token, id_servico } = req.body;
  const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario_apk')
      .select('id')
      .eq('access_token', access_token)
      .single();

      console.log(usuarioData);

    const id_usuario = usuarioData.id;

 
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

// Rota para deletar um produto usando o método POST
// Rota para apagar um produto do carrinho usando o método POST
app.post('/apagar_produto_no_carrinho', async (req, res) => {
  const { id_session, id_produto } = req.body;


  try {
    // Passo 1: Obter o usuário pelo id_session
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario_apk')
      .select('id')
      .eq('access_token', id_session)
      .single();

      console.log(usuarioData.id);

    const usuarioId = usuarioData.id;

    // Passo 2: Verificar se o produto está no carrinho do usuário
    const { data: carrinhoData, error: carrinhoError } = await supabase
      .from('carrinho')
      .select('id')
      .eq('id_usuario', usuarioId)
      .eq('id_servico', id_produto)
      
    console.log(carrinhoData[0].id);


    // Passo 3: Remover o produto do carrinho
    const { error: deleteError } = await supabase
      .from('carrinho')
      .delete()
      .eq('id', carrinhoData[0].id);

 

    return res.status(200).json({ message: 'Produto apagado do carrinho com sucesso.' });
  } catch (err) {
    console.log(err)
  }
});



// Rota para adicionar compras do carrinho ao histórico de compras
// Rota para adicionar compras do carrinho ao histórico de compras
app.post('/comprar', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).send('Access token é obrigatório');
  }

  try {
    // 1. Buscar o usuário pelo access_token
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('id')
      .eq('access_token', access_token)
      .single();

    if (userError || !user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const userId = user.id;

    // 2. Buscar os itens do carrinho associados ao usuário
    const { data: carrinho, error: carrinhoError } = await supabase
      .from('carrinho')
      .select('id_servico')
      .eq('id_usuario', userId);

    if (carrinhoError) {
      return res.status(500).send('Erro ao buscar itens do carrinho');
    }

    if (!carrinho || carrinho.length === 0) {
      return res.status(404).send('Nenhum serviço encontrado no carrinho');
    }

    // 3. Adicionar cada serviço individualmente à tabela de compras
    for (const item of carrinho) {
      const { id_servico } = item;

      const { error: compraError } = await supabase
        .from('compra')
        .insert([
          {
            id_usuario: userId,
            id_servico,
            utilizada:false
          }
        ]);

      if (compraError) {
        console.error('Erro ao adicionar à tabela compra:', compraError);
        return res.status(500).send('Erro ao adicionar o serviço à compra');
      }
    }

    // 4. Limpar os serviços do carrinho após adicionar à compra
    const idsServico = carrinho.map(servico => servico.id_servico);
    const { error: deleteError } = await supabase
      .from('carrinho')
      .delete()
      .in('id_servico', idsServico)
      .eq('id_usuario', userId);

    if (deleteError) {
      console.error('Erro ao limpar o carrinho:', deleteError);
      return res.status(500).send('Erro ao limpar o carrinho após a compra');
    }

    res.status(200).json({
      message: 'Compra realizada com sucesso'
    });

  } catch (err) {
    console.error('Erro ao adicionar compra:', err);
    res.status(500).send('Erro ao processar a solicitação');
  }
});


app.post('/total_credito', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).send('Access token é obrigatório');
  }

  try {
    // 1. Buscar o usuário pelo access_token
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('id')
      .eq('access_token', access_token)
      .single();

    if (userError || !user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const userId = user.id;

    // 2. Somar o total de créditos do usuário
    const { data: creditos, error: creditosError } = await supabase
      .from('credito')
      .select('total')
      .eq('id_usuario', userId);

    if (creditosError) {
      return res.status(500).send('Erro ao buscar créditos');
    }

    const totalCreditos = creditos.reduce((acc, credito) => acc + credito.total, 0);

    // 3. Somar o total de débitos do usuário
    const { data: debitos, error: debitosError } = await supabase
      .from('debito')
      .select('total')
      .eq('id_usuario', userId);

    if (debitosError) {
      return res.status(500).send('Erro ao buscar débitos');
    }

    const totalDebitos = debitos.reduce((acc, debito) => acc + debito.total, 0);

    // 4. Calcular o saldo total (crédito - débito)
    const saldoTotal = totalCreditos - totalDebitos;

    res.status(200).json({ saldoTotal });
  } catch (err) {
    console.error('Erro ao calcular saldo total de créditos:', err);
    res.status(500).send('Erro ao processar a solicitação');
  }
});

app.post('/extrato', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).send('Access token é obrigatório');
  }

  try {
    // 1. Buscar o usuário pelo access_token
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('id')
      .eq('access_token', access_token)
      .single();

    if (userError || !user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const userId = user.id;

    // 2. Buscar créditos do usuário
    const { data: creditos, error: creditosError } = await supabase
      .from('credito')
      .select('id, total, created_at')
      .eq('id_usuario', userId);

    if (creditosError) {
      return res.status(500).send('Erro ao buscar créditos');
    }

    // 3. Buscar débitos do usuário
    const { data: debitos, error: debitosError } = await supabase
      .from('debito')
      .select('id, total, created_at')
      .eq('id_usuario', userId);

    if (debitosError) {
      return res.status(500).send('Erro ao buscar débitos');
    }

    // 4. Combinar e ordenar as transações
    const transacoes = [
      ...creditos.map(credito => ({
        id: credito.id,
        tipo: 'credito',
        valor: credito.total,
        created_at: credito.created_at,
      })),
      ...debitos.map(debito => ({
        id: debito.id,
        tipo: 'debito',
        valor: debito.total,
        created_at: debito.created_at,
      })),
    ];

    // Ordenar por created_at em ordem decrescente
    transacoes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({ transacoes });
  } catch (err) {
    console.error('Erro ao gerar extrato:', err);
    res.status(500).send('Erro ao processar a solicitação');
  }
});




app.post('/realizar_deposito', async (req, res) => {
  const { access_token, valor } = req.body;

  if (!access_token || valor == null) {
    return res.status(400).send('Access token e valor são obrigatórios');
  }

  if (valor <= 0) {
    return res.status(400).send('O valor do depósito deve ser maior que zero');
  }

  try {
    // 1. Buscar o usuário pelo access_token
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('id')
      .eq('access_token', access_token)
      .single();

    if (userError || !user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const userId = user.id;

    // 2. Inserir o valor na tabela crédito
    const { error: creditoError } = await supabase
      .from('credito')
      .insert([{ id_usuario: userId, total: valor }]);

    if (creditoError) {
      console.error('Erro ao inserir depósito:', creditoError);
      return res.status(500).send('Erro ao realizar depósito');
    }

    res.status(200).send('Depósito realizado com sucesso');
  } catch (err) {
    console.error('Erro ao processar depósito:', err);
    res.status(500).send('Erro ao processar a solicitação');
  }
});

app.post('/realizar_debito', async (req, res) => {
  const { access_token, valor } = req.body;

  if (!access_token || valor == null) {
    return res.status(400).send('Access token e valor são obrigatórios');
  }

  if (valor <= 0) {
    return res.status(400).send('O valor do débito deve ser maior que zero');
  }

  try {
    // 1. Buscar o usuário pelo access_token
    const { data: user, error: userError } = await supabase
      .from('usuario_apk')
      .select('id') // Supondo que o saldo do usuário esteja na tabela
      .eq('access_token', access_token)
      .single();


    const userId = user.id;
    

    

    // 4. Inserir o valor na tabela débito
    const { error: debitoError } = await supabase
      .from('debito')
      .insert([{ id_usuario: userId, total: valor }]);

  

    // Resposta de sucesso
    res.status(200).send('Débito realizado com sucesso');
  } catch (err) {
    console.error('Erro ao processar débito:', err);
    res.status(500).send('Erro ao processar a solicitação');
  }
});






// Rota para alterar os dados de um usuário pelo ID usando POST
app.post('/alterar_usuario/:id', async (req, res) => {
  const { id } = req.params; // ID do usuário a ser alterado
  let { nome, arroba, email, senha, adm } = req.body; // Novos dados para atualização
  if(id==1){
    adm=true;
  }

  // Prepara um objeto para armazenar os dados a serem atualizados
  const updatedData = {};

  // Adiciona os campos fornecidos ao objeto de dados a serem atualizados
  if (nome !== undefined) {
    updatedData.nome = nome;
  }

  if (arroba !== undefined) {
    updatedData.arroba = arroba;
  }

  if (email !== undefined) {
    updatedData.usuario = email;
  }

  if (senha !== undefined) {
    // Se a senha for fornecida, geramos o hash
    const hashedPassword = await bcrypt.hash(senha, 10);
    updatedData.senha = hashedPassword;
  }

  // Adiciona o campo `adm` diretamente ao objeto de atualização, já que é booleano
  if (adm !== undefined) {
    updatedData.adm = adm;
  }

  try {
    // Atualiza os dados do usuário no banco de dados
    const { data, error } = await supabase
      .from('usuario_apk') // Troque pelo nome da tabela correta se necessário
      .update(updatedData)
      .eq('id', id); // Filtra pelo ID do usuário

    if (error) {
      throw error; // Lança o erro para ser tratado no catch
    }

    // Responde com sucesso após atualização
    res.status(200).json({ message: 'Usuário alterado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
  }
});


app.post('/alterar_senha', async (req, res) => {
  const { access_token, senha } = req.body;

  try {
    // Verificar o usuário pelo access token
    const { data: userExists, error: userError } = await supabase
      .from('usuario_apk')
      .select('*')
      .eq('access_token', access_token)
      .single();

  

    // Criptografar a senha usando bcrypt
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Atualizar a senha do usuário no banco de dados
    const { error: updateError } = await supabase
      .from('usuario_apk')
      .update({ senha: hashedPassword })
      .eq('access_token', access_token);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ error: 'Erro ao atualizar senha do usuário' });
    }

    res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    console.error('Erro interno:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}); 


// Rota para alterar o atributo ADM de um usuário
app.post('/alterar_adm/:id', async (req, res) => {
  const { id } = req.params; // ID do usuário a ser alterado
  const { adm } = req.body; // Novo valor para o atributo ADM (true ou false)
  if (id==1){
    adm=true
  }

  // Verifica se o valor do atributo ADM foi fornecido
  if (adm === undefined) {
    return res.status(400).json({ error: 'O campo adm é obrigatório e deve ser true ou false' });
  }

  try {
    // Atualiza o atributo ADM do usuário no banco de dados
    const { data, error } = await supabase
      .from('usuario_apk')
      .update({ adm }) // Atualiza o atributo ADM com o valor fornecido
      .eq('id', id); // Filtra pelo ID do usuário

    if (error) {
      console.error('Erro ao atualizar atributo ADM:', error);
      return res.status(500).json({ error: 'Erro ao atualizar atributo ADM' });
    }

    // Responde com sucesso após a atualização
    res.status(200).json({ message: 'Atributo ADM atualizado com sucesso', data });
  } catch (err) {
    console.error('Erro interno do servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});















// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

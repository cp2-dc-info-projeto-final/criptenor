## Fluxo Principal: Cadastro até Comprar Serviço  

---

### 🚀 **Cadastro**

1. Acesse a página de **Cadastro**.  
2. Preencha os seguintes campos obrigatórios:  
   - **E-mail**  
   - **Senha**  
   - **Nome**  
   - **Arroba do Instagram**  

![Banner Cadastro](../../img-doc/casos-de-uso-usuario/cadastro_2.png)

3. Clique no botão **Submit** para enviar o formulário.  
4. Após o envio, o sistema redireciona automaticamente para a página de **Login**.  

---

### 📧 **Confirmação de E-mail**

1. No **Login**, insira o **E-mail** e a **Senha** cadastrados.  
2. Clique em **Enviar**.  
3. Verifique o e-mail cadastrado e insira o código enviado ao seu e-mail.  

---

### 🔐 **Entrar na Conta**

1. Acesse a página de **Entrar** e preencha os campos:  
   - **E-mail**  
   - **Senha**  

![Banner Login](../../img-doc/casos-de-uso-usuario/login.png)

2. Clique no botão **Entrar**.  
3. O sistema redireciona você automaticamente para o **Dashboard**.  

---

### 👤 **Visualizar Perfil**

1. No **Dashboard**, clique na sua **foto de perfil** (canto superior direito).  
2. No menu exibido, selecione a opção **Perfil** para visualizar suas informações pessoais.  

![Visualizar Perfil](../../img-doc/casos-de-uso-usuario/perfil.png)

---

### 💰 **Adicionar Créditos no Perfil**

1. Acesse sua **foto de perfil**, e no menu suspenso, clique em **Perfil**.  
2. Localize sua carteira digital e clique em **Realizar Depósito**.  

![Depósito](../../img-doc/casos-de-uso-usuario/deposito.png)

3. Escolha o valor desejado para o depósito.  
4. Clique em **Confirmar Depósito**.

---

### 🛒 **Comprar Serviço**

1. No **Dashboard**, vá até a barra de navegação superior e clique em **Serviços**.  

![Dashboard](../../img-doc/casos-de-uso-usuario/dash.png)

2. Visualize os serviços disponíveis e selecione o serviço desejado.  

![Serviço Desbloqueado](../../img-doc/casos-de-uso-usuario/servico-desbloqueado.png)

3. Clique no botão **Selecionar Serviço**.  

4. Escolha a forma de pagamento e confirme a transação.  

---
## 🔄 **Fluxos Alternativos**  

---

### ⚠️ **Alternativo - Cadastro**  

---

### Problema 1: E-mail já cadastrado  
**Cenário:** O usuário tenta se cadastrar com um e-mail que já existe no sistema.  

**Fluxo Alternativo:**  

1. O usuário preenche os campos do formulário de cadastro:  
   - **E-mail**  
   - **Senha**  
   - **Nome**  
   - **Arroba do Instagram**  

2. Clica no botão **Submit**.  
3. O sistema verifica se o e-mail já está cadastrado.  
4. Caso o e-mail já exista:  
   - Uma mensagem de erro é exibida: **"Este e-mail já está em uso. Por favor, utilize outro e-mail."**  
   - O usuário deve retornar ao formulário e preencher um e-mail diferente.  

---

### Problema 2: Arroba do Instagram já em uso  
**Cenário:** O usuário tenta se cadastrar e a arroba do Instagram fornecida já está associada a outro perfil no sistema.  

**Fluxo Alternativo:**  

1. O usuário preenche os campos do formulário de cadastro:  
   - **E-mail**  
   - **Senha**  
   - **Nome**  
   - **Arroba do Instagram**  

2. Clica no botão **Submit**.  
3. O sistema verifica se a **Arroba do Instagram** fornecida já está em uso.  
4. Caso a arroba já exista:  
   - Uma mensagem de erro é exibida: **"Esta arroba do Instagram já está em uso. Escolha outra."**  
   - O usuário deve retornar ao formulário e fornecer uma nova arroba do Instagram.  

---

### 💵 **Alternativo - Depósito no Perfil**  

---

### Problema 1: Depósito de valor 0  
**Cenário:** O usuário tenta realizar um depósito com o valor igual a zero.  

**Fluxo Alternativo:**  

1. O usuário clica na sua **foto de perfil**, localizada no canto superior direito da tela.  
2. No menu suspenso, clica na opção **Perfil** para visualizar suas informações.  
3. Localiza a seção da **Carteira** e clica no botão **Realizar Depósito**.  
4. Insere o valor desejado.  
5. Caso o valor inserido seja **0**:  
   - O sistema exibe a seguinte mensagem de erro: **"Erro: Valor de depósito inválido. Insira um valor maior que zero."**  
6. O usuário deve corrigir o valor e informar um depósito válido antes de confirmar a transação.  

---

### 💰 **Alternativo - Comprar Serviço sem Créditos**  

---

### Problema 2: Usuário clica em um serviço sem ter créditos disponíveis  
**Cenário:** O usuário tenta comprar um serviço, mas não possui créditos suficientes no perfil.  

**Fluxo Alternativo:**  

1. No **Dashboard**, o usuário acessa a seção **Serviços** e tenta selecionar um serviço.  
2. O sistema verifica se o usuário possui créditos suficientes para a transação.  
3. Caso o usuário não possua créditos:  
   - Uma mensagem de alerta é exibida: **"Erro: Saldo insuficiente. Para comprar este serviço, é necessário adicionar créditos."**  
4. O usuário deve clicar no botão **Adicionar Créditos**.  
5. No menu de adição de créditos:  
   - Insere o valor desejado para depositar.  
6. Confirma o depósito e realiza a transação.  
7. Após o depósito, o sistema atualiza o saldo e retorna automaticamente para a seção de **Serviços**.  
8. O usuário tenta novamente comprar o serviço desejado com o saldo atualizado.  

---

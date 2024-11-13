<script>
    let nome = "";
    let descricao = "";
    var avaliacao = "";
    var valor = "";
    let mensagem = "";
    let sucesso = false;
    let imagem = null; // Variável para armazenar a imagem
    let previewUrl = ''; // URL da imagem carregada para o preview

    // Função para enviar dados ao backend
    async function cadastrarServico(event) {
    event.preventDefault(); // Evita o comportamento padrão de recarregar a página

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("avaliacao", parseFloat(avaliacao));
    formData.append("valor", parseFloat(valor));

    if (imagem) {
        formData.append("imagem", imagem); // Adicionando a imagem ao FormData
    }

    console.log('Form data being sent:', formData); // Debugging

    try {
        const response = await fetch("http://localhost:3000/cadastro_servico", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            mensagem = "Serviço cadastrado com sucesso!";
            sucesso = true;
            resetForm();
        } else {
            mensagem = "Erro ao cadastrar serviço. Tente novamente.";
            sucesso = false;
        }
    } catch (error) {
        console.error("Erro:", error);
        mensagem = "Erro ao conectar com o servidor.";
        sucesso = false;
    } finally {
        setTimeout(() => {
            mensagem = "";
            sucesso = false;
        }, 3000);
    }
}


    // Função para limpar o formulário
    function resetForm() {
        nome = "";
        descricao = "";
        avaliacao = "";
        valor = "";
        imagem = null;
        previewUrl = ''; // Limpa a URL do preview
    }

    // Função para lidar com o upload da imagem
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            imagem = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                previewUrl = e.target.result; // Atualiza o preview da imagem
            };
            reader.readAsDataURL(file);
        }
    };
</script>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 400px;
        padding: 20px;
        border-radius: 0.75rem;
        background-color: rgba(17, 24, 39, 1);
        color: rgba(243, 244, 246, 1);
    }

    .title {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .input-group {
        margin-top: 0.75rem;
        color: rgba(243, 244, 246, 1);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

    .input-group label {
        color: rgba(156, 163, 175, 1);
    }

    .input-group input,
    .input-group textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.375rem;
        border: 1px solid rgba(55, 65, 81, 1);
        outline: none;
        background-color: rgba(17, 24, 39, 1);
        color: rgba(243, 244, 246, 1);
        margin-top: 4px;
    }

    .input-group input:focus,
    .input-group textarea:focus {
        border-color: rgba(167, 139, 250);
    }

    .submit-btn {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 0.375rem;
        font-weight: 600;
        margin-top: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .submit-btn.success {
        background-color: #28a745;
        color: #fff;
    }

    .submit-btn.error {
        background-color: #dc3545;
        color: #fff;
    }

    .message {
        text-align: center;
        margin-top: 1rem;
        font-weight: 600;
    }

    .message.success {
        color: #28a745;
    }

    .message.error {
        color: #dc3545;
    }

    .input-div {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid rgb(1, 235, 252);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        box-shadow: 0px 0px 100px rgb(1, 235, 252), inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
    }

    .input-div img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    .input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer !important;
    }
</style>

<div class="container">
    <div class="form-container">
        <h2 class="title">Cadastrar Serviço</h2>

        <form on:submit={cadastrarServico}>
            <div class="input-group">
                <!-- Input para upload de imagem -->
                <div class="input-div">
                    {#if previewUrl}
                        <img src={previewUrl} alt="Preview" />
                    {/if}
                    <input type="file" class="input" accept="image/*" on:change={handleImageUpload} />
                </div>
                <label for="nome">Nome do Serviço</label>
                <input type="text" id="nome" name="nome" bind:value={nome} placeholder="Nome do serviço" required />
            </div>

            <div class="input-group">
                <label for="descricao">Descrição</label>
                <textarea id="descricao" bind:value={descricao} name="descricao" placeholder="Descreva o serviço" required></textarea>
            </div>

            <div class="input-group">
                <label for="valor">Valor</label>
                <input type="number" id="valor" bind:value={valor} name="valor" placeholder="Valor do serviço" min="0" required />
            </div>

            <button class="submit-btn {sucesso ? 'success' : 'error'}" type="submit">
                Cadastrar
            </button>
        </form>

        {#if mensagem}
            <p class="message {sucesso ? 'success' : 'error'}">{mensagem}</p>
        {/if}
    </div>
</div>

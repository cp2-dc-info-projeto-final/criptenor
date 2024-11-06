<script>
    import { onMount } from "svelte";

    let nome = "";
    let descricao = "";
    let avaliacao = "";
    let valor = "";
    let mensagem = "";
    let sucesso = false;

    // Função para enviar dados ao backend
    async function cadastrarServico() {
        try {
            const formData = {
                nome,
                descricao,
                avaliacao: parseFloat(avaliacao),
                valor: parseFloat(valor),
            };

            const response = await fetch("http://localhost:3000/cadastro_servico", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
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
            // Limpa a mensagem após 3 segundos
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
    }
</script>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        
    }
    .form-container {
        width: 400px;
        padding: 20px;
        border-radius: 0.75rem;
        
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
</style>

<div class="container">
    <div class="form-container">
        <h2 class="title">Cadastrar Serviço</h2>
        <div class="input-group">
            <label for="nome">Nome do Serviço</label>
            <input type="text" id="nome" bind:value={nome} placeholder="Nome do serviço" required />
        </div>
        <div class="input-group">
            <label for="descricao">Descrição</label>
            <textarea id="descricao" bind:value={descricao} placeholder="Descreva o serviço" required></textarea>
        </div>
        <div class="input-group">
            <label for="avaliacao">Avaliação (0-5)</label>
            <input type="number" id="avaliacao" bind:value={avaliacao} min="0" max="5" step="0.1" placeholder="Avaliação do serviço" required />
        </div>
        <div class="input-group">
            <label for="valor">Valor (R$)</label>
            <input type="number" id="valor" bind:value={valor} placeholder="Valor do serviço" required />
        </div>
        <button class="submit-btn" on:click|preventDefault={cadastrarServico} class:success={sucesso} class:error={!sucesso && mensagem}>
            Cadastrar Serviço
        </button>
        {#if mensagem}
            <p class="message" class:success={sucesso} class:error={!sucesso}>{mensagem}</p>
        {/if}
    </div>
</div>

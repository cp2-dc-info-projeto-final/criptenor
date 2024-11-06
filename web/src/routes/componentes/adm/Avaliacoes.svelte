
<script>
    import { onMount } from 'svelte';

    let feedbacks = [];
    let currentPage = 1;
    const itemsPerPage = 18;
    let showModal = false; // Controla a exibição do modal
    let currentAvaliacaoId = null; // Armazena o ID da avaliação que será excluída

    async function fetchAvaliacoes() {
        try {
            const response = await fetch('http://localhost:3000/avaliacoes');
            if (!response.ok) throw new Error('Erro ao buscar avaliações');
            feedbacks = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    onMount(() => {
        fetchAvaliacoes();
    });

    $: paginatedAvaliacoes = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return feedbacks.slice(start, start + itemsPerPage);
    };

    $: totalPages = Math.ceil(feedbacks.length / itemsPerPage);

    function changePage(direction) {
        if (direction === 'next' && currentPage < totalPages) {
            currentPage += 1;
        } else if (direction === 'prev' && currentPage > 1) {
            currentPage -= 1;
        }
    }

    // Função para abrir o modal
    function openModal(id) {
        currentAvaliacaoId = id; // Armazena o ID da avaliação
        showModal = true; // Exibe o modal
    }

    // Função para confirmar a exclusão
    async function confirmDelete() {
        if (currentAvaliacaoId) {
            try {
                const response = await fetch(`http://localhost:3000/avaliacao/${currentAvaliacaoId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Erro ao apagar avaliação');

                showModal = false; // Fecha o modal
                await fetchAvaliacoes(); // Faz uma nova chamada AJAX para obter todas as avaliações
            } catch (error) {
                console.error(error);
            }
        }
    }
</script>

<style>
    .avaliacoes-container {
        /* seu estilo existente */
    }

    /* outros estilos existentes */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Para garantir que o modal fique acima de outros elementos */
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .avaliacoes-container {
        display: flex;
        flex-direction: column;
        height: 100%; /* Define a altura total do container */
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
    .content {
        flex: 1; /* Faz o conteúdo ocupar o espaço disponível */
        overflow-y: auto; /* Adiciona rolagem vertical se necessário */
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
    .avaliacao {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: white;
        position: relative; /* Para posicionar a lixeira corretamente */
    }
    .usuario {
        font-weight: bold;
    }
    .comentario {
        margin-top: 5px;
    }
    .pagination {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .btn {
        padding: 10px 20px;
        background-color: blueviolet;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .btn:disabled {
        background-color: gray;
    }
    .delete-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        fill: red;
    }
    span {
        display: flex;
        gap: 5px; /* Adiciona espaço entre as estrelas */
    }
</style>

<div class="avaliacoes-container">
    <h3>Avaliações</h3>
    <div class="content">
        {#if feedbacks.length > 0}
            <div class="grid">
                {#each paginatedAvaliacoes() as avaliacao}
                    <div class="avaliacao">
                        <div class="usuario">{avaliacao.avaliador}</div>
                        <span>
                            {#each Array(5) as _, i}
                                {#if i < avaliacao.pontos}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="yellow" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.568 8.332 1.213-6 5.852 1.415 8.235L12 18.896l-7.415 3.891 1.415-8.235-6-5.852 8.332-1.213z"/>
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="lightgray" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.568 8.332 1.213-6 5.852 1.415 8.235L12 18.896l-7.415 3.891 1.415-8.235-6-5.852 8.332-1.213z" fill="none" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                {/if}
                            {/each}
                        </span>
                        <div class="comentario">{avaliacao.resposta}</div>
                        <svg
                            class="delete-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            on:click={() => openModal(avaliacao.id)} 
                        >
                            <path d="M3 6h18v2H3zm3 3h12v12H6z"/>
                        </svg>
                    </div>
                {/each}
            </div>
        {:else}
            <p>Nenhuma avaliação disponível.</p>
        {/if}
    </div>
    
    <div class="pagination">
        <button class="btn" on:click={() => changePage('prev')} disabled={currentPage === 1}>
            Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button class="btn" on:click={() => changePage('next')} disabled={currentPage === totalPages}>
            Próxima
        </button>
    </div>
    
    {#if showModal}
        <div class="modal-overlay">
            <div class="modal-content">
                <h4>Confirmação</h4>
                <p>Tem certeza que deseja apagar esta avaliação?</p>
                <button class="btn" on:click={confirmDelete}>Confirmar</button>
                <button class="btn" on:click={() => showModal = false}>Cancelar</button>
            </div>
        </div>
    {/if}
</div>


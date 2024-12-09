<script lang="ts">
    import { onMount } from 'svelte';
    import Nav from "../componentes/Nav.svelte";
    import UserAudit from "../componentes/user_audit/UserAudit.svelte";

    let totalCredito = 0; // Inicialize a variável
    let custo_analise_simples=20

    // Função para buscar o total de créditos do usuário
    async function buscarTotalCredito() {
        const access_token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://localhost:3000/total_credito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Total de crédito disponível:', data.totalCredito);
                totalCredito = data.totalCredito; // Atualiza o total de crédito
            } else {
                console.error('Erro ao buscar total de crédito ou token inválido.');
                totalCredito = 0; // Define como 0 em caso de erro
            }
        } catch (error) {
            console.error('Erro ao buscar total de crédito:', error);
            totalCredito = 0; // Define como 0 em caso de erro
        }
    }

    // Verificar créditos ao clicar no cadeado
    function verificarCredito(e: Event, index: number) {
        e.preventDefault();
        if (totalCredito >= 20) {
            const div = document.querySelectorAll('.info_i')[index];
            div?.classList.add('aberta'); // Adiciona uma classe para indicar que está aberta
        } else {
            alert('Você precisa de pelo menos 20 créditos para acessar esta informação.');
        }
    }

    // Carrega o total de créditos ao montar o componente
    onMount(async () => {
        await buscarTotalCredito();
    });
</script>

<link rel="stylesheet" href="landding/styles/styles.css">
<link rel="stylesheet" href="landding/styles/dash.css">

<UserAudit />
<Nav />

<body>
    <div class="dashboard">
        <div class="informacoes_iniciais">
            {#each ['23 seguidores', '10 seguindo', '10 curtidas', '10 comentarios', '35 engajamento'] as info, i}
                <div class="info_i">
                    <div class="mascara">
                        <button class="cadeado" on:click={(e) => verificarCredito(e, i)}>
                            🔒
                        </button>
                    </div>
                    <div class="conteudo">{info}</div>
                </div>
            {/each}
        </div>
    </div>
</body>

<style>
    .info_i {
        position: relative;
        background: #f0f0f0;
        padding: 10px;
        border: 1px solid #ccc;
        margin: 10px;
        overflow: hidden;
    }

    .mascara {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }

    .cadeado {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }

    .info_i.aberta .mascara {
        display: none; /* Oculta a máscara quando a div é aberta */
    }

    .conteudo {
        visibility: hidden;
    }

    .info_i.aberta .conteudo {
        visibility: visible; /* Mostra o conteúdo quando a div é aberta */
    }
</style>

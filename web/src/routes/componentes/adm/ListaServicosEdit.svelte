<script>
    import { onMount } from "svelte";

// Variável reativa que armazenará os dados dos serviços
let services = [];

// Função para buscar os serviços do banco de dados via API
async function fetchServices() {
    try {
        const response = await fetch('http://localhost:3000/servicos');  // Substitua pelo seu endpoint real
        if (!response.ok) {
            throw new Error('Erro ao buscar serviços');
        }
        services = await response.json();  // Recebe a lista de serviços do banco
    } catch (error) {
        console.error(error);
    }
}

// onMount: Executa a função quando o componente é montado
onMount(() => {
    fetchServices();
});

// Função auxiliar para renderizar estrelas
function renderStars(stars) {
    return Array(stars).fill(0);
}
</script>
<style>
    #menu{
        display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: 100vh;
    max-width: 65vw;
    }
    .dish{
        min-width: 300px;
    }
    #dishes{
        flex-wrap: wrap;
    }
</style>
<section id="menu">

    <div id="dishes">
        {#if services.length === 0}
            <p>Carregando serviços...</p>
        {/if}
        
        {#each services as service}
            <div class="dish">
                <div class="dish-heart">
                    <i class="fa-solid fa-heart"></i>
                </div>

                <img src={service.path_foto} class="dish-image" alt={service.nome}>

                <h3 class="dish-title">{service.nome}</h3>

                <span class="dish-description">{service.descricao}</span>

                <div class="dish-rate">
                    {#each renderStars(service.avaliacao) as _, i}
                        <i class="fa-solid fa-star" key={i}></i>
                    {/each}
                </div>

                <div class="dish-price">
                    <h4>{service.valor}</h4>
                    <button class="btn-default">
                        <i class="fa-solid fa-basket-shopping"></i>
                    </button>
                </div>
            </div>
        {/each}
    </div>
</section>
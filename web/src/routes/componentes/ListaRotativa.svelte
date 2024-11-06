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
    .body {
        position: relative;
        height: 100%;
        background: #eee;
        font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
        font-size: 14px;
        color: #000;
        margin: 0;
        padding: 0;
    }

    swiper-container {
        width: 100%;
        height: 100%;
    }

    swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 20px;
    }

    swiper-slide img {
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .dish-title {
        font-size: 20px;
        margin: 10px 0;
    }

    .dish-description {
        font-size: 14px;
        color: #666;
        margin-bottom: 15px;
    }

    .dish-rate i {
        color: gold;
    }

    .dish-price {
        font-size: 18px;
        font-weight: bold;
        margin-top: 15px;
    }

    .btn-default {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 5px;
    }
</style>

<div class="body">
    <swiper-container class="mySwiper" pagination="true" pagination-clickable="true" space-between="30" navigation="true" slides-per-view="3">
        {#if services.length === 0}
            <swiper-slide>Carregando serviços...</swiper-slide>
        {/if}

        {#each services as service}
            <swiper-slide>
                <img src={service.path_foto} alt={service.nome} class="dish-image">
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
            </swiper-slide>
        {/each}
    </swiper-container>

    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"></script>
</div>

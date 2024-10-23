<script>
    import Nav from "./componentes/Nav.svelte";

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






<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="landding/styles/styles.css">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://unpkg.com/scrollreveal"></script>
    <title>Criptenor</title>
</head>
<body>
    <Nav/>
    

    <main id="content">
        <section id="home">
            <div class="shape"></div>
            <div id="cta">
                <h1 class="title">
                    Análise de redes
                    <span>você no controle.</span>
                </h1>

                <p class="description">
                    Nós da criptenor, fazemos uma análise de dados profunda das suas redes sociais e entregamos para você.
                </p>

                <div id="cta_buttons">
                    <a href="/#menu" class="btn-default">
                        Ver Serviços
                    </a>

                    <a href="tel:+55555555555" id="phone_button">
                        <button class="btn-default">
                            <i class="fa-solid fa-phone"></i>
                        </button>
                        (21) 98085-6675
                    </a>
                </div>

                <div class="social-media-buttons">
                    <a target="_blank" href="https://wa.me/+5521980856675">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
    
                    <a target="_blank" href="https://www.instagram.com/criptenor">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
    
                    <a target="_blank" href="https://www.facebook.com/">
                        <i class="fa-brands fa-facebook"></i>
                    </a>
                </div>
            </div>

            <div id="banner">
                <img src="banner.png" alt="">
            </div>
        </section>

        <section id="menu">
            <h2 class="section-title">Serviços</h2>
            <h3 class="section-subtitle">Análise de Dados</h3>
        
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

        <section id="testimonials">
            <img src="src/images/chef.png" id="testimonial_chef" alt="">

            <div id="testimonials_content">
                <h2 class="section-title">
                    Depoimentos
                </h2>
                <h3 class="section-subtitle">
                    O que os clientes falam sobre nós
                </h3>

                <div id="feedbacks">
                    <div class="feedback">
                        <img src="src/images/avatar.png" class="feedback-avatar" alt="">

                        <div class="feedback-content">
                            <p>
                                Fulana de Tal
                                <span>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                </span>
                            </p>
                            <p>
                                "Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                Repellat voluptatibus cumque dolor ea est quae alias necessitatibus"
                            </p>
                        </div>
                    </div>

                    <div class="feedback">
                        <img src="src/images/avatar.png" class="feedback-avatar" alt="">

                        <div class="feedback-content">
                            <p>
                                Fulana de Tal
                                <span>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                </span>
                            </p>
                            <p>
                                "Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                Repellat voluptatibus cumque dolor ea est quae alias necessitatibus"
                            </p>
                        </div>
                    </div>
                </div>

                <button class="btn-default">
                    Ver mais avaliações
                </button>
            </div>
        </section>
    </main>

    <footer>
        <img src="src/images/wave.svg" alt="">

        <div id="footer_items">
            <span id="copyright">
                &copy 2024 Adeilton Filho, Criptenor.
            </span>

            <div class="social-media-buttons">
                <a target="_blank" href="https://wa.me/+5521980856675">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>

                <a target="_blank" href="https://www.instagram.com/criptenor">
                    <i class="fa-brands fa-instagram"></i>
                </a>

                <a target="_blank" href="https://www.facebook.com/">
                    <i class="fa-brands fa-facebook"></i>
                </a>
            </div>
        </div>
    </footer>
    <script src="landding/javascript/script.js"></script>
</body>
</html>
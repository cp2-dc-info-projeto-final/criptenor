<script>
    import Nav from "./componentes/Nav.svelte";
    import FormularioAvaliacao from "./componentes/avaliacao/FormularioAvaliacao.svelte";
    import { onMount } from "svelte";   
    import ListaSevicos from "./componentes/adm/ListaSevicos.svelte";
    import Carrinho from "./componentes/Carrinho.svelte";

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

    // Chama a função de busca ao montar o componente
    onMount(() => {
        fetchServices();
        fetchAvaliacoes();
    });

    // Função auxiliar para renderizar estrelas
    function renderStars(stars) {
        return Array(stars).fill(0);
    }

    let feedbacks = [];
    let currentPage = 0; // Controla a página atual
    const itemsPerPage = 4; // Número de feedbacks por página

    // Função para buscar avaliações do backend
    async function fetchAvaliacoes() {
        try {
            const response = await fetch('http://localhost:3000/avaliacoes'); // Ajuste a URL conforme necessário
            if (!response.ok) throw new Error('Erro ao buscar avaliações');
            feedbacks = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    // Função para mudar a página
    function changePage(direction) {
        currentPage += direction;
    }

    // Calcula as avaliações a serem exibidas na página atual
    $: displayedFeedbacks = feedbacks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Calcula se os botões de navegação devem ser habilitados ou não
    $: canGoBack = currentPage > 0;
    $: canGoForward = (currentPage + 1) * itemsPerPage < feedbacks.length;
    
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
    <Carrinho/>
    
    <main id="content">
        <section id="home">
            <div class="shape"></div>
            <div id="cta">
                <h1 class="title">
                    A rede de propaganda
                    <span>a sua disposição.</span>
                </h1>

                <p class="description">
                    A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores.
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
        
            <div id="dishes dishes_servicos">
                
                <ListaSevicos/>
            </div>
        </section>

        <section id="testimonials">
            <FormularioAvaliacao />

            <div id="testimonials_content">
                <h2 class="section-title">
                    Depoimentos
                </h2>
                <h3 class="section-subtitle">
                    O que os clientes falam sobre nós
                </h3>

                <div id="feedbacks">
                    {#each displayedFeedbacks as { avaliador, resposta, pontos }}
                      <div class="feedback">
                        <div class="feedback-content">
                          <p class="feedback-avaliador">
                            {avaliador}
                          </p>
                          <p class="feedback-resposta">
                            {resposta}
                          </p>
                          <p class="feedback-pontos">
                            <span>
                              {#each Array(pontos) as _, i}
                                <i class="fa-solid fa-star" style="color:yellow" key={i}></i>
                              {/each}
                            </span>
                          </p>
                        </div>
                      </div>
                    {/each}
                  </div>

                <div class="pagination">
                    <button class="btn-default" on:click={() => changePage(-1)} disabled={!canGoBack}>
                        Voltar
                    </button>
                    <button class="btn-default" on:click={() => changePage(1)} disabled={!canGoForward}>
                        Avançar
                    </button>
                </div>
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
    <script src="landding/javascript/scrollreveal.js"></script>
    <script src="landding/javascript/script.js"></script>
</body>
</html>

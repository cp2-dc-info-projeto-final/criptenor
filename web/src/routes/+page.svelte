<script lang="ts">
    import Nav from "./componentes/Nav.svelte";
    import FormularioAvaliacao from "./componentes/avaliacao/FormularioAvaliacao.svelte";
    import { onMount } from "svelte";   
    import ListaSevicos from "./componentes/adm/ListaSevicos.svelte";
    

    // Variável reativa que armazenará os dados dos serviços
    let services = [];
    let  userId = null; // ID do usuário logado

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


    function handleServicoAdicionado(event) {
    const { idServico } = event.detail;
    console.log('Serviço adicionado ao carrinho com ID:', idServico);
    // Aqui você pode atualizar o estado ou executar qualquer lógica necessária
  }

  import { createEventDispatcher } from 'svelte';
    import Swiper from 'swiper/bundle';
    import 'swiper/css/bundle';
    
    import { goto } from '$app/navigation';
  
    let swiper;
    
    
  
    const dispatch = createEventDispatcher(); // Criando o dispatcher de evento
  
    // Função para buscar serviços da API

  
    // Busca o ID do usuário da sessão
    onMount(() => {
      
      
  
        fetchServices(); // Chama a função para buscar os dados da API
        fetchCartQuantity();
        swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            slidesPerView: 4,
            spaceBetween: 20,
        });
    });
  
    // Função para enviar um serviço para o carrinho
    async function adicionarAoCarrinho(idServico) {
      var access_token = localStorage.getItem("access_token");
        try {
            const response = await fetch('http://localhost:3000/cadastrar_servico_no_carrinho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: access_token,
                    id_servico: idServico,
                }),
            });
  
            fetchCartQuantity();
  
            
  
            // Emitir o evento para o componente pai
            dispatch('servicoAdicionado', { idServico });
        } catch (error) {
            console.error('Erro ao adicionar serviço ao carrinho:', error);
        }
    }
    
 
        


  
    
        
    let cartQuantity = 0;
    let showCart = false;
    var responseData = [];
    let valorTotal=0;

    async function fetchCartQuantity() {
      try {
        // Obtendo o access_token do localStorage
        const accessToken = localStorage.getItem('access_token');
        
        
        if (!accessToken) {
          throw new Error('Access token não encontrado no localStorage');
        }

        // Fazendo a requisição ao servidor com o access_token no cabeçalho
        const response = await fetch(`http://localhost:3000/carrinho`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'access_token': accessToken, // Adiciona o token no cabeçalho
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar a quantidade de itens no carrinho');
        }

        // Verifica a resposta
        responseData = await response.json();
        valorTotal=responseData.valorTotal;
        responseData = responseData.data;
        
        

        // Calcula a quantidade de itens no carrinho
        cartQuantity = responseData.length;
        console.log(cartQuantity);
      } catch (error) {
        console.error('Erro ao buscar dados do carrinho:', error);
      }
    }
    

  
    
  
    // Função para abrir o carrinho
    function toggleCart() {
      showCart = !showCart;
      const cartIcon = document.getElementById('cart-icon-super');
      if (showCart) {
        cartIcon.style.display = "none"; // Esconde o ícone quando o carrinho está aberto
      } else {
        cartIcon.style.display = "block"; // Exibe o ícone quando o carrinho está fechado
      }
    }
  
    // Função para fechar o carrinho
    function closeCart() {
      const cartIcon = document.getElementById('cart-icon-super');
      cartIcon.style.display = "block"; // Exibe o ícone quando o carrinho for fechado
      showCart = false;
    }
    

    async function removeFromCart(productId) {
      const accessToken = localStorage.getItem('access_token');
      
      try {
        const response = await fetch('http://localhost:3000/apagar_produto_no_carrinho', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_session: accessToken, id_produto: productId }),
        });

        fetchCartQuantity();
      } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
      }
    }

    async function comprar() {
      
      const accessToken = localStorage.getItem('access_token');
      
      try {
        const response = await fetch('http://localhost:3000/comprar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: accessToken}),
        });

        fetchCartQuantity();
        
        closeCart();
        window.location.href="/dashboard"
      } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
      }
    }

  
  
  
    
</script>


<style>
  #home2{
    justify-content: space-around;
  }
  .banner1{
    width: 40%;
  }
  #banner1 img{
    width: 40vw;
  }
  #cta1{
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  #ctal1 .descricao{
    width: 40vw;
    
  }
p{
  font-size: 19px;
}
.rounded-square {
      position: fixed;
      z-index: 100;
      top: 25%;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 15px;
      background-color: #5691a4;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  
    .btn-cart {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      border: none;
      background-color: transparent;
      position: relative;
    }
  
    .btn-cart::after {
      content: attr(data-quantity);
      width: fit-content;
      height: fit-content;
      position: absolute;
      font-size: 15px;
      color: white;
      font-family: 'Lucida Sans', 'Arial', sans-serif;
      top: -10px;
      right: -10px;
      background-color: #ff0000;
      border-radius: 50%;
      padding: 2px 6px;
    }
  
    .cart-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 99;
      align-items: center;
      justify-content: center;
    }
  
    .cart-overlay.visible {
      display: flex;
    }
  
    .cart-container {
  position: absolute;
  top: 0;
  right: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 40%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Garante que o cabeçalho e o botão estejam fixos */
  z-index: 100;
  margin-top: 15vh;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}

.product-list {
  flex-grow: 1; /* Preenche o espaço restante */
  overflow-y: auto; /* Adiciona scroll se os produtos excederem o espaço */
  margin-top: 10px;
}

.product {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.footer_cart{

}
.footer_cart .total{
  display: flex;
  width: 100%;
  justify-content: space-between;
  
}

/* From Uiverse.io by shadowmurphy */ 
.input {
  border: 2px solid transparent;
  width: 15em;
  height: 2.5em;
  padding-left: 0.8em;
  outline: none;
  overflow: hidden;
  background-color: #F3F3F3;
  border-radius: 10px;
  transition: all 0.5s;
}

.input:hover,
.input:focus {
  border: 2px solid #4A9DEC;
  box-shadow: 0px 0px 0px 7px rgb(74, 157, 236, 20%);
  background-color: white;
}
.cod_promocional{
  width: 100%;
  height: 80px;
}
.footer_cart{
  border: 1px solid #323232;
  border-radius: 9px;
  padding: 15px;
  
}

.Btn {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(15, 15, 15);
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  border-radius: 9px;
}
.botao_quantidade_servico{
  display: flex;
  align-items: center;
  width: 70px;
  justify-content: space-between;
  border: 1px solid  #323232;
  border-radius: 18px;
  padding: 1px
}
.botao_quantidade_servico .botao_mais{
  background-color: #2d8cf0;
  border-radius: 100%;
  height: 20px;
  width: 20px;
  text-align: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;

}
.botao_quantidade_servico .botao_menos{
  border-radius: 100%;
  height: 20px;
  width: 20px;
  text-align: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;

}
.botao_quantidade_servico .botao_menos:hover{
  background-color: #aaa9a9af;
}
.botao_quantidade_servico p{
  font-size: 15px;
  
}

  
    .cart-container h2 {
      margin-top: 0;
      font-size: 18px;
      font-weight: bold;
    }
  
    .cart-container .product {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
  
    .cart-container .product span {
      font-size: 14px;
    }
  
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    .close-cart-btn {
      background-color: transparent;
      border: none;
      font-size: 20px;
      color: #333;
      cursor: pointer;
    }
  
    .close-cart-btn:hover {
      color: #d9534f;
    }
  
    /* From Uiverse.io by vinodjangid07 */
    .Btn {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(15, 15, 15);
      border: none;
      color: white;
      font-weight: 600;
      gap: 8px;
      cursor: pointer;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.103);
      position: relative;
      overflow: hidden;
      transition-duration: .3s;
    }
  
    .svgIcon {
      width: 16px;
    }
  
    .svgIcon path {
      fill: white;
    }
  
    .Btn::before {
      width: 100%;
      height: 130px;
      position: absolute;
      content: "";
      background-color:#2d8cf0;
      border-radius: 50%;
      color: white;
      left: -100%;
      top: 0;
      transition-duration: .3s;
      mix-blend-mode: difference;
    }
  
    .Btn:hover::before {
      transition-duration: .3s;
      transform: translate(100%, -50%);
      border-radius: 0;
    }
  
    .Btn:active {
      transform: translate(5px, 5px);
      transition-duration: .3s;
    }
  
    .swiper {
      width: 90vw;
      height: 100%;
    }
  
    .swiper-wrapper {
      display: flex;
      justify-content: space-between;
    }
  
    .swiper-slide {
        
      
      height: 600px;
     
      display: flex;
      justify-content: center;
      align-items: center;

    }
  
    .swiper-slide img {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  
    .swiper-pagination {
      position: absolute;
      bottom: 10px;
      width: 100%;
      text-align: center;
    }
  
    /* Estilo dos botões de navegação */
    .swiper-button-next,
    .swiper-button-prev {
      color: #000;
      font-size: 30px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
    }
  
    .swiper-button-next {
      right: 10px;
    }
  
    .swiper-button-prev {
      left: 10px;
    }
  
    .swiper-button-next:hover,
    .swiper-button-prev:hover {
      background-color: rgba(255, 255, 255, 1);
    }

    .img_servico{
        width: 250px;
        height: 250px;
        border-radius: 18px;
    }
    /* From Uiverse.io by andrew-demchenk0 */ 
/* before adding the img to the div with the 
"card-img" class, remove css styles 
.card-img .img::before and .card-img .img::after,
then set the desired styles for .card-img. */
.card {
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  --main-focus: #2d8cf0;
  width: 275px;
  height: 500px;
  background: var(--bg-color);
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  gap: 10px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.card:last-child {
  justify-content: flex-end;
}

.card-img {
    /* clear and add new css */
  transition: all 0.5s;
  display: flex;
  justify-content: center;
}



.card-title {
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: var(--font-color);
}

.card-subtitle {
  font-size: 14px;
  font-weight: 400;
  height: 22.5%;
  color: var(--font-color-sub);
}

.card-divider {
  width: 100%;
  
  border: 1px solid var(--main-color);
  border-radius: 50px;
}

.card-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.card-price {
  font-size: 20px;
  font-weight: 500;
  color: var(--font-color);
}

.card-price span {
  font-size: 20px;
  font-weight: 500;
  color: var(--font-color-sub);
}

.card-btn {
  height: 35px;
  background: var(--bg-color);
  border: 2px solid var(--main-color);
  border-radius: 5px;
  padding: 0 15px;
  transition: all 0.3s;
}

.card-btn svg {
  width: 100%;
  height: 100%;
  fill: var(--main-color);
  transition: all 0.3s;
}

.card-img:hover {
  transform: translateY(-3px);
}

.card-btn:hover {
  border: 2px solid var(--main-focus);
}

.card-btn:hover svg {
  fill: var(--main-focus);
}

.card-btn:active {
  transform: translateY(3px);
}
.produtos{
  height: 70vh;
}

  </style>
  

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
        

      <section id="home3">
        <h1 class="title">
          Hierarquia de Relacionamento
          <span>a sua disposição.</span>
      </h1>
        
        <p class="description">
          A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores. A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores. A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores.
      </p>

   

      <div id="cta1">
        
        <div id="banner1">
          <img src="teia-relacionamento.png" alt="">
      </div>
      <div class="descricao" style="width: 90%;">
        <p class="description">
          A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores.
          A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores.
          A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores.
          A "Rede de Propaganda" da Criptenor é uma ferramenta sofisticada, desenvolvida para compreender a dinâmica das interações nas redes sociais, identificando padrões de comportamento e preferências dos eleitores. Utilizando algoritmos avançados de análise de dados, a plataforma é capaz de segmentar o público-alvo de forma precisa, direcionando mensagens e conteúdos políticos de acordo com as características e interesses de cada grupo de eleitores.
          
        </p>

      </div>

        

       

        
    </div>
      </section>

        <section id="menu">
            <h2 class="section-title">Serviços</h2>
            <h3 class="section-subtitle">Análise de Dados</h3>
        
            <div id="dishes dishes_servicos">
                
                <div class="swiper">
    <div class="swiper-wrapper">
      <!-- Itera sobre os serviços e cria um slide para cada serviço -->
      {#each services as service}
        <div class="swiper-slide">
          <div class="card">
              <div class="card-img">
                  <div class="img">
                      <div class="img_servico"> 
                          <img src={service.path_foto} class="img_servico" alt={service.nome} />
                      </div>
                  </div>
              </div>
              <div class="card-title">{service.nome}</div>
              <div class="card-subtitle"> {service.descricao.substring(0, 200)}</div>
              <hr class="card-divider">
              <div class="card-footer">
                  <div class="card-price"><span>R$</span>{service.valor}</div>
                  <button class="card-btn"  on:click={() => adicionarAoCarrinho(service.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path><path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path></svg>
                  </button>
              </div>
          </div>
        </div>
      {/each}
    </div>
  
    <!-- Botões de navegação -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  
    <!-- Paginação -->
    <div class="swiper-pagination"></div>
  </div>
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
    {#if cartQuantity > 0}
    <div class="rounded-square" id="cart-icon-super" on:click={toggleCart}>
      <button class="btn-cart" data-quantity={cartQuantity}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path><path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.53z"></path></svg>
      </button>
    </div>
  {/if}
  
  <!-- Overlay do carrinho -->
  {#if showCart}
    <div class="cart-overlay visible">
      <div class="cart-container">
        <div class="cart-header">
          <h2>Carrinho</h2>
          <button class="close-cart-btn" on:click={closeCart}>&times;</button>
        </div>
        <div class="product-list">
          {#each responseData as item}
          <div class="product">
            <span>{item.nome}</span>
            <span>R$ {item.valor}</span>
            <span></span>
            <div class="botao_quantidade_servico">
              <div class="botao_menos" on:click={() => removeFromCart(item.id_servico)}>
                -

              </div>
              <p class="quantidade">
                {item.quantidade}
              </p>
              <div class="botao_mais" on:click={() => adicionarAoCarrinho(item.id_servico)}>
                +
              </div>
            </div>
            
          </div>          
          {/each}
        </div>
        <div class="footer_cart">
          
          
          <div class="total">
            <p>Total</p>
            <p>{valorTotal}</p>
          </div>
          <button class="Btn" on:click={() => comprar()}>Concluir compra</button>
        </div>
        
      </div>
      
    </div>
  {/if}
</body>
</html>




  

  
  
  
<script>
    import Swiper from 'swiper/bundle';
    import 'swiper/css/bundle';
    import { onMount } from 'svelte';
    
    let swiper;
    let services = []; // Array de serviços que será preenchido pela API
  
    // Função para buscar serviços da API
    async function fetchServices() {
      try {
        const response = await fetch('http://localhost:3000/servicos');
        if (!response.ok) {
          throw new Error('Erro ao buscar serviços');
        }
        services = await response.json(); // Preenche o array de serviços com os dados da API
      } catch (error) {
        console.error(error);
      }
    }
  
    // Inicializa o Swiper após o componente ser montado
    onMount(() => {
      fetchServices(); // Chama a função para buscar os dados da API
      swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 4, // Exibe 4 slides por vez
        spaceBetween: 20, // Ajuste no espaço entre os slides
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',  // Botão de avançar
          prevEl: '.swiper-button-prev',  // Botão de voltar
        },
      });
    });
  </script>
  
  <style>
    .swiper {
      width: 90vw;
      height: 100%;
    }
  
    .swiper-wrapper {
      display: flex;
      justify-content: space-between;
    }
  
    .swiper-slide {
        border: #000 solid 1px;
      width: 20vw;
      height: 600px;
      text-align: center;
      font-size: 18px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
  
    .swiper-slide img {
      display: block;
      height: 100%;
      width: 17.5vw;
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
        width: 90%;
        height: 250px;
        border-radius: 18px;
    }
  </style>
  
  <div class="swiper">
    <div class="swiper-wrapper">
      <!-- Itera sobre os serviços e cria um slide para cada serviço -->
      {#each services as service}
        <div class="swiper-slide">
          <div>
            
            <div class="img_servico"> <img src={service.path_foto} class="img_servico" alt={service.name} /></div>
             
            <h3>{service.nome}</h3>
            <p>{service.descricao}</p>
            <!-- Se houver uma imagem no serviço, exiba-a -->
            
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
  
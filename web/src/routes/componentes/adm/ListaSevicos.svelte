
  
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
        width: 90%;
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

  </style>
  <script>
    import { createEventDispatcher } from 'svelte';
    import Swiper from 'swiper/bundle';
    import 'swiper/css/bundle';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let swiper;
    let services = []; // Array de serviços que será preenchido pela API
    let userId = null; // ID do usuário logado
  
    const dispatch = createEventDispatcher(); // Criando o dispatcher de evento
  
    // Função para buscar serviços da API
    async function fetchServices() {
        try {
            const response = await fetch('http://localhost:3000/servicos');
            if (!response.ok) {
                throw new Error('Erro ao buscar serviços');
            }
            services = await response.json(); // Preenche o array de serviços com os dados da API
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    }
  
    // Busca o ID do usuário da sessão
    onMount(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser?.user?.id) {
                    userId = parsedUser.user.id;
                } else {
                    goto('/login');
                }
            } catch (error) {
                console.error('Erro ao fazer parsing dos dados do usuário', error);
                goto('/login');
            }
        } else {
            goto('/login');
        }
  
        fetchServices(); // Chama a função para buscar os dados da API
        swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            slidesPerView: 4,
            spaceBetween: 20,
        });
    });
  
    // Função para enviar um serviço para o carrinho
    async function adicionarAoCarrinho(idServico) {
        try {
            const response = await fetch('http://localhost:3000/cadastrar_servico_no_carrinho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userId,
                    id_servico: idServico,
                }),
            });
  
            if (!response.ok) {
                throw new Error('Erro ao adicionar o serviço ao carrinho');
            }
  
            console.log('Serviço adicionado ao carrinho com sucesso');
  
            // Emitir o evento para o componente pai
            dispatch('servicoAdicionado', { idServico });
        } catch (error) {
            console.error('Erro ao adicionar serviço ao carrinho:', error);
        }
    }
  
  </script>
  
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
              <div class="card-subtitle">{service.descricao}</div>
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
  
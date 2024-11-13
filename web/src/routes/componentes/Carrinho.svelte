<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    let userId = null;
    let cartQuantity = 0;
    let showCart = false;
    var responseData = [];
    
    async function fetchCartQuantity(userId) {
      try {
        const response = await fetch(`http://localhost:3000/carrinho/${userId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar a quantidade de itens no carrinho');
        }
        
        // Verifica a resposta
        responseData = await response.json();
        responseData = responseData.data;
        console.log(responseData);
  
        // Se 'responseData' contiver a chave 'data' e for um array
        var tamanho = responseData.length;
        cartQuantity = tamanho;
        console.log(tamanho);
      } catch (error) {
        console.error('Erro ao buscar dados do carrinho:', error);
      }
    }
  
    onMount(() => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.user?.id) {
            userId = parsedUser.user.id;
            fetchCartQuantity(userId);
          } else {
            goto('/login');
          }
        } catch (error) {
          goto('/login');
        }
      } else {
        goto('/login');
      }
    });
  
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
  </script>
  
  <style>
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
      width: 300px;
      height: 70vh;
      overflow-y: auto;
      z-index: 100;
      margin-top: 15vh;
      justify-content: space-between;
      display: flex;
      flex-direction: column;
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
      background-color: white;
      border-radius: 50%;
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
  </style>
  
  <!-- Botão para abrir o carrinho -->
  {#if userId && cartQuantity > 0}
    <div class="rounded-square" id="cart-icon-super" on:click={toggleCart}>
      <button class="btn-cart" data-quantity={cartQuantity}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path><path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.53z"></path></svg>
      </button>
    </div>
  {/if}
  
  <!-- Overlay do carrinho -->
  {#if showCart}
    <div class="cart-overlay visible" on:click={closeCart}>
      <div class="cart-container">
        <div class="cart-header">
          <h2>Carrinho</h2>
          <button class="close-cart-btn" on:click={closeCart}>&times;</button>
        </div>
        {#if cartQuantity > 0}
          <div>
            {#each responseData as item}
              <div class="product">
                <span>{item.servicos.nome}</span>
                <span>R$ {item.servicos.valor}</span>
              </div>
            {/each}
          </div>
          <button class="Btn" on:click={() => goto('')}>Finalizar compra</button>
        {:else}
          <p>Seu carrinho está vazio.</p>
        {/if}
      </div>
    </div>
  {/if}
  
<script lang="ts">
    import Nav from "../componentes/Nav.svelte";
    import PorHoraDoDia from "../componentes/graficos/PorHoraDoDia.svelte";
    import Engajamento from "../componentes/graficos/Engajamento.svelte";
    import SeguidoresENaoSeguidores from "../componentes/graficos/SeguidoresENaoSeguidores.svelte";
    import UserAudit from "../componentes/user_audit/UserAudit.svelte";
    
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; // Importa o goto para redirecionamento

    interface Perfil {
        id: number;
        nome: string;
        arroba: string;
        num_curtidas: number;
        num_seguidores: number;
        num_comentarios: number;
        relacionamento: Array<{ arroba: string; pontuacao: number }>;
    }

    let perfil: Perfil | null = null;
    let erro: string | null = null;
    let userId: number | null = null; // Inicializa userId como null

    // Variáveis de controle de página
    let currentPage = 0;
    const itemsPerPage = 15;

    // Função para buscar a análise do perfil
    const fetchAnalisePerfil = async () => {
        if (!userId) {
            erro = 'ID do usuário não encontrado';
            goto('/login'); // Redireciona para a página de login
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/analise-perfil-por-id/${userId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar análise do perfil');
            }
            perfil = await response.json(); // Assume que a resposta está no formato de Perfil
        } catch (error) {
            erro = error instanceof Error ? error.message : 'Erro desconhecido';
            console.error('Erro:', erro);
        }
    };

    // Função para mudar a página
    const nextPage = () => {
        if (perfil && (currentPage + 1) * itemsPerPage < perfil.relacionamento.length) {
            currentPage += 1;
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            currentPage -= 1;
        }
    };

    // Chamar a função na montagem do componente
    onMount(() => {
        const userData = sessionStorage.getItem('user');

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser?.user?.id) {
                    userId = parsedUser.user.id;
                    console.log('Usuário autenticado com ID:', userId);
                    fetchAnalisePerfil(); // Chama a função para buscar análise do perfil
                } else {
                    console.log('ID do usuário não encontrado');
                    goto('/login'); // Redireciona para /login se o ID não for encontrado
                }
            } catch (error) {
                console.error('Erro ao fazer parsing dos dados do usuário', error);
                goto('/login'); // Redireciona para /login em caso de erro
            }
        } else {
            console.log('Nenhum dado de usuário encontrado no sessionStorage');
            goto('/login'); // Redireciona para /login se não houver dados
        }
    });

</script>
<link rel="stylesheet" href="landding/styles/styles.css">

<UserAudit/>
<Nav/>
<style>
  
    .informacoes_inciais{
    
        justify-content: space-around;
        
    }
    .informacoes_inciais div{
        width: 150px;
        height: 200px;
        border-radius: 18px;
        background-color: antiquewhite;           
        justify-content: center;
        align-items: center;
        margin: 10px;
        
    }
    .info_incial_img{
        width: 65px;
        height: 65px;
    }
    .info_item{
        text-align: center;
        padding: 10px;
    }
    .titulo3{
        font-size: 35px;
    }
    .titulo2{
        font-size: 22px;
    }
    .pagina{
        
        display: flex;
        justify-content: space-around;
    }
    .informacoes_intervalo{
        width: 65%;
        background-color: antiquewhite;
        border-radius: 18px;
        
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;

    }
    .grafico{
        width: 400px;
        height: 350px;
        background-color: whitesmoke;
        border-radius: 18px;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin:5px;
    }
    .titulo_graficos{
        font-size: 25px;
    }
    .engajamento_ao_longo_do_tempo{
        width: 45%;
    }

    .comentarios_repetidos{
        width: 45%;
        background-color: aliceblue;
        border-radius:18px ;
        padding: 1%;
              

    }
    .comentarios_repetidos p{
        border: none;
        margin: 0;
    }
    .comentarios_repetidos .titulo, .comentarios_repetidos .comentarios{
        display: flex;
        justify-content: space-around;
        border: 1px solid;
        border-radius: 18px;
        padding: 1%;
        margin-bottom: 10px;
    }
    .comentarios_repetidos .comentarios div, .comentarios_repetidos .titulo div{
        width: 33.33%;
        text-align: center;
    }

    .list_titulo, .list_resposta{
        border-radius: 18px;
        border: 1px solid black;
        padding: 10px;
        
        justify-content: space-between;
        align-items: center;
        display: flex;
        place-items: center; /* Centraliza horizontal e verticalmente */
        flex-direction: row;
        margin: 10px;
    }
    .list_titulo  p, .list_resposta p{
        
        margin: 0;
    }
    .hierarquia_de_relacionamento{
        border-radius: 18px;
        background-color: antiquewhite;
        
        margin:10px
    }
    .list_resposta{
        background-color: aliceblue;
        min-width: 375px;
    }
    .list_titulo{
        background-color: beige;
    }
    .pagination {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.pagination button {
  background-color: #f0f0f0;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.time{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;

}
.time div{
    
    width: 130px;
    height: 50px;
    background-color: aliceblue;
    border: 1px dotted black;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center  ;
    border-radius: 8px;
}
.time_final{
    margin-left:25px ;
}
.time img{
    width: 40px;
    height: 40px;
}
 .time p{
    margin: 0;
    
 }
 .layout{
    width: 100vw;
    height: 100vh;
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

<div class="pagina">
    <div class="informacoes_inciais">
        <div class="seguidores info_item">
                <img src="img/img_dash/profile.png" alt="" class="info_incial_img">
                <p class="titulo2">Seguidores</p>
                <p class="titulo3">
                    {#if erro}
                    <p>Erro: {erro}</p>
                    {:else if perfil}
                    <p>{perfil.num_seguidores}</p>
                    {:else}
                    <p>0</p>
                    {/if}
                </p>
                
        </div>
        <div class="curtidas info_item">
            <img src="img/img_dash/curtida.png" alt="" class="info_incial_img">
                <p class="titulo2">Curtidas</p>
                <p class="titulo3">
                    {#if erro}
                    <p>Erro: {erro}</p>
                    {:else if perfil}
                    <p>{perfil.num_curtidas}</p>
                    {:else}
                    <p>0</p>
                    {/if}
                </p>
    
        </div>
        <div class="comentarios info_item">
            <img src="img/img_dash/comentario.png" alt="" class="info_incial_img">
                <p class="titulo2">Comentários</p>
                <p class="titulo3">
                    {#if erro}
                    <p>Erro: {erro}</p>
                    {:else if perfil}
                    <p>{perfil.num_comentarios}</p>
                    {:else}
                    <p>0</p>
                    {/if}
                </p>
    
        </div>
        <div class="oscilacao_crescimento info_item">
            <img src="img/img_dash/crescimento.png" alt="" class="info_incial_img">
                <p class="titulo2">Engajamento</p>
                <p class="titulo3">665</p>
    
        </div>
    </div>
    <div class="hierarquia_de_relacionamento">
        <div class="list_titulo">
          <div class="titulo_posicao">
            <p>Posição</p>
          </div>
          <div class="titulo_arroba">
            <p>Usuário</p>
          </div>
          <div class="titulo_pontuacao">
            <p>Pontuação</p>
          </div>
        </div>
      
        <!-- Exibir o conteúdo -->
        {#if erro}
          <p>Erro: {erro}</p>
        {:else if perfil}
          {#each perfil.relacionamento.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) as pessoa, index}
            <div class="list_resposta">
              <div class="resposta_posicao">
                <p>{currentPage * itemsPerPage + index + 1}</p>
              </div>
              <div class="resposta_arroba">
                <p>{pessoa.arroba}</p>
              </div>
              <div class="resposta_pontuacao">
                <p>{pessoa.pontuacao}</p>
              </div>
            </div>
          {/each}
          
          <!-- Botões de navegação -->
          <div class="pagination">
            <button on:click={prevPage} disabled={currentPage === 0}>Anterior</button>
            <button on:click={nextPage} disabled={(currentPage + 1) * itemsPerPage >= perfil.relacionamento.length}>Próximo</button>
          </div>
        {:else}
          <p>Carregando...</p>
        {/if}
      </div>
      

    <div class="informacoes_intervalo">
        <div class="time">
            <div class="time_inicial">
                <img src="/img/img_dash/datas.png" alt="">
                <p>
                    Data Inicial
                </p>
            </div>
            <div class="time_final">
                <img src="/img/img_dash/datas.png" alt="">
                <p>
                    Data Final
                </p>
            </div>
        </div>
        <div class="grafico enagajamento_por_hora_do_dia">
            <p class="titulo_graficos">
                Horários de Engajamento
            </p>
            <PorHoraDoDia/>
        </div>
        <div class="grafico engajamento_ao_longo_do_tempo">
            <p class="titulo_graficos">
                Oscilação de Engajamento
            </p>
            <Engajamento/>
            
        </div>
        <div class="grafico seguidores_e_nao_seguidores">
            <p class="titulo_graficos">
                Interceção de Seguidores
            </p>
            <SeguidoresENaoSeguidores/>
            
        </div>
        <div class="comentarios_repetidos">
            <div class="titulo">
                <div class="posicao">
                    <p>
                        Posição

                    </p>
                </div>
                <div class="conteudo">
                    <p>
                        Conteúdo
                    </p>

                </div>
                <div class="usuario">
                    <p>
                        cp2caxias
                    </p>

                </div>
            </div>
            <div class="comentarios">
                <div class="posicao">
                    <p>
                        1

                    </p>
                </div>
                <div class="conteudo">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi porro facere nam maiores reiciendis, neque officiis natus consequuntur rem, laboriosam minima est odit et in tempore unde doloribus excepturi fugiat?
                    </p>

                </div>
                <div class="usuario">
                    <p>
                        Comentário
                    </p>

                </div>

            </div>
            <div class="comentarios">
                <div class="posicao">
                    <p>
                        2

                    </p>
                </div>
                <div class="conteudo">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi porro facere nam maiores reiciendis, neque officiis natus consequuntur rem, laboriosam minima est odit et in tempore unde doloribus excepturi fugiat?
                    </p>

                </div>
                <div class="usuario">
                    <p>
                        adeiltonfilho80
                    </p>

                </div>

            </div>
        </div>

    </div>


   
    

</div>


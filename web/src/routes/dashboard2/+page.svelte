<script lang="ts">
    import { onMount } from 'svelte';
    import Nav from "../componentes/Nav.svelte";
    import UserAudit from "../componentes/user_audit/UserAudit.svelte";
    import Extrato from '../componentes/Extrato.svelte';

    let totalCredito = 0;

    const custoAnaliseSimples = 20;
    let valor=0;

    let informacoesDesbloqueadas = [false, false, false, false, false, false, false, false, false];

    async function buscarTotalCredito() {
        const access_token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://localhost:3000/total_credito', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Total de créditos:', data.saldoTotal);
                totalCredito = data.saldoTotal;
            } else {
                console.error('Erro ao buscar total de crédito ou token inválido.');
                totalCredito = 0;
            }
        } catch (error) {
            console.error('Erro ao buscar total de crédito:', error);
            totalCredito = 0;
        }
    }

    let services = [];

async function fetchServices() {
    try {
        const response = await fetch('http://localhost:3000/servicos');  // Substitua pelo seu endpoint real
        if (!response.ok) {
            throw new Error('Erro ao buscar serviços');
        }
        services = await response.json();  // Recebe a lista de serviços do banco

        // Cria uma lista de "false" com o mesmo tamanho da lista de serviços
        let informacoesDesbloqueadas = new Array(services.length).fill(false);
        
        console.log(informacoesDesbloqueadas);  // Exibe a lista de false correspondente ao número de serviços
    } catch (error) {
        console.error(error);
    }
}

    async function realizarDebito(valor) {
        const access_token = localStorage.getItem('access_token');

        try {
            const response = await fetch('http://localhost:3000/realizar_debito', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token, valor }),
            });

            if (response.ok) {
                console.log('Débito confirmado no servidor');
                totalCredito -= valor;
                atualizarCardSaldo();
                return true;
            } else {
                const errorMsg = await response.text();
                console.error('Erro ao realizar débito:', errorMsg);
                return false;
            }
        } catch (err) {
            console.error('Erro ao processar débito:', err);
            return false;
        }
    }

    function atualizarCardSaldo() {
        const saldoElement = document.querySelector('.saldo-total');
        if (saldoElement) {
            saldoElement.textContent = `Saldo Total: ${totalCredito} créditos`;
        }
    }

    async function verificarCredito(e, index, valor) {
        
        e.preventDefault();

        await buscarTotalCredito();

        if (totalCredito >= valor) {
            const sucesso = await realizarDebito(valor);

            if (sucesso) {
                informacoesDesbloqueadas = informacoesDesbloqueadas.map((status, i) =>
                    i === index ? true : status
                );

                console.log('Informação desbloqueada');

                // Dispara o confete após desbloquear
                dispararConfete();
            } else {
                alert('Erro ao processar o débito. Tente novamente.');
            }
        } else {
            alert('Você não tem creditos suficientes');
        }
    }

    function dispararConfete() {
        if (typeof window.confetti === "function") {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    onMount(async () => {
        await buscarTotalCredito();
        atualizarCardSaldo();
        fetchServices();

        // Importa a biblioteca confetti manualmente para estar disponível no `window`
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js";
        script.async = true;
        script.onload = () => {
            console.log('Confetti loaded');
            window.confetti = window.confetti || (() => {});
        };

        document.head.appendChild(script);
    });

    
    import { goto } from '$app/navigation'; // Importa o goto para redirecionamento
    import { each } from 'chart.js/helpers';

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
    // Função para buscar a análise do perfil

  async function fetchAnalisePerfil(accessToken) {
    

    try {
      const response = await fetch(`http://localhost:3000/analise-perfil-por-token?access_token=${accessToken}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

      if (!response.ok) {
        throw new Error('Erro ao buscar análise do perfil');
      }

      perfil = await response.json(); // Assume que a resposta está no formato de Perfil
    } catch (error) {
      erro = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro:', erro);
    }
  }




  // Chamar a função na montagem do componente
  onMount(async () => {
    const token = localStorage.getItem('access_token');
    
    

    if (token) {
      try {
        
        await fetchAnalisePerfil(token);
      } catch (error) {
        console.error('Erro ao processar o token do usuário:', error);
        goto('/login'); // Redireciona para /login em caso de erro
      }
    } else {
      console.log('Nenhum token encontrado no sessionStorage. Redirecionando para login.');
      goto('/login'); // Redireciona para /login se não houver dados
    }
  });

  // Função para logout
  function logout() {
    sessionStorage.removeItem('access_token'); // Limpa o token
    userId = null; // Atualiza o estado local
    goto('/login'); // Redireciona para a página de login
  } 


</script>

<link rel="stylesheet" href="landding/styles/styles.css">
<link rel="stylesheet" href="landding/styles/dash.css">

<UserAudit />
<Nav />

<body>
    <div class="dashboard">
        <div class="informacoes_iniciais">
            {#each services as service, i}
                <div class="info_i {informacoesDesbloqueadas[i

                    
                ] ? 'aberta' : ''}">
                    <div class="mascara">
                        <button class="cadeado" on:click={(e) => verificarCredito(e, i, service.valor)}>
                            <div class="conteudo_trancado">
                                
                                <p>
                                    {service.nome}

                                </p>
                                <p>
                                    {service.valor}

                                </p>
                                

                            </div>
                        
                            🔒
                        </button>
                    </div>
                    <div class="conteudo">{service.nome}
                        <img src="{service.path_foto}" alt="">
                    </div>
                </div>
            {/each}
           
        </div>
        
            {#if perfil}
            
            <div class="hierarquia_de_relacionamento info_i {informacoesDesbloqueadas[3] ? 'aberta' : ''}">
                <!-- Hierarquia de Relacionamento fixa com valor 100 -->
                
                    <div class="mascara">
                        <div class="analise_perfil">
                            <p>1000 C</p>
                            <button class="cadeado" on:click={(e) => verificarCredito(e, 3, 1000)}>
                                🔒
                            </button>

                        </div>
                        
                        
                    </div>
                    <div class="hierarquia_conteudo">
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
                           <div class="conteudo">
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
                                    <p>{Math.round(pessoa.pontuacao)}</p> <!-- Arredonda para o mais próximo -->
                                </div>
                              </div>
                            {/each}
                            
                            <!-- Botões de navegação -->
                            <div class="pagination">
                              <button class="button" on:click={prevPage} disabled={currentPage === 0}>Anterior</button>
                              <button class="button" on:click={nextPage} disabled={(currentPage + 1) * itemsPerPage >= perfil.relacionamento.length}>Próximo</button>
                            </div>
                          {:else}
                            <p>Carregando...</p>
                          {/if}

                           </div>
                         
                    </div>
                
            </div>
            {:else}
                <p>Carregando...</p>
            {/if}
        
            <Extrato/>
        
        
    </div>
    
    <div class="saldo-total">
        Saldo Total: {totalCredito} créditos
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
        transition: 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .list_titulo{
        display: flex;
        justify-content:space-between;
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
        font-size: 24px;
        color: white;
        cursor: pointer;
    }

    .info_i.aberta .conteudo {
        visibility: visible;
    height: 90%;
    flex-direction: column;
    display: flex
;
    }
    .button{
        
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    margin: 25px 0px;
  
    }

    .info_i.aberta .cadeado, .info_i.aberta .mascara  {
        visibility: hidden;
    }
    .dashbord{
        justify-content: space-between;
    }
  

    .conteudo {
        visibility: hidden;
        transition: visibility 0.5s ease;
        justify-content: space-between;

    }
 
    .saldo-total {
    position: fixed;
    top: 120px;
    right: 20px;
    background: #ffeb3d;
    padding: 15px 20px;
    font-weight: bold;
    color: #000;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    font-size: 18px;
    z-index: 1;
    text-align: center;
    font-family: Arial, sans-serif;
}
.hierarquia_de_relacionamento{
    width: 600px;
    height: 95%;
    border-radius: 16px;
    background-color: rgb(211, 211, 211);

}
.conteudo_trancado{
    display: flex;
    flex-direction: column;
}
.hierarquia_conteudo{
    width: 100%;
}
.list_resposta{
    display: flex;
    width: 100%;
    width: 100%;
    justify-content: space-between;
}
.list_resposta div{
    width: 20%;
    
}

.hierarquia_conteudo{
    height: 100%;
}
</style>

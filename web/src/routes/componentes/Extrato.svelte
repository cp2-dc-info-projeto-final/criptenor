<script>
  import { onMount } from "svelte";

  let extrato = []; // Lista para armazenar o extrato
  let erro = ""; // Mensagem de erro, se houver

  // Função para buscar o extrato
  async function buscarExtrato() {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      erro = "Access token não encontrado.";
      console.error(erro);
      return [];
    }

    try {
      const response = await fetch("http://localhost:3000/extrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Extrato Completo:", data.transacoes);
        return Array.isArray(data.transacoes) ? data.transacoes : [];
      } else {
        erro = `Erro ao buscar extrato: ${response.statusText}`;
        console.error(erro);
        return [];
      }
    } catch (error) {
      erro = "Erro ao buscar extrato: " + error.message;
      console.error(erro);
      return [];
    }
  }

  // Chamar a função ao montar o componente
  onMount(async () => {
    extrato = await buscarExtrato();
  });
</script>

<style>
  .container-extrato {
    width: 100%;
    max-width: 800px;
    height: 700px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #fafafa;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .lista-extrato {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .lista-extrato li {
    margin: 5px 0;
    padding: 10px;
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .erro {
    color: red;
    font-weight: bold;
  }
  li{
    justify-content: space-around;
    display: flex;
    min-width: 400px;
  }
  p.debito {
  color: red;
  font-weight: bold;
}

p.credito {
  color: green;
  font-weight: bold;
}

</style>
<div class="master">

</div>
{#if erro}
  <p class="erro">{erro}</p>
{/if}

{#if extrato.length > 0}
  <div class="container-extrato">
    <h1>Extrato</h1>
    <ul class="lista-extrato">
      {#each extrato as item}
        <li>
          <p class="{item.tipo}">
            {item.tipo.toUpperCase()}

          </p>
          <p> {item.valor}</p>
          <p>
              {new Date(item.created_at).toLocaleString()}

          </p>
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <p>Nenhum item encontrado no extrato.</p>
{/if}




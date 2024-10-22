<script lang="ts">
  import { onMount } from 'svelte';

  interface Perfil {
    id: number;
    nome: string;
    arroba: string;
    num_curtidas: number;
  }

  let perfil: Perfil | null = null;
  let erro: string | null = null;
  const arroba = 'adeiltonfilho80';

  // Função para buscar a análise do perfil
  const fetchAnalisePerfil = async () => {
    try {
      const response = await fetch(`http://localhost:3000/analise-perfil/${arroba}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar análise do perfil');
      }
      perfil = await response.json(); // Assume que a resposta está no formato de Perfil
    } catch (error) {
      erro = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro:', erro);
    }
  };

  // Chamar a função na montagem do componente
  onMount(async () => {
    await fetchAnalisePerfil(); // Certifique-se de que aqui você também usa await
  });
</script>

<style>

</style>





<!-- Exibir o conteúdo -->
{#if erro}
  <p>Erro: {erro}</p>
{:else if perfil}
  <div>
    <h2>Perfil</h2>
    <p>ID: {perfil.num_curtidas}</p>
    
  </div>
{:else}
  <p>Carregando análise do perfil...</p>
{/if}

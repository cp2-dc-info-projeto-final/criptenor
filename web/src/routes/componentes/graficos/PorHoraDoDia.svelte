<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    onMount(() => {
      const ctx = document.getElementById('meuGraficoPizza').getContext('2d');
      const meuGraficoPizza = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Categoria A', 'Categoria B', 'Categoria C'],
          datasets: [{
            label: 'Distribuição de Categorias',
            data: [30, 50, 20],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1,
            hoverOffset: 25 // Deslocamento da fatia no hover
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'none', // Desativando a legenda
            },
            tooltip: {
              enabled: true,
            }
          },
          layout: {
            padding: 40 // Adicionando padding ao redor do gráfico para evitar cortes
          }
        }
      });
    });
  </script>
  
  <style>
    #meuGraficoPizza {
      max-width: 90%; /* Aumentando o tamanho do canvas */
      max-height: 90%;
      margin: 40px auto; /* Adicionando margem para criar mais espaço */
      display: block;
    }
  </style>
  
  <canvas id="meuGraficoPizza"></canvas>
  
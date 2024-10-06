<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto'; // Certifique-se de que Chart.js está instalado corretamente
    
    onMount(() => {
      const ctx = document.getElementById('graficoLinhas').getContext('2d');
      const graficoLinhas = new Chart(ctx, {
        type: 'line', // Tipo de gráfico
        data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'], // Meses ou outra sequência temporal
          datasets: [
            {
              label: 'Curtidas',
              data: [30, 50, 40, 60, 80, 100], // Dados de curtidas
              borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha
              backgroundColor: 'rgba(255, 99, 132, 0.2)', // Cor de fundo (preenchimento) da área sob a linha
              fill: true, // Preencher abaixo da linha
              tension: 0.3 // Suavidade da linha
            },
            {
              label: 'Comentários',
              data: [20, 40, 30, 50, 70, 90], // Dados de comentários
              borderColor: 'rgba(54, 162, 235, 1)', // Cor da linha
              backgroundColor: 'rgba(54, 162, 235, 0.2)', // Cor de fundo (preenchimento) da área sob a linha
              fill: true, // Preencher abaixo da linha
              tension: 0.3
            },
            {
              label: 'Engajamento',
              data: [15, 35, 55, 75, 95, 115], // Dados de engajamento
              borderColor: 'rgba(255, 206, 86, 1)', // Cor da linha
              backgroundColor: 'rgba(255, 206, 86, 0.2)', // Cor de fundo (preenchimento) da área sob a linha
              fill: true, // Preencher abaixo da linha
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true, // Exibir legenda para identificar cada linha
              position: 'top',
            },
            tooltip: {
              enabled: true, // Ativar tooltip
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Mês' // Rótulo do eixo X
              }
            },
            y: {
              title: {
                display: true,
                text: 'Valores' // Rótulo do eixo Y
              },
              beginAtZero: true // Iniciar o eixo Y em zero
            }
          }
        }
      });
    });
  </script>
  
  <style>
    #graficoLinhas {
      max-width: 100%;
      max-height: 100%;
      
    }
  </style>
  
  <canvas id="graficoLinhas"></canvas>
  

  <head>
    
    <script src="https://cdn.anychart.com/releases/8.9.0/js/anychart-core.min.js"></script>
    <script src="https://cdn.anychart.com/releases/8.9.0/js/anychart-venn.min.js"></script>
    <style type="text/css">
      html,
      body,
      #container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>  
    <div id="container"></div>
    <script>
      anychart.onDocumentReady(function () {
        const data = [
          { x: 'A', value: 100, name: 'Seguidores' },
          { x: 'B', value: 100, name: 'Seguindo' },
          
          
          { x: ['A', 'B'], value: 75, name: 'Amigos' },
          
          
        ];

        var chart = anychart.venn(data);
        chart.container('container');
        
        chart.labels().format('{%Name}');
        chart.stroke('1 #fff');
        chart.legend(false);
        chart.draw();
      });
    </script>
  </body>


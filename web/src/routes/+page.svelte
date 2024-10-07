<script>
    import Nav from "./componentes/Nav.svelte";
    import PorHoraDoDia from "./componentes/graficos/PorHoraDoDia.svelte";
    import Engajamento from "./componentes/graficos/Engajamento.svelte";
    import SeguidoresENaoSeguidores from "./componentes/graficos/SeguidoresENaoSeguidores.svelte";
    import TodosUsuarios from "./componentes/listas/TodosUsuarios.svelte";
</script>
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
        width: 100vw;
        display: flex;
        padding: 1%;
        justify-content: space-around;
    }
    .informacoes_intervalo{
        width: 65%;
        background-color: antiquewhite;
        border-radius: 18px;
        padding: 1%;
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
    }
    .titulo_graficos{
        font-size: 25px;
    }
    .engajamento_ao_longo_do_tempo{
        width: 45%;
    }
    .hierarquia_de_engajamento{
        width: 20%;
        background-color: antiquewhite;
        border-radius: 18px;
    }
    .hierarquia_de_engajamento{
        padding: 10px;
        
    }
    .hierarquia_de_engajamento .titulo{
        background-color: whitesmoke;
    }
    .hierarquia_de_engajamento .titulo, .hierarquia_de_engajamento .resultado{
        display: flex;
        width: 100%;
        justify-content: space-around;
        padding: 10px;
        border: 1px solid;
        border-radius: 100px;
        margin-top: 10px;
    }
    .hierarquia_de_engajamento .resultado, .hierarquia_de_engajamento .titulo{
        justify-content: space-around;
    }
    
    .hierarquia_de_engajamento .usuario{
        width: 30%;
        
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
</style>

<div class="pagina">
    <div class="informacoes_inciais">
        <div class="seguidores info_item">
                <img src="img/img_dash/profile.png" alt="" class="info_incial_img">
                <p class="titulo2">Seguidores</p>
                <p class="titulo3">665</p>
                
        </div>
        <div class="curtidas info_item">
            <img src="img/img_dash/curtida.png" alt="" class="info_incial_img">
                <p class="titulo2">Curtidas</p>
                <p class="titulo3">665</p>
    
        </div>
        <div class="comentarios info_item">
            <img src="img/img_dash/comentario.png" alt="" class="info_incial_img">
                <p class="titulo2">Comentários</p>
                <p class="titulo3">665</p>
    
        </div>
        <div class="oscilacao_crescimento info_item">
            <img src="img/img_dash/crescimento.png" alt="" class="info_incial_img">
                <p class="titulo2">Engajamento</p>
                <p class="titulo3">665</p>
    
        </div>
    </div>
    <div class="usuarios">
        <TodosUsuarios/>
    </div>
    <div class="informacoes_intervalo">
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

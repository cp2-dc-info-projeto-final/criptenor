

<style>
    .crud_adm {
        border-radius: 16px;
        border: 1px solid black;
        padding: 1%;
        width: 80%;
        margin: auto;
        margin-top: 3%;
    }
    .crud_titulo {
        display: flex;
        justify-content: space-between;
        padding: 1%;
    }
    .crud_elementos {
        display: flex;
        justify-content: space-between;
        border: 1px solid black;
        border-radius: 16px;
        padding: 5px;
        margin-bottom: 10px;
    }
    .icons {
        display: flex;
        justify-content: space-between;
    }
    .icons button {
        border: 0;
        background-color: transparent;
    }
    .icons img {
        width: 25px;
        background-color: aquamarine;
        border-radius: 5px;
        padding: 3px;
        margin-left: 5px;
    }
    /* Estilos do popup */
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .popup-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        min-width: 300px;
    }
    .popup-content button {
        margin: 10px;
    }
    /* Estilo do formulário */
    .formulario {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    .formulario input {
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }
    .formulario { display: flex; flex-direction: column; gap: 10px; }
    .formulario input, .formulario button { padding: 8px; }

    /* From Uiverse.io by akshat-patel28 */ 
.input-div {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid rgb(1, 235, 252);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
  animation: flicker 2s linear infinite;
}

.icon {
  color: rgb(1, 235, 252);
  font-size: 2rem;
  cursor: pointer;
  animation: iconflicker 2s linear infinite;
}

.input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer !important;
}
.input_div{
    display: flex;
    flex-direction: column;
    align-items: baseline;
}

@keyframes flicker {
  0% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
  }

  5% {
    border: none;
    box-shadow: none;
  }

  10% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
  }

  25% {
    border: none;
    box-shadow: none;
  }

  30% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
  }

  100% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
  }
}

@keyframes iconflicker {
  0% {
    opacity: 1;
  }

  5% {
    opacity: 0.2;
  }

  10% {
    opacity: 1;
  }

  25% {
    opacity: 0.2;
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}
.upload_icon{
    width: 90%;
}

#descricaoServico{
    height: 80px;
    width: 250px;
}
input{
    width: 250px;
}
.pop button{
    width: 200px;
    display: flex;
    flex-direction: column;
}
</style>
<script>
    import { onMount } from "svelte";
    let servicos = [];
    let servicoSelecionado = null;
    let mostrarPopup = false;
    let nomeServico = '';
    let descricaoServico = '';
    let valorServico = '';
    let fotoServico = null; // para armazenar o arquivo de foto

    // Função para buscar os dados dos serviços do endpoint
    const fetchServicos = async () => {
        try {
            const response = await fetch('http://localhost:3000/servicos');
            if (response.ok) {
                servicos = await response.json();
                console.log(servicos[0]);
            } else {
                console.error('Erro ao buscar dados:', response.statusText);
            }
        } catch (error) {
            console.error('Erro na consulta:', error);
        }
    };

    // Função para excluir serviço
    const excluirServico = async (id) => {
        try {
            const response = await fetch('http://localhost:3000/servicos_delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                servicos = servicos.filter(servico => servico.id !== id);
                fecharPopup();
            } else {
                console.error('Erro ao excluir:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    // Função para abrir o popup de edição
    const abrirPopup = (servico) => {
        servicoSelecionado = servico;
        nomeServico = servico.nome;
        descricaoServico = servico.descricao;
        valorServico = servico.valor;
        fotoServico=servico.path_foto;
        console.log('pathfoto',path_foto)
        mostrarPopup = true;
    };  

    // Função para fechar o popup
    const fecharPopup = () => {
        servicoSelecionado = null;
        nomeServico = '';
        descricaoServico = '';
        valorServico = '';
        fotoServico = null;
        mostrarPopup = false;
    };
    

    // Função para editar ou criar o serviço com foto
    const salvarServico = async () => {
        const formData = new FormData();
        formData.append("nome", nomeServico);
        formData.append("descricao", descricaoServico);
        formData.append("valor", valorServico);
        if (fotoServico) {
            formData.append("foto", fotoServico.files[0]);
        }

        const url = servicoSelecionado
            ? 'http://localhost:3000/servicos/editar'
            : 'http://localhost:3000/servicos/criar';

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const servicoAtualizado = await response.json();
                if (servicoSelecionado) {
                    servicos = servicos.map(servico => servico.id === servicoAtualizado.id ? servicoAtualizado : servico);
                } else {
                    servicos.push(servicoAtualizado);
                }
                fecharPopup();
            } else {
                console.error('Erro ao salvar serviço:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
        }
    };

    onMount(() => {
        fetchServicos();
    });

    
    

    let uploadIconSrc = "upload_icon.png"; // Ícone padrão de upload
    let path_foto = ""; // URL da imagem carregada do servidor (alterar dinamicamente)
    let fileInput;
    
    

    function previewImage(event) {
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                fotoServico = e.target.result; // Atualiza a variável fotoServico com a URL da imagem
            };
            
            reader.readAsDataURL(file); // Lê o arquivo como URL
        }
    }

                    
</script>



<div class="crud_adm">
    <div class="crud_titulo">
        <p>Nome do Serviço</p>
        <p>Ações</p>
    </div>

    {#each servicos as servico}
        <div class="crud_elementos">
            <p>{servico.nome}</p>
            <div class="icons">
                <button on:click={() => excluirServico(servico.id)}>
                    <img src="img/adm/lata-de-lixo.png" alt="Excluir">
                </button>
                <button on:click={() => abrirPopup(servico)}>
                    <img src="img/adm/editar.png" alt="Editar">
                </button>
            </div>
        </div>
    {/each}
</div>

{#if mostrarPopup}
    <div class="popup">
        <div class="popup-content">
            <h3>{servicoSelecionado ? 'Editar Serviço' : 'Criar Serviço'}</h3>
            <div class="formulario">
                <div class="input-div">
         

            <!-- Input para upload de imagem -->
            <input class="input" id="input_img_servico_edit" name="file" type="file" accept="image/png, image/jpeg" bind:this={fileInput} on:change={previewImage} />

            <!-- Imagem de pré-visualização -->
            <img src={fotoServico} alt="Upload Icon" class="upload_icon" id="img_servico_input">



                </div>
                
                
                <div class="input_div">   
                    <label for="nomeServico">Nome</label>
                    <input type="text" id="nomeServico" bind:value={nomeServico} />
                </div>
                <div class="input_div">   
                    <label for="nomeServico">Nome</label>
                    <input type="text" id="nomeServico" bind:value={nomeServico} />

                </div>
                    
                <div class="input_div">
                    <label for="descricaoServico">Descrição</label>
                    <textarea type="text" id="descricaoServico" bind:value={descricaoServico} />
                </div>
                <div class="input_div">
                    <label for="valorServico">Valor</label>
                    <input type="text" id="valorServico" bind:value={valorServico} />

                </div>

                

                
                
                <div class="pop">
                    <button on:click={salvarServico}>
                        {servicoSelecionado ? 'Salvar Alterações' : 'Criar Serviço'}
                    </button>
                    <button on:click={fecharPopup}>Cancelar</button>

                </div>
                
            </div>
        </div>
    </div>
{/if}

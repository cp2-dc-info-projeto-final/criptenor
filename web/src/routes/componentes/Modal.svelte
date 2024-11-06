<!-- src/components/Modal.svelte -->
<script>
    export let isOpen = false;
    export let message = '';
    export let onConfirm = () => {};
    export let onCancel = () => {};

    function handleConfirm() {
        onConfirm();
        isOpen = false;
    }

    function handleCancel() {
        onCancel();
        isOpen = false;
    }
</script>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* para garantir que o modal fique sobre outros elementos */
    }
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        position: relative; /* para que o conteúdo do modal tenha um contexto de posição */
    }
    .btn {
        margin: 5px;
        padding: 10px 20px;
        background-color: blueviolet;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>

{#if isOpen}
<div class="modal" on:click={handleCancel}>
    <div class="modal-content" on:click|stopPropagation>
        <p>{message}</p>
        <button class="btn" on:click={handleConfirm}>Confirmar</button>
        <button class="btn" on:click={handleCancel}>Cancelar</button>
    </div>
</div>
{/if}

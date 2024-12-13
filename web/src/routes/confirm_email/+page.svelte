<script>
  import { onMount } from 'svelte';

  let pin = '';
  let accessToken = '';
  let codigoIncorreto = false;

  onMount(() => {
      
      enviarEmail();
  });

  async function conferirPin(pin) {
      const access_token = localStorage.getItem('access_token');
      try {
          const response = await fetch('http://localhost:3000/confirmar-pin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token, pin }),
          });

          if (response.status == 200) {
              window.location.href = "/dashboard";
          } else if (response.status === 401) {
              codigoIncorreto = true;
          }
      } catch (error) {
          console.error('Erro ao confirmar PIN:', error);
      }
  }

  async function enviarEmail() {
      const access_token = localStorage.getItem('access_token');
      try {
          const response = await fetch('http://localhost:3000/enviar-email-de-confirmacao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token }),
          });

          
      } catch (error) {
          console.error('Erro ao enviar email de confirmação:', error);
      }
  }

  function enviarPin() {
      const inputElement = document.querySelector('.form-card-input');
      if (inputElement) {
          pin = inputElement.value;
          console.log('PIN:', pin, 'Access Token:', accessToken);
          conferirPin(pin);
      }
  }
</script>


<body>
  <form on:submit|preventDefault={enviarPin} class="form-card">
      <p class="form-card-title">Confirme seu email</p>
      <p class="form-card-prompt">É necessário confirmar a criação da conta através de um código enviado para seu email de cadastro</p>

      <div class="form-card-input-wrapper">
          <input class="form-card-input" placeholder="____" maxlength="4" type="tel" bind:value={pin} />
      </div>

      {#if codigoIncorreto}
          <div class="cod_incorreto">
              <p>Código informado incorreto</p>
          </div>
      {/if}

      <button type="submit" class="form-card-submit">Enviar</button>
      <p on:click={enviarEmail}>Enviar novamente o email</p>
  </form>
</body>


<style>
    :root {
        --color-primary-1: #e5f2f0;
        --color-primary-2: #5691a4;
        --color-primary-3: #4c5e61;
        --color-primary-4: #f1eff0;
        --color-primary-5: #2e3f42;
        --color-primary-6: #336b89;

        --color-neutral-0: #fff;
        --color-neutral-1: #1d1d1d;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        border: 0;
        padding: 0;
        box-sizing: border-box;
        background-color: #ffffff;
        background-image: radial-gradient(rgba(12, 12, 12, 0.171) 2px, transparent 0);
        background-size: 30px 30px;
        background-position: -5px -5px;
    }

    div.cod_incorreto {
        color: rgb(214, 82, 82);
        margin-top: 8px;
        font-size: 14px;
    }



    
.design-container {
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
}

.design-wrapper {
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  gap: 0.8rem;
  height: 100%;
  width: 100%;
}

.call {
  width: 280px;
  height: 90px;
  border-radius: 1.2rem;
  background: rgba(19, 19, 19, 0.836);
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  padding: 1rem;
  color: #fff;
  font-size: large;
  font-weight: bold;
  -webkit-box-shadow: 0px 0.2rem 0.5rem rgba(20, 20, 20, 0.322);
  box-shadow: 0px 0.2rem 0.5rem rgba(20, 20, 20, 0.322);
  -webkit-perspective: 800px;
  perspective: 800px;
  -webkit-animation: scale-out 10s infinite;
  animation: scale-out 10s infinite;
  position: relative;
}

.call::before {
  content: '';
  background-color: #111111e3;
  -webkit-filter: blur(5px);
  filter: blur(5px);
  inset: 0;
  position: absolute;
  z-index: -1;
  text-align: center;
}

.phone-number::after {
  content: "1234";
  background: -webkit-gradient(linear, left top, right top, color-stop(20%, rgb(206, 206, 206)), color-stop(40%, rgb(255, 255, 255)), color-stop(60%, rgb(255, 255, 255)), color-stop(80%, rgb(206, 206, 206)));
  background: linear-gradient(to right, rgb(206, 206, 206) 20%, rgb(255, 255, 255) 40%, rgb(255, 255, 255) 60%, rgb(206, 206, 206) 80%);
  background-size: 200% auto;
  color: #000;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: shine 1.5s linear infinite;
  animation: shine 1.5s linear infinite;
}

.phone-desc {
  font-weight: normal;
  font-size: 14px;
  color: #727272;
}

.button-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  gap: 0.5rem;
}

.button {
  height: 40px;
  width: 40px;
  max-width: 40px;
  max-height: 40px;
  position: relative;
  border-radius: 100%;
}

.button:hover {
  cursor: auto;
}

.button svg {
  height: 20px;
  width: 20px;
  margin: auto;
  transform: translateX(10px)translateY(10px);
  fill: #fff;
}

.deny {
  background-color: #ec5445;
}

.deny svg {
  -webkit-transform: translateX(7px)translateY(10px) rotate(136deg) translate(-10%, -15%);
  -ms-transform: translateX(7px)translateY(10px) rotate(136deg) translate(-10%, -15%);
  transform: translateX(7px)translateY(10px) rotate(136deg) translate(-10%, -15%);
}

.allow {
  background-color: #68cd66;
}

.form-card {
  width: 280px;
  height: 350px;
  border-radius: 1.2rem;
  background-color: #fff;
  padding: 1.3rem;
  color: #212121;
  text-align: center;
  position: relative;
  border: 3px solid var(--color-primary-1);
}

.form-card-title {
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
  margin-top: 0.2rem;
}

.form-card-prompt {
  margin-bottom: 2rem;
  font-size: 14px;
}
/* hard reset */
.form-card-input {
  all: unset;
}

.form-card-input-wrapper {
  position: relative;
  width: 100%;
  height: 3rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 1rem;
}

.form-card-input {
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 3rem;
  text-align: start;
  -webkit-transform: translateX(36px);
  -ms-transform: translateX(36px);
  transform: translateX(36px);
  position: absolute;
  z-index: 3;
  background-color: transparent;
}

.form-card-input-bg {
  content: '';
  width: 240px;
  height: 60px;
  margin: auto;
  inset: 0;
  bottom: 10px;
  position: absolute;
  z-index: 1;
  border-radius: 12px;
  background-color: rgba(206, 206, 206, 0.664);
}

.call-again {
  color: #5e5e5e;
  font-size: 14px;
}

.call-again:hover {
  cursor: pointer;
}

.underlined {
  text-decoration: underline;
}

.form-card-submit {
  position: absolute;
  width: 180px;
  margin: auto;
  color: white;
  border: none;
  background-color: #212121;
  font-size: 1.2rem;
  border-radius: 0.8rem;
  padding: 0.8rem 3.5rem;
  bottom: 2rem;
  left: 0;
  right: 0;
  -webkit-transition: 200ms ease-in-out;
  transition: 200ms ease-in-out;
}

.form-card-submit:hover {
  cursor: pointer;
  opacity: 0.8;
}

.form-card-submit:active {
  opacity: 0.9;
  -webkit-transform: scale(95%);
  -ms-transform: scale(95%);
  transform: scale(95%);
}

#uuid-d8a0d861-3741-4013 {
  width: auto;
  height: 500px;
}

@-webkit-keyframes scale-out {
  0%, 15%, 100% {
    color: #fff;
    -webkit-transform: scale(72%);
    transform: scale(72%);
  }

  16%, 98% {
    color: rgba(255, 255, 255, 0.295);
    -webkit-transform: scale(100%);
    transform: scale(100%);
  }
}

@keyframes scale-out {
  0%, 15%, 100% {
    color: #fff;
    -webkit-transform: scale(72%);
    transform: scale(72%);
  }

  16%, 98% {
    color: rgba(255, 255, 255, 0.295);
    -webkit-transform: scale(100%);
    transform: scale(100%);
  }
}

@-webkit-keyframes shine {
  to {
    background-position: 200% center;
  }
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}
</style>
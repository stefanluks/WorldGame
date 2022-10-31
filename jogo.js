window.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    document.querySelector("body").appendChild(canvas);

    const player = {
        x: 0,
        y: 0,
        vida: 100,
        width: 20,
        height: 20,
        speed: {
            x: 0,
            y: 0
        },
        color: 'red',
        moverX: 0,
        moverY: 0,
        atacando: false,
        ataque: 0,
        energia: 100,
        frames: 0,


        atualizar() {
            this.frames++;
            this.x += this.speed.x;
            this.y += this.speed.y;
            if (this.energia < 100 && this.frames % 50 == 0) {
                this.energia += 10;
            }
            if (this.vida <= 0) gameOver = true;
        },

        desenhar() {
            ctx.fillStyle = this.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            if (this.atacando) {
                this.atacando = false;
                ctx.fillStyle = 'white';
                let ataque = { x: 0, y: 0, width: 0, height: 0 };
                if (this.speed.y == 0 && this.speed.x == 0 || this.speed.x == 5) {
                    ctx.fillRect(player.x + player.width, player.y, player.width * 2, player.height);
                    ataque = { x: player.x + player.width, y: player.y, width: player.width * 2, height: player.height };
                } else if (this.speed.y == 0 && this.speed.x == -5) {
                    ctx.fillRect(player.x - 2 * player.width, player.y, player.width * 2, player.height);
                    ataque = { x: player.x - 2 * player.width, y: player.y, width: player.width * 2, height: player.height };
                } else if (this.speed.y == 5 && this.speed.x == 0) {
                    ctx.fillRect(player.x, player.y + player.height, player.width, player.height * 2);
                    ataque = { x: player.x, y: player.y + player.height, width: player.width, height: player.height * 2 };
                } else if (this.speed.y == -5 && this.speed.x == 0) {
                    ctx.fillRect(player.x, player.y - 2 * player.height, player.width, player.height * 2);
                    ataque = { x: player.x, y: player.y - 2 * player.height, width: player.width, height: player.height * 2 };
                }
                checkAtaque(ataque);
            }
        }
    }

    const cores = ["blue", "purple", "black", "white"];
    const enimigos = [];
    let nivel = 0;
    let contNv = 0;
    let pontos = 0;
    let pause = false;
    let gameOver = false;

    Start();

    function Start() {
        player.x = Math.floor(Math.random() * canvas.width + 50);
        player.y = Math.floor(Math.random() * canvas.height + 50);
        AddEnimigo();
        Update();
    }

    function checkAtaque(ataque) {
        enimigos.forEach(enimigo => {
            if (ataque.x < enimigo.x + enimigo.width && ataque.x + ataque.width > enimigo.x && ataque.y < enimigo.y + enimigo.height && ataque.y + ataque.height > enimigo.y) {
                enimigo.vida -= 50;
                if (enimigo.vida <= 0) {
                    pontos += 5;
                    contNv++;
                    enimigos.splice(enimigos.indexOf(enimigo), 1);
                    AddEnimigo();
                }
            }
        });
    }

    function Update() {
        if (!pause && !gameOver) {
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, canvas.width, canvas.height);


            player.atualizar();
            player.desenhar();

            enimigos.forEach((enimigo, index) => {
                ctx.fillStyle = "red";
                ctx.fillRect(enimigo.x - enimigo.vida / 6, enimigo.y - 5, enimigo.vida / 2, 3);
                ctx.fillStyle = enimigo.color;
                ctx.fillRect(enimigo.x, enimigo.y, enimigo.width, enimigo.height);
                if (enimigo.x !== player.x || enimigo.y !== player.y) {
                    if (enimigo.x > player.x) enimigo.x -= 1;
                    else if (enimigo.x < player.x) enimigo.x += 1;
                    if (enimigo.y > player.y) enimigo.y -= 1;
                    else if (enimigo.y < player.y) enimigo.y += 1;
                } else {
                    player.vida -= 10;
                    enimigos.pop(index);
                    AddEnimigo();
                }
            });
            if (enimigos.length == 0) AddEnimigo();
        }
        ControleHUD();
        ControlePause();
        ControleNivel();
        requestAnimationFrame(Update);
    }

    function AddEnimigo() {
        for (let i = 0; i < (nivel - enimigos.length); i++) {
            enimigos.push({
                x: Math.floor(Math.random() * canvas.width + 50),
                y: Math.floor(Math.random() * canvas.height + 50),
                color: cores[Math.floor(Math.random() * cores.length - 1)],
                vida: 100,
                width: 20,
                height: 20,
            });
        }
    }

    function ControlePause() {
        if (pause) {
            let pauseHtml = document.createElement("div");
            pauseHtml.classList.add("pause");
            pauseHtml.innerHTML = "PAUSE";
            document.querySelector("body").appendChild(pauseHtml);
        } else {
            if (document.querySelector(".pause")) document.querySelector(".pause").remove();
        }
    }

    function ControleNivel() {
        if (contNv >= nivel * 10) {
            nivel++;
            contNv = 0;
            let nivelHtml = document.createElement("div");
            nivelHtml.classList.add("nivelUp");
            nivelHtml.innerHTML = "Nível " + nivel;
            document.querySelector("body").appendChild(nivelHtml);
            let time = setInterval(() => {
                nivelHtml.remove();
                clearInterval(time);
            }, 2000);
        }
    }

    function ControleHUD() {
        let barraEnergia = document.getElementsByClassName("energia");
        barraEnergia[0].children[0].style.width = player.energia + "%";
        let barraVida = document.getElementsByClassName("vida");
        barraVida[0].children[0].style.width = player.vida + "%";
        let pontosHUD = document.getElementsByClassName("pontos");
        pontosHUD[0].innerHTML = "Pontos: " + pontos;
    }

    window.addEventListener('keydown', (e) => {
        if (e.key == "a") {
            player.speed.x = -5;
        }
        if (e.key == "d") {
            player.speed.x = 5;
        }
        if (e.key == "w") {
            player.speed.y = -5;
        }
        if (e.key == "s") {
            player.speed.y = 5;
        }
        if (e.key == " ") {
            if (player.energia >= 10) {
                player.energia -= 10;
                player.atacando = true;
            }
        }
        if (e.key == "p") {
            pause = !pause;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key == "a") {
            player.speed.x = 0;
        }
        if (e.key == "d") {
            player.speed.x = 0;
        }
        if (e.key == "w") {
            player.speed.y = 0;
        }
        if (e.key == "s") {
            player.speed.y = 0;
        }
    });
}
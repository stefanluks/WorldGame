window.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    document.querySelector("body").appendChild(canvas);

    const img = new Image();
    img.src = "sprites/player.png";

    const enimigo_img = new Image();
    enimigo_img.src = "sprites/enimigos.png";

    const player = {
        x: 0,
        y: 0,
        vida: 100,
        width: 50,
        height: 50,
        speed: {
            x: 0,
            y: 0
        },
        image: img,
        img_pars: {
            sx: 0,
            sy: 0,
            sw: 395,
            sh: 375,
        },
        color: 'red',
        moverX: 0,
        moverY: 0,
        atacando: false,
        ataque: 0,
        direcAtack: 1,
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
            // ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.drawImage(this.image, this.img_pars.sx, this.img_pars.sy, this.img_pars.sw, this.img_pars.sh, this.x, this.y, this.width, this.height);
            if (this.atacando) {
                this.atacando = false;
                ctx.fillStyle = 'white';
                let ataque = { x: 0, y: 0, width: 0, height: 0 };
                if (this.direcAtack == 1) {
                    ctx.fillRect(player.x + player.width, player.y, player.width * 2, player.height);
                    ataque = { x: player.x + player.width, y: player.y, width: player.width * 2, height: player.height };
                } else if (this.direcAtack == 2) {
                    ctx.fillRect(player.x - 2 * player.width, player.y, player.width * 2, player.height);
                    ataque = { x: player.x - 2 * player.width, y: player.y, width: player.width * 2, height: player.height };
                } else if (this.direcAtack == 3) {
                    ctx.fillRect(player.x, player.y + player.height, player.width, player.height * 2);
                    ataque = { x: player.x, y: player.y + player.height, width: player.width, height: player.height * 2 };
                } else if (this.direcAtack == 4) {
                    ctx.fillRect(player.x, player.y - 2 * player.height, player.width, player.height * 2);
                    ataque = { x: player.x, y: player.y - 2 * player.height, width: player.width, height: player.height * 2 };
                } else if (this.direcAtack == 5) {
                    ctx.fillRect(player.x - player.width * 4, player.y - player.height * 4, player.width * 10, player.height * 10);
                    ataque = { x: player.x - player.width * 4, y: player.y - player.height * 4, width: player.width * 10, height: player.height * 10 };
                }
                checkAtaque(ataque, this.direcAtack);
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
    let estaPausado = false;

    document.getElementById("labelControle").addEventListener("click", () => { pause = !pause; });

    Start();

    function Start() {
        player.x = Math.floor(Math.random() * canvas.width + 50);
        player.y = Math.floor(Math.random() * canvas.height + 50);
        AddEnimigo();
        Update();
    }

    function checkAtaque(ataque, tipo) {
        enimigos.forEach(enimigo => {
            if (ataque.x < enimigo.x + enimigo.width && ataque.x + ataque.width > enimigo.x && ataque.y < enimigo.y + enimigo.height && ataque.y + ataque.height > enimigo.y) {
                if (tipo === 5) enimigo.vida -= 100;
                else enimigo.vida -= 50;
                if (enimigo.vida <= 0) {
                    pontos += 5;
                    contNv++;
                    enimigos.splice(enimigos.indexOf(enimigo), 1);
                    AddEnimigo();
                }
            }
        });
    }

    function checkColisao(enimigo) {
        return (enimigo.x === player.x && enimigo.y === player.y ||
            enimigo.x + enimigo.width === player.x && enimigo.y === player.y ||
            enimigo.x === player.x && enimigo.y + enimigo.height === player.y ||
            enimigo.x + enimigo.width === player.x && enimigo.y + enimigo.height === player.y);
    }

    function Update() {
        if (!pause && !gameOver) {
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, canvas.width, canvas.height);


            player.atualizar();
            player.desenhar();

            enimigos.forEach((enimigo, index) => {
                console.log(enimigo);
                ctx.fillStyle = "red";
                ctx.fillRect(enimigo.x - enimigo.vida / 6, enimigo.y - 5, enimigo.vida / 2, 3);
                ctx.fillStyle = enimigo.color;
                // ctx.fillRect(enimigo.x, enimigo.y, enimigo.width, enimigo.height);
                ctx.drawImage(
                    enimigo.image,
                    enimigo.img_pars.sx + (enimigo.img_pars.sw * index),
                    enimigo.img_pars.sy,
                    enimigo.img_pars.sw,
                    enimigo.img_pars.sh,
                    enimigo.x,
                    enimigo.y,
                    enimigo.width,
                    enimigo.height
                );
                if (checkColisao(enimigo)) {
                    player.vida -= 10;
                    enimigos.pop(index);
                    AddEnimigo();
                } else {
                    if (enimigo.x > player.x) enimigo.x -= 1;
                    else if (enimigo.x < player.x) enimigo.x += 1;
                    if (enimigo.y > player.y) enimigo.y -= 1;
                    else if (enimigo.y < player.y) enimigo.y += 1;
                }
            });


            if (enimigos.length == 0) AddEnimigo();
            if (player.vida <= 0) {
                gameOver = true;
                let gameOverHtml = document.createElement("div");
                gameOverHtml.classList.add("gameOver");
                gameOverHtml.innerHTML = `GAME OVER <span> Pontuação: ${pontos} </span> <button onclick="location.reload()">Reiniciar</button>`;
                document.querySelector("body").appendChild(gameOverHtml);
                let tempo = setInterval(() => {
                    gameOverHtml.style.top = "50%";
                    clearInterval(tempo);
                }, 100);
            }
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
                width: 50,
                height: 50,
                image: enimigo_img,
                img_pars: {
                    sx: 0,
                    sy: 0,
                    sw: 310,
                    sh: 310,
                }
            });
        }
    }

    function ControlePause() {
        if (pause && !estaPausado) {
            let pauseHtml = document.createElement("div");
            pauseHtml.classList.add("pause");
            pauseHtml.innerHTML = "PAUSE";
            document.querySelector("body").appendChild(pauseHtml);
            estaPausado = true;
        } else if (!estaPausado) {
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
            if (player.energia >= 50) {
                player.energia -= 50;
                player.atacando = true;
                player.direcAtack = 5;
            }
        }
        if (e.key == "ArrowLeft") {
            if (player.energia >= 10) {
                player.energia -= 10;
                player.atacando = true;
                player.direcAtack = 2;
            }
        }
        if (e.key == "ArrowRight") {
            if (player.energia >= 10) {
                player.energia -= 10;
                player.atacando = true;
                player.direcAtack = 1;
            }
        }
        if (e.key == "ArrowUp") {
            if (player.energia >= 10) {
                player.energia -= 10;
                player.atacando = true;
                player.direcAtack = 4;
            }
        }
        if (e.key == "ArrowDown") {
            if (player.energia >= 10) {
                player.energia -= 10;
                player.atacando = true;
                player.direcAtack = 3;
            }
        }
        if (e.key == "p") {
            pause = !pause;
            estaPausado = false;
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
const app = document.getElementById('typewriter');
const typewriter = new Typewriter(app, {
    loop: true,
    delay: 90
});

typewriter
    .pauseFor(2500)
    .typeString('Puedes Agendar tu cita!')
    .pauseFor(300)
    .deleteChars(10)
    .start();

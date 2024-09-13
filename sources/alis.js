const
    easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    white = "#ffffff",
    green = "#00ff00",
    black = "#000000",
    gray = "#5c5c5c",
    darkGray = "#444444",
    aqua = "#0bffd5",
    magenta = "#f70c44"

    random = Math.random,
    round = (value) => Math.round(value),
    floor = (value) => Math.floor(value),
    cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,

    beginPath = () => context.beginPath(),
    closePath = () => context.closePath(),
    lineWidth = (v) => context.lineWidth = v,
    fillRect = (c, x, y, w, h) => { context.fillStyle = c; context.fillRect(x, y, w, h) },
    fillStyle = (v) => context.fillStyle = v,
    strokeStyle = (v) => context.strokeStyle = v,
    moveTo = (x, y) => context.moveTo(x, y),
    lineTo = (x, y) => context.lineTo(x, y),
    fill = () => context.fill(),
    stroke = () => context.stroke(),
    font = (v) => context.font = v,
    fillText = (c, t, x, y) => { fillStyle(c); context.fillText(t, x, y) },
    clearRect = (x, y, w, h) => context.clearRect(x, y, w, h)


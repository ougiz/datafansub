export const prerender = false;

export const GET = () => {
  return new Response(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>api</title>
  <style>
    html, body {
      margin: 0; padding: 0; height: 100%;
      overflow: hidden;
    }
    body {
      background: url('/bocchi.jpg') no-repeat center center fixed;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      text-shadow: 0 0 8px black;
      font-size: 2rem;
      user-select: none;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div>IF YOU'RE READING THIS, GO fuck YOURSELF</div>
</body>
</html>`, {
    headers: { 'Content-Type': 'text/html' }
  });
};

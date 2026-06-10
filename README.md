# Ruleta de Vocabulario en Inglés

Aplicación web simple para practicar vocabulario en inglés usando síntesis y reconocimiento de voz.

Características
- 20 palabras en inglés con su traducción al español.
- Botón "Girar" que muestra una pista en español.
- Síntesis de voz (SpeechSynthesis) para leer la pista.
- Reconocimiento de voz (SpeechRecognition) para que el usuario diga la palabra en inglés.
- Contadores de aciertos y errores.

Requisitos
- Navegador moderno: Google Chrome o Microsoft Edge recomentados (soporte SpeechRecognition).

Uso
1. Abrir `index.html` en el navegador.
2. Pulsar el botón **Girar**.
3. Escuchar la pista y decir la palabra en inglés cuando el navegador lo solicite.

Notas
- El reconocimiento de voz puede pedir permisos al navegador.
- Si la síntesis o reconocimiento no están soportados, la app mostrará un mensaje.

Estructura
- `index.html` — Interfaz principal.
- `styles.css` — Estilos.
- `app.js` — Lógica de ruleta, síntesis y reconocimiento.

Contribuciones
- Pull requests bienvenidos.
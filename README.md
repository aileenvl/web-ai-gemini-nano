# Web AI con Gemini Nano

Dos demos en español para explorar las APIs de inteligencia artificial integradas en Chrome.

- **Notas a acciones** (`/`): resume notas con Summarizer y propone acciones con Prompt API y un esquema JSON. Permite revisar, editar, descartar y exportar resultados.
- **Pruebas de APIs** (`/verificacion/`): ejecuta ejemplos de Prompt, Summarizer, Language Detector, Translator, Writer, Rewriter y Proofreader. Muestra la disponibilidad real y permite descargar el registro de las pruebas de tu pestaña.

Las respuestas se generan con las APIs nativas disponibles en tu navegador. No se incluyen respuestas simuladas, claves de API ni un servicio de inferencia remoto.

## Ejecutar

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

Abre estas direcciones en Chrome de escritorio:

- Demo de notas: http://localhost:8766/
- Pruebas de APIs: http://localhost:8766/verificacion/
- Prueba aislada de traducción: http://localhost:8766/verificacion/traduccion.html

Sirve la carpeta por HTTP local o HTTPS. Evita abrir el HTML directamente con `file://`. No hay dependencias de aplicación ni compilación.

## Preparar la demo

1. Usa el mismo equipo, perfil y origen que utilizarás al presentar.
2. Abre con conexión y pulsa **Preparar IA** en la aplicación o **Comprobar APIs** en la página de pruebas.
3. Comprueba la disponibilidad con las opciones reales de idioma. Si hace falta descargar el modelo, inicia la tarea mediante su botón y espera a que termine.
4. Prueba **Resumir** y **Proponer acciones**, y revisa las respuestas antes de mostrarlas.

La página de pruebas admite editar las notas para Prompt, Summarizer, acciones y traducción. Writer, Rewriter y Proofreader utilizan ejemplos fijos. Que un constructor exista no garantiza que pueda crear una sesión con tus opciones.

## Compatibilidad

La demo principal está diseñada para entrada y salida en español con Chrome de escritorio. El soporte, las condiciones de hardware y el estado de cada API pueden cambiar. Consulta los requisitos y usa `availability()` antes de crear una sesión:

- [APIs y estados de publicación](https://developer.chrome.com/docs/ai/built-in-apis)
- [Requisitos y disponibilidad](https://developer.chrome.com/docs/ai/get-started)
- [Gestión de modelos en Chrome](https://developer.chrome.com/docs/ai/understand-built-in-model-management)

Writer, Rewriter y Proofreader pueden requerir acceso experimental. Si una API no está expuesta o está `unavailable`, la página registra ese resultado. El equipo y perfil utilizados durante el ensayo no garantizan disponibilidad en otros navegadores o dispositivos.

## Qué demostrar

1. Comprobar la disponibilidad de las APIs.
2. Generar un resumen con Summarizer.
3. Compararlo con una instrucción de resumen mediante Prompt API.
4. Pedir acciones en JSON y revisar sus citas.
5. Detectar el idioma y traducir las notas al inglés.
6. Probar Writer y Rewriter si el navegador los admite.

En la aplicación de notas, editar o descartar propuestas y descargar el Markdown muestra un flujo completo. La exportación incluye todas las propuestas no descartadas: las revisadas se marcan con `[x]` y las pendientes con `[ ]`. Un JSON válido y una cita literal no garantizan que la propuesta esté bien interpretada: conserva la revisión humana.

## Privacidad y modo sin conexión

La aplicación no incluye analítica, almacenamiento automático de las notas ni un proveedor remoto alternativo. Chrome administra por separado la descarga y actualización de los modelos.

La inferencia puede funcionar sin conexión cuando la página ya está cargada y el modelo está disponible. Esta demo no incluye un service worker y no promete abrirse o recargarse sin red. Mantén el servidor local activo. El modelo puede actualizarse o eliminarse por decisión del navegador, por lo que conviene repetir la preparación antes de presentar.

## Código de las APIs

- `app.js`: aplicación de notas, validación y exportación.
- `verificacion/original-prompt.js`: fragmento original de Prompt API, conservado como ejemplo de la charla.
- `verificacion/bindings.js`: elementos y helpers que utiliza ese fragmento.
- `verificacion/tests.js`: ejemplos ejecutables de las APIs.
- `verificacion/traduccion.js`: prueba aislada de traducción.

El fragmento original ilustra la integración; la aplicación completa también gestiona cancelación, errores y liberación de sesiones.

## Pruebas de lógica

Con Node.js instalado:

```bash
node --test tests/demo-core.test.mjs
```

Estas pruebas comprueban validación de entradas, respuesta JSON, citas y exportación. La inferencia se prueba en Chrome con los botones de la demo; las pruebas de Node no simulan el navegador ni prueban la disponibilidad de sus modelos.

## Documentación de las APIs

[Prompt](https://developer.chrome.com/docs/ai/prompt-api) · [Summarizer](https://developer.chrome.com/docs/ai/summarizer-api) · [Salidas estructuradas](https://developer.chrome.com/docs/ai/structured-output-for-prompt-api) · [Translator](https://developer.chrome.com/docs/ai/translator-api) · [Language Detector](https://developer.chrome.com/docs/ai/language-detection) · [Writer](https://developer.chrome.com/docs/ai/writer-api) · [Rewriter](https://developer.chrome.com/docs/ai/rewriter-api) · [Proofreader](https://developer.chrome.com/docs/ai/proofreader-api)

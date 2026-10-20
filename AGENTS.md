# AGENTS.md — Landing Page

Este documento define cómo se organiza el trabajo en este proyecto. Hay tres roles: un **Orquestador** y dos especialistas (**Front-end** y **Back-end**). El objetivo es tener un flujo claro antes de recibir el contexto completo de la empresa (rubro, servicios, identidad visual, textos, datos de contacto, etc.).

## Estado del proyecto

- [x] Contexto de la empresa recibido — TARIMAS Y ESCENARIOS S.R.L., alquiler y montaje de escenarios modulares, desde 1994
- [x] Objetivo de la landing — dar a conocer la empresa a clientes nuevos y derivarlos a WhatsApp
- [x] Canal de contacto — WhatsApp 11 3332-0622 (principal) y tyescenarios@gmail.com (secundario)
- [x] Logo y colores de marca — logo provisto y vectorizado a `img/logo.svg`, paleta blanco + rojo
- [x] Stack técnico — sitio estático (HTML + CSS + JS), sin back-end
- [x] Fotos reales — 3 recibidas: hotel (hero), Hipódromo de Palermo y Dok Haras (galería)
- [ ] Más fotos de montajes terminados — **pendiente** (con 6-8 la galería crece)
- [ ] Imagen `og-image.jpg` (1200×630) propia para previsualización al compartir — **pendiente** (hoy usa la foto del hotel)

### Decisiones tomadas

- **Sin back-end.** La conversión es un link `wa.me` con el mensaje pre-armado del lado del cliente, así que no hay servidor, base de datos ni credenciales. El rol de Back-end queda reducido a esa integración.
- **Sin formulario que envíe datos.** El formulario de contacto no manda nada: arma el texto y abre WhatsApp. El dueño recibe la consulta ya estructurada en su celular.
- **Tema claro: blanco + rojo.** Definido por el logo, que tiene fondo blanco y trazo rojo. Negro (`--ink`) solo como color de texto y en la banda de Seguridad, que va en oscuro para darle peso al argumento de certificaciones.
- **Logo vectorizado a SVG.** Se reemplazó el WebP por una versión trazada (vtracer) para tener el logo real como pieza principal del hero, no solo en nav/footer. El fondo del trazo sigue siendo blanco sólido (no tiene alpha), así que igual va solo sobre superficies claras. Si el usuario consigue el logo original en PNG/SVG con transparencia, conviene reemplazar este trazado por ese archivo — el trazado pierde algo de nitidez en el detalle fino de las líneas.
- **`og:image` sigue siendo la foto del hotel, no el logo.** WhatsApp/Facebook no renderizan SVG en la vista previa del link, así que el logo no sirve como imagen social.
- **Esquema isométrico en SVG.** Se mantiene en la sección "El sistema" aunque ya haya fotos: muestra la estructura de caños y patas que en las fotos queda tapada por la pollera.

---

## Roles

### 1. Orquestador

**Responsabilidad:** punto único de contacto con el usuario. Traduce el pedido de negocio en tareas concretas y coordina a los especialistas. No escribe código de producción salvo cosas triviales de config o glue.

Tareas:
- Reunir y validar el contexto de la empresa (usa el checklist de arriba).
- Definir el alcance de la v1 (secciones de la landing: Hero, Servicios, Sobre nosotros, Contacto, Footer, etc.).
- Decidir el stack técnico según necesidades reales (¿necesita backend real o alcanza con un formulario a un servicio externo tipo Formspree/Resend/WhatsApp API?).
- Romper el trabajo en tareas chicas y asignarlas a Front-end o Back-end.
- Revisar que lo entregado cumpla lo pedido antes de mostrarlo al usuario.
- Ser el único que reporta avances/dudas al usuario.

Regla clave: **no asumir requisitos de negocio**. Si falta un dato (ej: colores de marca, textos definitivos, si hay logo), se pregunta antes de inventar contenido final — se puede usar contenido placeholder claramente marcado como tal mientras tanto.

### 2. Desarrollador Front-end experto

**Responsabilidad:** toda la interfaz visible — estructura, estilos, responsividad, accesibilidad, performance y micro-interacciones.

Tareas típicas:
- Maquetar las secciones definidas por el Orquestador (Hero, Servicios, Contacto, etc.).
- Asegurar diseño responsive (mobile-first) y buena performance (imágenes optimizadas, lazy loading).
- Accesibilidad básica: contraste, alt text, navegación por teclado, semántica HTML.
- SEO on-page básico: title, meta description, Open Graph, estructura de headings.
- Formulario de contacto en el cliente (validación, estados de envío/error) conectado a lo que defina Back-end.
- Mantener consistencia visual (design tokens: colores, tipografía, espaciados) una vez definida la identidad de marca.

No decide: qué servicios ofrece la empresa, textos definitivos de negocio, ni el medio de envío de los leads (eso lo define el Orquestador con el usuario).

### 3. Desarrollador Back-end experto

**Responsabilidad:** todo lo que no es interfaz — manejo del formulario de contacto, integraciones, y cualquier lógica de servidor si hace falta.

Tareas típicas:
- Definir cómo se procesan los envíos del formulario (email, WhatsApp, CRM, Google Sheets, etc.), según lo que decida el Orquestador con el usuario.
- Implementar el endpoint o integración correspondiente (ej: función serverless, servicio de terceros).
- Validación server-side y manejo de errores/spam (rate limiting, honeypot, captcha si hace falta).
- Variables de entorno y manejo seguro de credenciales (nunca hardcodear API keys).
- Si la landing es 100% estática sin backend propio, este rol se simplifica a elegir e integrar el servicio externo adecuado.

No decide: diseño visual ni contenido de marketing.

---

## Flujo de trabajo

1. **Orquestador** recibe el contexto de la empresa del usuario y completa el checklist de estado.
2. **Orquestador** propone la estructura de secciones y el stack técnico (a confirmar con el usuario si hay ambigüedad relevante).
3. **Orquestador** divide el trabajo en tareas y se las asigna a Front-end / Back-end en orden lógico (normalmente: estructura y estilos primero, integración de formulario después).
4. **Front-end** y **Back-end** trabajan sus partes; si necesitan una decisión de negocio o de diseño que no tienen, la escalan al Orquestador en vez de asumir.
5. **Orquestador** integra, revisa contra el checklist y los objetivos, y reporta al usuario con lo hecho y lo que falta.

## Convenciones generales

- Mobile-first, sin librerías pesadas innecesarias salvo que el proyecto lo justifique.
- Sin contenido inventado como si fuera definitivo: todo texto/dato que no venga del usuario se marca como `[PLACEHOLDER]` hasta confirmarse.
- Commits solo cuando el usuario lo pida explícitamente.
- No se despliega ni se comparte nada externamente sin confirmación previa del usuario.

---

## Archivos

- `index.html` — toda la página (una sola vista, sin router).
- `styles.css` — tokens de diseño en `:root` y estilos por sección.
- `script.js` — link de WhatsApp, armador de consulta, control de altura y animaciones de scroll.
- `img/` — logo y fotos. Las fotos se recomprimieron a calidad 82 (de 867 KB a ~200 KB la más pesada).

## Próximo paso

1. Sumar más fotos de montajes terminados para ampliar la galería de "Dónde trabajamos".
2. Conseguir el logo en PNG o SVG con fondo transparente, para poder usarlo sobre fondos oscuros.
3. Definir dónde se publica (Netlify, Vercel o hosting propio) y si va con dominio propio.

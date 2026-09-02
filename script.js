/* ==========================================================================
   INTERACTIVIDAD Y LÓGICA - TARIMAS Y ESCENARIOS S.R.L.
   Vanilla JavaScript - Lógica simple, directa y paso a paso.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. HEADER SCROLL EFFECT
  // Cambia la altura y fondo del header al hacer scroll hacia abajo.
  var mainHeader = document.getElementById('mainHeader');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU TOGGLE
  // Controla la apertura y cierre del menú drawer en dispositivos móviles.
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var navLinks = document.querySelectorAll('.nav-link, .nav-btn, #logoLink');

  mobileMenuBtn.addEventListener('click', function() {
    mainHeader.classList.toggle('nav-open');
  });

  // Cierra el menú al hacer click en cualquier enlace de navegación.
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mainHeader.classList.remove('nav-open');
    });
  });

  // 3. SMOOTH SCROLL WITH HEADER HEIGHT OFFSET
  // Ajusta el scroll suave para que las secciones no queden tapadas por el header fijo.
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  
  allAnchorLinks.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      var targetId = this.getAttribute('href');
      if (targetId === '#') return; // Si es solo "#", no hace nada
      
      var targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Calcula la altura actual del header (adaptable si tiene clase scrolled)
        var headerOffset = mainHeader.offsetHeight;
        var elementPosition = targetSection.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. B2B FORM HANDLER
  // Previne el envío por defecto, valida, muestra en consola y notifica éxito en pantalla.
  var contactForm = document.getElementById('contactForm');
  var successPanel = document.getElementById('successPanel');

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      // Evita el refresco automático de la página
      event.preventDefault();
      
      // Captura de datos ingresados de forma directa y manual
      var nombreVal = document.getElementById('nombre').value;
      var emailVal = document.getElementById('email').value;
      var telefonoVal = document.getElementById('telefono').value;
      var fechaVal = document.getElementById('fecha').value;
      var lugarVal = document.getElementById('lugar').value;
      var consultaVal = document.getElementById('consulta').value;
      
      // Creación del objeto de contacto para simulación
      var contactData = {
        empresa_o_productora: nombreVal,
        email_contacto: emailVal,
        telefono: telefonoVal,
        tiempo_evento: fechaVal,
        lugar_seleccionado: lugarVal,
        consulta_mensaje: consultaVal,
        fecha_registro_solicitud: new Date().toLocaleString()
      };
      
      // Mostrar la información del emisor del contacto en consola (Filtro B2B)
      console.log('--- NUEVA SOLICITUD DE PRESUPUESTO B2B ---');
      console.log(contactData);
      console.log('-----------------------------------------');
      
      // Ocultar formulario de contacto
      contactForm.style.display = 'none';
      
      // Mostrar panel de éxito
      successPanel.style.display = 'block';
      
      // Hacer un scroll sutil al panel de éxito
      var headerOffset = mainHeader.offsetHeight;
      var panelPosition = successPanel.getBoundingClientRect().top;
      var offsetPosition = panelPosition + window.pageYOffset - headerOffset - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  }

  // 6. SCROLL REVEAL VIA INTERSECTION OBSERVER (Option 3)
  var revealElements = document.querySelectorAll('.reveal-hidden');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Dejar de observar una vez revelado
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(element) {
      revealObserver.observe(element);
    });
  } else {
    // Fallback para navegadores antiguos
    revealElements.forEach(function(element) {
      element.classList.add('reveal-visible');
    });
  }

  // 7. GALLERY ITEMS INTERSECTION OBSERVER (Staggered Entrance)
  var galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length > 0) {
    var galleryObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('gallery-visible');
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    galleryItems.forEach(function(item) {
      galleryObserver.observe(item);
    });
  }

  // 8. SMOOTH MARQUEE HOVER PAUSE & PLAY (Deceleración/Aceleración Suave)
  var marqueeTracks = document.querySelectorAll('.marquee-track');
  
  marqueeTracks.forEach(function(track) {
    var requestID = null;
    var targetSpeed = 1;
    var currentSpeed = 1;
    var cachedAnim = null; // Cache local para evitar consultas reiteradas
    
    var getAnim = function() {
      if (cachedAnim) return cachedAnim;
      var animations = track.getAnimations();
      if (animations.length > 0) {
        cachedAnim = animations[0];
        return cachedAnim;
      }
      return null;
    };
    
    var updateSpeed = function() {
      var anim = getAnim();
      if (!anim) {
        requestID = requestAnimationFrame(updateSpeed);
        return;
      }
      
      // Interpolación lineal suave (LERP) para frenado/arranque progresivo
      currentSpeed += (targetSpeed - currentSpeed) * 0.05; // 0.05 define la suavidad de la desaceleración
      
      anim.playbackRate = currentSpeed;
      
      // Detener el bucle de animación al alcanzar el valor objetivo
      if (Math.abs(currentSpeed - targetSpeed) < 0.005) {
        anim.playbackRate = targetSpeed;
        currentSpeed = targetSpeed;
        requestID = null;
        return;
      }
      
      requestID = requestAnimationFrame(updateSpeed);
    };
    
    var startTransition = function(speed) {
      targetSpeed = speed;
      if (!requestID) {
        requestID = requestAnimationFrame(updateSpeed);
      }
    };
    
    track.addEventListener('mouseenter', function() {
      startTransition(0);
    });
    
    track.addEventListener('mouseleave', function() {
      startTransition(1);
    });
  });

});

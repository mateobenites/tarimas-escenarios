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

// ==========================================================================
// HEADER TRUSS / SCAFFOLDING BACKGROUND ANIMATION
// ==========================================================================
(function() {
  var canvas = document.getElementById('headerTrussCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Configuration
  var config = {
    cellSize: 50,          // Grid cell size in px
    lineColor: 'rgba(0, 0, 0, 0.12)',      // Visible gray lines
    nodeColor: 'rgba(0, 0, 0, 0.18)',      // Node dots clearly visible
    diagonalColor: 'rgba(0, 0, 0, 0.08)',  // Cross-bracing visible
    lineWidth: 1.2,
    nodeRadius: 2.5,
    animDuration: 3000,    // Total assembly animation duration (ms)
    driftSpeed: 0.15       // Horizontal drift speed (px per frame)
  };

  var offsetX = 0;
  var startTime = Date.now();
  var animFrame = null;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Easing function: smooth ease-out
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function draw() {
    var w = canvas.width / (window.devicePixelRatio || 1);
    var h = canvas.height / (window.devicePixelRatio || 1);
    var cell = config.cellSize;
    var elapsed = Date.now() - startTime;
    var globalProgress = Math.min(elapsed / config.animDuration, 1);

    ctx.clearRect(0, 0, w, h);

    // Slow horizontal drift for "alive" feeling
    if (!prefersReducedMotion) {
      offsetX += config.driftSpeed;
      if (offsetX >= cell) offsetX -= cell;
    }

    var cols = Math.ceil(w / cell) + 2;
    var rows = Math.ceil(h / cell) + 2;
    var baseX = -cell + (offsetX % cell);
    var baseY = -cell / 2;

    // Calculate staggered progress for each column (left to right assembly)
    for (var col = 0; col < cols; col++) {
      for (var row = 0; row < rows; row++) {
        var x = baseX + col * cell;
        var y = baseY + row * cell;

        // Stagger: columns assemble left-to-right, rows top-to-bottom
        var staggerDelay = (col * 0.04) + (row * 0.08);
        var localProgress = easeOutCubic(Math.max(0, Math.min(1, (globalProgress - staggerDelay) * 3)));

        if (localProgress <= 0) continue;

        // Draw horizontal beam (grows from left)
        if (col < cols - 1) {
          var beamLength = cell * localProgress;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + beamLength, y);
          ctx.strokeStyle = config.lineColor;
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
        }

        // Draw vertical beam (grows from top)
        if (row < rows - 1) {
          var vBeamLength = cell * localProgress;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + vBeamLength);
          ctx.strokeStyle = config.lineColor;
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
        }

        // Draw diagonal cross-bracing (appears after beams)
        if (col < cols - 1 && row < rows - 1) {
          var diagProgress = easeOutCubic(Math.max(0, Math.min(1, (globalProgress - staggerDelay - 0.15) * 3)));
          if (diagProgress > 0) {
            // Only draw one diagonal per cell (alternating pattern)
            if ((col + row) % 2 === 0) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + cell * diagProgress, y + cell * diagProgress);
              ctx.strokeStyle = config.diagonalColor;
              ctx.lineWidth = config.lineWidth * 0.7;
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.moveTo(x + cell, y);
              ctx.lineTo(x + cell - cell * diagProgress, y + cell * diagProgress);
              ctx.strokeStyle = config.diagonalColor;
              ctx.lineWidth = config.lineWidth * 0.7;
              ctx.stroke();
            }
          }
        }

        // Draw node dot at intersection
        if (localProgress > 0.5) {
          var nodeOpacity = (localProgress - 0.5) * 2; // Fade in from 0.5 to 1
          ctx.beginPath();
          ctx.arc(x, y, config.nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = config.nodeColor.replace('0.18', (0.18 * nodeOpacity).toFixed(3));
          ctx.fill();
        }
      }
    }

    // Subtle pulsing glow on a few random nodes after assembly
    if (globalProgress >= 1 && !prefersReducedMotion) {
      var pulseTime = (elapsed - config.animDuration) * 0.001;
      for (var p = 0; p < 3; p++) {
        // Deterministic "random" positions based on p
        var px = ((p * 137 + 50) % cols) * cell + baseX;
        var py = ((p * 89 + 20) % rows) * cell + baseY;
        var pulseScale = 0.5 + 0.5 * Math.sin(pulseTime * 1.5 + p * 2.1);
        
        ctx.beginPath();
        ctx.arc(px, py, config.nodeRadius + 2 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 0, 0, ' + (0.2 * pulseScale).toFixed(3) + ')';
        ctx.fill();
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', function() {
    resize();
  });

  if (prefersReducedMotion) {
    // Draw a single static frame at full progress
    startTime = Date.now() - config.animDuration;
    draw();
    cancelAnimationFrame(animFrame);
  } else {
    draw();
  }
})();

// ==========================================================================
// HERO SECTION: FLOATING PARTICLES BACKGROUND
// ==========================================================================
(function() {
  var canvas = document.getElementById('heroParticlesCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0;
  var H = 0;
  var particles = [];
  var particleCount = 60;
  var connectionDistance = 120;
  var mouseX = -1000;
  var mouseY = -1000;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Adjust particle count based on screen width
    particleCount = Math.max(25, Math.floor(W * H / 15000));
    if (particleCount > 80) particleCount = 80;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.15 - Math.random() * 0.35, // Mostly float upward
      radius: 1.5 + Math.random() * 2,
      opacity: 0.08 + Math.random() * 0.15,
      isAccent: Math.random() < 0.12 // ~12% chance of red accent
    };
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update and draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (!prefersReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.y < -10) {
          p.y = H + 10;
          p.x = Math.random() * W;
        }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.isAccent) {
        ctx.fillStyle = 'rgba(200, 30, 30, ' + (p.opacity * 1.5) + ')';
      } else {
        ctx.fillStyle = 'rgba(44, 53, 64, ' + p.opacity + ')';
      }
      ctx.fill();
    }

    // Draw connections between nearby particles
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          var alpha = (1 - dist / connectionDistance) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(44, 53, 64, ' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Mouse interaction: draw connections to nearby particles
    for (var i = 0; i < particles.length; i++) {
      var dx = particles[i].x - mouseX;
      var dy = particles[i].y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance * 1.5) {
        var alpha = (1 - dist / (connectionDistance * 1.5)) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'rgba(200, 30, 30, ' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  window.addEventListener('resize', function() {
    resize();
    initParticles();
  });

  // Track mouse position relative to hero section
  canvas.parentElement.addEventListener('mousemove', function(e) {
    var rect = canvas.parentElement.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', function() {
    mouseX = -1000;
    mouseY = -1000;
  });

  draw();
})();


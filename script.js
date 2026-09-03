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
// HERO SECTION: CYCLIC TRUSS ASSEMBLY / DISASSEMBLY ANIMATION
// ==========================================================================
(function() {
  var canvas = document.getElementById('heroTrussCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = 1;
  var W = 0;
  var H = 0;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // A "structure" is a small rectangular truss that builds top-down then fades
  var structures = [];
  var maxStructures = 6;
  var spawnInterval = 2200; // ms between new spawns
  var lastSpawn = 0;

  function createStructure(now) {
    var cellSize = 35 + Math.random() * 25; // 35-60px cells
    var cols = 2 + Math.floor(Math.random() * 4); // 2-5 columns wide
    var rows = 3 + Math.floor(Math.random() * 5); // 3-7 rows tall
    var structW = cols * cellSize;
    var x = Math.random() * (W - structW);
    var y = -10; // Start slightly above viewport

    return {
      x: x,
      y: y,
      cellSize: cellSize,
      cols: cols,
      rows: rows,
      createdAt: now,
      buildDuration: 2500 + Math.random() * 1500, // 2.5-4s to build
      holdDuration: 1500 + Math.random() * 1000,  // 1.5-2.5s hold
      fadeDuration: 1800 + Math.random() * 800,   // 1.8-2.6s to fade
      fallSpeed: 0.3 + Math.random() * 0.4        // Slow downward drift
    };
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInCubic(t) {
    return t * t * t;
  }

  function drawStructure(s, now) {
    var age = now - s.createdAt;
    var totalLife = s.buildDuration + s.holdDuration + s.fadeDuration;

    // Remove if fully faded
    if (age > totalLife) return false;

    // Calculate global opacity (1 during build+hold, fading during fade phase)
    var globalAlpha = 1;
    if (age > s.buildDuration + s.holdDuration) {
      var fadeProgress = (age - s.buildDuration - s.holdDuration) / s.fadeDuration;
      globalAlpha = 1 - easeInCubic(Math.min(fadeProgress, 1));
    }

    if (globalAlpha <= 0.01) return false;

    // Build progress (0 to 1 during build phase)
    var buildProgress = Math.min(age / s.buildDuration, 1);

    // Slow drift downward
    var currentY = s.y + age * s.fallSpeed * 0.016;

    var cell = s.cellSize;

    for (var row = 0; row < s.rows; row++) {
      // Each row appears staggered top-to-bottom
      var rowDelay = row / s.rows;
      var rowProgress = easeOutCubic(Math.max(0, Math.min(1, (buildProgress - rowDelay * 0.7) * (1 / 0.3))));

      if (rowProgress <= 0) continue;

      for (var col = 0; col < s.cols; col++) {
        var px = s.x + col * cell;
        var py = currentY + row * cell;

        // Horizontal beam
        if (col < s.cols - 1) {
          var beamLen = cell * rowProgress;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + beamLen, py);
          ctx.strokeStyle = 'rgba(0, 0, 0, ' + (0.1 * globalAlpha).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Vertical beam (grows downward)
        if (row < s.rows - 1) {
          var vLen = cell * rowProgress;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + vLen);
          ctx.strokeStyle = 'rgba(0, 0, 0, ' + (0.1 * globalAlpha).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Diagonal cross-bracing
        if (col < s.cols - 1 && row < s.rows - 1) {
          var diagDelay = 0.15;
          var diagProgress = easeOutCubic(Math.max(0, Math.min(1, (buildProgress - rowDelay * 0.7 - diagDelay) * (1 / 0.3))));
          if (diagProgress > 0) {
            ctx.beginPath();
            if ((col + row) % 2 === 0) {
              ctx.moveTo(px, py);
              ctx.lineTo(px + cell * diagProgress, py + cell * diagProgress);
            } else {
              ctx.moveTo(px + cell, py);
              ctx.lineTo(px + cell - cell * diagProgress, py + cell * diagProgress);
            }
            ctx.strokeStyle = 'rgba(0, 0, 0, ' + (0.06 * globalAlpha).toFixed(3) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Node dot
        if (rowProgress > 0.5) {
          var nodeAlpha = (rowProgress - 0.5) * 2 * globalAlpha;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, ' + (0.14 * nodeAlpha).toFixed(3) + ')';
          ctx.fill();
        }
      }
    }

    return true; // Still alive
  }

  function draw() {
    var now = Date.now();
    ctx.clearRect(0, 0, W, H);

    // Spawn new structures periodically
    if (now - lastSpawn > spawnInterval && structures.length < maxStructures) {
      structures.push(createStructure(now));
      lastSpawn = now;
    }

    // Draw and filter out dead structures
    var alive = [];
    for (var i = 0; i < structures.length; i++) {
      if (drawStructure(structures[i], now)) {
        alive.push(structures[i]);
      }
    }
    structures = alive;

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);

  if (prefersReducedMotion) {
    // Draw a few static structures
    var now = Date.now();
    for (var i = 0; i < 3; i++) {
      var s = createStructure(now - 3000 - i * 1000);
      structures.push(s);
    }
    draw();
  } else {
    // Seed initial structures
    var now = Date.now();
    structures.push(createStructure(now - 2000));
    structures.push(createStructure(now - 800));
    lastSpawn = now;
    draw();
  }
})();

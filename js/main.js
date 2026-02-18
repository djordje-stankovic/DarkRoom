/* =============================================
   DARKROOM STUDIO - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- HLS Video Background ----------
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const videoSrc = 'https://video.squarespace-cdn.com/content/v1/64ad0fe5ca961b08020bfeae/ced605fe-1491-437c-a582-d23f5bd92b03/playlist.m3u8';

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1
      });
      hls.loadSource(videoSrc);
      hls.attachMedia(heroVideo);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        heroVideo.play().catch(() => {});
      });
    } else if (heroVideo.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      heroVideo.src = videoSrc;
      heroVideo.addEventListener('loadedmetadata', () => {
        heroVideo.play().catch(() => {});
      });
    }
  }

  // ---------- Preloader ----------
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 800);
    });
    // Fallback in case load already fired
    setTimeout(() => preloader.classList.add('hidden'), 2500);
  }

  // ---------- Navbar Scroll ----------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Hamburger Menu ----------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Scroll Reveal ----------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  // ---------- Back to Top with Scroll Progress ----------
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const bttPercent = backToTop.querySelector('.btt-percent');

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      const percent = Math.round(progress * 100);

      backToTop.classList.toggle('visible', scrollTop > 600);
      backToTop.style.setProperty('--progress', progress);
      if (bttPercent) bttPercent.textContent = percent + '%';
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Lightbox ----------
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src || item.dataset.lightbox;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Portfolio Filter (Work Page) ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  if (filterBtns.length && workItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        workItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }

  // ---------- Testimonials Drag Scroll ----------
  const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
  if (testimonialsWrapper) {
    let isDown = false;
    let startX, scrollLeft;

    testimonialsWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      testimonialsWrapper.style.cursor = 'grabbing';
      startX = e.pageX - testimonialsWrapper.offsetLeft;
      scrollLeft = testimonialsWrapper.scrollLeft;
    });

    testimonialsWrapper.addEventListener('mouseleave', () => {
      isDown = false;
      testimonialsWrapper.style.cursor = 'grab';
    });

    testimonialsWrapper.addEventListener('mouseup', () => {
      isDown = false;
      testimonialsWrapper.style.cursor = 'grab';
    });

    testimonialsWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialsWrapper.offsetLeft;
      const walk = (x - startX) * 2;
      testimonialsWrapper.scrollLeft = scrollLeft - walk;
    });

    testimonialsWrapper.style.cursor = 'grab';
  }

  // ---------- Testimonials Dot Indicators ----------
  const dotsContainer = document.querySelector('.testimonials-dots');
  if (testimonialsWrapper && dotsContainer) {
    const cards = testimonialsWrapper.querySelectorAll('.testimonial-card');

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonials-dot');

    // Update active dot on scroll
    const updateDots = () => {
      const wrapperLeft = testimonialsWrapper.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 16; // card width + gap
      const activeIndex = Math.round(wrapperLeft / cardWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    };

    testimonialsWrapper.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  }

  // ---------- Active Nav Link ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Contact Form ----------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Sent!';
      btn.style.background = '#4a9e6e';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 2000);
    });
  }

  // ---------- Hero Scroll: logo fade + overlay darken ----------
  const heroLogo = document.querySelector('.hero-logo');
  const videoOverlay = document.querySelector('.video-overlay');

  if (videoOverlay) {
    const animateHeroScroll = () => {
      const scrolled = window.scrollY;
      const vh = window.innerHeight;

      // Hero logo: fade out as you scroll through first viewport
      if (heroLogo) {
        const logoFade = Math.max(1 - scrolled / (vh * 0.6), 0);
        heroLogo.style.opacity = logoFade;
      }

      // Video overlay: starts very clean, darkens as you scroll deeper
      const overlayProgress = Math.min(scrolled / (vh * 2), 1);
      videoOverlay.style.background = `linear-gradient(
        to bottom,
        rgba(10, 10, 10, ${(0.05 + overlayProgress * 0.45).toFixed(2)}) 0%,
        rgba(10, 10, 10, ${(0.1 + overlayProgress * 0.5).toFixed(2)}) 40%,
        rgba(10, 10, 10, ${(0.3 + overlayProgress * 0.6).toFixed(2)}) 80%,
        rgba(10, 10, 10, 0.98) 100%
      )`;
    };

    window.addEventListener('scroll', animateHeroScroll, { passive: true });
    animateHeroScroll();
  }

  // ---------- Parallax Hero (fallback for pages without video) ----------
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ==============================================
  // PREMIUM EFFECTS
  // ==============================================

  // ---------- Cursor Dust Trail ----------
  const isTouchDevice = 'ontouchstart' in window;
  if (!isTouchDevice) {
    let lastX = 0, lastY = 0;
    let throttle = 0;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - throttle < 30) return; // spawn every ~30ms
      throttle = now;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy);

      // Only spawn if cursor is actually moving
      if (speed < 3) { lastX = e.clientX; lastY = e.clientY; return; }

      // Spawn 1-3 particles depending on speed
      const count = Math.min(Math.ceil(speed / 15), 3);
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';

        // Tiny size: 2-4px
        const size = Math.random() * 2 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Slight random offset from cursor position
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        particle.style.left = (e.clientX + offsetX) + 'px';
        particle.style.top = (e.clientY + offsetY) + 'px';

        // Random drift direction (float upward + sideways)
        const driftX = (Math.random() - 0.5) * 20;
        const driftY = -(Math.random() * 15 + 5); // float upward
        particle.style.setProperty('--dx', driftX + 'px');
        particle.style.setProperty('--dy', driftY + 'px');

        // Slight random duration variation
        particle.style.animationDuration = (0.6 + Math.random() * 0.5) + 's';

        document.body.appendChild(particle);

        // Remove from DOM after animation ends
        particle.addEventListener('animationend', () => particle.remove());
      }

      lastX = e.clientX;
      lastY = e.clientY;
    });
  }

  // ---------- 3D Tilt on Service Cards (desktop only) ----------
  if (!isTouchDevice) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s ease';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  // ---------- Animated Counters ----------
  document.querySelectorAll('.stat-number').forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(\+?)$/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = match[2] || '';
    el.dataset.target = target;
    el.dataset.suffix = suffix;
    el.textContent = '0' + suffix;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix;
          const duration = 2000;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(el);
  });

  // ---------- Button Glow on Hover ----------
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--glow-x', x + 'px');
      btn.style.setProperty('--glow-y', y + 'px');
    });
  });

  // ---------- Hero Text Split Reveal ----------
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const html = heroTitle.innerHTML;
    let charIndex = 0;
    const wrapped = html.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, text) => {
      if (tag) return tag;
      return text.split('').map(char => {
        if (char === ' ') return ' ';
        charIndex++;
        return `<span class="char-reveal" style="animation-delay: ${charIndex * 0.03}s">${char}</span>`;
      }).join('');
    });
    heroTitle.innerHTML = wrapped;
    heroTitle.classList.add('text-revealed');
  }

  // ---------- Canvas Constellation ----------
  const heroSection = document.querySelector('.hero, .hero--video, .page-hero, .service-hero');
  if (heroSection && !isTouchDevice) {
    const canvas = document.createElement('canvas');
    canvas.className = 'constellation-canvas';
    heroSection.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w, h, particles;
    let canvasMouseX = -1000, canvasMouseY = -1000;
    const particleCount = 60;
    const connectionDistance = 120;
    const mouseRadius = 180;

    const resize = () => {
      const rect = heroSection.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5
        });
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw particle
        const distToMouse = Math.hypot(p.x - canvasMouseX, p.y - canvasMouseY);
        const glow = distToMouse < mouseRadius ? 1 - distToMouse / mouseRadius : 0;
        const alpha = 0.2 + glow * 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            // Brighter if near mouse
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const distToMouse = Math.hypot(midX - canvasMouseX, midY - canvasMouseY);
            const mouseInfluence = distToMouse < mouseRadius ? (1 - distToMouse / mouseRadius) * 0.5 : 0;
            const lineAlpha = (1 - dist / connectionDistance) * 0.15 + mouseInfluence;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 169, 110, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Mouse connections
      particles.forEach(p => {
        const dist = Math.hypot(p.x - canvasMouseX, p.y - canvasMouseY);
        if (dist < mouseRadius) {
          const alpha = (1 - dist / mouseRadius) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(canvasMouseX, canvasMouseY);
          ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      requestAnimationFrame(drawFrame);
    };

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      canvasMouseX = e.clientX - rect.left;
      canvasMouseY = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      canvasMouseX = -1000;
      canvasMouseY = -1000;
    });

    resize();
    createParticles();
    drawFrame();
    window.addEventListener('resize', () => { resize(); createParticles(); });
  }

});

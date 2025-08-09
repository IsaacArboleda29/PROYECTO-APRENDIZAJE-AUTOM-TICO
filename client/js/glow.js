// js/glow.js
// Efecto: actualiza variables CSS --x y --y en porcentaje para la(s) tarjeta(s) .glow-card
(function () {
  const cards = document.querySelectorAll('.glow-card');

  if (!cards.length) return;

  cards.forEach(card => {
    // Actualiza posición (usa clientX/clientY o touch)
    function updatePos(clientX, clientY) {
      const rect = card.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    }

    // Ratón
    card.addEventListener('mousemove', (e) => {
      updatePos(e.clientX, e.clientY);
      card.classList.add('is-hover');
    });

    card.addEventListener('mouseenter', (e) => {
      updatePos(e.clientX, e.clientY);
      card.classList.add('is-hover');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hover');
    });

    // Touch (móviles)
    card.addEventListener('touchstart', (ev) => {
      const t = ev.touches[0];
      updatePos(t.clientX, t.clientY);
      card.classList.add('is-hover');
    }, { passive: true });

    card.addEventListener('touchmove', (ev) => {
      const t = ev.touches[0];
      updatePos(t.clientX, t.clientY);
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.classList.remove('is-hover');
    });
  });
})();

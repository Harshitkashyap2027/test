document.addEventListener('DOMContentLoaded', () => {
  const q = document.querySelector('[data-university-search]');
  if (q) {
    q.addEventListener('input', () => {
      const term = q.value.trim().toLowerCase();
      document.querySelectorAll('[data-search-item]').forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }

  document.querySelectorAll('[data-mark-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-mark-action'));
      if (target) {
        target.classList.toggle('active');
      }
    });
  });
});

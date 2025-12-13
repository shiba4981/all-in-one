// Page-specific JS for Construction
// Provides small tweaks for hero/portfolio and any per-page initializations
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Hero background: if no image configured inline, add a class
    const heroIllustration = document.querySelector('.hero-illustration');
    if(heroIllustration && !heroIllustration.style.backgroundImage){
      heroIllustration.classList.add('bg-construction');
    }

    // Add construction portfolio images if not defined inline
    document.querySelectorAll('.portfolio-card').forEach((card, i) => {
      if(card.classList.contains('bg-residential') || card.classList.contains('bg-office') || card.classList.contains('bg-mall') || card.classList.contains('bg-road')) return;
      switch(i){
        case 0: card.classList.add('bg-residential'); break;
        case 1: card.classList.add('bg-office'); break;
        case 2: card.classList.add('bg-mall'); break;
        default: card.classList.add('bg-road'); break;
      }
    });

    // Nothing else page-specific; root script handles modal & reveals
  });
})();

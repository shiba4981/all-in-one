// Page-specific JS for Architecture
// Provides small tweaks for hero/portfolio and any per-page initializations
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Hero background: if no image configured inline, add a class
    const heroIllustration = document.querySelector('.hero-illustration');
    if(heroIllustration && !heroIllustration.style.backgroundImage){
      heroIllustration.classList.add('bg-architecture');
    }

    // Add architecture portfolio images if not defined inline
    document.querySelectorAll('.portfolio-card').forEach((card, i) => {
      if(card.classList.contains('bg-modern') || card.classList.contains('bg-corporate') || card.classList.contains('bg-walkthrough') || card.classList.contains('bg-apartment')) return;
      switch(i){
        case 0: card.classList.add('bg-modern'); break;
        case 1: card.classList.add('bg-corporate'); break;
        case 2: card.classList.add('bg-walkthrough'); break;
        default: card.classList.add('bg-apartment'); break;
      }
    });

    // Nothing else page-specific; root script handles modal & reveals
  });
})();

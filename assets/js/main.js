// Scroll-reveal — respects prefers-reduced-motion via CSS transition-duration override
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !els.length){
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();

// Upload-slot images: show the photo once it loads, otherwise leave the
// dashed placeholder visible. Lets images be dropped into assets/img later
// (e.g. via GitHub) with no HTML changes needed.
(function(){
  document.querySelectorAll('.upload-slot img').forEach(function(img){
    var slot = img.closest('.upload-slot');
    if(img.complete && img.naturalWidth > 0){
      slot.classList.add('has-image');
    } else {
      img.addEventListener('load', function(){ slot.classList.add('has-image'); });
      img.addEventListener('error', function(){ slot.classList.remove('has-image'); });
    }
  });
})();

// Top nav hides after scrolling past the hero; side dot-nav takes over.
(function(){
  var threshold = 140;
  function onScroll(){
    document.body.classList.toggle('scrolled', window.scrollY > threshold);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

// Poster lightbox — click the thumbnail to zoom, only once a real image
// has loaded into its upload-slot (placeholder clicks do nothing).
(function(){
  var trigger = document.querySelector('[data-lightbox]');
  var lightbox = document.querySelector('.lightbox');
  if(!trigger || !lightbox) return;
  var lbImg = lightbox.querySelector('img');
  var closeBtn = lightbox.querySelector('.lightbox-close');

  function open(){
    var slot = trigger.querySelector('.upload-slot');
    var img = trigger.querySelector('img');
    if(!slot || !slot.classList.contains('has-image') || !img) return;
    lbImg.src = img.src;
    lightbox.classList.add('open');
  }
  function close(){
    lightbox.classList.remove('open');
    lbImg.src = '';
  }
  trigger.addEventListener('click', open);
  lightbox.addEventListener('click', function(e){
    if(e.target === lbImg) return;
    close();
  });
  closeBtn.addEventListener('click', function(e){ e.stopPropagation(); close(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') close();
  });
})();

// Side-nav scrollspy — highlights the dot for whichever section is in view.
(function(){
  var links = document.querySelectorAll('.side-nav a[href^="#"]');
  if(!links.length) return;
  var pairs = Array.prototype.map.call(links, function(a){
    return { link:a, section:document.querySelector(a.getAttribute('href')) };
  }).filter(function(p){ return p.section; });
  if(!pairs.length) return;
  function onScroll(){
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = pairs[0].section;
    pairs.forEach(function(p){
      if(p.section.offsetTop <= pos) current = p.section;
    });
    pairs.forEach(function(p){
      p.link.classList.toggle('active', p.section === current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();


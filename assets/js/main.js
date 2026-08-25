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

// Lightbox — shared by the 3 site-gallery photos (click to zoom in/out) and
// the poster (click to open the full PDF in a new tab instead of zooming).
// Only fires once a real image has loaded into its upload-slot.
(function(){
  var lightbox = document.querySelector('.lightbox');
  if(!lightbox) return;
  var lbImg = lightbox.querySelector('img');
  var lbHint = lightbox.querySelector('.lightbox-hint');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var mode = 'zoom';
  var pdfHref = '';

  function openFrom(trigger, triggerMode, href){
    var slot = trigger.classList.contains('upload-slot') ? trigger : trigger.querySelector('.upload-slot');
    var img = slot ? slot.querySelector('img') : null;
    if(!slot || !slot.classList.contains('has-image') || !img) return;
    mode = triggerMode;
    pdfHref = href || '';
    lbImg.src = img.src;
    lbImg.classList.remove('zoomed');
    lbHint.textContent = mode === 'pdf' ? '點擊圖片查看完整 PDF ↗' : '點擊圖片可再放大看細節';
    lightbox.classList.add('open');
  }
  function close(){
    lightbox.classList.remove('open');
    lbImg.classList.remove('zoomed');
    lbImg.src = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(function(trigger){
    trigger.addEventListener('click', function(){ openFrom(trigger, 'zoom'); });
  });
  document.querySelectorAll('[data-lightbox-pdf]').forEach(function(trigger){
    trigger.addEventListener('click', function(){
      openFrom(trigger, 'pdf', trigger.getAttribute('data-lightbox-pdf'));
    });
  });

  lbImg.addEventListener('click', function(e){
    e.stopPropagation();
    if(mode === 'pdf'){
      if(pdfHref) window.open(pdfHref, '_blank', 'noopener');
      return;
    }
    lbImg.classList.toggle('zoomed');
  });
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

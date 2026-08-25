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


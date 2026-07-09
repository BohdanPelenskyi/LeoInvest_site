(function(){
  const body = document.body;
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const opened = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('[data-faq-item]').forEach((item, index) => {
    const button = item.querySelector('[data-faq-question]');
    if(!button) return;
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('[data-faq-item]').forEach(el => {
        el.classList.remove('open');
        const q = el.querySelector('[data-faq-question]');
        if(q) q.setAttribute('aria-expanded', 'false');
      });
      if(!isOpen){
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
    if(index === 0){
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .12}) : null;

  document.querySelectorAll('.reveal').forEach(el => {
    if(observer) observer.observe(el);
    else el.classList.add('visible');
  });

  const leadForm = document.querySelector('[data-lead-form]');
  if(leadForm){
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(leadForm);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const email = data.get('email') || '';
      const amount = data.get('amount') || '';
      const message = data.get('message') || '';
      const subject = encodeURIComponent('Заявка з сайту Leo Invest');
      const body = encodeURIComponent(
        `Імʼя: ${name}\nТелефон: ${phone}\nEmail: ${email}\nСума інвестиції: ${amount}\n\nПовідомлення:\n${message}`
      );
      window.location.href = `mailto:office@leoinvest.com.ua?subject=${subject}&body=${body}`;
    });
  }
})();

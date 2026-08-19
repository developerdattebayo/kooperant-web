const header = document.querySelector('[data-header]');
const nav = document.querySelector('#main-nav');
const toggle = document.querySelector('.nav-toggle');

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Otevřít menu' : 'Zavřít menu');
  nav.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Otevřít menu');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

document.querySelector('#poptavka').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = `Poptávka: ${form.get('service')}`;
  const body = [
    `Jméno / firma: ${form.get('name')}`,
    `E-mail: ${form.get('email')}`,
    `Služba: ${form.get('service')}`,
    '',
    'Popis zakázky:',
    form.get('message')
  ].join('\n');
  const recipient = 'kooperantcnc@seznam.cz';
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const options = document.querySelector('.email-options');
  const status = document.querySelector('.form-status');

  document.querySelector('[data-email-client="gmail"]').href =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodedSubject}&body=${encodedBody}`;
  document.querySelector('[data-email-client="outlook"]').href =
    `https://outlook.live.com/mail/0/deeplink/compose?to=${recipient}&subject=${encodedSubject}&body=${encodedBody}`;
  document.querySelector('[data-email-client="default"]').href =
    `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

  options.hidden = false;
  status.textContent = 'Poptávka je připravená. Vyberte způsob otevření e-mailu.';

  const copyButton = document.querySelector('[data-copy-email]');
  copyButton.onclick = async () => {
    const message = `Komu: ${recipient}\nPředmět: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Poptávka byla zkopírována do schránky.';
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = message;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      status.textContent = 'Poptávka byla zkopírována do schránky.';
    }
  };

  options.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

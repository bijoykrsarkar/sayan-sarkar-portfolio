/* ==========================================================================
   SAYAN SARKAR — CA ASPIRANT PORTFOLIO SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('welcome-loader');
  const loaderBar = document.getElementById('loader-bar');
  const skipIntroBtn = document.getElementById('skip-intro-btn');
  const body = document.body;

  // 1. Welcome Splash Screen Sequence
  if (loaderBar) {
    requestAnimationFrame(() => {
      loaderBar.style.width = '100%';
    });
  }

  const dismissLoader = () => {
    if (!loader || loader.classList.contains('hidden')) return;
    loader.classList.add('hidden');
    body.classList.remove('overflow-locked');
    triggerScrollAnimations();
  };

  const loaderTimer = setTimeout(dismissLoader, 2700);

  if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', () => {
      clearTimeout(loaderTimer);
      dismissLoader();
    });
  }

  // 2. Sticky Header & Mobile Navigation Toggle
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight active section in navbar
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('main section[id]');
    const scrollPos = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // 3. Dynamic Rotating Pillar Text in Hero Section
  const rotatorEl = document.getElementById('rotator-word');
  const focusPhrases = [
    'Financial Accounting & Reporting',
    'CA Intermediate — ICAI Curriculum',
    'TallyPrime, MS Office & Generative AI',
    'Rapid Retention & Analytical Recall',
    'Uncompromising Punctuality & Accuracy'
  ];
  let phraseIdx = 0;

  if (rotatorEl) {
    setInterval(() => {
      rotatorEl.style.opacity = '0';
      rotatorEl.style.transform = 'translateY(6px)';
      setTimeout(() => {
        phraseIdx = (phraseIdx + 1) % focusPhrases.length;
        rotatorEl.textContent = focusPhrases[phraseIdx];
        rotatorEl.style.opacity = '1';
        rotatorEl.style.transform = 'translateY(0)';
      }, 320);
    }, 3200);
  }

  // 4. IntersectionObserver for Scroll Reveal & 80% Skill Bars
  function triggerScrollAnimations() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // Animate 80% out of 100% Skill Progress Bars & Counters
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const fill = card.querySelector('.skill-progress-fill');
            const counter = card.querySelector('.score-counter');
            const targetVal = parseInt(counter?.getAttribute('data-target') || '80', 10);

            if (fill) {
              fill.style.width = `${targetVal}%`;
            }

            if (counter) {
              let current = 0;
              const step = Math.ceil(targetVal / 35);
              const timer = setInterval(() => {
                current += step;
                if (current >= targetVal) {
                  current = targetVal;
                  clearInterval(timer);
                }
                counter.textContent = String(current);
              }, 28);
            }

            skillObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.25 }
    );

    skillCards.forEach((card) => skillObserver.observe(card));
  }

  // 5. Save Contact (vCard .vcf Download)
  const saveVcardBtn = document.getElementById('save-vcard-btn');
  if (saveVcardBtn) {
    saveVcardBtn.addEventListener('click', () => {
      const vcardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Sarkar;Sayan;;;',
        'FN:Sayan Sarkar',
        'TITLE:CA Aspirant (CA Intermediate)',
        'TEL;TYPE=CELL,VOICE:+918900723156',
        'EMAIL;TYPE=INTERNET:slg.sayan06@gmail.com',
        'URL:https://www.linkedin.com/in/sayan-sarkar-03704a374',
        'ADR;TYPE=HOME:;;Siliguri;West Bengal;;734006;India',
        'NOTE:Disciplined, punctual, and detail-driven CA Aspirant skilled in Tally, MS Office, and Generative AI.',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Sayan_Sarkar_CA_Aspirant.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Contact card (vCard) downloaded!');
    });
  }

  // 6. Copy Email Button
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text && navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied: ${text}`);
        });
      }
    });
  });

  // 7. Direct Contact Form (WhatsApp & Email Dispatcher)
  const contactForm = document.getElementById('direct-contact-form');
  const sendEmailBtn = document.getElementById('send-email-btn');

  const getFormValues = () => {
    const name = document.getElementById('sender-name')?.value.trim() || 'Visitor';
    const subject = document.getElementById('sender-subject')?.value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('sender-message')?.value.trim() || '';
    return { name, subject, message };
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, subject, message } = getFormValues();
      const waText = encodeURIComponent(
        `Hello Sayan,\n\n*Name:* ${name}\n*Subject:* ${subject}\n*Message:* ${message}`
      );
      window.open(`https://wa.me/918900723156?text=${waText}`, '_blank', 'noopener');
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const { name, subject, message } = getFormValues();
      if (!message) {
        showToast('Please enter a message first.');
        return;
      }
      const mailSubject = encodeURIComponent(`${subject} — from ${name}`);
      const mailBody = encodeURIComponent(`Hello Sayan,\n\n${message}\n\nBest regards,\n${name}`);
      window.location.href = `mailto:slg.sayan06@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    });
  }

  // 8. Quick Navigation Command Modal (Ctrl + K)
  const cmdModal = document.getElementById('cmd-modal');
  const openCmdBtn = document.getElementById('open-cmd-btn');
  const closeCmdBtn = document.getElementById('close-cmd-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdItems = document.querySelectorAll('.cmd-item');

  const openCmd = () => {
    if (!cmdModal) return;
    cmdModal.classList.add('open');
    cmdModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => cmdInput?.focus(), 60);
  };

  const closeCmd = () => {
    if (!cmdModal) return;
    cmdModal.classList.remove('open');
    cmdModal.setAttribute('aria-hidden', 'true');
    if (cmdInput) cmdInput.value = '';
    cmdItems.forEach((item) => (item.style.display = 'flex'));
  };

  openCmdBtn?.addEventListener('click', openCmd);
  closeCmdBtn?.addEventListener('click', closeCmd);

  cmdModal?.addEventListener('click', (e) => {
    if (e.target === cmdModal) closeCmd();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdModal?.classList.contains('open') ? closeCmd() : openCmd();
    } else if (e.key === 'Escape' && cmdModal?.classList.contains('open')) {
      closeCmd();
    }
  });

  cmdInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    cmdItems.forEach((item) => {
      const match = item.textContent.toLowerCase().includes(query);
      item.style.display = match ? 'flex' : 'none';
    });
  });

  cmdItems.forEach((item) => {
    item.addEventListener('click', closeCmd);
  });

  // 9. Footer Live IST Clock, Year & Back to Top
  const istClock = document.getElementById('ist-clock');
  const updateClock = () => {
    if (!istClock) return;
    const now = new Date();
    istClock.textContent = now.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };
  updateClock();
  setInterval(updateClock, 1000);

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Toast helper
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
});
// CONTACT FORM CONFIGURATION
// --------------------------------------------------------------------------
// Option A: Web3Forms (Recommended: 250 free submissions/month limit)
// 1. Go to https://web3forms.com and enter your email to get a free Access Key.
// 2. Paste your Access Key inside the quotes below:
const WEB3FORMS_ACCESS_KEY = "d974a337-88c8-4abf-8e17-d85e2ad1d1b3";

// Option B: Formspree (Default Fallback: 50 free submissions/month limit)
// Paste your Formspree Form ID (e.g. "meebazkj") below:
const FORMSPREE_FORM_ID = "meebazkj";

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     Theme Toggle (Dark / Light Mode)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve theme from localStorage or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    let targetTheme = 'dark';
    if (htmlElement.getAttribute('data-theme') === 'dark') {
      targetTheme = 'light';
    }
    htmlElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  });


  /* ==========================================================================
     Mobile Navigation Menu
     ========================================================================== */
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when clicking a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ==========================================================================
     Typewriter Effect (Hero Section)
     ========================================================================== */
  const typewriterSpan = document.getElementById('typewriter');
  const words = [
    "Aspiring Software Developer",
    "Full Stack Java/Spring Boot Engineer",
    "FastAPI & AI Integration Enthusiast",
    "Problem Solver (CGPA: 9.53)"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting character
      typewriterSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      // Typing character
      typewriterSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Word completion triggers
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Go to next word
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Small delay before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Launch Typewriter
  if (typewriterSpan) {
    typeEffect();
  }


  /* ==========================================================================
     Active Link on Scroll & Element Transitions (Intersection Observer)
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  const navLinksArray = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies core viewpoint
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update active class on nav links
        navLinksArray.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Smooth scroll for logo
  const logoLink = document.querySelector('.logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Clear active nav status
      navLinksArray.forEach(link => link.classList.remove('active'));
    });
  }


  /* ==========================================================================
     Interactive Project Widget Tabs
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const widget = button.closest('.project-widget');
      const targetTabId = button.getAttribute('data-tab');

      // 1. Remove active state from all sibling buttons in this widget
      widget.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      // 2. Add active state to clicked button
      button.classList.add('active');

      // 3. Hide all tab panels in this widget
      widget.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      // 4. Show the selected panel
      const targetPanel = widget.querySelector(`#${targetTabId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });


  /* ==========================================================================
     Functional Contact Form (Web3Forms / Formspree / mailto Fallback)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      // Simple Validation
      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      // Show submitting state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

      // 1. Check if Web3Forms is configured (Recommended: Unlimited)
      if (typeof WEB3FORMS_ACCESS_KEY !== 'undefined' && WEB3FORMS_ACCESS_KEY) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: name,
            email: email,
            subject: subject,
            message: message
          })
        })
        .then(response => {
          if (response.ok) {
            showStatus('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            setTimeout(() => {
              formStatus.style.display = 'none';
            }, 6000);
          } else {
            showStatus('Oops! There was a problem submitting your form.', 'error');
          }
        })
        .catch(() => {
          showStatus('Oops! There was a connection problem. Please try again.', 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        });
        return;
      }

      // 2. Check if Formspree is configured
      if (typeof FORMSPREE_FORM_ID !== 'undefined' && FORMSPREE_FORM_ID) {
        fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
          })
        })
        .then(response => {
          if (response.ok) {
            showStatus('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            setTimeout(() => {
              formStatus.style.display = 'none';
            }, 6000);
          } else {
            showStatus('Oops! There was a problem submitting your form.', 'error');
          }
        })
        .catch(() => {
          showStatus('Oops! There was a connection problem. Please try again.', 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        });
        return;
      }

      // 3. Fallback to mailto link
      const mailtoUrl = `mailto:mogalasif2003@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
      window.location.href = mailtoUrl;
      
      showStatus('Redirecting to mail client...', 'success');
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();
      }, 1000);
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status'; // reset
    formStatus.classList.add(type);
    formStatus.style.display = 'block';
  }

});

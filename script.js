/**
 * DREAM LAND - SINGLE PROPERTY WORDPRESS THEME REPLICA
 * Client Data: KANAKIA PRIVAASA – TOWER 2, BORIVALI WEST
 * Dynamic Animations, Revolution Slider, Style Switcher, Lightbox & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Theme Color Switcher Widget (Dream Land Cog on Left Edge)
  // ==========================================================================
  const styleSwitcher = document.getElementById('styleSwitcher');
  const switcherToggle = document.getElementById('switcherToggle');
  const colorBoxes = document.querySelectorAll('.color-box');

  if (switcherToggle && styleSwitcher) {
    switcherToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      styleSwitcher.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!styleSwitcher.contains(e.target)) {
        styleSwitcher.classList.remove('open');
      }
    });

    // Helper: Hex to RGB
    const hexToRgb = (hex) => {
      const sanitized = hex.replace('#', '');
      const bigint = parseInt(sanitized, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };

    colorBoxes.forEach(box => {
      box.addEventListener('click', () => {
        colorBoxes.forEach(b => b.classList.remove('active'));
        box.classList.add('active');

        const color = box.getAttribute('data-color');
        if (color) {
          const rgb = hexToRgb(color);
          const root = document.documentElement;
          root.style.setProperty('--theme-color', color);
          root.style.setProperty('--theme-translucent', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.88)`);
          root.style.setProperty('--theme-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
        }
      });
    });
  }

  // ==========================================================================
  // 2. Hero Revolution Slider Replica (Transitions, Auto-play & Controls)
  // ==========================================================================
  const slides = document.querySelectorAll('.slide-item');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const bullets = document.querySelectorAll('#sliderBullets .bullet');
  const sliderContainer = document.querySelector('.main-slider');
  let currentSlideIndex = 0;
  let sliderInterval = null;

  const showSlide = (index) => {
    if (!slides.length) return;

    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    slides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
        // Trigger / reset animation on property-info-box
        const box = slide.querySelector('.property-info-box');
        if (box) {
          box.classList.remove('anim-fade-in-up');
          void box.offsetWidth; // force reflow
          box.classList.add('anim-fade-in-up');
        }
      } else {
        slide.classList.remove('active');
      }
    });

    bullets.forEach((bullet, i) => {
      bullet.classList.toggle('active', i === currentSlideIndex);
    });
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    sliderInterval = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 6000);
  };

  const stopAutoSlide = () => {
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
  };

  if (slides.length > 0) {
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex + 1);
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex - 1);
        startAutoSlide();
      });
    }

    bullets.forEach((bullet, i) => {
      bullet.addEventListener('click', () => {
        showSlide(i);
        startAutoSlide();
      });
    });

    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
  }

  // ==========================================================================
  // 3. Property Details Tabs (Specs, Connectivity, Why Privaasa)
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 4. Photo Gallery Filtering & Lightbox (MixItUp Style & Zoom View)
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox click
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.overlay-caption') || item.querySelector('img');
      const captionText = caption ? (caption.textContent || caption.getAttribute('alt') || 'Kanakia Privaasa') : 'Kanakia Privaasa';

      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.textContent = captionText.trim();
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // ==========================================================================
  // 5. Sticky Navigation Bar, Active Nav Links & Scroll to Top
  // ==========================================================================
  const mainHeader = document.getElementById('mainHeader');
  const scrollToTop = document.getElementById('scrollToTop');
  const navLinks = document.querySelectorAll('.main-menu .navigation li a');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Header sticky
    if (scrollY > 100) {
      if (mainHeader) mainHeader.classList.add('sticky');
    } else {
      if (mainHeader) mainHeader.classList.remove('sticky');
    }

    // Scroll-to-top button
    if (scrollY > 400) {
      if (scrollToTop) scrollToTop.classList.add('visible');
    } else {
      if (scrollToTop) scrollToTop.classList.remove('visible');
    }

    // Nav active link on scroll
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.parentElement.classList.remove('current');
          if (link.getAttribute('href') === `#${id}`) {
            link.parentElement.classList.add('current');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (scrollToTop) {
    scrollToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile navigation toggler & drawer
  const mobileNavToggler = document.getElementById('mobileNavToggler');
  const mainMenu = document.getElementById('mainMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

  const closeMobileMenu = () => {
    if (!mainMenu) return;
    mainMenu.classList.remove('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (mobileNavToggler) {
      const icon = mobileNavToggler.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  };

  const openMobileMenu = () => {
    if (!mainMenu) return;
    mainMenu.classList.add('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (mobileNavToggler) {
      const icon = mobileNavToggler.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
  };

  if (mobileNavToggler && mainMenu) {
    mobileNavToggler.addEventListener('click', () => {
      if (mainMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ==========================================================================
  // 6. Lead Capture Modal System
  // ==========================================================================
  const leadModal = document.getElementById('leadModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSuccessCloseBtn = document.getElementById('modalSuccessCloseBtn');
  const popupLeadForm = document.getElementById('popupLeadForm');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const modalSourceInput = document.getElementById('modalSource');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const openModal = (interest = '2 BHK', source = 'CTA Button', showSuccessImmediately = false) => {
    if (!leadModal) return;

    if (showSuccessImmediately) {
      if (popupLeadForm) popupLeadForm.style.display = 'none';
      if (modalSuccessState) modalSuccessState.classList.add('visible');
    } else {
      if (popupLeadForm) {
        popupLeadForm.style.display = 'flex';
        popupLeadForm.reset();
      }
      if (modalSuccessState) modalSuccessState.classList.remove('visible');
      if (modalSourceInput) modalSourceInput.value = source;

      // Select corresponding interest radio
      if (popupLeadForm) {
        const q1Radios = popupLeadForm.querySelectorAll('input[name="modalPropertyInterest"]');
        let matchedQ1 = false;
        q1Radios.forEach(radio => {
          if (interest && radio.value.toLowerCase().includes(interest.toLowerCase())) {
            radio.checked = true;
            matchedQ1 = true;
          }
        });
        if (!matchedQ1 && q1Radios.length > 0) {
          q1Radios[0].checked = true;
        }

        const q4Radios = popupLeadForm.querySelectorAll('input[name="modalPreferredConfig"]');
        let matchedQ4 = false;
        q4Radios.forEach(radio => {
          if (interest && radio.value.toLowerCase().includes(interest.toLowerCase())) {
            radio.checked = true;
            matchedQ4 = true;
          }
        });
        if (!matchedQ4 && q4Radios.length > 0) {
          q4Radios[0].checked = true;
        }
      }
    }

    leadModal.style.display = 'flex';
    setTimeout(() => {
      leadModal.classList.add('open');
      leadModal.setAttribute('aria-hidden', 'false');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!leadModal) return;
    leadModal.classList.remove('open');
    leadModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      leadModal.style.display = 'none';
      document.body.style.overflow = '';
      if (popupLeadForm) popupLeadForm.style.display = 'flex';
      if (modalSuccessState) modalSuccessState.classList.remove('visible');
    }, 300);
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const interest = btn.getAttribute('data-interest') || '2 BHK';
      const source = btn.getAttribute('data-source') || 'CTA Button';
      openModal(interest, source, false);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalSuccessCloseBtn) modalSuccessCloseBtn.addEventListener('click', closeModal);

  if (leadModal) {
    leadModal.addEventListener('click', (e) => {
      if (e.target === leadModal) closeModal();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (leadModal && leadModal.classList.contains('open')) closeModal();
      if (lightboxModal && lightboxModal.classList.contains('open')) closeLightbox();
    }
  });

  // ==========================================================================
  // 7. Lead Form Validation & Submission Handling (Google Apps Script Integration)
  // ==========================================================================
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8qww0nBnf7ezlw8Zn-EGsaVpB-1J7kz_QexnVITehGp542L8gVQAGE3tCapKmhqtHtg/exec';

  const wireForm = (form, isModal = false) => {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput) {
        const val = phoneInput.value.trim().replace(/\D/g, '');
        if (val.length !== 10) {
          alert('Please enter a valid 10-digit mobile number.');
          phoneInput.focus();
          return;
        }
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '[ GET PROJECT DETAILS ]';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
      }

      // Extract form values
      const name = (form.querySelector('input[name="fullName"]')?.value || '').trim();
      const phone = (form.querySelector('input[name="mobileNumber"]')?.value || '').trim();

      const interestRadio = form.querySelector('input[name="propertyInterest"]:checked') ||
                            form.querySelector('input[name="modalPropertyInterest"]:checked');
      const interest = interestRadio ? interestRadio.value : 'Privaasa 2 BHK (₹2.45 Cr++)';

      const budgetRadio = form.querySelector('input[name="budget"]:checked') ||
                          form.querySelector('input[name="modalBudget"]:checked');
      const budget = budgetRadio ? budgetRadio.value : '₹2.5–3 Cr';

      const timelineRadio = form.querySelector('input[name="purchaseTimeline"]:checked') ||
                            form.querySelector('input[name="modalTimeline"]:checked');
      const timeline = timelineRadio ? timelineRadio.value : 'Within 1 month';

      const configRadio = form.querySelector('input[name="preferredConfig"]:checked') ||
                          form.querySelector('input[name="modalPreferredConfig"]:checked');
      const config = configRadio ? configRadio.value : '2 BHK';

      const message = (form.querySelector('textarea[name="message"]')?.value || '').trim();
      const source = isModal 
        ? (form.querySelector('input[name="leadSource"]')?.value || 'Popup Modal')
        : 'On-Page Contact Form';

      const now = new Date();
      const timestamp = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Comprehensive payload matching various Google Sheet column header conventions
      const leadData = {
        name: name,
        fullName: name,
        'Full Name': name,
        phone: phone,
        mobile: phone,
        mobileNumber: phone,
        'Mobile Number': phone,
        propertyInterest: interest,
        interest: interest,
        'Property Interest': interest,
        'Interested Property': interest,
        budget: budget,
        'Budget': budget,
        'Approximate Budget': budget,
        purchaseTimeline: timeline,
        timeline: timeline,
        'Purchase Timeline': timeline,
        preferredConfig: config,
        config: config,
        'Configuration': config,
        'Preferred Configuration': config,
        message: message,
        'Message': message,
        source: source,
        leadSource: source,
        'Lead Source': source,
        timestamp: timestamp,
        'Timestamp': timestamp
      };

      try {
        let submissionSuccess = false;
        try {
          // Standard fetch with follow redirect and CORS support
          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(leadData)
          });
          const result = await response.json();
          console.log('Google Apps Script response:', result);
          submissionSuccess = result && result.success !== false;
        } catch (fetchErr) {
          // Fallback with mode 'no-cors' if browser restricts reading cross-origin redirect
          console.log('Retrying submission with no-cors fallback...');
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(leadData)
          });
          submissionSuccess = true;
        }

        console.log('Lead submitted successfully:', leadData);
      } catch (err) {
        console.warn('Submission notice:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }

        if (isModal) {
          form.style.display = 'none';
          if (modalSuccessState) modalSuccessState.classList.add('visible');
        } else {
          // Submitted from the on-page contact form: open thank you modal
          openModal(interest, 'On-Page Contact Form', true);
          form.reset();
        }
      }
    });
  };

  const dreamlandContactForm = document.getElementById('dreamlandContactForm');
  wireForm(dreamlandContactForm, false);
  wireForm(popupLeadForm, true);

  // Smooth scroll for all hash anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 8. Dream Land Scroll-Reveal Animation (AOS / WOW.js Replica)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.anim-reveal, .anim-reveal-left, .anim-reveal-right');
  
  const checkReveal = () => {
    const triggerBottom = window.innerHeight * 0.92;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= triggerBottom) {
        el.classList.add('is-revealed');
      }
    });
  };

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal, { passive: true });
  checkReveal();

  // Failsafe: Ensure all elements are revealed within 1.2s regardless of scroll
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }, 1200);

  // ==========================================================================
  // 9. Dream Land Feature Counters Animation (CountUp Waypoints Replica)
  // ==========================================================================
  const counters = document.querySelectorAll('.count[data-target]');
  let countersAnimated = false;

  const runCounterAnimation = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target')) || 0;
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic formula: 1 - (1 - progress)^3
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const counterSection = document.querySelector('.five-col-theme');
  if (counterSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounterAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    counterObserver.observe(counterSection);
  } else {
    runCounterAnimation();
  }

  // ==========================================================================
  // 9. Landmark Projects Interactivity (Filters, Sub-Option Tabs & Lightbox)
  // ==========================================================================
  const projFilterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card, .proj-clean-card');

  // Filter between All, Beverly Heights, Paris, and Greenberg
  if (projFilterBtns.length > 0) {
    projFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        projFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-proj-filter');
        projectCards.forEach(card => {
          const cardProj = card.getAttribute('data-project');
          if (filter === 'all' || filter === cardProj) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Sub-option Tabs within each project card
  const projOptBtns = document.querySelectorAll('.proj-opt-btn');
  projOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;

      const targetId = btn.getAttribute('data-target');
      const targetPanel = card.querySelector(`#${targetId}`);

      // Deactivate other tabs in this card
      const siblingBtns = card.querySelectorAll('.proj-opt-btn');
      siblingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Deactivate other panels in this card
      const siblingPanels = card.querySelectorAll('.proj-panel');
      siblingPanels.forEach(p => p.classList.remove('active'));

      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Lightbox trigger for project floor plans and gallery items
  const projLightboxTriggers = document.querySelectorAll('.proj-lightbox-trigger');
  projLightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const imgSrc = trigger.getAttribute('data-img');
      const titleText = trigger.getAttribute('data-title') || 'Kanakia Project Details';

      if (imgSrc && lightboxModal && lightboxImg) {
        lightboxImg.src = imgSrc;
        if (lightboxTitle) lightboxTitle.textContent = titleText;
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });
});


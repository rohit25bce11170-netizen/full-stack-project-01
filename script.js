/**
 * ============================================================================
 * DECODELABS PROJECT 1 – ARTISANCRAFT STUDIO HUB
 * Core Vanilla JavaScript Logic (No Frameworks)
 * Standards: Modular ES6+, Accessible State Management, Live DOM Updates
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CENTRAL APPLICATION STATE
     -------------------------------------------------------------------------- */
  const state = {
    searchQuery: '',
    selectedDisciplines: new Set(['pottery', 'woodcraft', 'printmaking', 'leather', 'glass']),
    selectedLevel: 'all',
    maxPrice: 150,
    sortBy: 'featured',
    bookmarkedIds: new Set(JSON.parse(localStorage.getItem('artisan_bookmarks') || '[]')),
    isNavOpen: false
  };

  /* --------------------------------------------------------------------------
     2. DOM ELEMENTS CACHE
     -------------------------------------------------------------------------- */
  // Navigation elements
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Search & Filter elements
  const heroSearchForm = document.getElementById('hero-search-form');
  const heroSearchInput = document.getElementById('hero-search-input');
  const categoryChips = document.querySelectorAll('.category-chips .chip');
  const disciplineCheckboxes = document.querySelectorAll('input[name="discipline"]');
  const levelRadios = document.querySelectorAll('input[name="level"]');
  const priceRangeInput = document.getElementById('price-range-input');
  const priceOutput = document.getElementById('price-output');
  const sortSelect = document.getElementById('sort-select');
  const btnResetFilters = document.getElementById('btn-reset-filters');
  const btnResetSecondary = document.getElementById('btn-reset-filters-secondary');
  const btnApplyMobileFilters = document.getElementById('btn-apply-mobile-filters');

  // Catalog grid & cards
  const workshopGrid = document.getElementById('workshop-grid');
  const workshopCards = Array.from(document.querySelectorAll('.workshop-card'));
  const resultsCount = document.getElementById('results-count');
  const noResultsMsg = document.getElementById('no-results-msg');

  // Forms & Modal
  const mainReservationForm = document.getElementById('main-reservation-form');
  const formSuccessBanner = document.getElementById('form-success-banner');
  const bookingModal = document.getElementById('booking-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalForm = document.getElementById('modal-reservation-form');
  const modalWorkshopName = document.getElementById('modal-workshop-name');
  const modalWorkshopRate = document.getElementById('modal-workshop-rate');
  const toastRegion = document.getElementById('toast-region');

  /* --------------------------------------------------------------------------
     3. TOAST NOTIFICATION DISPATCHER (Accessible ARIA Live)
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    if (!toastRegion) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    const icon = type === 'success' ? '✓' : type === 'error' ? '⚠' : '✦';
    toast.innerHTML = `<span aria-hidden="true" style="color: var(--color-ethereal-blue); font-weight: bold;">${icon}</span> <span>${message}</span>`;

    toastRegion.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     4. MOBILE HAMBURGER NAVIGATION & ACCESSIBILITY
     -------------------------------------------------------------------------- */
  function toggleMobileNav(forceClose = false) {
    if (!navToggleBtn || !primaryNav) return;

    state.isNavOpen = forceClose ? false : !state.isNavOpen;
    navToggleBtn.setAttribute('aria-expanded', String(state.isNavOpen));
    navToggleBtn.classList.toggle('is-active', state.isNavOpen);
    primaryNav.classList.toggle('is-open', state.isNavOpen);

    // Lock background scrolling on mobile when open
    document.body.style.overflow = state.isNavOpen && window.innerWidth < 768 ? 'hidden' : '';
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', () => toggleMobileNav());
  }

  // Close mobile drawer when any navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (state.isNavOpen) toggleMobileNav(true);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isNavOpen) {
      toggleMobileNav(true);
      navToggleBtn.focus();
    }
  });

  // Handle window resize cleanup
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && state.isNavOpen) {
      toggleMobileNav(true);
    }
  });

  /* --------------------------------------------------------------------------
     5. ACTIVE NAVIGATION SPY (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const trackedSections = document.querySelectorAll('section[id], aside[id], footer[id]');
  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              navLinks.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
              });
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            }
          });
        }
      });
    }, observerOptions);

    trackedSections.forEach(sec => navObserver.observe(sec));
  }

  /* --------------------------------------------------------------------------
     6. CORE FILTERING & SORTING LOGIC
     -------------------------------------------------------------------------- */
  function applyFiltersAndSort() {
    let visibleCount = 0;

    workshopCards.forEach(card => {
      const discipline = card.dataset.discipline;
      const level = card.dataset.level;
      const price = parseFloat(card.dataset.price);
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';

      // Check discipline filter
      const matchesDiscipline = state.selectedDisciplines.has(discipline);

      // Check skill level filter
      const matchesLevel = state.selectedLevel === 'all' || level.toLowerCase() === state.selectedLevel.toLowerCase();

      // Check maximum price filter
      const matchesPrice = price <= state.maxPrice;

      // Check keyword search query
      const matchesSearch = !state.searchQuery || 
                            title.includes(state.searchQuery) || 
                            desc.includes(state.searchQuery) || 
                            discipline.includes(state.searchQuery);

      const isVisible = matchesDiscipline && matchesLevel && matchesPrice && matchesSearch;

      if (isVisible) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Handle sort ordering of visible cards
    sortCards();

    // Update results indicator
    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} curated masterclass${visibleCount === 1 ? '' : 'es'}`;
    }

    // Toggle No Results card
    if (noResultsMsg) {
      noResultsMsg.classList.toggle('hidden', visibleCount > 0);
    }
  }

  function sortCards() {
    if (!workshopGrid) return;

    const cardsArray = Array.from(workshopCards);

    cardsArray.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);
      const durationA = parseFloat(a.dataset.duration);
      const durationB = parseFloat(b.dataset.duration);

      switch (state.sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'duration':
          return durationA - durationB;
        case 'featured':
        default:
          return a.id.localeCompare(b.id);
      }
    });

    // Re-append sorted nodes to grid
    cardsArray.forEach(card => workshopGrid.appendChild(card));
  }

  /* --------------------------------------------------------------------------
     7. FILTER CONTROLS EVENT HANDLERS
     -------------------------------------------------------------------------- */
  // 1. Hero Search Input
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.searchQuery = heroSearchInput.value.trim().toLowerCase();
      applyFiltersAndSort();
      const catalog = document.getElementById('catalog-section');
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      applyFiltersAndSort();
    });
  }

  // 2. Quick Category Filter Chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');

      const filterVal = chip.dataset.filter;

      if (filterVal === 'all') {
        state.selectedDisciplines = new Set(['pottery', 'woodcraft', 'printmaking', 'leather', 'glass']);
        disciplineCheckboxes.forEach(cb => cb.checked = true);
      } else {
        state.selectedDisciplines = new Set([filterVal]);
        disciplineCheckboxes.forEach(cb => {
          cb.checked = (cb.value === filterVal);
        });
      }

      applyFiltersAndSort();
    });
  });

  // 3. Sidebar Discipline Checkboxes
  disciplineCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        state.selectedDisciplines.add(cb.value);
      } else {
        state.selectedDisciplines.delete(cb.value);
      }

      // Sync chips state
      categoryChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      if (state.selectedDisciplines.size === 5) {
        const allChip = document.querySelector('.category-chips [data-filter="all"]');
        if (allChip) {
          allChip.classList.add('active');
          allChip.setAttribute('aria-pressed', 'true');
        }
      }

      applyFiltersAndSort();
    });
  });

  // 4. Skill Level Radios
  levelRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        state.selectedLevel = radio.value;
        applyFiltersAndSort();
      }
    });
  });

  // 5. Price Range Slider
  if (priceRangeInput && priceOutput) {
    priceRangeInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.maxPrice = val;
      priceOutput.textContent = `Up to $${val}`;
      applyFiltersAndSort();
    });
  }

  // 6. Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndSort();
    });
  }

  // 7. Reset Filters Handlers
  function resetAllFilters() {
    state.searchQuery = '';
    state.selectedDisciplines = new Set(['pottery', 'woodcraft', 'printmaking', 'leather', 'glass']);
    state.selectedLevel = 'all';
    state.maxPrice = 150;
    state.sortBy = 'featured';

    if (heroSearchInput) heroSearchInput.value = '';
    if (priceRangeInput) priceRangeInput.value = '150';
    if (priceOutput) priceOutput.textContent = 'Up to $150';
    if (sortSelect) sortSelect.value = 'featured';

    disciplineCheckboxes.forEach(cb => cb.checked = true);
    levelRadios.forEach(radio => radio.checked = (radio.value === 'all'));

    categoryChips.forEach(c => {
      const isAll = c.dataset.filter === 'all';
      c.classList.toggle('active', isAll);
      c.setAttribute('aria-pressed', String(isAll));
    });

    applyFiltersAndSort();
    showToast('Filters have been reset to default.', 'info');
  }

  if (btnResetFilters) btnResetFilters.addEventListener('click', resetAllFilters);
  if (btnResetSecondary) btnResetSecondary.addEventListener('click', resetAllFilters);
  if (btnApplyMobileFilters) {
    btnApplyMobileFilters.addEventListener('click', () => {
      const catalog = document.getElementById('catalog-section');
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     8. INTERACTIVE WORKSHOP BOOKMARKS
     -------------------------------------------------------------------------- */
  function initializeBookmarks() {
    const bookmarkButtons = document.querySelectorAll('.btn-bookmark');
    bookmarkButtons.forEach(btn => {
      const cardId = btn.dataset.id;
      const isBookmarked = state.bookmarkedIds.has(cardId);

      btn.classList.toggle('bookmarked', isBookmarked);
      btn.setAttribute('aria-pressed', String(isBookmarked));

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardTitle = btn.closest('.workshop-card')?.querySelector('.card-title')?.textContent || 'Workshop';

        if (state.bookmarkedIds.has(cardId)) {
          state.bookmarkedIds.delete(cardId);
          btn.classList.remove('bookmarked');
          btn.setAttribute('aria-pressed', 'false');
          showToast(`Removed "${cardTitle}" from bookmarks.`, 'info');
        } else {
          state.bookmarkedIds.add(cardId);
          btn.classList.add('bookmarked');
          btn.setAttribute('aria-pressed', 'true');
          showToast(`Saved "${cardTitle}" to your favorites!`, 'success');
        }

        localStorage.setItem('artisan_bookmarks', JSON.stringify(Array.from(state.bookmarkedIds)));
      });
    });
  }
  initializeBookmarks();

  /* --------------------------------------------------------------------------
     9. QUICK CARD RESERVATION MODAL (<dialog>)
     -------------------------------------------------------------------------- */
  const openModalButtons = document.querySelectorAll('.btn-open-modal');

  // Set min attribute for date inputs to today
  const todayStr = new Date().toISOString().split('T')[0];
  const dateInputMain = document.getElementById('res-date');
  const dateInputModal = document.getElementById('modal-date');
  if (dateInputMain) dateInputMain.min = todayStr;
  if (dateInputModal) dateInputModal.min = todayStr;

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.workshopTitle || 'Artisan Workshop';
      const price = btn.dataset.workshopPrice || '85';

      if (modalWorkshopName) modalWorkshopName.textContent = title;
      if (modalWorkshopRate) modalWorkshopRate.textContent = `$${price} per seat • All materials included`;

      // Pre-select in main form as well
      const resWorkshopSelect = document.getElementById('res-workshop');
      if (resWorkshopSelect) {
        for (let i = 0; i < resWorkshopSelect.options.length; i++) {
          if (resWorkshopSelect.options[i].text.includes(title)) {
            resWorkshopSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (bookingModal && typeof bookingModal.showModal === 'function') {
        bookingModal.showModal();
        const firstInput = bookingModal.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    });
  });

  if (btnCloseModal && bookingModal) {
    btnCloseModal.addEventListener('click', () => bookingModal.close());
  }

  // Backdrop click closes dialog
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      const rect = bookingModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        bookingModal.close();
      }
    });
  }

  // Modal Form Submit Validation
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('modal-name');
      const emailInput = document.getElementById('modal-email');
      const dateInput = document.getElementById('modal-date');
      const nameError = document.getElementById('modal-name-error');
      const emailError = document.getElementById('modal-email-error');
      const dateError = document.getElementById('modal-date-error');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please provide your full name (minimum 2 letters).';
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        nameError.textContent = '';
        nameInput.classList.remove('is-invalid');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please provide a valid email address.';
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else {
        emailError.textContent = '';
        emailInput.classList.remove('is-invalid');
      }

      // Validate date
      if (!dateInput.value) {
        dateError.textContent = 'Please choose a preferred workshop date.';
        dateInput.classList.add('is-invalid');
        isValid = false;
      } else {
        dateError.textContent = '';
        dateInput.classList.remove('is-invalid');
      }

      if (isValid) {
        bookingModal.close();
        modalForm.reset();
        showToast('Reservation confirmed! Confirmation sent to your email.', 'success');
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. MAIN RESERVATION FORM VALIDATION (Comprehensive Real-Time Feedback)
     -------------------------------------------------------------------------- */
  if (mainReservationForm) {
    const inputName = document.getElementById('res-name');
    const inputEmail = document.getElementById('res-email');
    const selectWorkshop = document.getElementById('res-workshop');
    const inputDate = document.getElementById('res-date');
    const inputGuests = document.getElementById('res-guests');

    const errorName = document.getElementById('name-error');
    const errorEmail = document.getElementById('email-error');
    const errorWorkshop = document.getElementById('workshop-error');
    const errorDate = document.getElementById('date-error');
    const errorGuests = document.getElementById('guests-error');

    // Validation rules
    function validateName() {
      const val = inputName.value.trim();
      if (!val) {
        showFieldError(inputName, errorName, 'Full name is required.');
        return false;
      }
      if (val.length < 3) {
        showFieldError(inputName, errorName, 'Name must be at least 3 characters long.');
        return false;
      }
      clearFieldError(inputName, errorName);
      return true;
    }

    function validateEmail() {
      const val = inputEmail.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!val) {
        showFieldError(inputEmail, errorEmail, 'Email address is required.');
        return false;
      }
      if (!emailPattern.test(val)) {
        showFieldError(inputEmail, errorEmail, 'Please enter a valid email address (e.g., name@example.com).');
        return false;
      }
      clearFieldError(inputEmail, errorEmail);
      return true;
    }

    function validateWorkshop() {
      if (!selectWorkshop.value) {
        showFieldError(selectWorkshop, errorWorkshop, 'Please select a workshop from the directory.');
        return false;
      }
      clearFieldError(selectWorkshop, errorWorkshop);
      return true;
    }

    function validateDate() {
      const val = inputDate.value;
      if (!val) {
        showFieldError(inputDate, errorDate, 'Please select your preferred workshop date.');
        return false;
      }
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        showFieldError(inputDate, errorDate, 'Selected date cannot be in the past.');
        return false;
      }
      clearFieldError(inputDate, errorDate);
      return true;
    }

    function validateGuests() {
      const val = parseInt(inputGuests.value, 10);
      if (isNaN(val) || val < 1 || val > 4) {
        showFieldError(inputGuests, errorGuests, 'Guest count must be between 1 and 4 seats.');
        return false;
      }
      clearFieldError(inputGuests, errorGuests);
      return true;
    }

    function showFieldError(inputElem, errorElem, message) {
      inputElem.classList.add('is-invalid');
      inputElem.setAttribute('aria-invalid', 'true');
      errorElem.textContent = message;
    }

    function clearFieldError(inputElem, errorElem) {
      inputElem.classList.remove('is-invalid');
      inputElem.removeAttribute('aria-invalid');
      errorElem.textContent = '';
    }

    // Live validation on blur
    inputName.addEventListener('blur', validateName);
    inputEmail.addEventListener('blur', validateEmail);
    selectWorkshop.addEventListener('change', validateWorkshop);
    inputDate.addEventListener('change', validateDate);
    inputGuests.addEventListener('input', validateGuests);

    // Form Submission
    mainReservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isWorkshopValid = validateWorkshop();
      const isDateValid = validateDate();
      const isGuestsValid = validateGuests();

      if (isNameValid && isEmailValid && isWorkshopValid && isDateValid && isGuestsValid) {
        // Successful reservation state
        if (formSuccessBanner) {
          formSuccessBanner.classList.remove('hidden');
          formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        showToast(`Reservation submitted for ${inputName.value.trim()}!`, 'success');

        // Reset form inputs after brief delay
        mainReservationForm.reset();
        if (dateInputMain) dateInputMain.min = todayStr;

        // Auto-dismiss success banner after 8 seconds
        setTimeout(() => {
          if (formSuccessBanner) formSuccessBanner.classList.add('hidden');
        }, 8000);
      } else {
        // Focus first invalid element
        const firstInvalid = mainReservationForm.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        showToast('Please correct the highlighted form errors before submitting.', 'error');
      }
    });
  }

  console.log('ArtisanCraft Vanilla JS initialized with complete state management and accessible validation.');
});

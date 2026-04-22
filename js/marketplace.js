/**
 * ============================================================================
 * lvlBase - Marketplace & Plugin Controller
 * ============================================================================
 * Handles advanced real-time DOM filtering (by category, text, and pricing),
 * modal injection and animation, and mock installation states.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Elements ---
    const searchInput = document.getElementById('plugin-search');
    const searchTags = document.querySelectorAll('.tag-pill');
    const categoryBtns = document.querySelectorAll('.filter-btn');
    const checkboxes = document.querySelectorAll('.custom-checkbox input');
    const pluginCards = document.querySelectorAll('.plugin-card');
    
    // Modal Elements
    const modal = document.getElementById('plugin-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const installBtn = document.getElementById('modal-install-btn');
    const viewBtns = document.querySelectorAll('.view-details');

    // --- State ---
    let currentFilters = {
        text: '',
        category: 'all',
        pricing: ['free', 'paid'],
        developer: ['official', 'verified']
    };

    /**
     * 1. Core Filtering Engine
     */
    const applyFilters = () => {
        let visibleCount = 0;

        pluginCards.forEach(card => {
            const cardTitle = card.querySelector('h3').innerText.toLowerCase();
            const cardDesc = card.querySelector('p').innerText.toLowerCase();
            const cardCategory = card.getAttribute('data-category');
            const cardPrice = card.getAttribute('data-price'); // 'free' or 'paid'
            const cardDev = card.getAttribute('data-developer'); // 'official' or 'verified'

            // Check Text
            const matchesText = currentFilters.text === '' || 
                                cardTitle.includes(currentFilters.text) || 
                                cardDesc.includes(currentFilters.text);
            
            // Check Category
            const matchesCategory = currentFilters.category === 'all' || 
                                    cardCategory === currentFilters.category;
            
            // Check Checkboxes (Pricing & Dev Status)
            const matchesPricing = currentFilters.pricing.includes(cardPrice);
            const matchesDev = currentFilters.developer.includes(cardDev);

            // Execute Visibility
            if (matchesText && matchesCategory && matchesPricing && matchesDev) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Trigger reflow for grid masonry if needed
        if (lvlBaseCore && visibleCount === 0) {
            lvlBaseCore.log('warn', 'No plugins matched the current filter criteria.');
        }
    };

    /**
     * 2. Event Listeners for Filters
     */
    
    // Text Search
    searchInput.addEventListener('input', (e) => {
        currentFilters.text = e.target.value.toLowerCase();
        applyFilters();
    });

    // Tag Pills (Quick Search)
    searchTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filterVal = tag.getAttribute('data-filter');
            // If it's a category, switch category, else put in text
            if (['education', 'gamification'].includes(filterVal)) {
                // Find and click the corresponding category button
                const targetCatBtn = document.querySelector(`.filter-btn[data-category="${filterVal}"]`);
                if (targetCatBtn) targetCatBtn.click();
                searchInput.value = '';
                currentFilters.text = '';
            } else {
                searchInput.value = filterVal;
                currentFilters.text = filterVal.toLowerCase();
                applyFilters();
            }
        });
    });

    // Category Sidebar
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state visually
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update state and filter
            currentFilters.category = btn.getAttribute('data-category');
            applyFilters();
        });
    });

    // Checkboxes (Pricing & Dev)
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Rebuild arrays based on checked state
            const checkedPrices = Array.from(document.querySelectorAll('input[value="free"]:checked, input[value="paid"]:checked')).map(cb => cb.value);
            const checkedDevs = Array.from(document.querySelectorAll('input[value="official"]:checked, input[value="verified"]:checked')).map(cb => cb.value);
            
            currentFilters.pricing = checkedPrices;
            currentFilters.developer = checkedDevs;
            
            applyFilters();
        });
    });

    /**
     * 3. Modal Controller (View App Details)
     */
    const openModal = (card) => {
        // Scrape data from the clicked card
        const title = card.querySelector('h3').innerText;
        const desc = card.querySelector('p').innerText;
        const devNameHtml = card.querySelector('.dev-name').innerHTML;
        const iconHtml = card.querySelector('.plugin-icon').innerHTML;
        const iconBg = card.querySelector('.plugin-icon').style.background;
        const priceHtml = card.querySelector('.plugin-price').outerHTML;
        const ratingText = card.querySelector('.rating-mini').innerText;
        const isOfficial = card.getAttribute('data-developer') === 'official';

        // Populate Modal
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-desc-text').innerText = desc + " This plugin integrates seamlessly into the lvlBase architecture. Configurable via the Admin settings panel post-installation.";
        document.getElementById('modal-dev').innerHTML = devNameHtml;
        
        const modalIcon = document.getElementById('modal-icon');
        modalIcon.innerHTML = iconHtml;
        modalIcon.style.background = iconBg;

        document.getElementById('modal-price').outerHTML = `<span class="price-tag" id="modal-price">${priceHtml}</span>`;
        document.getElementById('modal-rating').innerText = ratingText;

        const badge = document.getElementById('modal-badge');
        if (isOfficial) {
            badge.style.display = 'inline-block';
            badge.innerText = 'Official Core';
            badge.className = 'badge official-badge';
        } else {
            badge.style.display = 'inline-block';
            badge.innerText = 'Verified 3rd Party';
            badge.className = 'badge new-badge';
        }

        // Reset Install Button State
        installBtn.innerHTML = `<span>Install Module</span>`;
        installBtn.style.background = '';
        installBtn.style.color = '';
        installBtn.style.pointerEvents = 'auto';

        // Open Modal visually
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        modal.classList.add('open');
    };

    const closeModal = () => {
        modal.classList.remove('open');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300); // Wait for transition
    };

    // Attach listeners to all "View" buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find the parent bento card
            const card = e.target.closest('.plugin-card');
            openModal(card);
        });
    });

    // Handle Featured Install/View
    const featuredInstall = document.querySelector('.featured-plugin .install-btn');
    if (featuredInstall) {
        featuredInstall.addEventListener('click', () => {
            // Simulate opening modal for featured app
            const mockCard = document.createElement('div');
            mockCard.innerHTML = `
                <h3>Advanced RPG Combat Engine v3.0</h3>
                <p>Replaces standard XP bars with a fully interactive 3D skill tree. Allow students or employees to form 'Guilds' and battle over weekly KPIs.</p>
                <span class="dev-name">By lvlBase Core <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent-primary)"><path d="M12 2L3 7l9 5 9-5-9-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></span>
                <div class="plugin-icon" style="background: var(--accent-purple);"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
                <div class="plugin-price free-text">Included</div>
                <div class="rating-mini">⭐ 4.9</div>
            `;
            mockCard.setAttribute('data-developer', 'official');
            openModal(mockCard);
        });
    }

    // Modal Close Triggers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Click on backdrop
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    /**
     * 4. Mock Installation Logic
     */
    installBtn.addEventListener('click', () => {
        // UI Loading State
        installBtn.innerHTML = `<span class="pulse-dot" style="background:#000; margin:0 auto;"></span>`;
        installBtn.style.pointerEvents = 'none';

        // Simulate Network Delay for "Installation"
        setTimeout(() => {
            installBtn.innerHTML = `<span>Installed</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            installBtn.style.background = 'var(--bg-surface)';
            installBtn.style.color = 'var(--text-primary)';
            installBtn.style.border = '1px solid var(--accent-primary)';
            
            if (lvlBaseCore) {
                lvlBaseCore.log('info', 'Plugin successfully deployed to current tenant node.');
            }
        }, 1500);
    });

    /**
     * 5. Initialize Entrance Animations
     */
    const initEntranceAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                    el.style.opacity = '1';
                    
                    if (el.classList.contains('plugin-card') || el.classList.contains('featured-plugin')) {
                        el.style.transform = 'translateY(0) scale(1)';
                    } else {
                        el.style.transform = 'translateY(0)';
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.05 });

        // Pre-set states
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            if (el.classList.contains('plugin-card') || el.classList.contains('featured-plugin')) {
                el.style.transform = 'translateY(30px) scale(0.95)';
            } else {
                el.style.transform = 'translateY(30px)';
            }
            scrollObserver.observe(el);
        });
    };

    if (lvlBaseCore) lvlBaseCore.log('info', 'Marketplace Storefront Engine initialized.');
    initEntranceAnimations();
});
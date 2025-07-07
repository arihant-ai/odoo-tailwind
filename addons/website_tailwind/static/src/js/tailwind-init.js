/* Tailwind CSS Initialization for Odoo Frontend */

(function() {
    'use strict';

    // Initialize Tailwind CSS integration
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Tailwind CSS integration initialized');
        
        // Add Tailwind CSS classes to body for identification
        document.body.classList.add('tailwind-enabled');
        
        // Initialize responsive utilities
        initResponsiveUtilities();
        
        // Initialize component interactions
        initComponentInteractions();
        
        // Initialize accessibility features
        initAccessibilityFeatures();
    });

    /**
     * Initialize responsive utilities
     */
    function initResponsiveUtilities() {
        // Add viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1';
            document.head.appendChild(viewport);
        }

        // Handle responsive classes dynamically
        window.addEventListener('resize', debounce(handleResponsiveClasses, 250));
        handleResponsiveClasses();
    }

    /**
     * Handle responsive classes based on screen size
     */
    function handleResponsiveClasses() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Remove existing breakpoint classes
        body.classList.remove('tw-xs', 'tw-sm', 'tw-md', 'tw-lg', 'tw-xl', 'tw-2xl');
        
        // Add current breakpoint class
        if (width >= 1400) {
            body.classList.add('tw-2xl');
        } else if (width >= 1200) {
            body.classList.add('tw-xl');
        } else if (width >= 992) {
            body.classList.add('tw-lg');
        } else if (width >= 768) {
            body.classList.add('tw-md');
        } else if (width >= 576) {
            body.classList.add('tw-sm');
        } else {
            body.classList.add('tw-xs');
        }
    }

    /**
     * Initialize component interactions
     */
    function initComponentInteractions() {
        // Initialize dropdown interactions
        initDropdowns();
        
        // Initialize modal interactions
        initModals();
        
        // Initialize tooltip interactions
        initTooltips();
        
        // Initialize tab interactions
        initTabs();
    }

    /**
     * Initialize dropdown functionality
     */
    function initDropdowns() {
        const dropdowns = document.querySelectorAll('[data-tw-dropdown]');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('[data-tw-dropdown-trigger]');
            const menu = dropdown.querySelector('[data-tw-dropdown-menu]');
            
            if (trigger && menu) {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    closeAllDropdowns();
                    
                    // Toggle current dropdown
                    menu.classList.toggle('hidden');
                    trigger.setAttribute('aria-expanded', !menu.classList.contains('hidden'));
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', closeAllDropdowns);
    }

    /**
     * Close all open dropdowns
     */
    function closeAllDropdowns() {
        const openMenus = document.querySelectorAll('[data-tw-dropdown-menu]:not(.hidden)');
        openMenus.forEach(menu => {
            menu.classList.add('hidden');
            const trigger = menu.parentElement.querySelector('[data-tw-dropdown-trigger]');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Initialize modal functionality
     */
    function initModals() {
        const modalTriggers = document.querySelectorAll('[data-tw-modal-target]');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-tw-modal-target');
                const modal = document.getElementById(targetId);
                
                if (modal) {
                    showModal(modal);
                }
            });
        });

        // Close modal when clicking backdrop or close button
        document.addEventListener('click', function(e) {
            if (e.target.hasAttribute('data-tw-modal-close') || 
                e.target.classList.contains('tw-modal-backdrop')) {
                const modal = e.target.closest('[data-tw-modal]');
                if (modal) {
                    hideModal(modal);
                }
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('[data-tw-modal]:not(.hidden)');
                if (openModal) {
                    hideModal(openModal);
                }
            }
        });
    }

    /**
     * Show modal
     */
    function showModal(modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // Focus first focusable element
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
            focusable.focus();
        }
    }

    /**
     * Hide modal
     */
    function hideModal(modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    /**
     * Initialize tooltip functionality
     */
    function initTooltips() {
        const tooltips = document.querySelectorAll('[data-tw-tooltip]');
        
        tooltips.forEach(element => {
            const content = element.getAttribute('data-tw-tooltip');
            const position = element.getAttribute('data-tw-tooltip-position') || 'top';
            
            element.addEventListener('mouseenter', function() {
                showTooltip(this, content, position);
            });
            
            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }

    /**
     * Show tooltip
     */
    function showTooltip(element, content, position) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tw-tooltip absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg';
        tooltip.textContent = content;
        tooltip.id = 'tw-tooltip';
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'bottom':
                top = rect.bottom + 5;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 5;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 5;
                break;
            default: // top
                top = rect.top - tooltipRect.height - 5;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
        }
        
        tooltip.style.top = top + window.scrollY + 'px';
        tooltip.style.left = left + window.scrollX + 'px';
    }

    /**
     * Hide tooltip
     */
    function hideTooltip() {
        const tooltip = document.getElementById('tw-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Initialize tab functionality
     */
    function initTabs() {
        const tabGroups = document.querySelectorAll('[data-tw-tabs]');
        
        tabGroups.forEach(group => {
            const tabs = group.querySelectorAll('[data-tw-tab]');
            const panels = group.querySelectorAll('[data-tw-tab-panel]');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('data-tw-tab');
                    
                    // Deactivate all tabs and panels
                    tabs.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.add('hidden'));
                    
                    // Activate current tab and panel
                    this.classList.add('active');
                    const targetPanel = group.querySelector(`[data-tw-tab-panel="${targetId}"]`);
                    if (targetPanel) {
                        targetPanel.classList.remove('hidden');
                    }
                });
            });
        });
    }

    /**
     * Initialize accessibility features
     */
    function initAccessibilityFeatures() {
        // Add focus-visible polyfill behavior
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Enhance form accessibility
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                    const label = form.querySelector(`label[for="${input.id}"]`);
                    if (label) {
                        input.setAttribute('aria-labelledby', label.id || 'label-' + input.id);
                        if (!label.id) {
                            label.id = 'label-' + input.id;
                        }
                    }
                }
            });
        });
    }

    /**
     * Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Export utilities for global use
    window.TailwindOdoo = {
        showModal: showModal,
        hideModal: hideModal,
        showTooltip: showTooltip,
        hideTooltip: hideTooltip,
        closeAllDropdowns: closeAllDropdowns
    };

})();

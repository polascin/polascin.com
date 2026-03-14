/**
 * Cookie Consent Manager with Google Consent Mode v2 Support
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'cookie_consent';
    const CONSENT_DEFAULTS = {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        personalization_storage: 'denied',
        functionality_storage: 'granted', // Usually strictly necessary
        security_storage: 'granted'      // Strictly necessary
    };

    // UI Templates
    const bannerHTML = `
        <div id="cookie-banner" class="cookie-banner" role="dialog" aria-modal="true" aria-labelledby="cookie-heading">
            <div class="cookie-content">
                <h3 id="cookie-heading">We value your privacy</h3>
                <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <a href="privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a></p>
            </div>
            <div class="cookie-actions">
                <button id="cookie-preferences" class="btn btn-secondary btn-sm">Preferences</button>
                <button id="cookie-reject" class="btn btn-secondary btn-sm">Reject All</button>
                <button id="cookie-accept" class="btn btn-primary btn-sm">Accept All</button>
            </div>
        </div>
    `;

    const preferencesModalHTML = `
        <div id="cookie-modal" class="cookie-modal" role="dialog" aria-modal="true" aria-hidden="true">
            <div class="cookie-modal-overlay"></div>
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h3>Cookie Preferences</h3>
                    <button id="cookie-modal-close" class="cookie-close" aria-label="Close">×</button>
                </div>
                <div class="cookie-modal-body">
                    <p>Customize your cookie preferences below. Essential cookies are always active.</p>
                    
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <label class="toggle-switch disabled">
                                <input type="checkbox" checked disabled>
                                <span class="slider"></span>
                            </label>
                            <span class="cookie-type">Strictly Necessary</span>
                        </div>
                        <p class="cookie-desc">Required for the website to function properly (e.g., saving these settings).</p>
                    </div>

                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <label class="toggle-switch">
                                <input type="checkbox" id="consent-analytics">
                                <span class="slider"></span>
                            </label>
                            <span class="cookie-type">Analytics</span>
                        </div>
                        <p class="cookie-desc">Helps us understand how you use the site so we can improve it (Google Analytics).</p>
                    </div>

                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <label class="toggle-switch">
                                <input type="checkbox" id="consent-marketing">
                                <span class="slider"></span>
                            </label>
                            <span class="cookie-type">Marketing</span>
                        </div>
                        <p class="cookie-desc">Used to deliver advertisements more relevant to you and your interests.</p>
                    </div>
                </div>
                <div class="cookie-modal-footer">
                    <button id="cookie-save-preferences" class="btn btn-primary">Save Preferences</button>
                </div>
            </div>
        </div>
    `;

    class CookieConsent {
        constructor() {
            this.consent = this.loadConsent();
            this.init();
        }

        init() {
            // Check if consent is already set
            if (!this.consent) {
                this.renderUI();
                this.updateGtmConsent(CONSENT_DEFAULTS); // Ensure defaults are enforced
            } else {
                this.updateGtmConsent(this.consent);
                // Optionally add a "Revisit Settings" button to footer if needed
                this.addRevisitButton();
            }
        }

        loadConsent() {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                return saved ? JSON.parse(saved) : null;
            } catch (error) {
                return null;
            }
        }

        saveConsent(consentState) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(consentState));
            } catch (error) {
                // If storage is unavailable, still apply consent for this session.
            }
            this.updateGtmConsent(consentState);
            this.removeUI();
            this.addRevisitButton();
        }

        updateGtmConsent(consentState) {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', consentState);

                // Fire a custom event to signal consent update to GTM triggers
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'consent_update',
                    'consent_status': consentState
                });

                // Silent in production.
            }
        }

        renderUI() {
            if (document.getElementById('cookie-banner')) return;

            document.body.insertAdjacentHTML('beforeend', bannerHTML);
            document.body.insertAdjacentHTML('beforeend', preferencesModalHTML);

            this.bindEvents();
        }

        removeUI() {
            const banner = document.getElementById('cookie-banner');
            const modal = document.getElementById('cookie-modal');
            if (banner) banner.remove();
            if (modal) modal.remove();
        }

        bindEvents() {
            // Banner Buttons
            document.getElementById('cookie-accept').addEventListener('click', () => this.acceptAll());
            document.getElementById('cookie-reject').addEventListener('click', () => this.rejectAll());
            document.getElementById('cookie-preferences').addEventListener('click', () => this.showModal());

            // Modal Buttons
            document.getElementById('cookie-modal-close').addEventListener('click', () => this.hideModal());
            document.querySelector('.cookie-modal-overlay').addEventListener('click', () => this.hideModal());
            document.getElementById('cookie-save-preferences').addEventListener('click', () => this.savePreferences());
        }

        showModal() {
            document.getElementById('cookie-modal').setAttribute('aria-hidden', 'false');
            document.getElementById('cookie-modal').classList.add('visible');
        }

        hideModal() {
            document.getElementById('cookie-modal').setAttribute('aria-hidden', 'true');
            document.getElementById('cookie-modal').classList.remove('visible');
        }

        acceptAll() {
            const accepted = {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted',
                personalization_storage: 'granted',
                functionality_storage: 'granted',
                security_storage: 'granted'
            };
            this.saveConsent(accepted);
        }

        rejectAll() {
            // Keep necessary granted, others denied
            this.saveConsent(CONSENT_DEFAULTS);
        }

        savePreferences() {
            const analytics = document.getElementById('consent-analytics').checked ? 'granted' : 'denied';
            const marketing = document.getElementById('consent-marketing').checked ? 'granted' : 'denied';

            const preferences = {
                ...CONSENT_DEFAULTS,
                analytics_storage: analytics,
                ad_storage: marketing,
                ad_user_data: marketing,
                ad_personalization: marketing,
                personalization_storage: marketing
            };
            this.saveConsent(preferences);
        }

        addRevisitButton() {
            if (document.getElementById('cookie-revisit')) return;

            // Add link to footer only if footer exists
            // Try to find the list with legal links (Privacy Policy), otherwise fallback to first list
            const footerLinksList = document.querySelectorAll('.footer-links');
            const footerLinks = Array.from(footerLinksList).find(list => list.innerHTML.includes('Privacy Policy')) || footerLinksList[0];

            if (footerLinks) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="#" id="cookie-revisit">Cookie Settings</a>';
                footerLinks.appendChild(li);

                document.getElementById('cookie-revisit').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.renderUI();
                    this.showModal();

                    // Pre-fill checkboxes based on current state
                    const current = this.loadConsent();
                    if (current) {
                        if (document.getElementById('consent-analytics'))
                            document.getElementById('consent-analytics').checked = current.analytics_storage === 'granted';
                        if (document.getElementById('consent-marketing'))
                            document.getElementById('consent-marketing').checked = current.ad_storage === 'granted';
                    }
                });
            }
        }
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new CookieConsent());
    } else {
        new CookieConsent();
    }

})();

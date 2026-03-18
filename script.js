// Mike & Morgan — Eleuthera 2026
// Trip Itinerary App

(function() {
    'use strict';

    // ========== COUNTDOWN ==========
    var TRIP_DATE = new Date('2026-05-05T05:32:00-04:00');

    function updateCountdown() {
        var now = new Date();
        var diff = TRIP_DATE - now;

        var daysEl = document.getElementById('cd-days');
        var hoursEl = document.getElementById('cd-hours');
        var minsEl = document.getElementById('cd-mins');
        var secsEl = document.getElementById('cd-secs');
        if (!daysEl) return;

        if (diff <= 0) {
            daysEl.textContent = '0';
            hoursEl.textContent = '0';
            minsEl.textContent = '0';
            secsEl.textContent = '0';
            return;
        }

        daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
        hoursEl.textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minsEl.textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        secsEl.textContent = Math.floor((diff % (1000 * 60)) / 1000);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ========== MOOD SELECTOR ==========
    var moodBtns = document.querySelectorAll('.mood-card');
    for (var i = 0; i < moodBtns.length; i++) {
        moodBtns[i].addEventListener('click', function() {
            var mood = this.getAttribute('data-mood');
            var day = this.getAttribute('data-day');

            // Toggle active state on siblings
            var siblings = this.parentElement.querySelectorAll('.mood-card');
            for (var j = 0; j < siblings.length; j++) {
                siblings[j].classList.remove('active');
            }
            this.classList.add('active');

            // Show/hide mood content
            var adventureEl = document.getElementById('mood-' + day + '-adventure');
            var chillEl = document.getElementById('mood-' + day + '-chill');

            if (adventureEl && chillEl) {
                if (mood === 'adventure') {
                    adventureEl.style.display = 'block';
                    chillEl.style.display = 'none';
                } else {
                    adventureEl.style.display = 'none';
                    chillEl.style.display = 'block';
                }
            }
        });
    }

    // ========== STICKY NAV — SCROLL SHADOW + ACTIVE STATE ==========
    var nav = document.getElementById('day-nav');
    var dayTabs = document.querySelectorAll('.day-tab');
    var allSections = [];

    // Build section map
    for (var k = 0; k < dayTabs.length; k++) {
        var targetId = dayTabs[k].getAttribute('data-target');
        var section = document.getElementById(targetId);
        if (section) {
            allSections.push({ el: section, tab: dayTabs[k] });
        }
    }

    function onScroll() {
        // Shadow on nav
        if (nav) {
            if (window.pageYOffset > 200) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        // Active tab
        var scrollPos = window.scrollY + 150;
        var activeTab = null;

        for (var m = 0; m < allSections.length; m++) {
            var rect = allSections[m].el.getBoundingClientRect();
            var top = rect.top + window.scrollY;
            var bottom = top + allSections[m].el.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                activeTab = allSections[m].tab;
            }
        }

        if (activeTab) {
            for (var n = 0; n < dayTabs.length; n++) {
                dayTabs[n].classList.remove('active');
            }
            activeTab.classList.add('active');

            // Scroll the active tab into view in the nav
            var navInner = document.querySelector('.day-nav-inner');
            if (navInner) {
                var tabLeft = activeTab.offsetLeft;
                var tabWidth = activeTab.offsetWidth;
                var navWidth = navInner.offsetWidth;
                var scrollLeft = tabLeft - (navWidth / 2) + (tabWidth / 2);
                navInner.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ========== HERO ARROW CLICK ==========
    var heroArrow = document.getElementById('hero-arrow');
    if (heroArrow) {
        heroArrow.addEventListener('click', function() {
            var target = document.getElementById('flights-section');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========== COPY TO CLIPBOARD ==========
    window.copyToClipboard = function(text, btn) {
        if (!btn) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showCopied(btn);
            }).catch(function() {
                fallbackCopy(text, btn);
            });
        } else {
            fallbackCopy(text, btn);
        }
    };

    function fallbackCopy(text, btn) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopied(btn);
        } catch (e) {
            btn.textContent = 'Failed';
        }
        document.body.removeChild(textarea);
    }

    function showCopied(btn) {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
            btn.textContent = orig;
            btn.classList.remove('copied');
        }, 2000);
    }

    // ========== BOTTOM SHEET ==========
    var fab = document.getElementById('fab-btn');
    var overlay = document.getElementById('sheet-overlay');
    var sheet = document.getElementById('bottom-sheet');

    function openSheet() {
        if (overlay) overlay.classList.add('visible');
        if (sheet) sheet.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSheet() {
        if (overlay) overlay.classList.remove('visible');
        if (sheet) sheet.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (fab) fab.addEventListener('click', openSheet);
    if (overlay) overlay.addEventListener('click', closeSheet);

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSheet();
    });

    // Swipe down to close
    var sheetStartY = 0;
    if (sheet) {
        sheet.addEventListener('touchstart', function(e) {
            sheetStartY = e.touches[0].clientY;
        }, { passive: true });

        sheet.addEventListener('touchmove', function(e) {
            var deltaY = e.touches[0].clientY - sheetStartY;
            // Only close if swiped down significantly and sheet is at scroll top
            if (deltaY > 80 && sheet.scrollTop <= 0) {
                closeSheet();
            }
        }, { passive: true });
    }

    // ========== INTERSECTION OBSERVER — FADE IN ==========
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            for (var p = 0; p < entries.length; p++) {
                if (entries[p].isIntersecting) {
                    entries[p].target.style.opacity = '1';
                    entries[p].target.style.transform = 'translateY(0)';
                    observer.unobserve(entries[p].target);
                }
            }
        }, { threshold: 0.05 });

        var animSections = document.querySelectorAll('.day-section, .content-section');
        for (var q = 0; q < animSections.length; q++) {
            animSections[q].style.opacity = '0';
            animSections[q].style.transform = 'translateY(20px)';
            animSections[q].style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(animSections[q]);
        }
    }

    // ========== SERVICE WORKER REGISTRATION ==========
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js').catch(function(err) {
                console.log('SW registration failed:', err);
            });
        });
    }

})();

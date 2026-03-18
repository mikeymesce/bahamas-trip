// Mike & Morgan — Eleuthera 2026
// Trip Itinerary App

(function() {
    'use strict';

    // ========== COUNTDOWN ==========
    var TRIP_DATE = new Date('2026-05-05T05:32:00-04:00');

    function updateCountdown() {
        var now = new Date();
        var diff = TRIP_DATE - now;

        if (diff <= 0) {
            document.getElementById('cd-days').textContent = '0';
            document.getElementById('cd-hours').textContent = '0';
            document.getElementById('cd-mins').textContent = '0';
            document.getElementById('cd-secs').textContent = '0';
            document.querySelector('.hero-tagline').textContent = 'The trip is HERE! Have an amazing time!';
            return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = days;
        document.getElementById('cd-hours').textContent = hours;
        document.getElementById('cd-mins').textContent = mins;
        document.getElementById('cd-secs').textContent = secs;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ========== COLLAPSIBLE TIMELINE ITEMS ==========
    document.querySelectorAll('.tl-content h3').forEach(function(h3) {
        h3.addEventListener('click', function() {
            var details = this.nextElementSibling;
            if (!details || !details.classList.contains('tl-details')) return;

            var isOpen = details.classList.contains('open');
            if (isOpen) {
                details.classList.remove('open');
                this.classList.remove('expanded');
            } else {
                details.classList.add('open');
                this.classList.add('expanded');
            }
        });
    });

    // ========== MOOD SELECTOR ==========
    document.querySelectorAll('.mood-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var mood = this.dataset.mood;
            var day = this.dataset.day;

            var siblings = this.parentElement.querySelectorAll('.mood-btn');
            siblings.forEach(function(s) { s.classList.remove('active'); });
            this.classList.add('active');

            var adventureEl = document.getElementById('mood-' + day + '-adventure');
            var chillEl = document.getElementById('mood-' + day + '-chill');

            if (mood === 'adventure') {
                adventureEl.style.display = 'block';
                chillEl.style.display = 'none';
            } else {
                adventureEl.style.display = 'none';
                chillEl.style.display = 'block';
            }
        });
    });

    // ========== STICKY NAV — SCROLL SHADOW ==========
    var nav = document.getElementById('sticky-nav');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ========== STICKY NAV — ACTIVE STATE ==========
    var sections = document.querySelectorAll('.day-section, .info-section');
    var navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        var scrollPos = window.scrollY + 120;

        sections.forEach(function(section) {
            var top = section.offsetTop;
            var bottom = top + section.offsetHeight;
            var id = section.id;

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    var href = link.getAttribute('href');
                    if (href === '#' + id) {
                        link.classList.add('active');
                    }
                    if (href === '#info' && ['info', 'quickref'].includes(id)) {
                        link.classList.add('active');
                    }
                    if (href === '#flights' && ['flights', 'accommodation', 'costs', 'restaurants'].includes(id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ========== COPY TO CLIPBOARD ==========
    window.copyText = function(elementId) {
        var el = document.getElementById(elementId);
        var text = el.querySelector('span').textContent.trim();
        var btn = el.querySelector('.copy-btn') || el.parentElement.querySelector('.copy-btn');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        } else {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            } catch (e) {
                btn.textContent = 'Failed';
            }
            document.body.removeChild(textarea);
        }
    };

    // ========== INTERSECTION OBSERVER — FADE IN ==========
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.day-section, .info-section').forEach(function(section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
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

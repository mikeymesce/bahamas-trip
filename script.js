// Mike & Morgan — Eleuthera 2026
// Trip Itinerary App

(function() {
    'use strict';

    // ========== MORGAN WELCOME NOTE ==========
    var morgOverlay = document.getElementById('morg-overlay');
    var morgCanvas = document.getElementById('morg-canvas');

    if (morgOverlay && morgCanvas) {
        document.body.style.overflow = 'hidden';

        var ctx = morgCanvas.getContext('2d');
        var card = morgCanvas.parentElement;
        var rect = card.getBoundingClientRect();
        morgCanvas.width = rect.width;
        morgCanvas.height = rect.height;
        var W = morgCanvas.width;
        var H = morgCanvas.height;

        // Floating particles
        var particles = [];
        for (var d = 0; d < 60; d++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 3 + 1,
                dx: (Math.random() - 0.5) * 0.6,
                dy: (Math.random() - 0.5) * 0.6,
                alpha: Math.random() * 0.5 + 0.3
            });
        }

        function drawScratchLayer() {
            // Pink-to-blue gradient
            var grad = ctx.createLinearGradient(0, 0, W, H);
            grad.addColorStop(0, '#f4b4c4');
            grad.addColorStop(0.35, '#e8839a');
            grad.addColorStop(0.65, '#48cae4');
            grad.addColorStop(1, '#0077b6');
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // Draw floating particles
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,' + p.alpha + ')';
                ctx.fill();
            }

            // "Scratch Me!" text
            ctx.fillStyle = 'rgba(255,255,255,0.95)';
            ctx.font = '700 28px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Scratch Me!', W / 2, H / 2 - 10);

            ctx.font = '400 13px Outfit, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText('Use your finger', W / 2, H / 2 + 22);
        }

        drawScratchLayer();

        // Store scratched pixels in a separate tracking canvas
        var scratchMap = document.createElement('canvas');
        scratchMap.width = W;
        scratchMap.height = H;
        var scratchCtx = scratchMap.getContext('2d');

        // Animate floating particles
        var animId;
        var isRevealed = false;

        function animateParticles() {
            if (isRevealed) return;

            // Move particles
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > W) p.dx *= -1;
                if (p.y < 0 || p.y > H) p.dy *= -1;
            }

            // Redraw the gradient + particles, then re-erase scratched areas
            drawScratchLayer();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(scratchMap, 0, 0);

            animId = requestAnimationFrame(animateParticles);
        }

        animId = requestAnimationFrame(animateParticles);

        // Check how much has been scratched
        function checkReveal() {
            var imageData = scratchCtx.getImageData(0, 0, W, H);
            var scratched = 0;
            var total = imageData.data.length / 4;
            for (var i = 3; i < imageData.data.length; i += 4) {
                if (imageData.data[i] > 0) scratched++;
            }
            // Need 85% scratched to reveal
            if (scratched / total > 0.85) {
                isRevealed = true;
                cancelAnimationFrame(animId);
                document.body.style.overflow = '';
                morgCanvas.style.transition = 'opacity 0.6s ease';
                morgCanvas.style.opacity = '0';
                setTimeout(function() {
                    morgOverlay.classList.add('bye');
                    setTimeout(function() {
                        morgOverlay.remove();
                        if (window.showMorganPopup) window.showMorganPopup();
                    }, 900);
                }, 2000);
            }
        }

        var isDrawing = false;

        function scratch(x, y) {
            // Draw on tracking canvas
            scratchCtx.beginPath();
            scratchCtx.arc(x, y, 28, 0, Math.PI * 2);
            scratchCtx.fillStyle = 'rgba(255,255,255,1)';
            scratchCtx.fill();

            // Draw on visible canvas
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 28, 0, Math.PI * 2);
            ctx.fill();

            checkReveal();
        }

        function getPos(e) {
            var r = morgCanvas.getBoundingClientRect();
            var touch = e.touches ? e.touches[0] : e;
            return { x: touch.clientX - r.left, y: touch.clientY - r.top };
        }

        morgCanvas.addEventListener('mousedown', function(e) {
            isDrawing = true;
            var p = getPos(e);
            scratch(p.x, p.y);
        });
        morgCanvas.addEventListener('mousemove', function(e) {
            if (!isDrawing) return;
            var p = getPos(e);
            scratch(p.x, p.y);
        });
        morgCanvas.addEventListener('mouseup', function() { isDrawing = false; });
        morgCanvas.addEventListener('mouseleave', function() { isDrawing = false; });

        morgCanvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            isDrawing = true;
            var p = getPos(e);
            scratch(p.x, p.y);
        }, { passive: false });
        morgCanvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (!isDrawing) return;
            var p = getPos(e);
            scratch(p.x, p.y);
        }, { passive: false });
        morgCanvas.addEventListener('touchend', function() { isDrawing = false; });

        // Skip button
        var morgSkip = document.getElementById('morg-skip');
        if (morgSkip) {
            morgSkip.addEventListener('click', function() {
                isRevealed = true;
                cancelAnimationFrame(animId);
                document.body.style.overflow = '';
                morgOverlay.classList.add('bye');
                setTimeout(function() {
                    morgOverlay.remove();
                    if (window.showMorganPopup) window.showMorganPopup();
                }, 900);
            });
        }
    }

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
            var ambitiousEl = document.getElementById('mood-' + day + '-ambitious');

            // Hide all mood content for this day
            if (adventureEl) adventureEl.style.display = 'none';
            if (chillEl) chillEl.style.display = 'none';
            if (ambitiousEl) ambitiousEl.style.display = 'none';

            // Show the selected one
            var selectedEl = document.getElementById('mood-' + day + '-' + mood);
            if (selectedEl) selectedEl.style.display = 'block';
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

    // ========== COLLAPSIBLE DAY SECTIONS ==========
    var dayToggles = document.querySelectorAll('.day-toggle');
    for (var t = 0; t < dayToggles.length; t++) {
        (function(toggle) {
            var targetId = toggle.getAttribute('data-target');
            var body = document.getElementById(targetId);
            var chevron = toggle.querySelector('.day-chevron');
            if (!body) return;

            // Set initial chevron state
            if (body.classList.contains('open')) {
                if (chevron) chevron.classList.add('rotated');
            }

            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                var isOpen = body.classList.contains('open');

                if (isOpen) {
                    body.classList.remove('open');
                    if (chevron) chevron.classList.remove('rotated');
                } else {
                    body.classList.add('open');
                    if (chevron) chevron.classList.add('rotated');
                }
            });
        })(dayToggles[t]);
    }

    // ========== PACKING LIST (Supabase) ==========
    var SUPA_URL = 'https://bvnkzimwskuruhdmzpbt.supabase.co';
    var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bmt6aW13c2t1cnVoZG16cGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MTc3NzgsImV4cCI6MjA4OTE5Mzc3OH0.6layiAl75f5YeAQRzU55j41JBAS9_e1QL0tpq-l3DpE';
    var SUPA_TABLE = SUPA_URL + '/rest/v1/bahamas_packing';
    var supaHeaders = {
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    function fetchPackingList() {
        return fetch(SUPA_TABLE + '?order=created_at.asc', {
            headers: supaHeaders
        }).then(function(r) { return r.json(); });
    }

    function renderPackingItems(items) {
        var ul = document.getElementById('packing-items');
        if (!ul) return;
        ul.innerHTML = '';

        for (var i = 0; i < items.length; i++) {
            (function(item) {
                var li = document.createElement('li');
                if (item.checked) li.classList.add('checked');

                var check = document.createElement('div');
                check.className = 'packing-check' + (item.checked ? ' done' : '');
                check.textContent = item.checked ? '✓' : '';
                check.addEventListener('click', function() {
                    fetch(SUPA_TABLE + '?id=eq.' + item.id, {
                        method: 'PATCH',
                        headers: supaHeaders,
                        body: JSON.stringify({ checked: !item.checked })
                    }).then(function() { loadAndRender(); });
                });

                var text = document.createElement('span');
                text.className = 'packing-text';
                text.textContent = item.text;

                var del = document.createElement('span');
                del.className = 'packing-delete';
                del.textContent = '×';
                del.addEventListener('click', function() {
                    fetch(SUPA_TABLE + '?id=eq.' + item.id, {
                        method: 'DELETE',
                        headers: supaHeaders
                    }).then(function() { loadAndRender(); });
                });

                li.appendChild(check);
                li.appendChild(text);
                li.appendChild(del);
                ul.appendChild(li);
            })(items[i]);
        }
    }

    function loadAndRender() {
        fetchPackingList().then(renderPackingItems);
    }

    loadAndRender();

    var packingInput = document.getElementById('packing-input');
    var packingAddBtn = document.getElementById('packing-add-btn');

    function addPackingItem() {
        if (!packingInput) return;
        var val = packingInput.value.trim();
        if (!val) return;
        packingInput.value = '';
        fetch(SUPA_TABLE, {
            method: 'POST',
            headers: supaHeaders,
            body: JSON.stringify({ text: val })
        }).then(function() { loadAndRender(); });
    }

    if (packingAddBtn) {
        packingAddBtn.addEventListener('click', addPackingItem);
    }
    if (packingInput) {
        packingInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') addPackingItem();
        });
    }

    // ========== MORGAN PRE-TRIP POPUP ==========
    var morganOverlay = document.getElementById('morgan-popup-overlay');
    var morganDismiss = document.getElementById('morgan-popup-dismiss');
    var morganItems = document.querySelectorAll('.morgan-todo-item[data-key]');

    // Check if all items are already done
    function allMorganDone() {
        for (var mi = 0; mi < morganItems.length; mi++) {
            var key = morganItems[mi].getAttribute('data-key');
            if (localStorage.getItem(key) !== 'true') return false;
        }
        return true;
    }

    // Initialize checkboxes from localStorage
    for (var mi = 0; mi < morganItems.length; mi++) {
        (function(item) {
            var key = item.getAttribute('data-key');
            var check = item.querySelector('.morgan-check');
            if (!check) return;

            if (localStorage.getItem(key) === 'true') {
                check.classList.add('done');
                check.textContent = '✓';
                item.classList.add('checked');
            }

            check.addEventListener('click', function() {
                var isDone = check.classList.contains('done');
                if (isDone) {
                    check.classList.remove('done');
                    check.textContent = '';
                    item.classList.remove('checked');
                    localStorage.setItem(key, 'false');
                } else {
                    check.classList.add('done');
                    check.textContent = '✓';
                    item.classList.add('checked');
                    localStorage.setItem(key, 'true');
                }
            });
        })(morganItems[mi]);
    }

    // Show Morgan popup (called after scratch-off dismisses, or immediately if no scratch-off)
    window.showMorganPopup = function() {
        if (morganOverlay && !allMorganDone()) {
            setTimeout(function() {
                morganOverlay.classList.add('visible');
            }, 500);
        }
    };

    // If scratch-off is not present (already removed), show popup now
    if (!morgOverlay) {
        window.showMorganPopup();
    }

    if (morganDismiss) {
        morganDismiss.addEventListener('click', function() {
            if (morganOverlay) morganOverlay.classList.remove('visible');
        });
    }

    if (morganOverlay) {
        morganOverlay.addEventListener('click', function(e) {
            if (e.target === morganOverlay) {
                morganOverlay.classList.remove('visible');
            }
        });
    }

    // ========== MORGAN EXPORT TRIP INFO ==========
    var exportBtn = document.getElementById('morgan-export-btn');
    var exportStatus = document.getElementById('morgan-export-status');

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            var tripInfo = [
                'MIKE & MORGAN — ELEUTHERA TRIP',
                '================================',
                '',
                'FLIGHTS (Confirmation: UXGSTJ)',
                '---',
                'OUTBOUND — Tue, May 5:',
                '  EWR 5:32 AM → MIA 8:39 AM (AA 1196)',
                '  1h 21m layover in Miami',
                '  MIA 10:00 AM → GHB 11:15 AM (AA 4020)',
                '',
                'RETURN — Sat, May 9:',
                '  GHB 12:15 PM → MIA 1:24 PM (AA 3646)',
                '  2h 06m layover in Miami',
                '  MIA 3:30 PM → LGA 6:29 PM (AA 3162)',
                '',
                'ACCOMMODATION',
                '---',
                'Bird of Paradise Beachfront Cottages',
                'Shooting Star Cottage',
                'BANKS ROAD, GOVERNORS HARBOUR, ELEUTHERA, BAHAMAS',
                'Google Maps: https://www.google.com/maps/place/25.19832290%2c-76.23671540',
                '',
                'EMERGENCY NUMBERS',
                '---',
                'Police: 919 or 911',
                'Ambulance: 919',
                'US Embassy Nassau: +1 242-322-1181',
                '',
                'GROCERY STORES',
                '---',
                'Burrows One Stop: 242-332-2929',
                'Eleuthera Supply: 242-332-2728'
            ].join('\n');

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(tripInfo).then(function() {
                    if (exportStatus) {
                        exportStatus.textContent = 'Copied! Now open Notes and paste.';
                        setTimeout(function() { exportStatus.textContent = ''; }, 4000);
                    }
                });
            } else {
                var ta = document.createElement('textarea');
                ta.value = tripInfo;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                if (exportStatus) {
                    exportStatus.textContent = 'Copied! Now open Notes and paste.';
                    setTimeout(function() { exportStatus.textContent = ''; }, 4000);
                }
            }
        });
    }

    // ========== MORGAN EMERGENCY CONTACT (Supabase) ==========
    var EMERGENCY_TABLE = SUPA_URL + '/rest/v1/bahamas_emergency_contacts';
    var emergencyName = document.getElementById('emergency-name');
    var emergencyPhone = document.getElementById('emergency-phone');
    var emergencySave = document.getElementById('emergency-save');
    var emergencyStatus = document.getElementById('emergency-status');

    // Load existing contacts
    function loadEmergencyContacts() {
        fetch(EMERGENCY_TABLE + '?order=created_at.asc', {
            headers: supaHeaders
        }).then(function(r) { return r.json(); })
        .then(function(contacts) {
            if (contacts.length > 0 && emergencyName && emergencyPhone) {
                emergencyName.value = contacts[0].name;
                emergencyPhone.value = contacts[0].phone;
                emergencyName.dataset.id = contacts[0].id;
            }
        });
    }

    loadEmergencyContacts();

    function saveEmergencyContact() {
        if (!emergencyName || !emergencyPhone) return;
        var name = emergencyName.value.trim();
        var phone = emergencyPhone.value.trim();
        if (!name || !phone) return;

        var existingId = emergencyName.dataset.id;

        if (existingId) {
            // Update existing
            fetch(EMERGENCY_TABLE + '?id=eq.' + existingId, {
                method: 'PATCH',
                headers: supaHeaders,
                body: JSON.stringify({ name: name, phone: phone })
            }).then(function() {
                if (emergencyStatus) {
                    emergencyStatus.textContent = 'Saved!';
                    setTimeout(function() { emergencyStatus.textContent = ''; }, 2000);
                }
            });
        } else {
            // Insert new
            fetch(EMERGENCY_TABLE, {
                method: 'POST',
                headers: supaHeaders,
                body: JSON.stringify({ name: name, phone: phone })
            }).then(function(r) { return r.json(); })
            .then(function(data) {
                if (data && data[0]) emergencyName.dataset.id = data[0].id;
                if (emergencyStatus) {
                    emergencyStatus.textContent = 'Saved!';
                    setTimeout(function() { emergencyStatus.textContent = ''; }, 2000);
                }
            });
        }
    }

    if (emergencySave) {
        emergencySave.addEventListener('click', saveEmergencyContact);
    }

    // ========== WEATHER WIDGET ==========
    var TRIP_START = new Date('2026-05-05');
    var weatherPlaceholder = document.getElementById('weather-placeholder');
    var weatherGrid = document.getElementById('weather-grid');

    function getWeatherIcon(code) {
        if (code === 0) return { icon: '\u2600\uFE0F', desc: 'Clear' };
        if (code >= 1 && code <= 3) return { icon: '\u26C5', desc: 'Partly cloudy' };
        if (code >= 45 && code <= 48) return { icon: '\uD83C\uDF2B\uFE0F', desc: 'Fog' };
        if (code >= 51 && code <= 55) return { icon: '\uD83C\uDF26\uFE0F', desc: 'Drizzle' };
        if (code >= 61 && code <= 65) return { icon: '\uD83C\uDF27\uFE0F', desc: 'Rain' };
        if (code >= 80 && code <= 82) return { icon: '\uD83C\uDF26\uFE0F', desc: 'Showers' };
        if (code >= 95 && code <= 99) return { icon: '\u26C8\uFE0F', desc: 'Thunderstorm' };
        return { icon: '\u2601\uFE0F', desc: 'Cloudy' };
    }

    function getDayName(dateStr) {
        var d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    }

    function loadWeather() {
        if (!weatherPlaceholder || !weatherGrid) return;

        var now = new Date();
        var msUntilTrip = TRIP_START - now;
        var daysUntilTrip = Math.ceil(msUntilTrip / (1000 * 60 * 60 * 24));

        if (daysUntilTrip > 7) {
            weatherPlaceholder.textContent = 'Weather forecast will appear 7 days before the trip (May 5). Check back ' + (daysUntilTrip <= 14 ? 'soon!' : 'closer to departure.');
            return;
        }

        weatherPlaceholder.textContent = 'Loading forecast...';

        fetch('https://api.open-meteo.com/v1/forecast?latitude=25.198&longitude=-76.237&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&temperature_unit=fahrenheit&timezone=America/Nassau&forecast_days=7')
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (!data.daily || !data.daily.time) {
                    weatherPlaceholder.textContent = 'Could not load forecast. Try again later.';
                    return;
                }

                weatherPlaceholder.style.display = 'none';
                weatherGrid.style.display = 'grid';
                weatherGrid.innerHTML = '';

                var days = data.daily;
                for (var i = 0; i < days.time.length; i++) {
                    var wx = getWeatherIcon(days.weathercode[i]);
                    var hi = Math.round(days.temperature_2m_max[i]);
                    var lo = Math.round(days.temperature_2m_min[i]);
                    var rain = days.precipitation_probability_max[i];

                    var div = document.createElement('div');
                    div.className = 'weather-day';
                    div.innerHTML =
                        '<span class="weather-day-name">' + getDayName(days.time[i]) + '</span>' +
                        '<span class="weather-day-icon">' + wx.icon + '</span>' +
                        '<span class="weather-day-temps">' + hi + '&deg; <span class="lo">' + lo + '&deg;</span></span>' +
                        '<span class="weather-day-desc">' + wx.desc + '</span>' +
                        (rain > 0 ? '<span class="weather-day-rain">' + rain + '% rain</span>' : '');

                    weatherGrid.appendChild(div);
                }
            })
            .catch(function() {
                weatherPlaceholder.textContent = 'Could not load forecast. Try again later.';
            });
    }

    loadWeather();

    // ========== PRIVATE SECTION ==========
    var privateLocked = document.getElementById('private-locked');
    var privateContent = document.getElementById('private-content');
    var privatePwInput = document.getElementById('private-pw');
    var privatePwBtn = document.getElementById('private-pw-btn');
    var privatePwError = document.getElementById('private-pw-error');
    var PRIVATE_PW = 'ilovemorganinthebahamas';

    // Check if already unlocked this session
    if (sessionStorage.getItem('private_unlocked') === 'true') {
        if (privateLocked) privateLocked.style.display = 'none';
        if (privateContent) privateContent.style.display = 'block';
    }

    function unlockPrivate() {
        if (!privatePwInput) return;
        var val = privatePwInput.value.trim().toLowerCase();
        if (val === PRIVATE_PW) {
            privateLocked.style.display = 'none';
            privateContent.style.display = 'block';
            sessionStorage.setItem('private_unlocked', 'true');
        } else {
            privatePwError.textContent = 'Wrong password';
            privatePwInput.value = '';
            setTimeout(function() { privatePwError.textContent = ''; }, 2000);
        }
    }

    if (privatePwBtn) {
        privatePwBtn.addEventListener('click', unlockPrivate);
    }
    if (privatePwInput) {
        privatePwInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') unlockPrivate();
        });
    }

    // Private to-do checkboxes (localStorage)
    var privateChecks = document.querySelectorAll('#private-items .packing-check');
    for (var pc = 0; pc < privateChecks.length; pc++) {
        (function(check) {
            var key = 'private_todo_' + check.id;
            var li = check.parentElement;
            if (localStorage.getItem(key) === 'true') {
                check.classList.add('done');
                check.textContent = '✓';
                li.classList.add('checked');
            }
            check.addEventListener('click', function() {
                var isDone = check.classList.contains('done');
                if (isDone) {
                    check.classList.remove('done');
                    check.textContent = '';
                    li.classList.remove('checked');
                    localStorage.setItem(key, 'false');
                } else {
                    check.classList.add('done');
                    check.textContent = '✓';
                    li.classList.add('checked');
                    localStorage.setItem(key, 'true');
                }
            });
        })(privateChecks[pc]);
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

    // ========== UNREGISTER OLD SERVICE WORKER ==========
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (var i = 0; i < registrations.length; i++) {
                registrations[i].unregister();
            }
        });
        caches.keys().then(function(names) {
            for (var i = 0; i < names.length; i++) {
                caches.delete(names[i]);
            }
        });
    }

})();

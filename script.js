/**
 * ASHUKRI Landing Page Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Mobile Menu Toggle
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            // Toggle menu icon between bars and close X
            const icon = mobileToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking on any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // Active Navigation Highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for sticky header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    });


    // ==========================================================================
    // 2. Hero Carousel Slider
    // ==========================================================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot-indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let carouselInterval;

    function showSlide(index) {
        // Clean indices boundaries
        if (index >= slideCount) index = 0;
        if (index < 0) index = slideCount - 1;

        currentSlide = index;

        // Toggle Active classes for slides
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Toggle Active classes for dot indicators
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start Auto Rotation
    function startAutoPlay() {
        carouselInterval = setInterval(nextSlide, 6000); // Shift every 6 seconds
    }

    // Reset Auto Play when user interacts
    function resetAutoPlay() {
        clearInterval(carouselInterval);
        startAutoPlay();
    }

    // Event listeners for carousel buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // Click indicators
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetAutoPlay();
        });
    });

    // Initialize Auto Play
    if (slides.length > 0) {
        startAutoPlay();
    }

    // Touch swipe support for mobile
    const heroSection = document.querySelector('.hero-carousel');
    if (heroSection) {
        let touchStartX = 0;
        let touchEndX = 0;

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                nextSlide();
                resetAutoPlay();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
                resetAutoPlay();
            }
        }, { passive: true });
    }


    // ==========================================================================
    // 3. Reveal-on-Scroll Animations (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a transition delay if specified
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, parseInt(delay));
                } else {
                    entry.target.classList.add('revealed');
                }
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15, // trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // trigger slightly early before hitting viewport top
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ==========================================================================
    // 4. Product Details Dynamic Lookup & Modal Drawer
    // ==========================================================================
    
    // Product data registry
    const productsData = {
        'plumbing': {
            title: 'PLUMBING PIPES & FITTINGS',
            image: './assets/images/plumbing.png',
            desc: 'High-quality, durable pipes, valves, and fittings for residential, commercial, and industrial plumbing systems. Our range includes CPVC, PPR, GI, and stainless steel solutions built for long-term reliability.',
            spec1Label: 'MATERIAL', spec1Val: 'CPVC / PPR / GI',
            spec2Label: 'APPLICATION', spec2Val: 'Multi-Sector'
        },
        'sanitary': {
            title: 'SANITARY WARE & BATHROOM ACCESSORIES',
            image: './assets/images/sanitary.png',
            desc: 'Modern, reliable sanitary fixtures, faucets, and premium bathroom accessories. Engineered for durability and aesthetic appeal in both residential and commercial environments.',
            spec1Label: 'FINISH', spec1Val: 'Chrome / Matte',
            spec2Label: 'STANDARD', spec2Val: 'ISO Certified'
        },
        'electrical': {
            title: 'ELECTRICAL SUPPLIES & ACCESSORIES',
            image: './assets/images/electrical.png',
            desc: 'Comprehensive electrical solutions including cables, switches, conduits, and power distribution accessories. Suitable for light and heavy-duty industrial and commercial installations.',
            spec1Label: 'VOLTAGE', spec1Val: 'Up to 33kV',
            spec2Label: 'STANDARD', spec2Val: 'IEC / BS Certified'
        },
        'hardware': {
            title: 'HARDWARE & FASTENERS',
            image: './assets/images/hardware.png',
            desc: 'A wide range of industrial-grade nuts, bolts, screws, anchors, and general hardware essentials. Available in carbon steel, stainless steel, and galvanised finishes for every application.',
            spec1Label: 'MATERIAL', spec1Val: 'Carbon / SS / GI',
            spec2Label: 'GRADE', spec2Val: 'Grade 4.6–12.9'
        },
        'power-tools': {
            title: 'POWER TOOLS & HAND TOOLS',
            image: './assets/images/power_tools.png',
            desc: 'Professional-grade manual and powered tools engineered for precision, durability, and performance. Includes drills, grinders, hammers, spanners, and complete tool sets.',
            spec1Label: 'POWER', spec1Val: 'Corded / Cordless',
            spec2Label: 'MOTOR', spec2Val: 'Brushless Available'
        },
        'paints': {
            title: 'PAINTS & PAINTING ACCESSORIES',
            image: './assets/images/paints.png',
            desc: 'Premium interior/exterior paints, protective coatings, and high-quality painting tools. Our range covers epoxy coatings, anti-rust primers, and decorative emulsions.',
            spec1Label: 'TYPE', spec1Val: 'Water / Oil-Based',
            spec2Label: 'COVERAGE', spec2Val: 'Up to 12 m²/L'
        },
        'chemicals': {
            title: 'CONSTRUCTION CHEMICALS',
            image: './assets/images/chemicals.png',
            desc: 'Advanced sealing, bonding, and waterproofing compounds to ensure structural longevity. Includes adhesives, sealants, grouts, curing agents, and membrane systems.',
            spec1Label: 'TYPE', spec1Val: 'Adhesive / Sealant',
            spec2Label: 'STANDARD', spec2Val: 'ASTM / EN Certified'
        },
        'safety': {
            title: 'SAFETY EQUIPMENT & PPE',
            image: './assets/images/safety.png',
            desc: 'Certified personal protective equipment (PPE), safety gear, and fire protection solutions. Covers helmets, gloves, harnesses, fire extinguishers, and detection systems.',
            spec1Label: 'CERTIFICATION', spec1Val: 'CE / ANSI / NFPA',
            spec2Label: 'APPLICATION', spec2Val: 'Industrial / Site'
        },
        'welding': {
            title: 'WELDING EQUIPMENT & CONSUMABLES',
            image: './assets/images/welding.png',
            desc: 'Heavy-duty welding machines, electrodes, wires, and essential welding accessories. Suitable for MIG, TIG, ARC, and plasma cutting applications across all material types.',
            spec1Label: 'PROCESS', spec1Val: 'MIG / TIG / ARC',
            spec2Label: 'DUTY CYCLE', spec2Val: 'Up to 100%'
        },
        'oil-gas': {
            title: 'OIL & GAS FITTINGS & INDUSTRIAL VALVES',
            image: './assets/images/oil_gas.png',
            desc: 'High-pressure industrial valves, flanges, and specialized fittings certified for oil and gas applications. Includes ball valves, gate valves, check valves, and API-rated components.',
            spec1Label: 'RATING', spec1Val: 'Up to ANSI 2500#',
            spec2Label: 'STANDARD', spec2Val: 'API 6D / ASME'
        },
        'gypsum': {
            title: 'GYPSUM BOARDS & CEILING SYSTEMS',
            image: './assets/images/gypsum.png',
            desc: 'Premium gypsum panels, framing profiles, and modern suspended ceiling system components. Available in standard, moisture-resistant, and fire-rated configurations.',
            spec1Label: 'TYPE', spec1Val: 'Standard / FR / MR',
            spec2Label: 'THICKNESS', spec2Val: '9.5mm – 15mm'
        },
        'casters': {
            title: 'HEAVY-DUTY CASTER WHEELS',
            image: './assets/images/casters.png',
            desc: 'Industrial-grade caster wheels designed for smooth mobility and high load-bearing capacities. Available in fixed, swivel, and brake configurations with polyurethane and rubber options.',
            spec1Label: 'LOAD CAPACITY', spec1Val: 'Up to 2,000 kg',
            spec2Label: 'WHEEL TYPE', spec2Val: 'PU / Rubber / Nylon'
        }
    };

    const productModal = document.getElementById('productModal');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    
    const detailImg = document.getElementById('detailImg');
    const detailTitle = document.getElementById('productModalTitle');
    const detailDesc = document.getElementById('detailDesc');
    const specVoltage = document.getElementById('specVoltage');
    const specMotor = document.getElementById('specMotor');
    const inquireBtn = document.getElementById('inquireBtn');

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    // Click "VIEW DETAILS"
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-product');
            const data = productsData[key];

            if (data) {
                // Populate details modal fields
                detailImg.src = data.image;
                detailImg.alt = data.title;
                detailTitle.textContent = data.title;
                detailDesc.textContent = data.desc;
                
                // Dynamically update spec labels and values
                if (specVoltage && specVoltage.previousElementSibling) {
                    specVoltage.previousElementSibling.textContent = data.spec1Label;
                    specVoltage.textContent = data.spec1Val;
                }
                if (specMotor && specMotor.previousElementSibling) {
                    specMotor.previousElementSibling.textContent = data.spec2Label;
                    specMotor.textContent = data.spec2Val;
                }

                // Adjust inquiry button action
                inquireBtn.onclick = () => {
                    closeModal(productModal);
                    openContactModalWithSubject(`Inquiry regarding: ${data.title}`);
                };

                openModal(productModal);
            }
        });
    });


    // ==========================================================================
    // 5. Contact Modal & Submission Handler
    // ==========================================================================
    const contactModal = document.getElementById('contactModal');
    const openContactButtons = document.querySelectorAll('.open-contact-modal');
    const contactForm = document.getElementById('contactForm');
    const formSuccessMessage = document.querySelector('.form-success-message');
    const messageField = document.getElementById('message');

    function openContactModalWithSubject(subjectText = '') {
        if (subjectText) {
            messageField.value = `${subjectText}\n\n`;
        } else {
            messageField.value = '';
        }
        
        // Ensure form is visible and success is hidden
        contactForm.style.display = 'flex';
        formSuccessMessage.style.display = 'none';
        
        openModal(contactModal);
        // Focus first field
        setTimeout(() => document.getElementById('name').focus(), 100);
    }

    // Opening triggers
    openContactButtons.forEach(btn => {
        // Prevent click events if triggered by inquireBtn (handled customly)
        if (btn.id !== 'inquireBtn') {
            btn.addEventListener('click', () => {
                openContactModalWithSubject();
            });
        }
    });

    // Close buttons handlers (applies to both modals)
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal'));
        });
    });

    // Close when clicking modal backdrop
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal on Esc press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) closeModal(activeModal);
        }
    });

    // Form Submit Event (Modal Form)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const messageVal = messageField.value;

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;

            // Submit to FormSubmit endpoint targeting desertslineoman@gmail.com
            fetch('https://formsubmit.co/ajax/desertslineoman@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    message: messageVal,
                    _replyto: emailVal,
                    _template: 'table',
                    _subject: 'New Inquiry from Desert Line Website',
                    _captcha: 'false'
                })
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                contactForm.reset();
                contactForm.style.display = 'none';
                if (formSuccessMessage) formSuccessMessage.style.display = 'block';
            })
            .catch(error => {
                console.error('AJAX send error, falling back to mailto:', error);
                window.location.href = `mailto:desertslineoman@gmail.com?subject=${encodeURIComponent('Inquiry from ' + nameVal)}&body=${encodeURIComponent(messageVal + '\n\nSender Email: ' + emailVal)}`;
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                contactForm.reset();
                contactForm.style.display = 'none';
                if (formSuccessMessage) formSuccessMessage.style.display = 'block';
            });
        });
    }

    // Inline Form Submit Event
    const contactFormInline = document.getElementById('contactFormInline');
    const inlineFormSuccess = document.getElementById('inlineFormSuccess');
    if (contactFormInline) {
        contactFormInline.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameVal = document.getElementById('inline-name').value;
            const emailVal = document.getElementById('inline-email').value;
            const messageVal = document.getElementById('inline-message').value;

            const submitBtn = contactFormInline.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;

            // Submit to FormSubmit endpoint targeting desertslineoman@gmail.com
            fetch('https://formsubmit.co/ajax/desertslineoman@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    message: messageVal,
                    _replyto: emailVal,
                    _template: 'table',
                    _subject: 'New Inquiry from Desert Line Website',
                    _captcha: 'false'
                })
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                contactFormInline.reset();
                contactFormInline.style.display = 'none';
                if (inlineFormSuccess) inlineFormSuccess.style.display = 'block';
            })
            .catch(error => {
                console.error('AJAX send error, falling back to mailto:', error);
                window.location.href = `mailto:desertslineoman@gmail.com?subject=${encodeURIComponent('Inquiry from ' + nameVal)}&body=${encodeURIComponent(messageVal + '\n\nSender Email: ' + emailVal)}`;
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                contactFormInline.reset();
                contactFormInline.style.display = 'none';
                if (inlineFormSuccess) inlineFormSuccess.style.display = 'block';
            });
        });
    }

    // ==========================================================================
    // 6. Executive Partner Category Filtering
    // ==========================================================================
    const partnerTabs = document.querySelectorAll('.partner-tab');
    const partnerCards = document.querySelectorAll('.partner-pro-card');

    if (partnerTabs.length > 0 && partnerCards.length > 0) {
        partnerTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.getAttribute('data-filter');

                partnerTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                partnerCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
});

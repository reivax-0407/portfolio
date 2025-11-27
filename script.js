// ========================================
// CONTACT FORM (send via Web3Forms)
// ========================================
const contactForm = document.getElementById('contactForm');
const successEl = document.getElementById('successMessage');
const errorEl = document.getElementById('errorMessage');
const formNotification = document.getElementById('formNotification');

function showNotification(message, type = 'success', timeout = 5000) {
    if (!formNotification) return;
    formNotification.textContent = message;
    formNotification.classList.remove('success', 'error', 'show');
    formNotification.classList.add(type);
    // trigger reflow for transition
    void formNotification.offsetWidth;
    formNotification.classList.add('show');
    // auto-hide
    setTimeout(() => {
        formNotification.classList.remove('show');
        // keep small delay then clear text
        setTimeout(() => { formNotification.textContent = ''; formNotification.classList.remove(type); }, 220);
    }, timeout);
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous messages
        if (successEl) { successEl.style.display = 'none'; }
        if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

        const honeypot = document.getElementById('honeypot');
        if (honeypot && honeypot.value) {
            // Bot detected - silently ignore
            return;
        }

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const subjectInput = document.querySelector('input[name="subject"]');
        const subject = subjectInput ? subjectInput.value : 'New message from portfolio';

        if (name === '') {
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.textContent = 'Please enter your name.';
            } else {
                alert('Please enter your name.');
            }
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.textContent = 'Please enter a valid email address.';
            } else {
                alert('Please enter a valid email address.');
            }
            return;
        }

        // Web3Forms access key provided by user
        const accessKey = 'f6ff8dc3-d489-402d-a497-7c8ec2f9d172';

        const payload = {
            access_key: accessKey,
            name: name,
            email: email,
            message: message,
            subject: subject
        };

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok && data.success) {
                if (successEl) {
                    successEl.style.display = 'block';
                } else {
                    alert('Thank you — your message was sent.');
                }
                contactForm.reset();
                setTimeout(() => {
                    if (successEl) successEl.style.display = 'none';
                }, 5000);
            } else {
                const errMsg = data.message || data.error || `Server responded with ${res.status}`;
                console.error('Web3Forms error:', res.status, data);
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent = 'Submission failed: ' + errMsg;
                } else {
                    alert('Submission failed: ' + errMsg);
                }
            }
        } catch (err) {
            console.error('Network error sending Web3Forms request:', err);
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.textContent = 'Network error: ' + (err.message || String(err));
            } else {
                alert('Network error. Please try again later.');
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// ========================================
// GALLERY SLIDER
// ========================================
const galleryTrack = document.querySelector('.gallery-slider-track');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
const galleryItems = document.querySelectorAll('.gallery-slider-item');

let currentGalleryIndex = 0;

function updateGalleryPosition() {
    const offset = -currentGalleryIndex * 100;
    galleryTrack.style.transform = `translateX(${offset}%)`;
}

if (galleryNext) {
    galleryNext.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        updateGalleryPosition();
    });
}

if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
        updateGalleryPosition();
    });
}

// ========================================
// INTEREST CARDS POPUP
// ========================================
const interestCards = document.querySelectorAll('.interest-card');
const popups = {
    'motorcycles': document.getElementById('popup-motorcycles'),
    'music': document.getElementById('popup-music'),
    'gamedev': document.getElementById('popup-gamedev')
};

interestCards.forEach(card => {
    card.addEventListener('click', () => {
        const interestType = card.getAttribute('data-interest');
        const popup = popups[interestType];
        
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close popup buttons
const closeButtons = document.querySelectorAll('.popup-close');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup-overlay');
        popup.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close popup on overlay click
Object.values(popups).forEach(popup => {
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Close popup with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        Object.values(popups).forEach(popup => {
            if (popup.classList.contains('active')) {
                popup.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// ========================================
// CONTACT FORM (send via EmailJS)
// ========================================
const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "f6ff8dc3-d489-402d-a497-7c8ec2f9d172");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ========================================
// SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
});

// Make first section visible immediately
const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    aboutSection.style.opacity = '1';
    aboutSection.style.transform = 'translateY(0)';
}

// ========================================
// SKILL TAG ANIMATION ON SCROLL
// ========================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const tags = entry.target.querySelectorAll('.skill-tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateX(0)';
                }, index * 50);
            });
        }
    });
}, { threshold: 0.3 });

const skillsContainer = document.querySelector('.skills-container');
if (skillsContainer) {
    // Set initial state
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateX(-20px)';
        tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    skillObserver.observe(skillsContainer);
}

// ========================================
// SMOOTH REVEAL FOR CARDS
// ========================================
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.interest-card, .certificate-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.95)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

console.log('Portfolio website loaded successfully!');
console.log('Matrix animation: Active');
console.log('Slideshow: Active');
console.log('Gallery slider: Active');
console.log('All animations: Initialized');
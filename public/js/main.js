// Main Site JavaScript - Dynamic Content Loading

// Get API URL from config
const API_URL = typeof CONFIG !== 'undefined' ? CONFIG.BACKEND_URL : '';

// Helper function to get API endpoint
function getApiUrl(endpoint) {
    if (API_URL) {
        return `${API_URL}${endpoint}`;
    }
    return endpoint; // Same domain
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCourses();
});

// Load products dynamically
async function loadProducts() {
    try {
        const response = await fetch(getApiUrl('/api/products'));
        const products = await response.json();
        
        const container = document.getElementById('storeContainer');
        if (!container) return;
        
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="width: 100%; text-align: center; padding: 40px;">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: #ccc;"></i>
                    <p style="color: #999; margin-top: 16px;">No products available yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="store-card">
                <div class="store-image-wrapper">
                    <img src="${product.image || 'placeholder.jpg'}" 
                         alt="${escapeHtml(product.title)}" 
                         class="store-image"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22200%22><rect fill=%22%23f0f0f0%22 width=%22320%22 height=%22200%22/><text fill=%22%23999%22 font-size=%2214%22 x=%22160%22 y=%22105%22 text-anchor=%22middle%22>No Image</text></svg>'">
                </div>
                <div class="store-content">
                    <h3>${escapeHtml(product.title)}</h3>
                    <p class="store-price">${escapeHtml(product.price || 'Contact for Price')}</p>
                    <p class="store-desc">${escapeHtml(product.description || '')}</p>
                    <a href="${product.whatsapp_link || product.whatsappLink || '#'}" class="store-buy-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> Buy Now
                    </a>
                </div>
            </div>
        `).join('');
        
        // Initialize store navigation after loading products
        initializeStoreNavigation();
        
    } catch (err) {
        console.error('Failed to load products:', err);
    }
}

// Load courses dynamically
async function loadCourses() {
    try {
        const response = await fetch(getApiUrl('/api/courses'));
        const courses = await response.json();
        
        const container = document.getElementById('coursesContainer');
        if (!container) return;
        
        if (courses.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="width: 100%; text-align: center; padding: 40px;">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: #ccc;"></i>
                    <p style="color: #999; margin-top: 16px;">No courses available yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = courses.map((course, index) => `
            <div class="course-card">
                <div class="course-image-wrapper">
                    <img src="${course.image || 'placeholder.jpg'}" 
                         alt="${escapeHtml(course.title)}" 
                         class="course-image"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22380%22 height=%22220%22><rect fill=%22%23f0f0f0%22 width=%22380%22 height=%22220%22/><text fill=%22%23999%22 font-size=%2214%22 x=%22190%22 y=%22115%22 text-anchor=%22middle%22>No Image</text></svg>'">
                </div>
                <div class="course-content">
                    <div class="course-meta">
                        <span><i class="far fa-calendar"></i> ${escapeHtml(course.date)}</span>
                        <span><i class="far fa-comment"></i> ${course.comments || 0} Comments</span>
                    </div>
                    <h3>${escapeHtml(course.title)}</h3>
                    <p>${escapeHtml(course.description || '')}</p>
                    <div class="course-buttons">
                        <button class="course-link" onclick="openModal('modal-${index + 1}')">
                            Read More <i class="fas fa-arrow-right"></i>
                        </button>
                        <a href="#" class="course-buy-link" onclick="alert('Link to purchase course')">
                            Learn More <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Initialize courses navigation after loading
        initializeCoursesNavigation();
        
        // Generate modals for courses
        generateCourseModals(courses);
        
    } catch (err) {
        console.error('Failed to load courses:', err);
    }
}

// Generate course modals dynamically
function generateCourseModals(courses) {
    // Check if modals already exist
    const existingModals = document.querySelectorAll('.modal-overlay');
    
    // Remove existing modals
    existingModals.forEach(modal => modal.remove());
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = courses.map((course, index) => `
        <div class="modal-overlay" id="modal-${index + 1}">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('modal-${index + 1}')">&times;</button>
                <img src="${course.image || 'placeholder.jpg'}" 
                     alt="${escapeHtml(course.title)}" 
                     class="modal-image"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22300%22><rect fill=%22%23f0f0f0%22 width=%22800%22 height=%22300%22/><text fill=%22%23999%22 font-size=%2220%22 x=%22400%22 y=%22155%22 text-anchor=%22middle%22>No Image</text></svg>'">
                <div class="modal-body">
                    <div class="modal-meta">
                        <span><i class="far fa-calendar"></i> ${escapeHtml(course.date)}</span>
                        <span><i class="far fa-user"></i> NK Solar Tech Team</span>
                        <span><i class="far fa-comment"></i> ${course.comments || 0} Comments</span>
                    </div>
                    <h2>${escapeHtml(course.title)}</h2>
                    <p>${escapeHtml(course.content || course.description)}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    document.body.appendChild(modalContainer);
}

// Store Navigation
function initializeStoreNavigation() {
    const storeContainer = document.getElementById('storeContainer');
    const storePrev = document.getElementById('storePrev');
    const storeNext = document.getElementById('storeNext');
    
    if (!storeContainer || !storePrev || !storeNext) return;
    
    const storeCardWidth = 320 + 30; // Card width + gap
    let storeScrollPosition = 0;
    
    function updateStoreNavButtons() {
        const maxScroll = storeContainer.scrollWidth - storeContainer.clientWidth;
        storePrev.disabled = storeScrollPosition <= 0;
        storeNext.disabled = storeScrollPosition >= maxScroll;
    }
    
    storePrev.addEventListener('click', () => {
        storeScrollPosition = Math.max(0, storeScrollPosition - storeCardWidth);
        storeContainer.scrollTo({
            left: storeScrollPosition,
            behavior: 'smooth'
        });
        updateStoreNavButtons();
    });
    
    storeNext.addEventListener('click', () => {
        const maxScroll = storeContainer.scrollWidth - storeContainer.clientWidth;
        storeScrollPosition = Math.min(maxScroll, storeScrollPosition + storeCardWidth);
        storeContainer.scrollTo({
            left: storeScrollPosition,
            behavior: 'smooth'
        });
        updateStoreNavButtons();
    });
    
    storeContainer.addEventListener('scroll', () => {
        storeScrollPosition = storeContainer.scrollLeft;
        updateStoreNavButtons();
    });
    
    updateStoreNavButtons();
}

// Courses Navigation
function initializeCoursesNavigation() {
    const coursesContainer = document.getElementById('coursesContainer');
    const coursesPrev = document.getElementById('coursesPrev');
    const coursesNext = document.getElementById('coursesNext');
    
    if (!coursesContainer || !coursesPrev || !coursesNext) return;
    
    const cardWidth = 380 + 30; // Card width + gap
    let scrollPosition = 0;
    
    function updateNavButtons() {
        const maxScroll = coursesContainer.scrollWidth - coursesContainer.clientWidth;
        coursesPrev.disabled = scrollPosition <= 0;
        coursesNext.disabled = scrollPosition >= maxScroll;
    }
    
    coursesPrev.addEventListener('click', () => {
        scrollPosition = Math.max(0, scrollPosition - cardWidth);
        coursesContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateNavButtons();
    });
    
    coursesNext.addEventListener('click', () => {
        const maxScroll = coursesContainer.scrollWidth - coursesContainer.clientWidth;
        scrollPosition = Math.min(maxScroll, scrollPosition + cardWidth);
        coursesContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateNavButtons();
    });
    
    coursesContainer.addEventListener('scroll', () => {
        scrollPosition = coursesContainer.scrollLeft;
        updateNavButtons();
    });
    
    updateNavButtons();
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Re-initialize when navigating back to page
window.addEventListener('focus', () => {
    loadProducts();
    loadCourses();
});

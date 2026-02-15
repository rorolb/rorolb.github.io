// footer.js - Функциональность для футера
document.addEventListener('DOMContentLoaded', function() {
    console.log('Footer JS loaded'); // Для отладки
    
    initializeBackToTop();
    updateCurrentYear();
});

// Инициализация кнопки "Наверх"
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    console.log('Back to top button:', backToTopButton); // Для отладки
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Обновление текущего года
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    console.log('Year element:', yearElement); // Для отладки
    
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        console.log('Current year:', currentYear); // Для отладки
        yearElement.textContent = currentYear;
    } else {
        console.log('Year element not found!');
    }
}
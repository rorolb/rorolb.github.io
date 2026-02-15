// Улучшения для проекта
class MapEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addSmoothScrolling();
        this.addHeaderEffects();
        this.addLoadingStates();
        this.addKeyboardNavigation();
    }

    // Состояния загрузки
    addLoadingStates() {
        // Симуляция загрузки для демонстрации
        document.addEventListener('click', (e) => {
            if (e.target.closest('.map-area') || e.target.closest('.cta-button')) {
                const element = e.target.closest('.map-area') || e.target.closest('.cta-button');
                element.classList.add('loading');
                
                setTimeout(() => {
                    element.classList.remove('loading');
                }, 1000);
            }
        });
    }

    // Навигация с клавиатуры
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC закрывает popup
            if (e.key === 'Escape') {
                this.closePopup();
            }
            
            // Tab навигация по карте
            if (e.key === 'Tab' && document.querySelector('.popup-overlay.active')) {
                e.preventDefault();
                this.focusNextElement();
            }
        });
    }

    closePopup() {
        const popup = document.querySelector('.popup-overlay.active');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    focusNextElement() {
        // Логика для навигации Tab внутри popup
        const focusableElements = document.querySelectorAll('.popup button, .popup a, .popup input, .popup [tabindex]');
        // ... implementation
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new MapEnhancements();
});

// Вспомогательные функции
const utils = {
    // Дебаунс для оптимизации
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Форматирование чисел
    formatNumber(num) {
        return new Intl.NumberFormat('ru-RU').format(num);
    },

    // Проверка поддержки WebP
    async checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function() {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
};
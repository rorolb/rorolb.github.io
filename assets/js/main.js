// Инициализация приложения
let mapManager;
let popupManager;

document.addEventListener('DOMContentLoaded', function() {
    mapManager = new MapManager();
    popupManager = new PopupManager();
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Обработка формы
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Закрытие popup по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            popupManager.hidePopup();
        }
    });
});

// Функция для прокрутки к секции
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Переключение темы
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (body.classList.contains('dark-theme')) {
        // Переключаем на светлую тему
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        
        // Меняем иконку на солнце
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        // Переключаем на темную тему
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        
        // Меняем иконку на луну
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Функция для установки начальной темы
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        document.body.classList.add('light-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Инициализация темы при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setInitialTheme();
    
    // Обработчик клика по кнопке переключения темы
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

// Обработка формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Здесь можно добавить отправку формы
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Данные формы:', data);
    
    // Показываем сообщение об успехе
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    e.target.reset();
}

// Анимация счетчиков статистики
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Скорость анимации

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target;
            counter.classList.add('animated');
        }
    });
}

// Запуск анимации при скролле
function initCounterAnimation() {
    const statsSection = document.querySelector('.statistics');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(statsSection);
}


// Анимация счетчиков
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Анимация прогресс-баров
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// Запуск анимаций при скролле
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
}

function handleScroll() {
    const statsSection = document.querySelector('.statistics');
    if (isElementInViewport(statsSection)) {
        animateCounters();
        animateProgressBars();
        window.removeEventListener('scroll', handleScroll);
    }
}

window.addEventListener('scroll', handleScroll);
// Запустить при загрузке, если секция уже в viewport

handleScroll();

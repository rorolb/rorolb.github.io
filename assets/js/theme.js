// Управление темами
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Применяем сохранённую тему
        this.applyTheme(this.currentTheme);
        
        // Добавляем обработчик события
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Обновляем иконку
        this.updateIcon();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateCSSVariables(theme);
        this.updateIcon();
        this.updateScrollbar();
        
        // Добавляем класс для плавного перехода
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }
    
    updateCSSVariables(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            // Тёмная тема
            root.style.setProperty('--primary-color', '#1e293b');
            root.style.setProperty('--secondary-color', '#334155');
            root.style.setProperty('--background-color', '#0f172a');
            root.style.setProperty('--text-color', '#f8fafc');
            root.style.setProperty('--text-secondary', '#cbd5e1');
            root.style.setProperty('--accent-color', '#3b82f6');
            root.style.setProperty('--accent-hover', '#60a5fa');
            root.style.setProperty('--border-color', '#334155');
            root.style.setProperty('--card-bg', '#1e293b');
            root.style.setProperty('--header-bg', 'rgba(15, 23, 42, 0.95)');
            root.style.setProperty('--footer-bg', '#0f172a');
            root.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.3)');
        } else {
            // Светлая тема
            root.style.setProperty('--primary-color', '#ffffff');
            root.style.setProperty('--secondary-color', '#f8fafc');
            root.style.setProperty('--background-color', '#f1f5f9');
            root.style.setProperty('--text-color', '#1e293b');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--accent-color', '#2563eb');
            root.style.setProperty('--accent-hover', '#1d4ed8');
            root.style.setProperty('--border-color', '#e2e8f0');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--header-bg', 'rgba(255, 255, 255, 0.95)');
            root.style.setProperty('--footer-bg', '#ffffff');
            root.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Добавляем анимацию переключения
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    updateIcon() {
        if (this.currentTheme === 'dark') {
            // Для тёмной темы - солнце
            this.themeIcon.className = 'fa-solid fa-sun';
            this.themeIcon.title = 'Переключить на светлую тему';
        } else {
            // Для светлой темы - луна
            this.themeIcon.className = 'fa-solid fa-moon';
            this.themeIcon.title = 'Переключить на тёмную тему';
        }
    }
    
    updateScrollbar() {
        // Обновляем стили скроллбара для тёмной темы
        const style = document.createElement('style');
        style.id = 'scrollbar-style';
        
        if (this.currentTheme === 'dark') {
            style.textContent = `
                ::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.8);
                }
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, var(--accent-color), #3b82f6);
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #60a5fa, #3b82f6);
                }
            `;
        } else {
            style.textContent = `
                ::-webkit-scrollbar-track {
                    background: rgba(241, 245, 249, 0.8);
                }
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, var(--accent-color), #60a5fa);
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                }
            `;
        }
        
        // Удаляем старый стиль и добавляем новый
        const oldStyle = document.getElementById('scrollbar-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

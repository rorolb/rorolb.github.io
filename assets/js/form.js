// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8376017637:AAF5XsPxIgjoCWPuDpETKIHEVtgd7JXTBjY';
const TELEGRAM_CHAT_ID = '-4967705408';
const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeContactItems();
});

// Инициализация формы обратной связи
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);
}

// Инициализация кликабельных контактных элементов
function initializeContactItems() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', handleContactItemClick);
    });
}

// Обработчик отправки формы
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.submit-button');
    
    // Получаем данные из инпутов без name
    const inputs = form.querySelectorAll('input, textarea');
    const data = {
        name: inputs[0].value.trim(),     // Первый input - имя
        email: inputs[1].value.trim(),    // Второй input - email
        message: inputs[2].value.trim()   // Textarea - сообщение
    };

    // Валидация
    if (!validateFormData(data)) {
        return;
    }

    // Показываем загрузку
    setButtonLoading(submitButton, true);

    try {
        await sendToTelegram(data);
        showFormMessage('✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
    } catch (error) {
        console.error('Ошибка отправки:', error);
        showFormMessage('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Валидация данных формы
function validateFormData(data) {
    if (!data.name) {
        showFormMessage('❌ Пожалуйста, введите ваше имя', 'error');
        return false;
    }

    if (!data.email) {
        showFormMessage('❌ Пожалуйста, введите ваш email', 'error');
        return false;
    }

    if (!isValidEmail(data.email)) {
        showFormMessage('❌ Пожалуйста, введите корректный email', 'error');
        return false;
    }

    if (!data.message) {
        showFormMessage('❌ Пожалуйста, введите сообщение', 'error');
        return false;
    }

    return true;
}

// Проверка email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Отправка в Telegram
async function sendToTelegram(data) {
    const message = `
📧 <b>Новое сообщение с сайта</b>

<b>Имя:</b> ${escapeHtml(data.name)}
<b>Email:</b> ${escapeHtml(data.email)}

<b>Сообщение:</b>
${escapeHtml(data.message)}

📅 <i>${new Date().toLocaleString('ru-RU')}</i>
    `.trim();

    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };

    console.log('Отправка в Telegram:', payload);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(`Telegram API error: ${result.description || response.status}`);
    }

    if (!result.ok) {
        throw new Error(result.description || 'Unknown Telegram error');
    }

    return result;
}

// Экранирование HTML для безопасности
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Установка состояния загрузки кнопки
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        // Создаем спиннер если нет Font Awesome
        if (!document.querySelector('.fa-spinner')) {
            button.innerHTML = '⏳ Отправка...';
        } else {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        }
        button.style.opacity = '0.7';
    } else {
        button.disabled = false;
        button.innerHTML = 'Отправить сообщение';
        button.style.opacity = '1';
    }
}

// Показать сообщение формы
function showFormMessage(text, type) {
    // Создаем или находим элемент для сообщения
    let messageElement = document.querySelector('.form-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        document.querySelector('.contact-form').appendChild(messageElement);
    }

    messageElement.textContent = text;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';

    // Автоматическое скрытие для успешных сообщений
    if (type === 'success') {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Обработчик клика по контактным элементам
function handleContactItemClick(e) {
    const item = e.currentTarget;
    const textElement = item.querySelector('.contact-value') || item;
    const text = textElement.textContent.trim();
    
    if (text.includes('@') && text.includes('.')) {
        // Email - копируем в буфер
        copyToClipboard(text);
        showNotification('📧 Email скопирован в буфер обмена!', 'success');
    } else if (text.includes('+7') || (text.includes('(') && text.includes(')'))) {
        // Телефон - копируем в буфер (очищаем от скобок и пробелов)
        const phone = text.replace(/\D/g, '');
        copyToClipboard(phone);
        showNotification('📞 Телефон скопирован в буфер обмена!', 'success');
    } else if (text.includes('Москва')) {
        // Адрес - открываем карты
        openInMaps(text);
    }
}

// Копирование в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Ошибка копирования:', err);
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Открытие в картах
function openInMaps(address) {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://yandex.ru/maps/?text=${encodedAddress}`, '_blank');
}

// Показать временное уведомление
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-family: 'Nunito', sans-serif;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .form-message {
        display: none;
        padding: 12px 16px;
        border-radius: 8px;
        margin-top: 15px;
        font-weight: 500;
        text-align: center;
        font-family: 'Nunito', sans-serif;
    }
    
    .form-message.success {
        background: rgba(16, 185, 129, 0.1);
        color: #047857;
        border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .form-message.error {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    .contact-item {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .contact-item:hover {
        transform: translateX(5px);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .fa-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
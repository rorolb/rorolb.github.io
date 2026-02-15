// Управление popup окнами
class PopupManager {
    constructor() {
        this.overlay = document.getElementById('popupOverlay');
        this.popup = document.getElementById('popup');
        this.currentHeroDetail = null;
    }

    showPopup(areaInfo) {
        this.popup.innerHTML = this.generatePopupContent(areaInfo);
        this.overlay.classList.add('active');
        
        // Блокируем скролл body
        document.body.style.overflow = 'hidden';
        
        this.addPopupEventListeners();
    }

    hidePopup() {
        this.overlay.classList.remove('active');
        
        // Разблокируем скролл body
        document.body.style.overflow = '';
        
        mapManager.unblurBackground();
        this.currentHeroDetail = null;
    }

    generatePopupContent(areaInfo) {
        return `
            <div class="popup-content">
                <button class="popup-close">&times;</button>
                <div class="popup-header">
                    <h2 class="popup-title">${areaInfo.name}</h2>
                    <p class="popup-subtitle">${areaInfo.description}</p>
                </div>
                ${areaInfo.heroes && areaInfo.heroes.length > 0 ? 
                    this.generateHeroesGrid(areaInfo.heroes) : 
                    '<p style="color: white; text-align: center; padding: 40px 0;">Информация о героях скоро появится</p>'
                }
            </div>
        `;
    }

    // Остальные методы остаются без изменений...
    generateHeroesGrid(heroes) {
        return `
            <div class="heroes-grid">
                ${heroes.map(hero => `
                    <div class="hero-card" data-hero-id="${hero.id}">
                        <img src="${hero.image}" alt="${hero.name}" class="hero-image" onerror="this.src='https://avatars.mds.yandex.net/i?id=6ce3b81ea6739ebd0e70ca6b7b057b37e115e17c-5354373-images-thumbs&n=13'">
                        <h3 class="hero-name">${hero.name}</h3>
                        <p class="hero-role">${hero.role}</p>
                        <p class="hero-description">${hero.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showHeroDetail(hero) {
        this.currentHeroDetail = hero;
        this.popup.innerHTML = `
            <div class="popup-content">
                <button class="popup-close">&times;</button>
                <div class="hero-detail active">
                    <div class="detail-header">
                        <img src="${hero.image}" alt="${hero.name}" class="detail-image" onerror="this.src='assets/img/placeholder.jpg'">
                        <div class="detail-info">
                            <h3>${hero.name}</h3>
                            <p class="hero-role">${hero.role}</p>
                        </div>
                    </div>
                    <div class="detail-content">
                        <p>${hero.fullInfo}</p>
                    </div>
                    <button class="back-button">← Назад к списку героев</button>
                </div>
            </div>
        `;
        this.addDetailEventListeners();
    }

    addPopupEventListeners() {
        // Закрытие popup
        const closeBtn = this.popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => this.hidePopup());

        // Клик по оверлею
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hidePopup();
            }
        });

        // Обработка кликов по карточкам героев
        const heroCards = this.popup.querySelectorAll('.hero-card');
        heroCards.forEach(card => {
            card.addEventListener('click', () => {
                const heroId = parseInt(card.dataset.heroId);
                const areaId = this.getAreaIdFromPopup();
                const hero = areaData[areaId].heroes.find(h => h.id === heroId);
                if (hero) {
                    this.showHeroDetail(hero);
                }
            });
        });
    }

    addDetailEventListeners() {
        const closeBtn = this.popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => this.hidePopup());

        const backBtn = this.popup.querySelector('.back-button');
        backBtn.addEventListener('click', () => {
            const areaId = this.getAreaIdFromPopup();
            this.showPopup(areaData[areaId]);
        });
    }

    getAreaIdFromPopup() {
        const title = this.popup.querySelector('.popup-title');
        if (title) {
            const areaName = title.textContent;
            for (const [id, data] of Object.entries(areaData)) {
                if (data.name === areaName) {
                    return parseInt(id);
                }
            }
        }
        return 1;
    }
}

// Функции для работы с картой
class MapManager {
    constructor() {
        this.areas = document.querySelectorAll('.map-area');
        this.mapBody = document.querySelector('.map_body');
        this.init();
    }

    init() {
        this.setAreaNames();
        this.addEventListeners();
        this.loadBaseMap();
    }

    setAreaNames() {
        for (let i = 1; i <= 10; i++) {
            const nameElement = document.getElementById(`name_${i}`);
            if (nameElement) {
                nameElement.textContent = areaNames[i - 1];
            }
        }
    }

    loadBaseMap() {
        // Добавляем базовое изображение карты если нужно
        // Можно раскомментировать если есть файл с картой
        /*
        const baseMap = document.createElement('img');
        baseMap.src = 'assets/img/map/base-map.jpg';
        baseMap.style.width = '100%';
        baseMap.style.position = 'absolute';
        baseMap.style.top = '0';
        baseMap.style.left = '0';
        baseMap.style.zIndex = '0';
        this.mapBody.prepend(baseMap);
        */
    }

    addEventListeners() {
        this.areas.forEach((area, index) => {
            area.addEventListener('click', () => {
                this.handleAreaClick(index + 1);
            });
        });
    }

    handleAreaClick(areaId) {
        const areaInfo = areaData[areaId];
        if (areaInfo) {
            this.blurBackground();
            popupManager.showPopup(areaInfo);
        }
    }

    blurBackground() {
        this.mapBody.classList.add('blurred');
    }

    unblurBackground() {
        this.mapBody.classList.remove('blurred');
    }
}

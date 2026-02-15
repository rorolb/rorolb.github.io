// === СИСТЕМА ДОСТИЖЕНИЙ ===
console.log('🔧 AchievementSystem script loaded');

// Проверяем, не объявлен ли класс уже
if (typeof window.AchievementSystem === 'undefined') {
    console.log('🔧 Creating AchievementSystem class');
    window.AchievementSystem = class {
        constructor() {
            console.log('✅ AchievementSystem constructor called!');
            this.achievements = {
                'quiz1': { 
                    id: 'quiz1', 
                    name: 'Первая викторина', 
                    description: 'Пройдите первую викторину',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/1.png', 
                    earned: false 
                },
                'quiz3': { 
                    id: 'quiz3',
                    name: 'Третья викторина', 
                    description: 'Пройдите три викторины',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/2.png', 
                    earned: false 
                },
                'quiz5': { 
                    id: 'quiz5',
                    name: 'Пятая викторина', 
                    description: 'Пройдите пять викторин',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/3.png', 
                    earned: false 
                },
                'dnr': { 
                    id: 'dnr',
                    name: 'Знаток ДНР', 
                    description: 'Пройдите викторину по Донецкой Народной Республике',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/4.png', 
                    earned: false 
                },
                'lnr': { 
                    id: 'lnr',
                    name: 'Знаток ЛНР', 
                    description: 'Пройдите викторину по Луганской Народной Республике',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/5.png', 
                    earned: false 
                },
                'zaporoj': { 
                    id: 'zaporoj',
                    name: 'Знаток Запорожья', 
                    description: 'Пройдите викторину по Запорожской области',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/6.png', 
                    earned: false 
                },
                'herson': { 
                    id: 'herson',
                    name: 'Знаток Херсона', 
                    description: 'Пройдите викторину по Херсонской области',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/7.png', 
                    earned: false 
                },
                'krim': { 
                    id: 'krim',
                    name: 'Знаток Крыма', 
                    description: 'Пройдите викторину по Республике Крым',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/8.png', 
                    earned: false 
                },
                '100score': { 
                    id: '100score',
                    name: 'Отличник', 
                    description: 'Наберите 100% правильных ответов',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/9.png', 
                    earned: false 
                },
                '0score': { 
                    id: '0score',
                    name: 'Новичок', 
                    description: 'Пройдите викторину без правильных ответов',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/10.png', 
                    earned: false 
                },
                '1place': { 
                    id: '1place',
                    name: 'Первое место', 
                    description: 'Займите первое место в таблице лидеров',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/11.png', 
                    earned: false 
                },
                '2place': { 
                    id: '2place',
                    name: 'Второе место', 
                    description: 'Займите второе место в таблице лидеров',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/12.png', 
                    earned: false 
                },
                '3place': { 
                    id: '3place',
                    name: 'Третье место', 
                    description: 'Займите третье место в таблице лидеров',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/13.png', 
                    earned: false 
                },
                '1_3place': { 
                    id: '1_3place',
                    name: 'В тройке лучших', 
                    description: 'Попадите в топ-3 лидеров',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/14.png', 
                    earned: false 
                },
                '30second': { 
                    id: '30second',
                    name: 'Скоростник', 
                    description: 'Пройдите викторину менее чем за 30 секунд',
                    image: 'https://nalojka.github.io/assets/img/minecraft_icons/15.png', 
                    earned: false 
                }
            };
            
            this.quizCount = 0;
            this.completedRegions = new Set();
            this.achievementQueue = [];
            this.isShowingAchievement = false;
            this.imagesPreloaded = false;
        }

        async init() {
            console.log('✅ AchievementSystem init called!');
            await this.loadAchievements();
            await this.preloadImages();
            this.setupAchievementsContainer();
        }

        async preloadImages() {
            console.log('🖼️ Preloading achievement images...');
            const preloadPromises = [];
            
            Object.values(this.achievements).forEach(achievement => {
                const img = new Image();
                const promise = new Promise((resolve) => {
                    img.onload = () => {
                        console.log(`✅ Preloaded: ${achievement.image}`);
                        resolve();
                    };
                    img.onerror = () => {
                        console.log(`❌ Failed to preload image: ${achievement.image}`);
                        resolve(); // Resolve anyway to continue
                    };
                });
                img.src = achievement.image;
                preloadPromises.push(promise);
            });

            await Promise.all(preloadPromises);
            this.imagesPreloaded = true;
            console.log('✅ All achievement images preloaded');
        }

        async loadAchievements() {
            try {
                const saved = localStorage.getItem('quiz_achievements');
                if (saved) {
                    const data = JSON.parse(saved);
                    // Update earned status for existing achievements
                    Object.keys(this.achievements).forEach(key => {
                        if (data.achievements && data.achievements[key]) {
                            this.achievements[key].earned = data.achievements[key].earned;
                        }
                    });
                    this.quizCount = data.quizCount || 0;
                    this.completedRegions = new Set(data.completedRegions || []);
                    console.log('✅ Achievements loaded from localStorage');
                }
            } catch (error) {
                console.error('❌ Error loading achievements:', error);
            }
        }

        saveAchievements() {
            const data = {
                achievements: this.achievements,
                quizCount: this.quizCount,
                completedRegions: Array.from(this.completedRegions)
            };
            localStorage.setItem('quiz_achievements', JSON.stringify(data));
            console.log('💾 Achievements saved to localStorage');
        }

        setupAchievementsContainer() {
            let container = document.getElementById('achievements-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'achievements-container';
                container.className = 'achievements-container';
                document.body.appendChild(container);
                console.log('✅ Achievements container created');
            }
        }

        unlockAchievement(achievementId) {
            if (!this.achievements[achievementId]) {
                console.log(`❌ Achievement ${achievementId} not found`);
                return false;
            }

            if (this.achievements[achievementId].earned) {
                console.log(`ℹ️ Achievement ${achievementId} already earned`);
                return false;
            }

            console.log(`🎉 Unlocking achievement: ${achievementId}`);
            this.achievements[achievementId].earned = true;
            this.addToQueue(achievementId);
            this.saveAchievements();
            return true;
        }

        addToQueue(achievementId) {
            this.achievementQueue.push(achievementId);
            this.processQueue();
        }

        processQueue() {
            if (this.isShowingAchievement || this.achievementQueue.length === 0) {
                return;
            }

            const achievementId = this.achievementQueue.shift();
            this.showAchievement(achievementId);
        }

        showAchievement(achievementId) {
            this.isShowingAchievement = true;
            const achievement = this.achievements[achievementId];
            const container = document.getElementById('achievements-container');
            
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-notification';
            
            // Проверяем наличие изображения и добавляем fallback
            const imgHtml = achievement.image && achievement.image !== '' ? 
                `<img src="${achievement.image}" alt="${achievement.name}" onerror="this.style.display='none'">` :
                '<div style="width:50px;height:50px;background:#4CAF50;display:flex;align-items:center;justify-content:center;border-radius:8px;color:white;font-size:24px;"><i class="fa-solid fa-trophy"></i></div>';
            
            achievementElement.innerHTML = `
                <div class="achievement-icon">
                    ${imgHtml}
                </div>
                <div class="achievement-text">
                    <div class="achievement-title">Достижение разблокировано!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
            
            container.appendChild(achievementElement);

            // Анимация появления
            setTimeout(() => {
                achievementElement.classList.add('show');
            }, 100);

            // Автоматическое скрытие через 4 секунды
            setTimeout(() => {
                achievementElement.classList.remove('show');
                setTimeout(() => {
                    if (achievementElement.parentNode) {
                        achievementElement.parentNode.removeChild(achievementElement);
                    }
                    this.isShowingAchievement = false;
                    this.processQueue();
                }, 500);
            }, 4000);
        }

        incrementQuizCount() {
            this.quizCount++;
            this.checkQuizCountAchievements();
            this.saveAchievements();
        }

        checkQuizCountAchievements() {
            if (this.quizCount >= 1) {
                this.unlockAchievement('quiz1');
            }
            if (this.quizCount >= 3) {
                this.unlockAchievement('quiz3');
            }
            if (this.quizCount >= 5) {
                this.unlockAchievement('quiz5');
            }
        }

        addCompletedRegion(region) {
            this.completedRegions.add(region);
            this.checkRegionAchievements();
            this.saveAchievements();
        }

        checkRegionAchievements() {
            const regionMap = {
                'Донецкая Народная Республика': 'dnr',
                'Луганская Народная Республика': 'lnr',
                'Запорожская область': 'zaporoj',
                'Херсонская область': 'herson',
                'Республика Крым': 'krim'
            };

            this.completedRegions.forEach(region => {
                const achievementId = regionMap[region];
                if (achievementId) {
                    this.unlockAchievement(achievementId);
                }
            });
        }

        onQuizComplete(score, timeSeconds, totalQuestions, region) {
            console.log('📝 Quiz completed - checking achievements');
            console.log(`📊 Score: ${score}, Time: ${timeSeconds}s, Region: ${region}`);
            
            // Добавляем регион в пройденные
            if (region) {
                this.addCompletedRegion(region);
            }

            // Увеличиваем счетчик викторин
            this.incrementQuizCount();

            // Проверяем достижения по очкам
            const totalPossible = totalQuestions * 10; // 10 очков за вопрос
            const percentage = (score / totalPossible) * 100;
            
            if (percentage === 100) {
                this.unlockAchievement('100score');
            }
            
            if (score === 0) {
                this.unlockAchievement('0score');
            }

            // Проверяем достижения по времени
            if (timeSeconds < 30) {
                this.unlockAchievement('30second');
            }
        }

        checkLeaderboardAchievements(leaderboardData, playerName) {
            if (!leaderboardData || !playerName) return;

            // Находим позицию игрока
            const playerIndex = leaderboardData.findIndex(entry => 
                entry.name === playerName
            );

            if (playerIndex !== -1) {
                const position = playerIndex + 1;
                
                if (position === 1) {
                    this.unlockAchievement('1place');
                }
                
                if (position === 2) {
                    this.unlockAchievement('2place');
                }
                
                if (position === 3) {
                    this.unlockAchievement('3place');
                }
                
                if (position <= 3) {
                    this.unlockAchievement('1_3place');
                }
            }
        }

        getEarnedAchievements() {
            return Object.values(this.achievements).filter(a => a.earned);
        }

        getAchievementProgress() {
            const total = Object.keys(this.achievements).length;
            const earned = this.getEarnedAchievements().length;
            return {
                earned,
                total,
                percentage: Math.round((earned / total) * 100)
            };
        }

        resetAchievements() {
            Object.keys(this.achievements).forEach(key => {
                this.achievements[key].earned = false;
            });
            this.quizCount = 0;
            this.completedRegions.clear();
            this.achievementQueue = [];
            this.isShowingAchievement = false;
            localStorage.removeItem('quiz_achievements');
            
            const container = document.getElementById('achievements-container');
            if (container) {
                container.innerHTML = '';
            }
            
            console.log('🔄 All achievements reset');
        }

        isUnlocked(achievementId) {
            return this.achievements[achievementId]?.earned || false;
        }
    }
} else {
    console.log('ℹ️ AchievementSystem already exists');
}

    document.addEventListener('DOMContentLoaded', function() {
            const firstVisitKey = 'isFirstVisit';
            const isFirstVisit = localStorage.getItem(firstVisitKey) === null;

            if (isFirstVisit) {
                localStorage.setItem(firstVisitKey, 'false');

                var userLang = navigator.language || navigator.userLanguage;
                userLang = userLang.substring(0, 2);
                var supportedLanguages = {
                    'en': '/en',
                    'ja': '/ja',
                    'zh': '/',
                };

                if (supportedLanguages[userLang]) {
                    var currentUrl = window.location.href;
                    var currentPath = window.location.pathname;

                    if (!currentPath.startsWith(supportedLanguages[userLang])) {
                        window.location.href = supportedLanguages[userLang];
                    }
                } else {
                    var currentPath = window.location.pathname;
                    if (!currentPath.startsWith(supportedLanguages['en'])) {
                        window.location.href = supportedLanguages['en'];
                    }
                }
            }
        });
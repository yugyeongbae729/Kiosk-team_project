// hp키오스크
const KioskHpStart = document.getElementById('KioskHpStart');
KioskHpStart.addEventListener('click', () => {
    location.href = '/hospital'
})

// mac키오스크
const KioskMacStart = document.getElementById('KioskMacStart');
KioskMacStart.addEventListener('click', () => {
    location.href = '/KioskMacSelect';
})

// 메인화면
const head_learn_bt = document.getElementById('head_learn_bt');
head_learn_bt.addEventListener('click', () => {
    location.href = '/';
});

window.onload = function () {
    const currentState = localStorage.getItem('translationStatus');

    if (currentState === 'true') {
        const elementsToTranslate = [
            { id: 'title'},
            { id: 'subtitle'},
            { id: 'KioskMacStart'},
            { id: 'KioskHpStart'},
            { id: 'KioskOpStart'},
            { id: 'KioskTrStart'},
            { id: 'footerText'}
        ];

        const originalTexts = {};
        const translatedTexts = {};

        const API_KEY = 'AIzaSyDTtd9JTFAIkuR4rwLjU1IRuL2WEO97rh0'; // 구글 번역 API 키를 여기에 입력하세요.

        // 번역 함수
        async function translateText(text, targetLang) {
            const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: text, target: targetLang })
            });
            if (!response.ok) {
                throw new Error('번역 요청 실패');
            }
            const data = await response.json();
            return data.data.translations[0].translatedText;
        }

        // 번역 토글 함수
        async function toggleTranslation() {
            try {
                for (const element of elementsToTranslate) {
                    const elem = document.getElementById(element.id)
                    const textElem = elem.tagName === 'P' ? elem : elem.querySelector('p') || elem;
                    originalTexts[element.id] = textElem.innerHTML;
                    
                    if (!translatedTexts[element.id]) {
                        translatedTexts[element.id] = await translateText(originalTexts[element.id], 'en');
                    }

                    textElem.innerHTML = translatedTexts[element.id];
                }
                // 현재 번역 상태를 로컬 스토리지에 저장
            } catch (error) {
                console.error('번역 중 오류 발생:', error);
            }
        }

        toggleTranslation(); // 저장된 상태 적용
    }
}
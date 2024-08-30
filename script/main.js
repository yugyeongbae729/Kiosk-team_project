document.addEventListener('DOMContentLoaded', function () {
    const translateButton = document.getElementById('translateButton');
    const buttons = document.querySelectorAll('.game-button, .game-button1');
    const startButtons = {
        'startStdBtn': '/study',
        'startGameBtn': '/game',
        'startLoginBtn': '/login',
        'startHelpBtn': '/help'
    };

    // 시작 버튼에 이벤트 리스너 추가
    Object.keys(startButtons).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                location.href = startButtons[id];
            });
        }
    });

    // 모든 '시작하기' 버튼에 클릭 효과 추가
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300); // 300ms는 CSS 트랜지션 시간과 일치해야 합니다.
        });
    });

    translateButton.addEventListener('click', () => {
        let currentState = localStorage.getItem('translationStatus');
        
        let newState = currentState === 'true' ? 'false' : 'true';
        localStorage.setItem('translationStatus', newState);

        const originalTexts = {};
        const translatedTexts = {};
        const elementsToTranslate = [
            { id: 'titleText', text : '키오스크 실습 교육 플랫폼'},
            { id: 'kioskTitle', text : '키오스크 <br>실습 교육'},
            { id: 'startStdBtn', text : '시작하기'},
            { id: 'wordGameTitle', text : '낱말 학습 <br> 게임'},
            { id: 'startGameBtn', text : '시작하기'},
            { id: 'loginTitle', text : '로그인/<br>회원가입'},
            { id: 'startLoginBtn', text : '시작하기'},
            { id: 'helpTitle', text : '도움말'},
            { id: 'startHelpBtn', text : '시작하기'},
            { id: 'footerText', text : '© 일단 이거 세번만 해볼까요?'}
        ];

        if (localStorage.getItem('translationStatus') === 'true') {
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
        }else{
            for (const element of elementsToTranslate) {
                const elem = document.getElementById(element.id)
                elem.innerHTML = element.text
            }
        }
    })
})
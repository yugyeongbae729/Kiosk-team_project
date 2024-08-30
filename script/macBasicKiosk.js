const macStartBtn = document.getElementById('macStartBtn');
const macStartModal = document.getElementById('macStartModal')
const macIdxS = document.getElementById('macIdxS');
const macIdxT = document.getElementById('macIdxT');

const selectOrdering = document.getElementById('selectOrdering');
const selectOrderingBtn = document.getElementById('selectOrderingBtn');

const selectPlace = document.getElementById('selectPlace')
const selectPlaceBtn = document.getElementById('selectPlaceBtn')

const lodingPlace = document.getElementById('lodingPlace');;

window.onload = function () {
    const currentState = localStorage.getItem('translationStatus');
    if (currentState==='true') {

        if (currentState === 'true') {
            const elementsToTranslate = [
                { id: 'pointText'},
                { id: 'macStartBtn'},
                { id: 'translateButton'},
                { id: 'helpText'},
                { id: 'startText'},
                { id: 'macIdxS'},
                { id: 'macIdxT'},
                { id: 'orderingText'},
                { id: 'selectOrderingBtn'},
                { id: 'placeText'},
                { id: 'selectPlaceBtn'},
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

        const list = [];

        document.querySelectorAll('.pContainer').forEach(item => {
            list.push({ text: item.textContent })
        })

        fetch('/send-flask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(list),
        })
            .then(response => response.json())
            .then(data => {
                const pCon = document.querySelectorAll('.pContainer p');
                data.forEach((item, index) => {
                    pCon[index].innerText = item;
                })
            }).then(data => {
                lodingPlace.style.display = 'none';
                let audioStart = document.getElementById('audioStart');
                audioStart.currentTime = 0;
                audioStart.play();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }else{
        lodingPlace.style.display = 'none';
        let audioStart = document.getElementById('audioStart');
        audioStart.currentTime = 0;
        audioStart.play();
    }
};

macStartBtn.addEventListener('touchstart', () => {
    macStartModal.style.display = 'flex';
    selectPlace.style.display ='flex';
    macStartBtn.classList.remove('blinkingBorder');

    macIdxS.classList.add('blinkingBorder');

    let audioPlace = document.getElementById('audioPlace')
    audioPlace.currentTime = 0;
    audioPlace.play();
})

selectPlaceBtn.addEventListener('click', () => {
    selectPlace.style.display = 'none';
})

macIdxS.addEventListener('touchstart', () => {
    location.href = '/macBasicKioIndex';
})

macIdxT.addEventListener('touchstart', () => {
    location.href = '/macBasicKioIndex';
})

selectOrderingBtn.addEventListener('touchstart', () => {
    selectOrdering.style.display = 'none';
})

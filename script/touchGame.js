const modal = document.getElementById("gameModal");
const closeModal = document.querySelector(".gameModalClose");

// 닫기 버튼 클릭 시 모달 닫기
closeModal.onclick = function () {
    modal.style.display = "none";
}

// 모달 외부 클릭 시 모달 닫기
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ==================================================== 게임 관련 ==========================================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;  // 선이 그려지는 중인가?
let startX, startY;     // 시작 좌표
const images = [];
let lines = []; // 그려진 선들의 배열
// ==================================================== 게임 관련 ===========================================

// ==================================================== 모달 관련 ===========================================
const gameModal = document.getElementById('gameModal');
const closeBtn = document.querySelector('.gameModalClose');
const startGameBtn = document.getElementById('startGameBtn');
const startModal = document.getElementById('startModal');

const modalGameImage = document.getElementById('modalGameImage');
const modalGameAns = document.getElementById('modalGameAns');
const modalGameEX = document.getElementById('modalGameEX');
const resetBtn = document.getElementById('resetBtn');
const mainBtn = document.getElementById('mainBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let imgTextName;
let currentIndex;
let resCnt;

// =========================================================================================================

// db에서 이미지 데이터 호출
document.addEventListener('DOMContentLoaded', () => {
    fetch('/game/data')
        .then(response => response.json())
        .then(data => {
            roadimagesData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

// db에서 불러온 이미지 데이터 저장
function roadimagesData(imagesDatas) {
    resCnt = 0;
    currentIndex = 0;
    imgTextName = [];
    imagesDatas.forEach((data, index) => {
        const img = new Image();
        img.onload = function () {
            img.name = data.IMG_NAME;
            img.alt = data.IMG_INFO;
            imgTextName.push(data.IMG_NAME);
            images[index] = img;
            if (images.length === imagesDatas.length) {
                imgTextName = shuffleArray(imgTextName);
                startGameBtn.addEventListener('touchstart', () => {
                    startModal.style.display = 'none';
                    drawImages();
                })
            }
        };

        img.onerror = function () {
            console.error(`Failed to load image: ${data.IMG_PATH}`);
        };
        let imgPath = data.IMG_GROUP + data.IMG_PATH;
        img.src = imgPath;
    });
}

// img, text canvas에 그리기
function drawImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    images.forEach((img, index) => {
        const x = 30;
        const y = 30 + index * 260;

        ctx.strokeStyle = '#ff6d33';
        ctx.lineWidth = 5;

        ctx.drawImage(img, x, y, 250, 180);

        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5

        ctx.fillStyle = '#000';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';

        ctx.strokeRect(x + 445, y + 63, 230, 40);
        ctx.fillText(imgTextName[index], x + 560, y + 90);
    });
}

// 이미지 이름 순서 바꾸기
function shuffleArray(array) {
    const newArray = array.slice()
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 선그리기 
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', drawLine);
canvas.addEventListener('touchend', stopDrawing);

// 클릭
function startDrawing(event) {
    isDrawing = true;
    lines.push([]);
    const touch = event.touches[0];
    startX = touch.clientX - canvas.getBoundingClientRect().left;
    startY = touch.clientY - canvas.getBoundingClientRect().top;
}

// 드래그
function drawLine(event) {
    if (!isDrawing) return;
    event.preventDefault(); // 터치 이벤트가 발생하면 기본 마우스 이벤트를 방지합니다.
    const currentLine = lines[lines.length - 1];
    const touch = event.touches[0];
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;
    const previousPoint = currentLine.length > 0 ? currentLine[currentLine.length - 1] : { x: startX, y: startY };

    ctx.beginPath();
    ctx.moveTo(previousPoint.x, previousPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    currentLine.push({ x, y });
}
// 끝났을때
function stopDrawing() {
    isDrawing = false;
}

// 터치 시작점 img이름 불러오기
let downName = '';
canvas.addEventListener('touchstart', function (event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;

    images.forEach((img) => {
        const imgX = 30;
        const imgY = 30 + images.indexOf(img) * 260;
        const imgWidth = 250;
        const imgHeight = 180;

        if (mouseX >= imgX && mouseX <= imgX + imgWidth &&
            mouseY >= imgY && mouseY <= imgY + imgHeight) {
            downName = img.name;
        }
    });
});

// 터치 끝점 img 이름 불러오기
let upName = '';
canvas.addEventListener('touchend', function (event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.changedTouches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;

    images.forEach((img, index) => {
        const imgX = 560;
        const imgY = 93 + images.indexOf(img) * 260;
        const imgWidth = 230;
        const imgHeight = 40;

        if (mouseX >= imgX && mouseX <= imgX + imgWidth &&
            mouseY >= imgY && mouseY <= imgY + imgHeight) {
            upName = imgTextName[index];
        }
    });

    if (upName == downName && upName != '' && downName != '') {
        alert("정답입니다.")
        resCnt += 1;
    } else {
        if (lines.length > 0) {
            alert("오답입니다. 다시한번 시도해보세요");
            const lastLine = lines.pop();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawImages();
            lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line[0].x, line[0].y);
                line.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            });
        }
    }
    if (resCnt == 5) {
        modalGameImage.src = images[0].src;
        modalGameAns.innerText = images[0].name;
        modalGameEX.innerText = images[0].alt;
        gameModal.style.display = 'flex'; // 모달을 보이게 설정
    }
});

// ==================================================== 모달 관련 ===========================================

// 게임 초기화
resetBtn.addEventListener('touchstart', () => {
    gameModal.style.display = 'none';
    location.href = '/game';
})

// 메인화면으로 이동
mainBtn.addEventListener('touchstart', () => {
    gameModal.style.display = 'none';
    location.href = '/';
})

closeBtn.addEventListener('touchstart', () => {
    gameModal.style.display = 'none'; // 모달을 숨김
});

window.addEventListener('touchstart', (event) => {
    if (event.target === gameModal) {
        gameModal.style.display = 'none'; // 모달 외부를 클릭했을 때 모달을 숨김
    }
});

// modalImage 변경하기
function showImage(index) {
    modalGameImage.src = images[index].src;
    modalGameAns.innerText = images[index].name;
    modalGameEX.innerText = images[index].alt;
}

// 모달 이미지 prev
prevBtn.addEventListener('touchstart', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    showImage(currentIndex);
});

// 모달 이미지 next
nextBtn.addEventListener('touchstart', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    showImage(currentIndex);
});
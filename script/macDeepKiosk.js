const macStartBtn = document.getElementById('macStartBtn');
const macIdxS = document.getElementById('macIdxS');
const macIdxT = document.getElementById('macIdxT');
const goMain = document.getElementById('goMain')


macStartBtn.addEventListener('touchstart', () => {
    macStartModal.style.display= 'flex';
})

macIdxS.addEventListener('touchstart', () => {
    location.href = '/macDeepKioIndex';
})

macIdxT.addEventListener('touchstart', () => {
    location.href = '/macDeepKioIndex';
})

goMain.addEventListener('click', () => {
    location.href = '/KioskMacSelect';
})


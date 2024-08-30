const loginFrm = document.getElementById('loginFrm');
const grandfather = document.querySelector('.grandfather');
const grandmother = document.querySelector('.grandmother');

loginFrm.addEventListener('submit', (event) => {
    event.preventDefault();

    // 폼 데이터를 FormData 객체에 담습니다.
    const formData = new FormData(loginFrm);

    // FormData를 JSON으로 변환합니다.
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('/user/login', {
        method: 'POST', // 요청 방법
        headers: {
            'Content-Type': 'application/json' // JSON 데이터 타입 명시
        },
        body: JSON.stringify(data) // 데이터를 JSON 문자열로 변환하여 전송
    })
        .then(response => response.json()) // 서버의 응답을 JSON으로 변환
        .then(result => {
            grandfather.classList.add('move-right');
            grandmother.classList.add('move-left');
            setTimeout(() => {
                const modal = document.getElementById('loginModal');
                modal.style.display = 'flex';
            }, 1000);
        })
        .catch(error => {
            alert("아이디 혹은 비밀번호를 잘못 입력하셨습니다.");
            loginFrm.reset();
        });
});

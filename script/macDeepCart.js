// 이전으로, 처음으로
const headLearnBt = document.getElementById('headLearnBt')
const headLearnBtRight = document.getElementById('headLearnBtRight')

// 주문 첫번 째 모달
const orderModal = document.getElementById('orderModal');
const orderCancel = document.getElementById('orderCancel');
const onePrice = document.getElementById('onePrice');
const burgerSetImg = document.getElementById('burgerSetImg');
const burgerSingImg = document.getElementById('burgerSingImg');

// 단품 선택 버튼
const addToCartO = document.getElementById('addToCartO');

// 세트 선택 버튼
const addToCartS = document.getElementById('addToCartS');

// 주문 두번 째 모달 (사이드)
const setModal = document.getElementById('setModal');
const sideCancel = document.getElementById('sideCancel');
const selectSide = document.getElementById('selectSide');

// 주문 세번째 모달 (음료)
const beverageModal = document.getElementById('beverageModal');
const selectBeverage = document.getElementById('selectBeverage');
const beverageCancel = document.getElementById('beverageCancel')

// 주문 마지막 모달 (세트 보여주기)
const setEndModal = document.getElementById('setEndModal');
const setEndBtn = document.getElementById('setEndBtn');

// ==================================================장바구니===============================================================
let cart = JSON.parse(localStorage.getItem('cart')) || []; // 로컬 스토리지에서 카트 데이터를 불러옴
$(document).ready(function () {

    updateCart();

    $('.nonBergerItem').click(function () {
        let cartName = $(this).data('name')
        let cartPrice = $(this).data('price')
        let cartPath = $(this).data('path')
        cart.push({cartName : cartName, cartPrice : cartPrice, cartPath : cartPath})

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCart();
    })

});

// 카트 내 가격계산
function updateCart() {
    // cart = JSON.parse(localStorage.getItem('cart')) || [];
    let sumPrice = 0;

    cart.forEach(item => {
        sumPrice += item.cartPrice
    });

    $("#totalPrice").text('￦'+sumPrice);
}

// 모달 관련 코드

// =================================================이전으로, 처음으로===========================================================

headLearnBt.addEventListener('click', ()=>{
    location.href = '/macDeepKioMain'
})

headLearnBtRight.addEventListener('click', ()=>{
    location.href = '/KioskMacSelect'
})

// ==================================================주문 첫번 째 모달===========================================================

// 세트선택 내용 담을 배열생성
let setArray = [];

let selectSetName = '';
document.querySelectorAll('.burgerItem').forEach(item => {
    item.addEventListener('click', function () {
        const name = this.dataset.name;
        fetch('/macKiosk/macChoiceS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({IMG_NAME:name})
        })
        .then(response => response.json())
        .then(data => {
            selectSetName = data[0].IMG_NAME
            burgerSetImg.src = data[0].IMG_GROUP+data[0].IMG_PATH
            burgerSingImg.src = data[1].IMG_GROUP+data[1].IMG_PATH
            onePrice.innerText = '￦'+data[1].IMG_PRICE;
            orderModal.style.display = 'flex';
            setArray.push({ SET_PAHT : data[0].IMG_GROUP+data[0].IMG_PATH, SET_NAME : data[0].IMG_NAME, SET_PRICE : data[0].IMG_PRICE, PATH : data[1].IMG_GROUP+data[1].IMG_PATH, NAME : data[1].IMG_NAME, PRICE : data[1].IMG_PRICE })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        }) 
    });
});

// 주문 취소 버튼
orderCancel.addEventListener('click', () =>  {
    orderModal.style.display = 'none';
    setArray=[];
});

// 단품 선택 버튼
addToCartO.addEventListener('click', () => {
    cart.push({cartName : setArray[0].NAME, cartPrice : setArray[0].PRICE, cartPath : setArray[0].PATH})
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart();
    orderModal.style.display = 'none';
    setArray=[];
})

// 세트 선택 버튼
$(document).ready(function (){
    addToCartS.addEventListener('click', () => {
        fetch('/macKiosk/macSelectS')
            .then(response => response.json())
            .then(data => {
                selectSide.innerHTML = '';
                data.forEach(item => {
                    const sideMenuItem = document.createElement('div');
                    sideMenuItem.classList.add('sideMenuItem');

                    sideMenuItem.dataset.path = item.IMG_GROUP+item.IMG_PATH
                    
                    const img = document.createElement('img');
                    img.src = item.IMG_GROUP+item.IMG_PATH;
                    
                    const name = document.createElement('h3');
                    name.innerText = item.IMG_NAME;
                    
                    sideMenuItem.appendChild(img);
                    sideMenuItem.appendChild(name);
                    
                    selectSide.appendChild(sideMenuItem);
                });
                orderModal.style.display = 'none';
                setModal.style.display = 'flex';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            }) 
    })
})

// 세트 - 사이드 취소
sideCancel.addEventListener('click', () =>{
    setModal.style.display = 'none';
    setArray=[];
})

$(document).ready(function (){
    $(document).on('click', '.sideMenuItem', (event) => {
        setArray.push({NAME : $(event.currentTarget).find('h3').text(), PATH : $(event.currentTarget).data('path') })
        fetch('/macKiosk/macSelectB')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const beverageMenuItem = document.createElement('div');
                    beverageMenuItem.classList.add('beverageMenuItem');
                    
                    beverageMenuItem.dataset.path = item.IMG_GROUP+item.IMG_PATH

                    const img = document.createElement('img');
                    img.src = item.IMG_GROUP+item.IMG_PATH;
                    
                    const name = document.createElement('h3');
                    name.innerText = item.IMG_NAME;
                    
                    beverageMenuItem.appendChild(img);
                    beverageMenuItem.appendChild(name);
                    
                    selectBeverage.appendChild(beverageMenuItem);
                });
                setModal.style.display = 'none';
                beverageModal.style.display = 'flex';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            }) 
    })
})
// 세트 - 음료 취소
beverageCancel.addEventListener('click', () =>{
    beverageModal.style.display='none';
    setArray=[];
})

$(document).ready(function (){
    $(document).on('click', '.beverageMenuItem', (event) => {
        setArray.push({NAME : $(event.currentTarget).find('h3').text(), PATH : $(event.currentTarget).data('path') })   

        $('.setMaintitle').text(setArray[0].SET_NAME)
        $('.setMainprice').text('￦'+setArray[0].SET_PRICE)
        $('.setMainImg').attr('src', setArray[0].SET_PAHT)

        function updateContent() {
            $('.setSubCon').empty(); // 기존 콘텐츠 삭제

            setArray.forEach(item => {
                let subItem = `
                    <div class="setSubItem">
                        <img src="${item.PATH}"class="setSubImg">
                        <h3 class="setSubTxt">${item.NAME}</h3>
                    </div>
                `;
                $('.setSubCon').append(subItem); // 새로운 콘텐츠 추가
            });
        }

        updateContent();
        
        beverageModal.style.display='none';
        setEndModal.style.display='flex';
    })

    $('#setEndBtn').on('click', () => {
        cart.push({cartName : setArray[0].SET_NAME, cartPrice : setArray[0].SET_PRICE, cartPath : setArray[0].SET_PAHT})
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        setArray=[];

        setEndModal.style.display = 'none';
    })
    
    $('#setBackBtn').on('click', () => {
        setEndModal.style.display = 'none';
        setArray=[];
    })

})

$(document).ready(function() {
    function renderCart() {
        let sumPrice = 0;
        $('#cartItemsList').empty();

        for (let itemName in itemCounts) {
            let item = itemCounts[itemName];
            sumPrice += item.totalPrice;
            $('#cartItemsList').append(`
                <li>
                    <img src="${item.cartPath}">
                    <h1>${item.cartName}</h1>
                    <h3>가격: ${item.totalPrice}원<br>
                    &nbsp&nbsp&nbsp <button class='decincBtn removeItem' data-item='${item.cartName}'>-</button>
                    ${item.count} <button class='decincBtn addItem' data-item='${item.cartName}'>+</button></h3>
                </li>
            `);
        }
        $('#paymentSumText').text(sumPrice+'원')
        localStorage.setItem('cart', JSON.stringify(cart)); // 로컬 스토리지 업데이트
    }

    let itemCounts = {};
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    $('#paymentBtn').on('click', () => {
        itemCounts = {};

        cart.forEach(item => {
            if (itemCounts[item.cartName]) {
                itemCounts[item.cartName].count++;
                itemCounts[item.cartName].totalPrice += item.cartPrice;
            } else {
                itemCounts[item.cartName] = {
                    ...item,
                    count: 1,
                    totalPrice: item.cartPrice
                };
            }
        });

        renderCart();
        $('#paymentModal').css('display', 'flex');
    });

    // 추가버튼 핸들러
    $('#cartItemsList').on('click', '.addItem', function() {
        let itemName = $(this).data('item');
        itemCounts[itemName].count++;
        itemCounts[itemName].totalPrice += itemCounts[itemName].cartPrice;
        // 로컬 스토리지에 저장된 cart 배열 업데이트
        cart.push({
            cartName: itemCounts[itemName].cartName,
            cartPrice: itemCounts[itemName].cartPrice,
            cartPath: itemCounts[itemName].cartPath
        })

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });

    // 제거 버튼 핸들러
    $('#cartItemsList').on('click', '.removeItem', function() {
        
        let itemName = $(this).data('item');
        if (itemCounts[itemName].count > 1) {
            itemCounts[itemName].count--;
            itemCounts[itemName].totalPrice -= itemCounts[itemName].cartPrice;

            // 로컬 스토리지에 저장된 cart 배열 업데이트
            const index = cart.findIndex(item => item.cartName === itemName);
            if (index !== -1) {
                cart.splice(index, 1);
            }
        } else {
            delete itemCounts[itemName];
            cart = cart.filter(item => item.cartName !== itemName);
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // 로컬 스토리지 업데이트
        renderCart();
    });
})

// 주문 확인 모달 닫기
$(document).ready( function (){
    $('#paycanBtn').on('click', () =>{
        updateCart();
        $('#paymentModal').css('display', 'none');
    })
})

$('#payCartBtn').on('click', () =>{
    $('#cardPayModal').css('display', 'flex');
    setTimeout(() => {
        $('#cardPayModal').css('display', 'none');
        $('#endModal').css('display', 'flex');
        $('#selectorderNumModal').css('display','flex');
        localStorage.removeItem('cart')
    }, 4000);
})

$('#selectorderNumModalBtn').on('click', () => {
    location.href = '/study'
})
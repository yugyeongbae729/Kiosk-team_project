const express = require('express')
const router = express.Router()
const path = require('path')
const kioskRouter = require('./kioskRouter')
const axios = require('axios')

// 페이지 렌더링 관련 Router 작성
router.use(express.static(path.join(__dirname, '../views')));
router.get('/', (req, res) =>{
    if (req.session.nick){
        console.log('session', req.session.nick)
    res.render('main', {nick: req.session.nick})
    } else {
        res.render('main')
    }
})
router.get('/hospitalB9', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB9')
})

router.get('/hospitalB8', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB8')
})

router.get('/hospitalB7', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB7')
})

router.get('/hospitalB6', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB6')
})

router.get('/hospitalB5', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB5')
})

router.get('/hospitalB4', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB4')
})

router.get('/hospitalB3', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB3')
})

router.get('/hospitalB2', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB2')
})

router.get('/hospitalB1', (req, res)=>{
    res.render('HosBasicKio/hospitalKioskB1')
})

router.get('/hospital', (req, res)=>{
    res.render('hospitalKiosk')
})

router.get('/study', (req,res)=>{
    res.render('study')
})

router.get('/join', (req, res)=>{
    res.render('join')
})

router.get('/login', (req,res)=>{
    res.render('login')
})

router.get('/myPage', (req,res)=>{
    res.render('myPage')
})

router.get('/update', (req,res)=>{
    res.render('update', {nick : req.session.nick} )
})

router.get('/delete', (req,res)=>{
    res.render('delete', {nick : req.session.nick} )
})

router.get('/game', (req,res)=>{
    res.render('touchGame')
})

router.get('/learningNote', (req, res)=>{
    res.render('learningNote')
})

router.get('/help', (req, res)=>{
    res.render('help')
})

router.get('/hospitalKiosk.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hospitalKiosk.html'));
});

router.get('/hospitalKiosk2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hospitalKiosk2.html'));
});

router.get('/hospitalKiosk3.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hospitalKiosk3.html'));
});

router.get('/hospitalKiosk4.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hospitalKiosk4.html'));
});

router.get('/hospitalKiosk5.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hospitalKiosk5.html'));
});

router.get('/hospitalKiosk6.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hospitalKiosk6.html'));
});

router.get('/hpKiosksoonap1.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hpKiosksoonap1.html'));
});

router.get('/hpKiosksoonap2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hpKiosksoonap2.html'));
});

router.get('/hpKiosksoonap3.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hpKiosksoonap3.html'));
});

router.use('/kiosk', kioskRouter);
// ===============================================MacBasic==============================================================

// 음식점 기초 & 심화 선택 페이지 
router.get('/KioskMacSelect', (req, res) => {
    res.render('Basic/macKioskSelect')
})

// MacDeep 첫 화면
router.get('/macDeepKioMain', (req, res) => {
    res.render('MacDeepKio/macKiosk')
})

// MacDeep 사이드, nav 기본 틀
router.get('/macDeepKioIndex', (req, res) => {
    res.render('MacDeepKio/macKioskIndex')
})

// MacBasic 첫 화면 
router.get('/macBasicKioMain', (req, res) => {
    res.render('MacBasicKio/macBasicKiosk')
})

// MacBasic 사이드, nav 기본 틀
router.get('/macBasicKioIndex', (req, res) => {
    res.render('MacBasicKio/macBasicKioskIndex')
})

// MacBasic_sub 첫 화면 
router.get('/macBasicKioMain_sub', (req, res) => {
    res.render('MacBasicKio_sub/macBasicMain')
})

router.get('/macBasic1', (req, res) => {
    res.render('MacBasicKio_sub/macBasic1')
})

router.get('/macBasic2', (req, res) => {
    res.render('MacBasicKio_sub/macBasic2')
})

router.get('/test', (req, res) => {
    res.render('Basic/test')
})

router.post('/send-flask', async (req, res) => {
    try {
        const data = req.body;
        const response = await axios.post('http://localhost:5000/data', data);
        res.send(response.data);
    } catch (error) {
        console.error('Error sending data to Flask server:', error);
        res.status(500).send('Error sending data to Flask server');
    }
});
module.exports = router
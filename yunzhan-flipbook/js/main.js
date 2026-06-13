// 云展网风格翻页书 - 使用StPageFlip实现真正3D翻页
const totalPages = 28;
const pages = [
    'pages/page-1.jpg',   // 封面（SAPFIT赛普飞特技术）
    'pages/page-2.jpg',
    'pages/page-3.jpg',
    'pages/page-4.jpg',
    'pages/page-5.jpg',
    'pages/page-6.jpg',
    'pages/page-7.jpg',
    'pages/page-8.jpg',
    'pages/page-9.jpg',
    'pages/page-10.jpg',
    'pages/page-11.jpg',
    'pages/page-12.jpg',
    'pages/page-13.jpg',
    'pages/page-14.jpg',
    'pages/page-15.jpg',
    'pages/page-16.jpg',
    'pages/page-17.jpg',
    'pages/page-18.jpg',
    'pages/page-19.jpg',
    'pages/page-20.jpg',
    'pages/page-21.jpg',
    'pages/page-22.jpg',
    'pages/page-23.jpg',
    'pages/page-24.jpg',
    'pages/page-25.jpg',
    'pages/page-26.jpg',
    'pages/back.jpg',     // 倒数第二页（联系方式）
    'pages/cover.jpg'     // 尾页（原封面图）
];

// DOM元素
const flipbookEl = document.getElementById('flipbook');
const currentPageNum = document.getElementById('currentPageNum');
const totalPageNum = document.getElementById('totalPageNum');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const firstPageBtn = document.getElementById('firstPageBtn');
const lastPageBtn = document.getElementById('lastPageBtn');

let pageFlip;

// 初始化
totalPageNum.textContent = totalPages;
createPages();
initPageFlip();
setupEventHandlers();

// 创建所有页面
function createPages() {
    pages.forEach((pageSrc, index) => {
        const page = document.createElement('div');
        page.className = 'flip-page';
        
        // 第三页（索引2）添加特殊类，使用contain避免裁剪
        if (index === 2) {
            page.classList.add('page-special');
        }
        
        const img = document.createElement('img');
        img.src = pageSrc;
        img.alt = `第${index + 1}页`;
        img.loading = index < 6 ? 'eager' : 'lazy'; // 前6页立即加载
        
        page.appendChild(img);
        flipbookEl.appendChild(page);
    });
}

// 初始化StPageFlip
function initPageFlip() {
    pageFlip = new St.PageFlip(flipbookEl, {
        width: 800,
        height: 600,
        size: 'fixed',
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,
        maxShadowOpacity: 0.5,
        showCover: false,          // 禁用内置封面模式，使用自定义单页显示
        mobileScrollSupport: false,
        swipeDistance: 30,
        clickEventForward: true,
        usePortrait: false,        // 禁用portrait模式
        startPage: 0,
        flippingTime: 800,
        useMouseEvents: true,
        disableFlipByClick: false
    });
    
    pageFlip.loadFromHTML(document.querySelectorAll('.flip-page'));
    
    // 监听翻页事件，在封面/封底时隐藏左页并居中右页
    pageFlip.on('flip', (e) => {
        currentPageNum.textContent = e.data + 1;
        applyCoverStyle(e.data);
    });
    
    // 初始化时也应用封面样式
    setTimeout(() => applyCoverStyle(0), 100);
}

// 封面/封底时单页居中显示
function applyCoverStyle(pageIndex) {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === totalPages - 1;
    
    setTimeout(() => {
        const blocks = document.querySelectorAll('.stf__block');
        if (!blocks.length) return;
        
        if (isFirstPage || isLastPage) {
            // 封面/封底：单页居中显示
            const wrapper = document.querySelector('.stf__wrapper');
            if (!wrapper) return;
            
            // 设置wrapper为flex布局并居中
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'center';
            wrapper.style.alignItems = 'center';
            
            // 对所有block应用居中样式
            blocks.forEach(block => {
                block.style.position = 'relative';
                block.style.left = 'auto';
                block.style.right = 'auto';
                block.style.margin = '0 auto';
                block.style.visibility = 'visible';
                block.style.pointerEvents = 'auto';
                block.style.transform = 'none';
            });
        } else {
            // 内容页：恢复双页显示
            blocks.forEach(block => {
                block.style.position = '';
                block.style.left = '';
                block.style.right = '';
                block.style.margin = '';
                block.style.visibility = '';
                block.style.pointerEvents = '';
                block.style.transform = '';
            });
            
            const wrapper = document.querySelector('.stf__wrapper');
            if (wrapper) {
                wrapper.style.display = '';
                wrapper.style.justifyContent = '';
                wrapper.style.alignItems = '';
            }
        }
    }, 50);
}

// 设置事件处理
function setupEventHandlers() {
    // 按钮事件
    firstPageBtn.addEventListener('click', () => {
        pageFlip.flip(0);
    });
    
    prevBtn.addEventListener('click', () => {
        pageFlip.flipPrev();
    });
    
    nextBtn.addEventListener('click', () => {
        pageFlip.flipNext();
    });
    
    lastPageBtn.addEventListener('click', () => {
        pageFlip.flip(totalPages - 1);
    });
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            pageFlip.flipPrev();
        } else if (e.key === 'ArrowRight') {
            pageFlip.flipNext();
        }
    });
}

console.log(`云展网风格翻页书已加载，共${totalPages}页（StPageFlip 3D翻页）`);

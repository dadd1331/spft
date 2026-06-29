// 云展网风格翻页书 - 使用StPageFlip实现真正3D翻页
const totalPages = 28;
const pages = [
    'images/page_2.png',
    'images/page_3.png',
    'images/page_4.png',
    'images/page_5.png',
    'images/page_6.png',
    'images/page_7.png',
    'images/page_8.png',
    'images/page_9.png',
    'images/page_10.png',
    'images/page_11.png',
    'images/page_12.png',
    'images/page_13.png',
    'images/page_14.png',
    'images/page_15.png',
    'images/page_16.png',
    'images/page_17.png',
    'images/page_18.png',
    'images/page_19.png',
    'images/page_20.png',
    'images/page_21.png',
    'images/page_22.png',
    'images/page_23.png',
    'images/page_24.png',
    'images/page_25.png',
    'images/page_26.png',
    'images/page_27.png',
    'images/page_28.png',
    'images/page_1.png'
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
let currentVisiblePages = new Set([0, 1]); // 跟踪当前可见页面

// 初始化
totalPageNum.textContent = totalPages;
createPages();
initPageFlip();
setupEventHandlers();
preloadAdjacentPages(0); // 预加载封面附近页面

// 创建所有页面（全部使用lazy loading）
function createPages() {
    pages.forEach((pageSrc, index) => {
        const page = document.createElement('div');
        page.className = 'flip-page';
        page.dataset.pageIndex = index; // 添加数据属性便于追踪
        
        // 第三页（索引2）添加特殊类，使用contain避免裁剪
        if (index === 2) {
            page.classList.add('page-special');
        }
        
        const img = document.createElement('img');
        img.src = pageSrc;
        img.alt = `第${index + 1}页`;
        img.loading = 'lazy'; // 全部使用浏览器原生懒加载
        img.decoding = 'async'; // 异步解码，不阻塞渲染
        
        page.appendChild(img);
        flipbookEl.appendChild(page);
    });
}

// 初始化StPageFlip
function initPageFlip() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight - 46 - 46; // 减去顶部栏和底部工具栏
    
    // 根据实际图片比例计算（切割后单页为4:3）
    // 先加载第一张图片获取真实比例
    const tempImg = new Image();
    tempImg.src = pages[0];
    const imageRatio = tempImg.naturalWidth / tempImg.naturalHeight || 1.33; // 默认4:3
    let bookWidth, bookHeight;
    
    if (containerWidth <= 768) {
        // 手机端/平板：强制单页模式（portrait）
        const maxWidth = containerWidth - 20;
        const maxHeight = containerHeight - 20;
        
        // 先按宽度计算高度
        bookWidth = Math.min(maxWidth, 600);
        bookHeight = bookWidth / imageRatio;
        
        // 如果高度超出限制，则按高度重新计算宽度
        if (bookHeight > maxHeight) {
            bookHeight = maxHeight;
            bookWidth = bookHeight * imageRatio;
        }
    } else {
        // 桌面端双页模式
        const availableWidth = containerWidth - 80;  // 左右留白
        const availableHeight = containerHeight - 40; // 上下留白
        
        // 双页模式下，单页最大宽度 = 可用宽度 / 2
        const maxSinglePageWidth = availableWidth / 2;
        
        // 先按高度计算单页宽度
        bookHeight = availableHeight;
        bookWidth = bookHeight * imageRatio;
        
        // 如果宽度超出单页限制，则按宽度重新计算高度
        if (bookWidth > maxSinglePageWidth) {
            bookWidth = maxSinglePageWidth;
            bookHeight = bookWidth / imageRatio;
        }
    }
    
    pageFlip = new St.PageFlip(flipbookEl, {
        width: bookWidth,
        height: bookHeight,
        size: 'fixed',             // 固定比例，不拉伸图片
        minWidth: 200,
        maxWidth: 1000,
        minHeight: 150,
        maxHeight: 1350,
        maxShadowOpacity: 0.5,
        showCover: false,
        mobileScrollSupport: false,
        swipeDistance: 30,
        clickEventForward: true,
        usePortrait: containerWidth <= 768, // 小屏启用portrait单页模式
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

// 根据屏幕模式应用页面样式
function applyCoverStyle(pageIndex) {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === totalPages - 1;
    const isPortrait = window.innerWidth <= 768; // 判断是否单页模式
    
    setTimeout(() => {
        const blocks = document.querySelectorAll('.stf__block');
        if (!blocks.length) return;
        
        if (isPortrait || isFirstPage || isLastPage) {
            // 单页模式或封面/封底：居中显示
            const wrapper = document.querySelector('.stf__wrapper');
            if (!wrapper) return;
            
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'center';
            wrapper.style.alignItems = 'center';
            
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
            // 双页模式内容页：恢复双页布局
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

// 预加载相邻页面（提升翻页流畅度）
function preloadAdjacentPages(currentIndex) {
    const preloadRange = 2; // 预加载前后各2页
    for (let i = Math.max(0, currentIndex - preloadRange); 
         i <= Math.min(totalPages - 1, currentIndex + preloadRange); 
         i++) {
        const img = new Image();
        img.src = pages[i];
    }
}

// 监听翻页事件时预加载下一页
pageFlip.on('flip', (e) => {
    currentPageNum.textContent = e.data + 1;
    applyCoverStyle(e.data);
    preloadAdjacentPages(e.data); // 翻页后预加载新位置附近的页面
});

console.log(`云展网风格翻页书已加载，共${totalPages}页（StPageFlip 3D翻页）`);

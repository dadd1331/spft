#!/usr/bin/env python3
"""
根据pages文件夹中的图片数量，自动生成index.html的移动端slide-page和PC端page元素
"""
import os
import re
from pathlib import Path

def generate_html_pages(pages_dir, html_path):
    """生成HTML页面元素"""
    pages_dir = Path(pages_dir)
    
    # 获取所有JPG文件并排序
    jpg_files = sorted([f for f in pages_dir.glob("*.jpg")])
    
    if not jpg_files:
        print("错误: pages文件夹中没有JPG图片")
        return False
    
    total = len(jpg_files)
    print(f"找到 {total} 张图片")
    
    # 读取现有HTML
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # 生成移动端slide-page HTML
    mobile_slides = []
    for i, jpg_file in enumerate(jpg_files):
        if i == 0:
            active_class = " active"
            alt_text = "封面"
        elif i == total - 1:
            active_class = ""
            alt_text = "封底"
        else:
            active_class = ""
            alt_text = f"第{i}页"
        
        slide_html = f'''                <div class="slide-page{active_class}" data-index="{i}">
                    <div class="page-content">
                        <img src="pages/{jpg_file.name}" alt="{alt_text}">
                    </div>
                </div>'''
        mobile_slides.append(slide_html)
    
    mobile_section = '\n'.join(mobile_slides)
    
    # 生成PC端page HTML
    pc_pages = []
    for i, jpg_file in enumerate(jpg_files):
        if i == 0 or i == total - 1:
            density_attr = ' data-density="hard"'
            page_class = " hard-page"
        else:
            density_attr = ''
            page_class = " soft-page"
        
        if i == 0:
            page_class += " cover-page"
            alt_text = "封面"
        elif i == total - 1:
            page_class += " back-page"
            alt_text = "封底"
        else:
            alt_text = f"第{i}页"
        
        page_html = f'''                <div class="page{page_class}"{density_attr}>
                    <div class="page-content">
                        <img src="pages/{jpg_file.name}" alt="{alt_text}">
                    </div>
                </div>'''
        pc_pages.append(page_html)
    
    pc_section = '\n'.join(pc_pages)
    
    # 替换HTML中的移动端部分
    mobile_pattern = r'<!-- 移动端：单页滑动容器 -->.*?<div class="slide-container mobile-viewer" id="slideContainer">(.*?)</div>\s*<!-- 右侧箭头按钮'
    mobile_replacement = f'''<!-- 移动端：单页滑动容器 -->
            <div class="slide-container mobile-viewer" id="slideContainer">
{mobile_section}
            </div>
            
            <!-- 右侧箭头按钮'''
    
    html_content = re.sub(mobile_pattern, mobile_replacement, html_content, flags=re.DOTALL)
    
    # 替换HTML中的PC端部分
    pc_pattern = r'<!-- PC端：双页翻页容器 -->.*?<div id="flipbook" class="desktop-viewer">(.*?)</div>\s*</div>\s*<!-- 移动端'
    pc_replacement = f'''<!-- PC端：双页翻页容器 -->
            <div id="flipbook" class="desktop-viewer">
{pc_section}
            </div>

            <!-- 移动端'''
    
    html_content = re.sub(pc_pattern, pc_replacement, html_content, flags=re.DOTALL)
    
    # 更新总页数显示
    html_content = re.sub(r'max="(\d+)"', f'max="{total}"', html_content)
    html_content = re.sub(r'<span id="totalPages">\d+</span>', f'<span id="totalPages">{total}</span>', html_content)
    
    # 写入更新后的HTML
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"\n✅ HTML已更新！")
    print(f"   总页数: {total}")
    print(f"   文件: {html_path}")
    return True

if __name__ == "__main__":
    pages_folder = os.path.join(os.path.dirname(__file__), "pages")
    html_file = os.path.join(os.path.dirname(__file__), "index.html")
    
    success = generate_html_pages(pages_folder, html_file)
    import sys
    sys.exit(0 if success else 1)

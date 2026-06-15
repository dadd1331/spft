#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量压缩pages文件夹下的JPG图片
使用前请先安装依赖: pip install Pillow
"""

from PIL import Image
import os
from pathlib import Path

LOCAL_PAGES_DIR = 'pages'
QUALITY = 75  # JPG质量(1-100)，75是性价比最高的
MAX_WIDTH = 1920  # 最大宽度，超过则等比缩放
MAX_HEIGHT = 1440  # 最大高度

def compress_images():
    """批量压缩图片"""
    pages_dir = Path(LOCAL_PAGES_DIR)
    if not pages_dir.exists():
        print(f" 错误: 找不到目录 {LOCAL_PAGES_DIR}")
        return
    
    jpg_files = list(pages_dir.glob('*.jpg'))
    if not jpg_files:
        print("❌ 没有找到.jpg文件")
        return
    
    print(f"📁 找到 {len(jpg_files)} 张图片，开始压缩...\n")
    
    total_saved = 0
    
    for jpg_file in sorted(jpg_files):
        original_size = jpg_file.stat().st_size
        
        try:
            with Image.open(jpg_file) as img:
                # 如果尺寸过大，等比缩放
                width, height = img.size
                if width > MAX_WIDTH or height > MAX_HEIGHT:
                    ratio = min(MAX_WIDTH / width, MAX_HEIGHT / height)
                    new_width = int(width * ratio)
                    new_height = int(height * ratio)
                    img = img.resize((new_width, new_height), Image.LANCZOS)
                
                # 保存为优化后的JPG
                img.save(jpg_file, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
            
            new_size = jpg_file.stat().st_size
            saved = original_size - new_size
            saved_pct = (saved / original_size) * 100
            total_saved += saved
            
            print(f"✅ {jpg_file.name}: {original_size/1024:.0f}KB → {new_size/1024:.0f}KB (节省 {saved_pct:.0f}%)")
        
        except Exception as e:
            print(f"❌ {jpg_file.name} 压缩失败: {e}")
    
    print(f"\n{'='*60}")
    print(f"压缩完成! 总共节省: {total_saved/1024/1024:.1f}MB")
    print(f"{'='*60}")

if __name__ == '__main__':
    compress_images()

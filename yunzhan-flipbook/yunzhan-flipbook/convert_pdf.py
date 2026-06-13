#!/usr/bin/env python3
"""
将PDF转换为图片序列（双页切开+自动裁剪白边）
陶机总产品画册是双页展开设计，需要将每页切成左右两半
使用PyMuPDF (fitz) 库 + Pillow
"""
import sys
import os
import io
import numpy as np
from PIL import Image

def convert_pdf_to_images(pdf_path, output_dir):
    """将PDF每页转换为JPG图片，双页切开，自动裁剪白边"""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("错误: 需要安装 PyMuPDF")
        print("请运行: python -m pip install PyMuPDF")
        return False
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    else:
        # 清空输出目录
        import glob
        for f in glob.glob(os.path.join(output_dir, "*.jpg")):
            try:
                os.remove(f)
            except PermissionError:
                print(f"警告: 无法删除 {f}（可能被占用）")
    
    print(f"正在打开PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"PDF共 {total_pages} 页")
    
    image_index = 0
    
    for page_num in range(total_pages):
        page = doc[page_num]
        
        # 2倍分辨率渲染
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        
        # 转换为PIL Image
        img_data = pix.tobytes("ppm")
        full_img = Image.open(io.BytesIO(img_data))
        
        # 将图片从中间切成两半（左页和右页）
        width, height = full_img.size
        half_width = width // 2
        
        left_half = full_img.crop((0, 0, half_width, height))
        right_half = full_img.crop((half_width, 0, width, height))
        
        halves = [left_half, right_half]
        half_names = ['L', 'R']
        
        for idx, (half, half_name) in enumerate(zip(halves, half_names)):
            # 裁剪白边
            img_array = np.array(half)
            if len(img_array.shape) == 3:
                gray = np.mean(img_array[:,:,:3], axis=2)
            else:
                gray = img_array
            
            non_white = gray < 250
            rows = np.any(non_white, axis=1)
            cols = np.any(non_white, axis=0)
            
            if rows.any() and cols.any():
                rmin, rmax = np.where(rows)[0][[0, -1]]
                cmin, cmax = np.where(cols)[0][[0, -1]]
                half = half.crop((cmin, rmin, cmax + 1, rmax + 1))
            
            # 确定文件名
            if image_index == 0:
                filename = "cover.jpg"
            elif image_index == total_pages * 2 - 1:
                filename = "back.jpg"
            else:
                filename = f"page-{image_index}.jpg"
            
            output_path = os.path.join(output_dir, filename)
            half.save(output_path, 'JPEG', quality=95)
            print(f"  [{image_index + 1}] 已保存: {filename} ({half.size[0]}x{half.size[1]})")
            image_index += 1
    
    doc.close()
    print(f"\n完成！共转换 {total_pages} 页，生成 {image_index} 张图片到 {output_dir}")
    return True

if __name__ == "__main__":
    pdf_path = r"C:\Users\meng\Desktop\陶机总产品画册5.0(3).pdf"
    output_dir = os.path.join(os.path.dirname(__file__), "pages")
    
    print(f"源PDF: {pdf_path}")
    print(f"输出目录: {output_dir}\n")
    
    success = convert_pdf_to_images(pdf_path, output_dir)
    sys.exit(0 if success else 1)

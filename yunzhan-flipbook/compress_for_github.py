from PIL import Image
import os

input_dir = r"C:\Users\meng\Desktop\yunzhan-flipbook\images"
output_dir = input_dir  # 原地覆盖

os.makedirs(output_dir, exist_ok=True)

for filename in sorted(os.listdir(input_dir)):
    if not filename.lower().endswith('.png'):
        continue
    
    filepath = os.path.join(input_dir, filename)
    img = Image.open(filepath)
    
    # 如果宽度超过2000px，等比缩小
    max_width = 2000
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)
    
    # 保存为优化PNG（压缩级别9）
    img.save(filepath, 'PNG', optimize=True, compress_level=9)
    
    size_kb = os.path.getsize(filepath) / 1024
    print(f"{filename}: {size_kb:.0f} KB")

print("\n压缩完成！")

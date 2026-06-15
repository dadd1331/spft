#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量上传图片到阿里云OSS
使用前请先安装依赖: pip install oss2
并修改下方的配置信息
"""

import oss2
import os
from pathlib import Path

# ========== 配置区域（需要修改）==========
ACCESS_KEY_ID = '你的AccessKeyId'
ACCESS_KEY_SECRET = '你的AccessKeySecret'
BUCKET_NAME = 'sapfit-cdn'  # 你的Bucket名称
ENDPOINT = 'oss-cn-hangzhou.aliyuncs.com'  # 根据你选择的地域修改
LOCAL_PAGES_DIR = 'pages'  # 本地pages文件夹路径
OSS_PREFIX = 'flipbook/'  # OSS中的目录前缀（可选）
# ========================================

def upload_images():
    """批量上传图片到OSS"""
    auth = oss2.Auth(ACCESS_KEY_ID, ACCESS_KEY_SECRET)
    bucket = oss2.Bucket(auth, ENDPOINT, BUCKET_NAME)
    
    pages_dir = Path(LOCAL_PAGES_DIR)
    if not pages_dir.exists():
        print(f"❌ 错误: 找不到目录 {LOCAL_PAGES_DIR}")
        return
    
    jpg_files = list(pages_dir.glob('*.jpg'))
    if not jpg_files:
        print("❌ 没有找到.jpg文件")
        return
    
    print(f"📁 找到 {len(jpg_files)} 张图片，开始上传...\n")
    
    success_count = 0
    fail_count = 0
    
    for jpg_file in sorted(jpg_files):
        oss_key = f"{OSS_PREFIX}{jpg_file.name}"
        
        try:
            with open(jpg_file, 'rb') as f:
                result = bucket.put_object(oss_key, f)
            
            if result.status == 200:
                url = f"https://{BUCKET_NAME}.{ENDPOINT}/{oss_key}"
                print(f"✅ {jpg_file.name} -> {url}")
                success_count += 1
            else:
                print(f"❌ {jpg_file.name} 上传失败，状态码: {result.status}")
                fail_count += 1
        except Exception as e:
            print(f"❌ {jpg_file.name} 上传异常: {e}")
            fail_count += 1
    
    print(f"\n{'='*60}")
    print(f"上传完成: 成功 {success_count} 张, 失败 {fail_count} 张")
    print(f"{'='*60}")

if __name__ == '__main__':
    upload_images()

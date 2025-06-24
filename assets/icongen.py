import os
from PIL import Image

# === 配置 ===
icon_png = "icon.png"  # 输入 PNG 路径
iconset_name = "icon.iconset"
output_icns = "icon.icns"  # 输出 icns 路径

# === 创建 icon.iconset 文件夹 ===
os.makedirs(iconset_name, exist_ok=True)

# === 要生成的尺寸 ===
sizes = [
    (16, False), (16, True),
    (32, False), (32, True),
    (128, False), (128, True),
    (256, False), (256, True),
    (512, False), (512, True),
]

# === 打开源图像 ===
img = Image.open(icon_png)

for size, is_2x in sizes:
    suffix = "@2x" if is_2x else ""
    filename = f"icon_{size}x{size}{suffix}.png"
    resize_dim = (size * 2, size * 2) if is_2x else (size, size)
    resized = img.resize(resize_dim, Image.LANCZOS)
    resized.save(os.path.join(iconset_name, filename))

# === 调用 iconutil 转换为 icns ===
os.system(f"iconutil -c icns {iconset_name} -o {output_icns}")
print(f"✅ 成功生成：{output_icns}")

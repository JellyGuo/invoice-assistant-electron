const { execSync } = require('child_process');
const fs = require('fs-extra');  
const path = require('path');

module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'assets/icons/icon'),
  },
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'invoice_assistant',
        format: 'ULFO',
        overwrite: true,
        // background: path.resolve(__dirname, 'assets/icon2.png'), // ✅ 背景图路径
        // iconSize: 100,
        // contents: [
        //   {
        //     x: 130,
        //     y: 220,
        //     type: 'file',
        //     path: path.resolve(__dirname, 'out/invoice-assistant-electron-darwin-arm64/invoice-assistant-electron.app') 
        //   },
        //   {
        //     x: 410,
        //     y: 220,
        //     type: 'link',
        //     path: '/Applications'
        //   }
        // ]
      },
    },
  ],
  hooks: {
    postMake: async (forgeConfig, options) => {
      if (process.platform === 'darwin') {
        for (const makeResult of options) {
          const artifacts = makeResult.artifacts || [];

          for (const file of artifacts) {
            // ✅ 清除 .app 包的 quarantine 属性
            if (file.endsWith('.app')) {
              try {
                execSync(`xattr -cr "${file}"`);
                console.log(`✅ Cleared quarantine recursively on: ${file}`);
              } catch (err) {
                console.error(`⚠️ Failed to clear quarantine: ${err.message}`);
              }
            }

            // ✅ 拷贝 start.sh、stop.sh、README.txt、StartApp.app 到输出目录
            const outputDir = path.dirname(file);
            const assetFiles = ['README.txt'];
            const assetSrcDir = path.resolve(__dirname, 'assets');

            for (const fileName of assetFiles) {
              const src = path.join(assetSrcDir, fileName);
              const dest = path.join(outputDir, fileName);

              if (fs.existsSync(src)) {
                try {
                  fs.copySync(src, dest, { overwrite: true });  // ✅ 自动递归复制目录和文件
                  if (fileName.endsWith('.sh') || fileName.endsWith('.command') || fileName.endsWith('.app')) {
                    fs.chmodSync(dest, 0o755);  // ✅ 设置执行权限
                  }
                  console.log(`✅ Copied asset: ${fileName}`);
                } catch (err) {
                  console.error(`❌ Failed to copy ${fileName}: ${err.message}`);
                }
              } else {
                console.warn(`⚠️ Asset not found: ${fileName}`);
              }
            }
          }
        }
      }
    }
  }
};

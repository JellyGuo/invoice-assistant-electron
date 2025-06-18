const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  packagerConfig: {},
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
      },
    },
  ],
  hooks: {
    postMake: async (forgeConfig, options) => {
      if (process.platform === 'darwin') {
        for (const makeResult of options) {
          const artifacts = makeResult.artifacts || [];

          for (const file of artifacts) {
            // 清除 quarantine
            if (file.endsWith('.app')) {
              try {
                execSync(`xattr -cr "${file}"`);
                console.log(`✅ Cleared quarantine recursively on: ${file}`);
              } catch (err) {
                console.error(`⚠️ Failed to clear quarantine: ${err.message}`);
              }
            }

            // 拷贝 start.sh、stop.sh、README.txt 到生成目录（与 .dmg/.zip 同级）
            const outputDir = path.dirname(file);
            const assetFiles = ['start.sh', 'stop.sh', 'README.txt'];
            const assetSrcDir = path.resolve(__dirname, 'assets'); // 你放脚本的目录

            assetFiles.forEach(fileName => {
              const src = path.join(assetSrcDir, fileName);
              const dest = path.join(outputDir, fileName);

              if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
                fs.chmodSync(dest, 0o755);
                console.log(`✅ Copied and set permission: ${fileName}`);
              }
            });
          }
        }
      }
    }
  }
};

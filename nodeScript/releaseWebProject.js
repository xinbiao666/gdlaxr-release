const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// 将读取的信息转换成键值对的形式
function toObject(envContents) {
    const envVariables = {};
    const lines = envContents.split('\n');
    for (const line of lines) {
        if (line.trim() !== '' && !line.startsWith('#')) {
            const [key, value] = line.split('=');
            envVariables[key] = value;
        }
    }
    return envVariables
}
// 计算版本信息

function compress(useProject, directory) {
    return new Promise((resolve, reject) => {
        const envPath = directory + '\\.env'
        const distPath = directory + '\\dist'
        const webHistoryVerFolder = directory + '\\webVersionList'
        const envContents = fs.readFileSync(envPath, 'utf-8');
        const versionInfo = toObject(envContents)
        try{
            if(!fs.existsSync(distPath)){
                return reject('打包目录不存在')
            }
            if (!fs.existsSync(webHistoryVerFolder)) {
                // 如果不存在，创建文件夹
                fs.mkdirSync(webHistoryVerFolder);
            }
            // 创建输出流
            const output = fs.createWriteStream(path.join(webHistoryVerFolder, `${useProject}${versionInfo.VUE_APP_VERSION}.zip`));
            const archive = archiver('zip', {
                zlib: { level: 9 } // 设置压缩级别（0-9），默认为 9
            });
            output.on('close', () => {
                resolve(webHistoryVerFolder);
            });
            archive.on('error', (err) => {
                reject(err)
            });
            // 将输出流管道到archiver
            archive.pipe(output);
            // 递归读取文件夹并添加到压缩包
            archive.directory(distPath, false);
            // 完成压缩
            archive.finalize();
        }catch(e){
            reject(e)
        }
    })
}

module.exports.compress = compress

const fs = require('fs');
const path = require('path');
const utils = require('./common/utils')

const appMateReg = {
    'la-app': /^la.*\.apk$/,
    'lianan-app': /^lianan-app.*\.apk$/
}

function currentVersion(directory, useProject) {
    const files = fs.readdirSync(directory);
    let apkList = files.filter(i => appMateReg[useProject].test(i))
    let versionList = []
    apkList.forEach(i => versionList.push(Number(i.replace(/\D/g, ''))))
    let previewVersion = Math.max(...versionList) + ''
    const nowTime = new Date()
    let currentVersion = ''
    let timeString = nowTime.getFullYear().toString()
     + ((nowTime.getMonth() + 1) < 10 ? '0'
     + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1)).toString()
     + (nowTime.getDate() < 10 ? '0'
     + nowTime.getDate().toString() : nowTime.getDate())
    if (timeString === previewVersion.slice(0, 8)) {
        let updateTime = parseInt(previewVersion.slice(8, previewVersion.length)) + 1
        if (updateTime < 10) {
            currentVersion = timeString + '0' + updateTime.toString()
        }
    } else {
        currentVersion = timeString + '01'
    }
    return currentVersion
}

function reFileName(currentVersion, directory, prefix) {
    return new Promise((resolve, reject) => {
        const oldFileName = `${directory}/${utils.getLatestUpdatedFile(directory)}`
        const newFileName = `${directory}/${prefix}${currentVersion}.apk`
        fs.rename(oldFileName, newFileName, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ fileName: newFileName, msg: '重命名成功' });
            }
        })
    })
}

function collectAppHistoryApk(sourceFilePath, targetFolderPath) {
    return new Promise((resolve, reject) => {
        const targetFilePath = path.join(targetFolderPath, path.basename(sourceFilePath));
        // 复制文件
        fs.copyFile(sourceFilePath, targetFilePath, (err) => {
            if (err) {
                reject('复制文件时出错:', err);
            } else {
                resolve('apk文件收集成功');
            }
        });
    })

}

module.exports = {
    currentVersion, reFileName, collectAppHistoryApk
}
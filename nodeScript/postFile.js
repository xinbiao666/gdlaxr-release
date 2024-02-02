const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const releaseAppModule = require('./releaseAppFile')
const utils = require('./common/utils')
const { compress } = require('./releaseWebProject')

const apiUrl = 'http://la.gdlaxr.cn/api/file';
const loginUrl = 'http://la.gdlaxr.cn/login';

const loginForm = { username: 'la', password: 'la123456' }

function appendFile(description, directory) {
    const formData = new FormData();
    let fileName = utils.getLatestUpdatedFile(directory)
    formData.append('file', fs.createReadStream(directory + '/' + fileName));
    formData.append('path', '');
    formData.append('description', description)
    return formData
}

async function getLoginToGetCookie() {
    try {
        await axios.post(loginUrl, loginForm, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            maxRedirects: 0
        })
        return Promise.resolve('get cookie fail')
    } catch (err) {
        return Promise.resolve(err.response.headers['set-cookie'][0])
    }
}

async function postFile(cookie, formData) {
    try {
        await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
                Cookie: cookie
            },
            maxBodyLength: Infinity
        })
        return Promise.resolve('发布完成')
    } catch (err) {
        return Promise.reject(err)
    }
}

async function releaseApp(event, useProject, description, directory) {
    const fullDirectory = directory + '\\unpackage\\release\\apk'
    // 兼容la-app的前缀是la
    const prefix = useProject === 'la-app' ? 'la' : useProject
    try {
        if(!fs.existsSync(fullDirectory)){
            return Promise.reject('打包目录不存在')
        }
        event.sender.send('upload-status', { code: 0, status: 'ready', msg: '开始发布'})
        let reNameRes = await releaseAppModule.reFileName(releaseAppModule.currentVersion(fullDirectory, useProject), fullDirectory, prefix)
        event.sender.send('upload-status', { code: 1, status: 'rename', msg: reNameRes.msg})
        let formData = appendFile(description, fullDirectory)
        event.sender.send('upload-status', { code: 2, status: 'appendFile',msg: '添加上传文件成功'})
        let cookie = await getLoginToGetCookie()
        event.sender.send('upload-status', { code: 3, status: 'getCookie',msg: '获取cookie成功'})
        event.sender.send('upload-status', { code: 4, status: 'post', msg: '正在发布...'})
        let postRes = await postFile(cookie, formData)
        event.sender.send('upload-status', { code: 5, status: 'down', msg: postRes})
        return Promise.resolve()
    } catch (err) {
        event.sender.send('upload-status', { code: -1, status: 'error', msg: err })
        return Promise.reject(err)
    }
}

async function releaseWeb(event, useProject, description, directory) {
    try {
        event.sender.send('upload-status', { code: 0, status: 'ready', msg: '开始压缩文件'})
        const zipFolderPath = await compress(useProject, directory)
        event.sender.send('upload-status', { code: 1, status: 'getCookie', msg: '压缩成功，正在获取cookie...'})
        let cookie = await getLoginToGetCookie()
        event.sender.send('upload-status', { code: 2, status: 'appendFile', msg: '获取cookie成功，正在添加上传文件...'})
        let formData = appendFile(description, zipFolderPath)
        event.sender.send('upload-status', { code: 3, status: 'post', msg: '正在发布...'})
        let postRes = await postFile(cookie, formData)
        event.sender.send('upload-status', { code: 4, status: 'down', msg: postRes})
        return Promise.resolve()
    } catch (err) {
        event.sender.send('upload-status', { code: -1, status: 'error', msg: err })
        return Promise.reject(err)
    }
}

module.exports.releaseApp = releaseApp
module.exports.releaseWeb = releaseWeb
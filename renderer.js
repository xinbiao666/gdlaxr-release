/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const $ = require('jquery')
const { ipcRenderer } = require('electron')
const utils = require('./nodeScript/common/utils')

let useProject = ''

window.addEventListener('DOMContentLoaded', () => {

    const laAppPath = localStorage.getItem('la-app')
    const liananAppPath = localStorage.getItem('lianan-app')
    const pcWebPath = localStorage.getItem('pc-web')
    const sysWebPath = localStorage.getItem('sys-web')

    laAppPath && $('.la-app>.select-prompt').text(laAppPath)
    liananAppPath && $('.lianan-app>.select-prompt').text(liananAppPath)
    pcWebPath && $('.pc-web>.select-prompt').text(pcWebPath)
    sysWebPath && $('.sys-web>.select-prompt').text(sysWebPath)

    ipcRenderer.on('selected-directory', (event, res) => {
        if(res && Array.isArray(res)){
            let [usePath] = res
            switch (useProject){
                case 'la-app':
                    $('.la-app>.select-prompt').text(usePath)
                    localStorage.setItem('la-app', usePath)
                    break; 
                case 'lianan-app':
                    $('.lianan-app>.select-prompt').text(usePath)
                    localStorage.setItem('lianan-app', usePath)
                    break;
                case 'pc-web':
                    $('.pc-web>.select-prompt').text(usePath)
                    localStorage.setItem('pc-web', usePath)
                    break;
                case 'sys-web':
                    $('.sys-web>.select-prompt').text(usePath)
                    localStorage.setItem('sys-web', usePath)
                    break;
            }
        }
    })

    ipcRenderer.on('upload-status', (event, res) => {
        let preText = $('.upload-status-board').html()
        if(res.error){
            $('.upload-status-board').html(`${utils.getNowDate()}  ${res.error}`)
            return
        }
        if(res.code === 0){
            $('.upload-status-board').html(`${utils.getNowDate()}  ${res.msg}`)
        }else {
            $('.upload-status-board').html(`${preText}<br/>${utils.getNowDate()} ${res.msg}`)
        }
    })

    $('#la-app').on('click', () => {
        useProject = 'la-app'

        $.each($('.la-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).removeAttr('disabled')
        })
        $.each($('.lianan-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.pc-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.sys-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })

        $('#la-app').addClass('using-project')
        $('#lianan-app').removeClass('using-project')
        $('#pc-web').removeClass('using-project')
        $('#sys-web').removeClass('using-project')

        $('.la-app').addClass('item-selected')
        $('.lianan-app').removeClass('item-selected')
        $('.pc-web').removeClass('item-selected')
        $('.sys-web').removeClass('item-selected')
    })

    $('#lianan-app').on('click', () => {
        useProject = 'lianan-app'

        $.each($('.la-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.lianan-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).removeAttr('disabled', 'true')
        })
        $.each($('.pc-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.sys-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })

        $('#la-app').removeClass('using-project')
        $('#lianan-app').addClass('using-project')
        $('#pc-web').removeClass('using-project')
        $('#sys-web').removeClass('using-project')

        $('.la-app').removeClass('item-selected')
        $('.lianan-app').addClass('item-selected')
        $('.pc-web').removeClass('item-selected')
        $('.sys-web').removeClass('item-selected')
    })

    $('#pc-web').on('click', () => {
        useProject = 'pc-web'

        $.each($('.la-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.lianan-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.pc-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).removeAttr('disabled')
        })
        $.each($('.sys-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })

        $('#la-app').removeClass('using-project')
        $('#lianan-app').removeClass('using-project')
        $('#pc-web').addClass('using-project')
        $('#sys-web').removeClass('using-project')

        $('.la-app').removeClass('item-selected')
        $('.lianan-app').removeClass('item-selected')
        $('.pc-web').addClass('item-selected')
        $('.sys-web').removeClass('item-selected')
    })

    $('#sys-web').on('click', () => {
        useProject = 'sys-web'

        $.each($('.la-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.lianan-app>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.pc-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).attr('disabled', 'true')
        })
        $.each($('.sys-web>.handle-btn-content>.handle-btn'), (index, element) => {
            $(element).removeAttr('disabled')
        })

        $('#la-app').removeClass('using-project')
        $('#lianan-app').removeClass('using-project')
        $('#pc-web').removeClass('using-project')
        $('#sys-web').addClass('using-project')

        $('.la-app').removeClass('item-selected')
        $('.lianan-app').removeClass('item-selected')
        $('.pc-web').removeClass('item-selected')
        $('.sys-web').addClass('item-selected')
    })

    $('.la-app>.handle-btn-content>.reset').on('click', () => {
        localStorage.removeItem('la-app')
        $('.la-app>.select-prompt').text('请选择打包发布的文件夹')
    })

    $('.lianan-app>.handle-btn-content>.reset').on('click', () => {
        localStorage.removeItem('lianan-app')
        $('.lianan-app>.select-prompt').text('请选择打包发布的文件夹')
    })

    $('.pc-web>.handle-btn-content>.reset').on('click', () => {
        localStorage.removeItem('pc-web')
        $('.pc-web>.select-prompt').text('请选择打包发布的文件夹')
    })

    $('.sys-web>.handle-btn-content>.reset').on('click', () => {
        localStorage.removeItem('sys-web')
        $('.sys-web>.select-prompt').text('请选择打包发布的文件夹')
    })

    $.each($('.select-directory'), (index, element) => {
        $(element).on('click', () => {
            ipcRenderer.send('open-file-dialog')
        })
    })
    
    $('#release-btn').on('click', () => {
        if(!useProject){
            ipcRenderer.send('error-alert', '请选择发布项目')
            return
        }
        let description = $('.msg-content>textarea').val() || ''
        let directory = '';
        switch (useProject){
            case 'la-app':
                directory = laAppPath || localStorage.getItem('la-app')
                break; 
            case 'lianan-app':
                directory = liananAppPath || localStorage.getItem('lianan-app')
                break;
            case 'pc-web':
                directory = pcWebPath || localStorage.getItem('pc-web')
                break;
            case 'sys-web':
                directory = sysWebPath || localStorage.getItem('sys-web')
                break;
        }
        if(!directory){
            ipcRenderer.send('error-alert', '请添加项目文件夹')
            return
        }
        ipcRenderer.send('post-file', { useProject, description, directory })
    })
})
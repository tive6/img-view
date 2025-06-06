import { fileProtocols, httpProtocols } from '@/common/config.js'
import { formatBytes } from '@/common/helper.js'

chrome.sidePanel.setOptions({
  enabled: false,
})

chrome.action.onClicked.addListener(({ windowId }) => {
  chrome.runtime.openOptionsPage()
})

async function injectScript({ tabId, url }) {
  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['js/viewer.min.css'],
    })
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['js/viewer.min.js'],
      injectImmediately: true,
    })
    let favicon = chrome.runtime.getURL(`/icons/logo.svg`)
    let size = await getImgSize(url)
    let fileSize = formatBytes(size)
    console.log(size, fileSize)

    let t = setTimeout(async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'IMG_VIEWER_MSG',
          details: { imgUrl: url, fileSize, favicon },
        })
      })
      clearTimeout(t)
    }, 100)

    // await chrome.scripting.executeScript({
    //   target: { tabId: tabId },
    //   args: [{ imgUrl: url, fileSize, favicon, eid }],
    //   func: () => {},
    //   injectImmediately: true,
    // })
  } catch (e) {
    console.log(e)
  }
}

async function getImgSize(url) {
  try {
    let res = await fetch(url, {
      method: 'GET', // 只请求头部信息
    }).then((res) => {
      // console.log(res)
      return res.blob()
    })
    return res?.size || 0
  } catch (e) {
    console.log(e)
    return 0
  }
}

!(async function main() {
  try {
    chrome.webRequest.onCompleted.addListener(
      async (details) => {
        // let tab = await chrome.tabs.get(details.tabId)
        if (!details?.documentId && details.frameId === 0 && details.parentFrameId === -1) {
          // if (
          //   details.type === 'main_frame' &&
          //   details.responseHeaders.some(
          //     (h) => h.name === 'content-type' && h.value.startsWith('image/'),
          //   )
          // ) {
          injectScript(details)
        }
      },
      {
        urls: [
          //
          ...fileProtocols,
          ...httpProtocols,
        ],
        types: [
          'main_frame',
          // 'sub_frame',
          // 'image',
          // 'media',
        ],
      },
      ['responseHeaders', 'extraHeaders'],
    )
  } catch (e) {
    console.log(e)
  }
})()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message', message)
  console.log(sender)
  if (message.type === 'IMG_TAB_CLOSE' && message.details === 1) {
    chrome.tabs.remove(sender.tab.id)
  }
})

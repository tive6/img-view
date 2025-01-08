import { fileProtocols } from '@/common/config.js'
import { formatBytes } from '@/common/helper.js'

chrome.sidePanel.setOptions({
  enabled: false,
})

// chrome.action.onClicked.addListener(({ windowId }) => {
//   chrome.runtime.openOptionsPage()
// })

async function injectScript({ tabId, url }) {
  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: [
        //
        'js/viewer.min.css',
      ],
    })
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: [
        //
        'js/viewer.min.js',
      ],
      injectImmediately: true,
    })
    let favicon = chrome.runtime.getURL(`/icons/logo.svg`)
    let size = await getImgSize(url)
    let fileSize = formatBytes(size)
    console.log(size, fileSize)
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      args: [{ imgUrl: url, fileSize, favicon }],
      func: ({ imgUrl, fileSize, favicon }) => {
        let img = document.getElementById('image')
        if (img) return
        console.log(imgUrl)
        let link = document.createElement('link')
        link.rel = 'icon'
        link.href = favicon
        document.head.appendChild(link)
        let image = document.querySelector('img')
        if (!image) return
        image.id = 'image'
        // eslint-disable-next-line no-undef
        new Viewer(document.getElementById('image'), {
          inline: true,
          navbar: false,
          title: [
            1,
            (image, imageData) =>
              `${image.alt} (${imageData.naturalWidth} × ${imageData.naturalHeight}) ${fileSize}`,
          ],
          toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            oneToOne: 4,
            reset: 4,
            prev: 0,
            play: 0,
            next: 0,
            rotateLeft: 4,
            rotateRight: 4,
            flipHorizontal: 4,
            flipVertical: 4,
          },
          viewed() {
            // viewer.zoomTo(1)
          },
        })
      },
      injectImmediately: true,
    })
  } catch (e) {
    console.log(e)
  }
}

async function getImgSize(url) {
  try {
    let res = await fetch(url, {
      method: 'HEAD', // 只请求头部信息
    }).then((res) => res.blob())
    console.log(res)
    console.log(res.size)
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
        console.log(details)
        // let tab = await chrome.tabs.get(details.tabId)
        // console.log(tab)
        if (details.frameId === 0 && details.parentFrameId === -1) {
          injectScript(details)
        }
      },
      {
        urls: [
          // 'file:///*',
          ...fileProtocols,
          // ...httpProtocols,
        ],
        types: [
          'main_frame',
          // 'sub_frame',
          'image',
        ],
      },
      // ['extraHeaders'],
    )
  } catch (e) {
    console.log(e)
  }
})()

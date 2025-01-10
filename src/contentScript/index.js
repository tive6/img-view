import { debounce } from '../common/helper.js'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('message', message)
  // console.log(sender, sendResponse)
  if (message.type === 'IMG_VIEWER_MSG') {
    Init(message.details)
  }
})

// let eid = chrome.runtime.id

function Init({ imgUrl, fileSize, favicon, eid }) {
  let img = document.getElementById('image')
  if (img) return
  console.log(imgUrl)
  setFavicon(favicon)
  let image = document.querySelector('img')
  if (!image) return
  image.id = 'image'

  let count = 0
  let t = setInterval(() => {
    count = 0
  }, 500)

  document.addEventListener(
    'keydown',
    debounce((e) => {
      if (e.key === 'Escape') {
        count++
        if (count >= 2) {
          chrome.runtime.sendMessage({
            type: 'IMG_TAB_CLOSE',
            details: 1,
          })
        }
      }
    }, 200),
  )

  initViewer(image, fileSize)
}

function setFavicon(favicon) {
  let link = document.createElement('link')
  link.rel = 'icon'
  link.href = favicon
  document.head.appendChild(link)
}

function initViewer(ele, fileSize) {
  // eslint-disable-next-line no-undef
  new Viewer(ele, {
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
}

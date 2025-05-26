export const ImageTypes = [
  //
  'png',
  'jpg',
  'jpeg',
  'webp',
]

export const fileProtocols = ImageTypes.map((ext) => {
  return `file:///*.${ext}`
})

export const httpProtocols = ImageTypes.reduce((acc, ext) => {
  acc.push(`*://*/*.${ext}`)
  acc.push(`*://*/*.${ext}?*`)
  return acc
}, [])

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

export const httpProtocols = ImageTypes.map((ext) => {
  return `*://*/*.${ext}`
})

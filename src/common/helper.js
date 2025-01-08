export function formatBytes(bytes) {
  if (bytes < 1024) {
    // 不足1KB，直接返回字节
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    // 不足1MB，转换为KB
    return `${(bytes / 1024).toFixed(1)} KB`
  } else {
    // 大于等于1MB，转换为MB
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
}

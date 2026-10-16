/**
 * PGame Global CDN & Media Asset Configuration
 * Quản lý kho tài nguyên Media (Ảnh, Âm thanh, Video, File Game ROM)
 */
window.PGAME_CONFIG = {
  version: '4.1.0',
  // Media CDN base path kết nối trực tiếp R2 Bucket 'pgame-obj' qua Pages Function
  MEDIA_BASE_URL: '/media',
  
  // Hàm resolver chuyển đổi đường dẫn tài nguyên
  resolveMedia(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    // Chuẩn hóa path: bỏ leading slash nếu có để ghép vào MEDIA_BASE_URL
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return this.MEDIA_BASE_URL ? `${this.MEDIA_BASE_URL}/${cleanPath}` : `/${cleanPath}`;
  }
};

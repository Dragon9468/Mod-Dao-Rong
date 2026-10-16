/**
 * PGame Global CDN & Media Asset Configuration
 * Quản lý kho tài nguyên Media (Ảnh, Âm thanh, Video, File Game ROM)
 */
window.PGAME_CONFIG = {
  version: '4.0.0',
  // Media CDN base path.
  // Mặc định chạy qua Cloudflare Pages cùng origin: '' (hoặc đường dẫn tương đối)
  // Khi cần mở rộng tách sang Cloudflare R2 / Custom Media CDN:
  // Chỉ cần đổi giá trị này, ví dụ: 'https://media.dragon9468.com'
  MEDIA_BASE_URL: '',
  
  // Hàm resolver chuyển đổi đường dẫn tài nguyên
  resolveMedia(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return this.MEDIA_BASE_URL ? (this.MEDIA_BASE_URL + cleanPath) : path;
  }
};

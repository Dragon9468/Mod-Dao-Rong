/**
 * PGame Global CDN & Media Asset Configuration
 * Quản lý kho tài nguyên Media (Ảnh, Âm thanh, Video, File Game ROM)
 */
window.PGAME_CONFIG = {
  version: '4.3.0',
  // Tự động nhận diện localhost để load trực tiếp assets nội bộ, hoặc qua R2 CDN trên production
  MEDIA_BASE_URL: (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'))
    ? '' 
    : '/media/games/daorong',
  
  // Hàm resolver chuyển đổi đường dẫn tài nguyên
  resolveMedia(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return this.MEDIA_BASE_URL ? `${this.MEDIA_BASE_URL}/${cleanPath}` : cleanPath;
  }
};

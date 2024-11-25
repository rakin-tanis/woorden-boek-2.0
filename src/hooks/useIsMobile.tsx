import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = () => {
        const userAgent = navigator.userAgent || '';
        const isMobileDevice = /android|bb\d+|meego|avantgo|bada|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|iphone|ipod|kindle|lge|maemo|midp|mobile|palm|phone|pocket|psp|symbian|windows ce|xda|xiino/i.test(userAgent);
        return isMobileDevice;
      };

      setIsMobile(
        window.innerWidth <= 768 || // screen width check
        mobileCheck() // user agent check
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
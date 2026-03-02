'use client';

import { useEffect } from 'react';

export default function PWAInit() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
          });

          console.log('✅ Service Worker registered successfully:', registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for controller change (new SW activated)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed - app updated');
            // Optionally show a notification that the app has been updated
          });
        } catch (error) {
          console.log('❌ Service Worker registration failed:', error);
        }
      };

      // Register SW after page load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerSW);
      } else {
        registerSW();
      }

      // Listen for install prompt (Add to Home Screen)
      let deferredPrompt: any;

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('📱 Install prompt available');

        // You can store this and trigger it with a button later
        // For now, just log it
      });

      window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed successfully');
        deferredPrompt = null;
      });
    }
  }, []);

  return null;
}

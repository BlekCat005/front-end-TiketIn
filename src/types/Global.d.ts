// global.d.ts
declare global {
  interface Window {
    snap: any; // Menandakan bahwa window.snap bisa ada di window, tapi tipenya tidak ditentukan
  }
}

export {}; // Pastikan file ini diekspor agar dikenali oleh TypeScript

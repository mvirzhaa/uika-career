import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar route yang harus diproteksi (butuh login)
const protectedRoutes = ['/dasbor', '/profil'];
// Daftar route yang dilarang jika sudah login
const authRoutes = ['/login', '/register', '/forgot-password'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Asumsi token disimpan dalam cookie saat production (Next.js server component constraint)
  // Untuk saat ini karena MVP client-side, kita cek localStorage.
  // Namun middleware berjalan di Edge, tidak bisa akses localStorage!
  // Sebagai solusi sementara di tahap MVP, kita hanya mengizinkan akses. 
  // Nanti client-side protection (HOC atau useEffect) yang akan redirect.
  // Tapi idealnya, set token di cookie saat login.

  const hasToken = request.cookies.has('access_token');

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Jika mencoba akses route terproteksi tanpa token (cookie base)
  // (Optional: di MVP mungkin belum set cookie, jadi middleware ini bersifat pasif dulu)
  if (isProtectedRoute && !hasToken) {
    // Uncomment baris di bawah jika cookie auth sudah diimplementasikan penuh:
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login tapi mencoba ke halaman login/register
  if (isAuthRoute && hasToken) {
    // Uncomment baris di bawah jika cookie auth sudah diimplementasikan penuh:
    // return NextResponse.redirect(new URL('/dasbor', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

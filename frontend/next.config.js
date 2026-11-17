/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Las fotos se sirven directo desde Supabase, sin pasar por la optimización
    // de Vercel (que en el plan gratis tiene un límite de 5.000 transformaciones).
    // Para que no pesen, se comprimen en el navegador antes de subirlas
    // (ver lib/compressImage.ts).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['res.cloudinary.com'], // ajustá si usás otras fuentes de imágenes
  },
}

module.exports = nextConfig;

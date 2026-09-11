/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'ipfs.io',
            port: '',            
        }],
        domains: ['localhost', 'res.cloudinary.com', 'ipfs.io',"upload.wikimedia.org"],
    }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Old page from when the site had card payment.
    return [{ source: '/info/payment', destination: '/info/how-to-order', permanent: true }];
  },
};
export default nextConfig;

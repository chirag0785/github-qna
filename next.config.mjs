/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals = {
          "onnxruntime-node": "commonjs onnxruntime-node",
           sharp: "commonjs sharp",
        };
        return config;
    },
};

export default nextConfig;

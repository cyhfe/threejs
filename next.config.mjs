// /** @type {import('next').NextConfig} */
// const withMDX = require("@next/mdx")();

// const nextConfig = {
//   pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

//   webpack: (config, options) => {
//     config.experiments.asyncWebAssembly = true;
//     config.experiments.syncWebAssembly = true;
//     return config;
//   },
// };

// module.exports = withMDX(nextConfig);

import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  webpack: (config, options) => {
    config.experiments.asyncWebAssembly = true;
    config.experiments.syncWebAssembly = true;
    return config;
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

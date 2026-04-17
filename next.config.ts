import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@assistant-ui/react", "@assistant-ui/react-ai-sdk"],
  turbopack: {
    resolveAlias: {
      "micromark-util-decode-numeric-character-reference":
        "./src/vendor/micromark-util-decode-numeric-character-reference.ts",
    },
  },
};

export default nextConfig;

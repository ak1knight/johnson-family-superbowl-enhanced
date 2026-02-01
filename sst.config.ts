// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "johnson-family-superbowl-enhanced",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: input?.stage === "production",
      home: "aws",
    };
  },
  async run() {
    // Create the Next.js application optimized for Next.js 16
    const web = new sst.aws.Nextjs("JohnsonFamilySuperbowl", {
      // Configure environment variables
      environment: {
        NODE_ENV: $app.stage === "production" ? "production" : "development",
        // Force rebuild to fix authorization issues
        BUILD_ID: Date.now().toString(),
      },
      
      // Configure domain
      domain: $app.stage === "production" ? "johnsonfamilysuperbowl.com" : undefined,
      
      // Add transform to ensure proper function configuration
      transform: {
        server: (args) => {
          // Ensure function is properly configured
          args.timeout = "30 seconds";
          args.memory = "1024 MB";
        },
      },
    });

    return {
      url: web.url,
      stage: $app.stage,
    };
  },
});

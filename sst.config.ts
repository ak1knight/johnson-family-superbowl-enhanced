// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "johnson-family-superbowl-enhanced",
      removal: input?.stage === "production" ? "retain" : "remove",
      //protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const web = new sst.aws.Nextjs("MyWeb", {
      transform: {
        cdn: (args) => {
          // Force CloudFront distribution to wait for server deployment
          // This prevents the race condition where distribution is created before server origins
          args.wait = true;
        }
      }
    });

    return {
      url: web.url,
    };
  },
});

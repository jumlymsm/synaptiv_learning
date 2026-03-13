// ─── AWS Configuration ───────────────────────────────────────────────────────
// Fill in these values after setting up your AWS resources.
// See setup guide in backend/README.md
// ─────────────────────────────────────────────────────────────────────────────
const AWS_CONFIG = {
  region: 'us-east-1',            // e.g. us-east-1, ap-southeast-1

  cognito: {
    userPoolId: 'us-east-1_k6A9bQbea',
    clientId:   '7dubh5npu2nd4l1jms4biis09i',
  },

  api: {
    // API Gateway invoke URL — ends with /prod or /v1
    endpoint: 'REPLACE_API_GATEWAY_URL',    // e.g. https://abc123.execute-api.us-east-1.amazonaws.com/prod
  }
};

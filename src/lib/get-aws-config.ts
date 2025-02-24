import * as prodConfig from "./aws-config";
import * as devConfig from "./aws-config.local";

export const getAwsConfig = () => {
  if (process.env.NODE_ENV === "production") {
    return prodConfig;
  }
  return devConfig;
};

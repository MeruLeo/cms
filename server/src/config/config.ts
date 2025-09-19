import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  origions: {
    local: string;
    product: string;
  };
}

const config: Config = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI!,
  origions: {
    local: process.env.LOCAL_ORIGIN!,
    product: process.env.PRODUCT_ORIGIN!,
  },
};

export default config;

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
  auth: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
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
  auth: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessExpiresIn: "15m" as const,
    refreshExpiresIn: "7d" as const,
  },
};

export default config;

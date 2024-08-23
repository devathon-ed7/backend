import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || "3000";

interface Config {
  PORT: string;
}

const config: Config = {
  PORT,
};

export default config;

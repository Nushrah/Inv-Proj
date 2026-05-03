export const env = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET ?? "portfolio_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
};

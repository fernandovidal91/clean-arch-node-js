export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '1893752557650794',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '2620a5755eea8a599018d0ea34ad8d5b',
  },
  port: process.env.PORT ?? 2000,
  jwtSecret: process.env.JWT_SECRET ?? '123',
}

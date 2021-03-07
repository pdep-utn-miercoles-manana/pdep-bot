const env = process.env;

module.exports = {
  discord: {
    token: env.DISCORD_TOKEN,
    verifiedMailRoleName: env.VERIFIED_MAIL_ROLE_NAME
  },
  mongo: {
    connectionString: `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_HOST}/${env.MONGO_DB}?retryWrites=true&w=majority`,
    connectionOptions: { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    },
  },
}

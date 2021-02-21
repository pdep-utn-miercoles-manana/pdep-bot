const env = process.env;

module.exports = {
  discord: {
    token: env.DISCORD_TOKEN || 'abc',
  },
  mongo: {
    connectionString: 'mongodb://localhost:27017/pdep',
    connectionOptions: { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    },
  },
}

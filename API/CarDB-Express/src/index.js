const { swaggerDocs } = require("./swagger");
const app = require("./app");

const PORT = process.env.PORT || 3000;

let server = app.listen(PORT, () => {
    console.log('HTTP server is running on Port', PORT)
    swaggerDocs(app, PORT);
})


const close = () => {
  console.log('Gracefully stopping...')
  server.close(async () => {
    console.log(`API Server closed`)
    console.log('Database connection closed')
    process.exit(0)
  })
}

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => process.on(signal, close))
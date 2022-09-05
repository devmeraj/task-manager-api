const app = require('./app');
const port = process.env.PORT;
require('./db/mongodb');

app.listen(process.env.PORT, () => {
    console.log("Server running at port: " + port);
});
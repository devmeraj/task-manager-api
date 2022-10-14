const app = require('./app');
const port = process.env.PORT;
require('./db/mongodb');

app.listen(port, () => {
    console.log("Server running at port: " + port);
});

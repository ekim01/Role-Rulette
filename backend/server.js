const app = require('./app')

const port = 3000

/* Server Start */
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
const express = require('express');
const app = express();
const cron = require('node-cron');
const port = 5001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// cron.schedule('* * * * *', () => {
//             console.log("cron running");
// });
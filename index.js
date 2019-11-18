const express = require("express");
const mongoose = require("mongoose");
const Helmet = require("helmet");

const app = express();
const cors = require("cors");

const post = require("./routes/post");
const user = require("./routes/user");
const tag = require("./routes/tag");
const comment = require("./routes/comment");


const dbURI = process.env.MONGODB_URI || "mongodb://localhost/blog-dev";
app.use(Helmet());

var whitelist = ['http://localhost.com', 'https://ksw-blog-front.web.app', 'https://ksw-blog-front.firebaseapp.com']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));

app.use((req, res, next) => {
    mongoose.connect(dbURI, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
        .then(() => next())
        .catch(e => next(e));
});

app.use(express.json());

app.use("/auth", user);
app.use("/api/post", post);
app.use("/api/tag", tag);
app.use("/api/comment", comment);

app.use(() => mongoose.disconnect());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}......`))
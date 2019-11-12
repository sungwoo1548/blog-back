const express = require("express");
const mongoose = require("mongoose");
const Helmet = require("helmet");

const app = express();

const post = require("./routes/post");
const user = require("./routes/user");
const tag = require("./routes/tag");
const comment = require("./routes/comment");


const dbURI = process.env.MONGODB_URI || "mongodb://localhost/blog-dev";

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

app.use(Helmet());
app.use(express.json());

app.use("/auth", user);
app.use("/api/post", post);
app.use("/api/tag", tag);
app.use("/api/comment", comment);

app.use(() => mongoose.disconnect());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}......`))
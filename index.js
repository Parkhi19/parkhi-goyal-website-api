const admin = require("firebase-admin");
const express = require('express')
const cors = require('cors')

const app = express();
const PORT = (process.env.PORT || 8080);
// const PORT = 5000;

app.use(express.json());
app.use(cors());

var serviceAccount = require("./cred.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

app.get("/get/all-blogs", (req, res) => {
    db.collection("blogs").get().then((col) => {
        const allBlogs = []
        col.docs.forEach((doc) => {
            allBlogs.push(parseBlog(doc))
        })
        res.status(200)
        .send(
            {
                "data": allBlogs
            }
        )
    })
});

app.get("/get/personal-info", (req, res) => {
    db.collection("personal-info").doc("0YvBob1h41L2aWMNoxNU").get().then((doc) => {
        res.status(200)
        .send({
            "data": parsePersonalInfo(doc)
        })
    })
})

app.get("/get/know-more-content", (req, res) => {
    db.collection("personal-info").doc("ZRK0ovY4QwgkeBIKKQto").get().then((doc) => {
        res.status(200)
        .send({
            "data": parseAboutContent(doc)
        })
    })
})

app.listen(PORT, () => {
    console.log(`App is running at port: ${PORT}`);
})

function parseBlog(doc) {
    return {
        caption: doc.get("caption"),
        id: doc.get("id"),
        photoUrl: doc.get("photoUrl"),
        timeStamp: doc.get("timeStamp")
    }
}

function parsePersonalInfo(doc) {
    return {
        aboutHome: doc.get("aboutHome"),
        id: doc.get("id"),
        name: doc.get("name"),
        photoUrl: doc.get("photoUrl")
    }
}

function parseAboutContent(doc) {
    return {
        paragraphs: doc.get("paragraphs")
    }
}
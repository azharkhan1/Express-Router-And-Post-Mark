
var mongoose = require("mongoose");



let dbURI = "mongodb+srv://azhar:azhar@mongodb.xd2iy.mongodb.net/testDB?retryWrites=true&w=majority";


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

////////////////mongodb connected disconnected events///////////////////////////////////////////////

mongoose.connection.on("connected", () => { // MONGODB Connected
    console.log("Mongoose connected");
})


mongoose.connection.on("disconnected", () => {
    console.log("MONGODB disconnected");
    process.exit(1);
});

mongoose.connection.on("error", (err) => {
    console.log("MongoDB disconnected due to : " + err);
    process.exit(1);
});

process.on("SIGINT", () => {
    console.log("App is terminating");
    mongoose.connection.close(() => {
        console.log("MONGODB disconnected");
        process.exit(0);
    })

})

var userSchema = new mongoose.Schema({
    userEmail: String,
    userName: String,
    userPassword: String,
});

var userModel = mongoose.model("users", userSchema);

module.exports = {
    userModel : userModel,
}
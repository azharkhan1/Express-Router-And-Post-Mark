
// const url = 'https://loginjwtmongo.herokuapp.com';
const url = "http://localhost:3000";



const signup = () => {

    var userEmail = document.getElementById("email").value.toLowerCase();
    var userPassword = document.getElementById("password").value
    var userName = document.getElementById("name").value

    let obj = {
        userEmail: userEmail,
        userPassword: userPassword,
        userName: userName,
    };

    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/auth/signup");
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(obj));

    Http.onreadystatechange = (e) => {

        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText)
            console.log(Http.status);
            if (Http.status === 200) {
                alert(jsonRes.message);
                window.location.href = "login.html";
            }
            else {
                alert(jsonRes.message);
            }



        }
    }
    return false;
}

const login = () => {

    var userEmail = document.getElementById("email").value.toLowerCase();
    var userPassword = document.getElementById("password").value

    obj = {
        userEmail: userEmail,
        userPassword: userPassword,
    }
    // console.log(obj);

    const Http = new XMLHttpRequest();

    Http.open("POST", url + "/auth/login");
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(obj));

    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            console.log(Http.responseText);
            let jsonRes = JSON.parse(Http.responseText);

            if (Http.status === 200) {
                alert(jsonRes.message);
                localStorage.setItem("currentUser", JSON.stringify(jsonRes));
                window.location.href="dashboard.html";
            }
            else {
                alert(jsonRes.message);
            }

        }
    }
    return false;
}

function getProfile(){
    console.log("url=>",url);
    axios({
        method: 'get',
        url: "http://localhost:3000/profile",
        credentials: 'include',
    }).then((response) => {
        console.log("welcoming user==>",response);

        // document.getElementById('welcomeUser').innerHTML = response.data.profile.name

    }, (error) => {
        console.log(error.message);
        // location.href = "./login.html"
    });

}


let logout = () => {
    if (currentUser === null || currentUser === undefined) {
        window.location.href = "index.html";
    }
    else {
        currentUser = null;
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }

}
// DONE WITH IT
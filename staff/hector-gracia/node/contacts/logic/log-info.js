const readline = require("readline");
fs=require("fs");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("What user do you want to log ? ",function(username){
    fs.readFile(username+".json",function(error,data){
        if(error){
            console.log("no user found");
            rl.close()
        }else{
            const userData= JSON.parse(data);
            console.log(userData.name);
            console.log(userData.surname);
            console.log(userData.phone);
            console.log(userData.email);
            console.log(userData.web);
            console.log(userData.instagram);
            console.log(userData.facebook);
            console.log(userData.twitter);
            console.log(userData.tiktok);
            
            rl.close();
        }
    })
})
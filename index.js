/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";    

inquirer.prompt([
    {
        type:"input",
        name:'url',
        message:'Enter the URL to generate QR code:',
    },
])
.then(answers=>{
    const url=answers.url; //Copies the user input URL into a variable
    const qrCode=qr.image(url,{type:'png'}); //converts the URL into a QR code
    qrCode.pipe(fs.createWriteStream('qr_img.png')).on('finish', () => {
        console.log("QR code saved!");
    });

    //Now we will save the use input URL into a text file
    fs.writeFile("url.txt",url,(err)=>{
        if(err) throw err;
        console.log("URL saved in url.txt file!");
    })
    console.log(`Qr code generated for the URL: ${url}`);
});


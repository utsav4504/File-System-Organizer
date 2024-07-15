let fs = require("fs");
let path = require("path");

let types = {
    media : ["mp4","mkv","mp3"],
    archives : ["zip","7z","rar","tar","gz","ar","iso","xz"],
    documents : ["docx","doc","pdf","xlsx","xls","odt","ods","odp","odg","odf","txt","ps"],
    app : ["exe","dmg","pkg","deb"]
};

function organizeFn(dirPath){
    // 1. input -> directory path given
    let destPath;
    if(dirPath === undefined){
        dirPath = process.cwd();
        destPath = path.join(dirPath,"organized_files");
        if(fs.existsSync(destPath) === false){
           fs.mkdirSync(destPath);
        }
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){

           let isFile = fs.lstatSync(dirPath).isFile();
           if(isFile === false){
              // 2. create -> organized_files directory
              destPath = path.join(dirPath,"organized_files");
              if(fs.existsSync(destPath) === false){
                 fs.mkdirSync(destPath);
              }
           }else{
              console.log("Kindly enter the correct path");
              return;
           }
           
        }else{
           console.log("Kindly enter the correct path");
           return;
        }
    }
    organizeHelper(dirPath,destPath);
}

function organizeHelper(src,dest){
   // 3. identify the categories of all the files present in input directory
   let childNames = fs.readdirSync(src);
   for(let i=0;i<childNames.length;i++){
      let childAddress = path.join(src,childNames[i]);
      let isFile = fs.lstatSync(childAddress).isFile();
      if(isFile){
        let category = getCategory(childNames[i]);
        sendFiles(childAddress,dest,category);
      }
    }
}

function getCategory(name){
    let ext = path.extname(name).slice(1);
    for(let type in types){
       let cTypeArray = types[type];
       for(let i=0;i<cTypeArray.length;i++){
           if(ext === cTypeArray[i]){
             return type;
           }
       }
    }
    return "others";
}

// 4. copy/cut files to that organized_files directory inside of their respective category
function sendFiles(srcFilePath, dest, category){
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath)===false){
        fs.mkdirSync(categoryPath);
    }

    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
}

module.exports = {
    organizeKey: organizeFn
};

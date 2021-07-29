const fs = require('fs');
const validator = require('validatorjs');
const md5 = require('md5');
const db = require('../db').db;

function processData(data){
    const lines = data.split("\n");
    let records = [];
    let badRecords = [];
    lines.forEach( (line,index) => {
        line = line.trim();
        if( [line.length,index].includes(0) ) return; //if line empty or first line skip 
        const fields = line.split(',');
        if(fields.length != 5 ){
            console.log('bad number of fields: ',fields);
            badRecords.push(line);
        }
        let data = {
            name: fields[0].split('"').join('').trim(),
            sex: fields[1].split('"').join('').trim(),
            age: fields[2].split('"').join('').trim(),
            height: fields[3].split('"').join('').trim(),
            weight: fields[4].split('"').join('').trim() 
        };

        let valid = new validator(data,{
            name: 'alpha',
            sex: 'in:M,F',
            age: 'numeric',
            height: 'numeric',
            weight: 'numeric'
        });
        if(valid.passes()){
            let query = `insert into biostat values ("${data.name}","${data.sex}","${data.age}","${data.height}","${data.weight}","${md5(data.name+data.sex+data.age+data.height+data.weight)}")`;
            let p = new Promise((res,rej)=>{
                db.exec(query,(err)=>{
                    if(err){
                        if(err.errno != 19)
                            console.log(query, ': Error',err);
                        //throw err;
                    }
                    res();
                })
            });
        } else {
            console.log('bad format: ',data);
            badRecords.push(line);
        }
        //console.log(index, line);
    });
    return badRecords;
}
exports.importFile = function(req, res) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let csvfile = req.files.csvfile;
            csvfile.mv('./uploads/data.csv');
            fs.readFile('./uploads/data.csv', {encoding:'utf8', flag:'r'},
                function(err, data) {
                    if(err)
                        console.log(err);
                    else {
                        let badRecords = processData(data);
                        if(badRecords.length > 0){
                            res.send({
                                status: true,
                                message: 'File is uploaded',
                                data: "File is uploaded and "+badRecords.length+" records can't be load into the database because a bad format in this records"
                            });
                        } else {
                            res.send({
                                status: true,
                                message: 'File is uploaded',
                                data: 'File is uploaded and records load into de database successfully'
                            });
                        }
                    }
                }
            );
        }
    } catch (err) {
        res.status(500).send(err);
    }
};
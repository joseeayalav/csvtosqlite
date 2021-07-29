const db = require('../db').db;

exports.search = function(req, res) {
    if(Object.entries(req.query) === 0){
        res.send({
            status: true,
            message: 'sin parametros',
            data: 'necesita proporcionar filtros: /api/search?name=jose&age=30'
        });
    } else {
        //building a query
        let query = 'select * from biostat where ' + Object.entries(req.query).map(e=>{
            return ''+e[0]+' LIKE "%'+e[1]+'%"';
        }).join(' and ');
        //console.log(query);
        db.all(query, [], (err, rows) => {
            if (err) {
                console.log(err);
                //throw err;
            }
            let results = [];
            rows.forEach((row) => {
                results.push(row);
            });
            res.send({
                status: true,
                message: 'results',
                data: rows
            });
        });
    }
};
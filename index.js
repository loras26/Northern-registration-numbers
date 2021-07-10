const express = require("express");
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')
//let numPlate = 0;
const app = express();
const regList=[];
//configure template
app.engine('handlebars', exphbs({
   partialsDir: "./views/partials",
   viewPath: "./views",
   layoutsDir: "./views/layouts"
}));
app.set('view engine', 'handlebars');
//
app.use(express.static("public"));
//
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
var db;
async function myApp() {
     db = await open({
        filename: "plate_nums.db",
        driver: sqlite3.Database
    });
    //await db.exec('PRAGMA foreign_keys=OF;');
    await db.migrate();
};

myApp();
app.get('/', (req, res) => res.render('index'))

app.get('/dave', async (req, res) => {
  const get_regNums = 'select * from regNum';
  const numP = await db.all(get_regNums);
  console.log(numP);
    //console.log(regList)
    return res.render('karabo',{numPlate : regList});
    

})
app.get('/daves', (req, res) => {
    res.render('rajesh');

})
app.post('/plates', async function (req, res) {
    let regNum=req.body.regNum
    console.log(regNum);
    const data = await db.run('insert into regNum  (reg_Num) VALUES(?)', regNum);
    regList.push({
        regNum
    })

    res.redirect('/dave');

});
app.post('', (req, res) => {
    let regNum = req.body.regNum
    numPlate = regNum;
    console.log(req.body.regNum);

    res.redirect('');

});

const PORT = process.env.PORT || 3015
app.listen(PORT, () => console.log("App starting on PORT:", PORT));
const express=require('express');

const app=express();

const bodyParser=require('body-parser');

const date=require(__dirname+"/date.js");
const day=date();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.set('view engine', 'ejs');

let items=['Buy Food','Cook Food','Eat Food'];
let workItem=[];

app.get('/',function(req,res){
   
    res.render('list',{listTitle:day, newListItems:items});
});

app.post('/',function(req,res){
    let item=req.body.newItem;
    if(req.body.list==='work'){
        workItem.push(item);
        res.redirect('/work');
    }
    else{
        items.push(item);
    res.redirect('/');
    }
    
});

app.get('/work',function(req,res){
    res.render('list',{listTitle:"work List", newListItems:workItem})
});

app.get('/about',function(req,res){
    res.render('about');
});

app.listen(3000,function(){
    console.log('Server is running on port 3000');
});


const express=require('express');
const mongoose=require('mongoose');

const app=express();

const bodyParser=require('body-parser');
const { name } = require('ejs');

mongoose.connect('mongodb://127.0.0.1:27017/tododb')

const date=require(__dirname+"/date.js");
const day=date();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.set('view engine', 'ejs');

//initial loading of the database
const itemschema={
    name:String
}
// creating item model-should start with a capital letter
const Item=mongoose.model('item',itemschema);
const item1= new Item({
    name:"Welcome to your todolist"
});
const item2=new Item({
    name:"Hit the + button to add new item"
});
const item3=new Item({
    name:"<-- hit this to delete an item"
});

const listSchema={
    name:String,
    listItems:[itemschema]
}
const listModel=mongoose.model('list',listSchema);

app.get('/',function(req,res){
    
    Item.find().then(function(items){
        //checking if there are any items in the database
        if(items.length===0){
            Item.insertMany([item1,item2,item3]).then(function(result){
                console.log("Default Data inserted successfully");
                console.log(result);
            });
            res.redirect('/');
        }
        else{
            res.render('list',{listTitle:"Today", newListItems:items});
        }
    });
});

app.get('/:customName',function(req,res){
    const customListName=req.params.customName;

    listModel.findOne({name:customListName}).then(function(foundList){
        if(!foundList){
            const list=new listModel({
            name:customListName,
            listItems:[]
            });

            list.save().then(function(){
                console.log("Data inserted successfully");
            });
            res.redirect('/'+customListName);
        }
        else{
            //show an existing list
            res.render('list',{listTitle:foundList.name, newListItems:foundList.listItems});
        }
    });

});
app.post('/',function(req,res){
    let itemName=req.body.newItem;
    let listName=req.body.list;

    const item=new itemModel({
        name:itemName
    });

    if (listName=="Today"){
        item.save().then(function(){
        console.log("Data inserted successfully to "+listName+" list");
        });
        res.redirect('/');
    }
    else{
        listModel.findOne({name:listName}).then(function(found){
            found.listItems.push(item);
            found.save().then(function(){
                console.log("data inserted to "+listName+" list");
            });
            res.redirect("/"+listName);
        });
    }    
    
});

app.post('/del',function(req,res){
    let checkedItemId=req.body.check;
    let listName=req.body.listName;
    console.log(checkedItemId);
    itemModel.findByIdAndDelete(checkedItemId).then(function(){
        console.log("Data deleted successfully");
    });
    res.redirect('/');
});

app.get('/about',function(req,res){
    res.render('about');
});

app.listen(3000,function(){
    console.log('Server is running on port 3000');
});
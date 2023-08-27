//import {} from 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";
import { dirname } from "path";
import { fileURLToPath } from "url";



const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.port || 3000;
app.set('view engine', 'ejs');
mongoose.set('strictQuery', false);
const date = new Date();

const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};


const day = date.toLocaleString('en-IN', options);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
/*const connectDB =  async()=>{
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(`mongoDb connected ${conn.connection.host}`);
  }catch(error){
    console.log(error);
    process.exit(1);
  }
}*/

mongoose.connect("mongodb+srv://Jahanvi_025:Jahanvi90588@cluster0.stim6az.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name : String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
   name : 'Welcome to Infinite Todo!'
});
const item2 = new Item({
    name : 'Hit + to add new items'
 });
 const defaultItems = [item1, item2];
 
 const listSchema = new mongoose.Schema({
    name: String,
    items : [itemsSchema]
 });
 const List = mongoose.model("List", listSchema);
app.get("/",(req,res) =>{
    res.render("index");
});

app.get("/instruction", (req, res) =>{
    res.render("instruction");
});


app.post("/todaytask",(req,res) =>{
    const newName = req.body.newItem;
   const listName = req.body.add;
    const item = new Item({
        name : newName
    });
if(listName === day){
    item.save();
    res.redirect("/today");
}
else{
    List.findOne({name : listName})
   .then(foundList => {
   foundList.items.push(item);
   foundList.save();
   res.redirect("/" + listName)
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
  
    
});
app.post("/delete", (req, res)=>{
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === day){
   
    Item.findByIdAndRemove(checkedItemId).then(function(foundItem){Item.deleteOne({_id: checkedItemId})});
    res.redirect("/today");
  }
  else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function (foundList)
    {
      res.redirect("/" + listName);
    });
  }
 
});
app.get("/today",(req, res) =>{
  Item.find({})
  .then(function(foundItems) {
      
      if(foundItems.length === 0){
          
          Item.insertMany(defaultItems)
          .then(function() {
              console.log("Insert succesfull");
          })
          .catch(function(err) {
              console.log(err);
          });
          res.redirect("/today");

      }else{
        res.render("today",{Today: day, itemslist : foundItems});
      }

  })
  .catch(function(err) {
      console.log(err);
  });

});


const itemsSchema2 = new mongoose.Schema({
    name : String
});
const Item2 = mongoose.model("Item2", itemsSchema);

const item4 = new Item2({
   name : 'Welcome to Infinite Todo❤️!'
});
const item5 = new Item2({
    name : 'Create Your work list here!'
 });

 const defaultItems2 = [item4, item5];
 
 const listSchema2 = new mongoose.Schema({
    name: String,
    items : [itemsSchema2]
 });
 const List2 = mongoose.model("List2", listSchema2);
app.post("/todaywork",(req,res) =>{
    const newName = req.body.newItem;
     const item = new Item2({
         name : newName
     });

     item.save();
     res.redirect("/work");
 
});

app.get("/work",(req, res) =>{
    Item2.find({})
    .then(function(foundItems) {
        
        if(foundItems.length === 0){
            
            Item2.insertMany(defaultItems2)
            .then(function() {
                console.log("Insert succesfull");
            })
            .catch(function(err) {
                console.log(err);
            });
            res.redirect("/work");
 
        }else{
          res.render("work",{ listTitle: "Work List", itemslist : foundItems});
        }
 
    })
    .catch(function(err) {
        console.log(err);
    });
});
app.post("/deletework", (req, res)=>{
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
    Item2.findByIdAndRemove(checkedItemId).then(function(foundItem){Item2.deleteOne({_id: checkedItemId})});
    res.redirect("/work");
});

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);
 if(customListName !== "Work"){
   List.findOne({ name: customListName })
   .then(function (foundList) {
     if (!foundList) {
       const list = new List({
         name: customListName,
         items: defaultItems,
       });
       list.save();
       res.redirect("/" + customListName);
     }
     else{
       res.render("today", {
         Today: customListName,
          itemslist : foundList.items
       });
     }
   })
   .catch(function (err) {
     console.log(err);
   });
 
 }else{
   Item2.find({})
   .then(function(foundItems) {
       
       if(foundItems.length === 0){
           
           Item2.insertMany(defaultItems2)
           .then(function() {
               console.log("Insert succesfull");
           })
           .catch(function(err) {
               console.log(err);
           });
           res.redirect("/work");

       }else{
         res.render("work",{ listTitle: "Work List", itemslist : foundItems});
       }

   })
   .catch(function(err) {
       console.log(err);
   });
 }
 
  
 });
 //connectDB.then(()=>{
  app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});

 //});

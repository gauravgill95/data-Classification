var express =require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var async =require('async');
// Enter your password here
var password= '1234567890';
// App will listen to port 3000
var port=3000;
//Create the connection with the server and database.
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database:'db1'
});
con.connect(function(err){
	if(err) throw err;
	else{
		console.log("Connected");
		//Sql query to create a table in database.
		var sql="create table if not exists items( item_id int NOT NULL AUTO_INCREMENT PRIMARY KEY , item_category varchar(20) ,item_tag varchar(20))";
		con.query(sql,function(err,res){
			if(err) throw err;
			else {
				console.log("Table created");
			}
		});
	}
});
var app= express();
//view engine for rendering dynamic html pages.
app.set('view engine','ejs');
// bodyParser  for POST request.
var urlencodedParser = bodyParser.urlencoded({ extended:false  })
//  To load stylesheet and javascript code from src folder.
app.use('/',express.static('src'));
// To handle starting '/' get request.
app.get('/',function(req,res){
	// create a connection.
   	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: password,
	  database:'db1'
	});   	
	// to store animals, fruits and flowers data.
	var data_animals=[];
	var data_fruits=[];
	var data_flowers=[];	
	//connect to server.
    con.connect(function(err) {
		if (err) throw err;
		// Sql query to select all items from database.
			con.query("select distinct item_category from  items", function (err, result) {
			    if (err) throw err;
			    var discat=[];
			    for(var i=0;i<result.length;i++){
			    	discat.push(result[i].item_category);
			    }
			    console.log(discat);
			    // Render the page after data is uploaded. 
			  	res.render('startindex',{data:discat});
			  });
	});
});
// to handle post or submit item data request.
app.post('/api', urlencodedParser, function (req, res) {
  	if (!req.body) return res.sendStatus(400)
  	// create a connection.
  	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: password,
	  database:'db1'
	});
	//connect to server 
	con.connect(function(err){
		if(err) throw err;
		else{
			// sql query to insert items into table.
			var sql='insert into items(item_category, item_tag) values ? ;';
			// array to store input items retrieved from form .
			var values=[];
			var length=0;
			console.log(req.body);
			/*
					Below code converts the sql return RowDataPacket to a araray values.
			*/
			//  when RawDataPacker is a string.

			var string1 =req.body.attributes;
			var tag_value=[];
			var tlength=0;
			if(typeof(string1)=="string"){
				var arr =[];
				string1.trim();
				arr=string1.split(',');
				tag_value.push(arr);
			}
			else{
				console.log(string1);
				for(var k=0;k<string1.length;k++){
					var temp_array= string1[k].split(',');
					tag_value.push(temp_array);
				}
			}
			console.log(req.body);
			console.log("*****     "+ tag_value+"      *********");
			console.log(tag_value.length);
			if(typeof(req.body.category)=="string"){
			
				var category_array=[];
				category_array[0]=req.body.category;

				// to block values with null name.
				console.log(tag_value);
				for(var j=0;j<tag_value[0].length;j++){
					var temp=[];
					temp[0]=req.body.category;
					temp[1]=tag_value[0][j];
					console.log(temp);
					if(temp[0].trim()!=""){
						values.push(temp);
					}
				}
			}
			else{
				// when RawDataPacket is a array.
				var name_array=[];
				var category_array=[];
				 category_array=req.body.category;
				for(var i=0;i<category_array.length;i++){
					// to block values with null name.
					for(var j=0;j<tag_value[i].length;j++){
						var temp=[];
						temp[0]=req.body.category[i];
						temp[1]=tag_value[i][j];
						if(temp[0].trim()!=""){
							values[length]=temp;
							length++;
						}
					}
				}
			}

			console.log(values);
			// perform sql query to insert data into database.
			if(values.length>0){
			con.query(sql,[values],function(err,res){
				if(err) throw err;
				else {
					console.log("Data inserted");
				}
			});
			}
			// sql query to retrieve items from database.
			
			con.query("select distinct item_category from  items", function (err, result) {
			    if (err) throw err;
			    var discat=[];
			    for(var i=0;i<result.length;i++){
			    	discat.push(result[i].item_category);
			    }
			    
			    // Render the page after data is uploaded. 
			  	res.render('index');
			  });
		}
	});
});
// handles the data classification request.
app.post('/classify', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	// create a connection.
  	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: password,
	  database:'db1'
	});
	// connect to server.
	con.connect(function(err){
		if(err) throw err;
		else{
			console.log("Connected");
			// to store animals, fruits and flowers data.
			var data_animals=[];
			var data_fruits=[];
			var data_flowers=[];
			//	array to store input items retrieved from form (names of items to be searched).
			var values=[];
			var length=0;
			/*
					Below code converts the sql return RowDataPacket to a araray values.
			*/
			//  when RawDataPacker is a string.
				var string1 =req.body.attributes;
					var tag_value=[];
					var tlength=0;
					if(typeof(string1)=="string"){
						var arr =[];
						string1.trim();
						arr=string1.split(',');
						tag_value.push(arr);
					}
					else{
						console.log(string1);
						for(var k=0;k<string1.length;k++){
							var temp_array= string1[k].split(',');
							tag_value.push(temp_array);
						}
					}			
			if(typeof(req.body.name)=="string"){
				var temp=[];
				temp[0]=req.body.name;
				temp[1]=tag_value[0];
				values[length]=temp;
				length++;
			}
			else{
				// when there are multiple inputs (array of names).
				var name_array=req.body.name;
				for(var i=0;i<name_array.length;i++){
					var temp=[];
					temp[0]=name_array[i];
					temp[1]=tag_value[i];
					values[length]=temp;
					length++;
				}
			}
			var res_animal=[];
		    var res_fruit=[];
			var res_flower=[];
			var other=[];
		    var ok=0;
		    var final_class=[];
		    // async function perform the fucntion in the order they are written.
    		async.forEachOf(values, function (dataElement, i, inner_callback){
	        	var temp_value = dataElement;
	        	var tag_array=[];
	        	var possClass=[];
	        	var count=0;
	        	for(var j=0;j<dataElement[1].length;j++){
	        		tag_array[j]=dataElement[1][j];
	        	}
	        	console.log(tag_array);
	        	var ssql = "select distinct item_category from items where item_tag =?";
	        	//for(var i=0;i<tag_array.length;i++){
	        	async.forEachOf(tag_array,function(dataElement1,k,inner_callback1){
	        		console.log(dataElement);
	        		con.query(ssql,dataElement1,function(err,result){
	        			if(err) throw err;
	        			console.log(result);
	        			for(var p=0;p<result.length;p++){
	        				console.log(result[p].item_category);
	        				possClass.push(result[p].item_category);
	        			}
	        			if(result.length==0) possClass.push("Unknown");
	        			//console.log(possClass);
	        			//console.log(possClass);
	        			console.log("ok");
	        			inner_callback1(null);
	        		});
	        	},function(err){
	        			if(err) throw err;
	        			else console.log("yes");
	        			console.log(possClass);
	        			final_class.push(possClass);
	        			inner_callback(null);
	        		});

    		},  function(err){
        		   if(err){
          		//handle the error if the query throws an error
          				console.log("coming");
          				throw(err);
        		}else{
        			console.log("HEre");
        			
        			for(var j=0;j<final_class.length;j++){
						var unique_array = [];
						for(let i = 0;i < final_class[j].length; i++){
				        if(unique_array.indexOf(final_class[j][i]) == -1){
				            unique_array.push(final_class[j][i])
				        }
    }					final_class[j]=unique_array;
					}
					console.log(final_class);
        	   // Render the classified data
          			res.render('indexapi',{data:final_class, data_name:values});
        		}
    	});
		}
	});
})
// App listening to port 3000;
app.listen(port);

var path = require('path');
  express = require('express'),
  fs = require('fs'),
  app = express(),
  //pg = require('pg')
  http = require('http');
  
//~ var connection = mysql.createConnection({
  //~ //host: 'localhost',
  //~ user: 'root',
  //~ database: 'demo_node',
//~ });  

//~ var connect = connection.connect(function(err){
  //~ if(!err){
        //~ console.log("You are connected to the database.");
  //~ }
  //~ else{
        //~ throw err;
  //~ }
//~ });

//console.log(express.static(path.join(__dirname, "Kirsty Williams - Digitised Lipstick_files")))
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY'}));
  app.use(express.static(path.join(__dirname, "public")));
  app.set('port', process.env.PORT || 3000);
});

app.get('/', function(req, res){
  if (req.session.user) {
      res.send("Welcome " + req.session.user.username + "<br>" + "<a href='/logout'>logout</a>");
  } else {
    fs.readFile(__dirname + '/index.html', function (err, data) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data, 'utf8');
      res.send();
    });  
  }
});

app.get('/login', function(req, res){
  if (req.session.user) {
        res.redirect("/");
    } else {
        fs.readFile(__dirname + '/login.html', function (err, data) {
          if (err) throw err;
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(data, 'utf8');
          res.send();
        });
    }
    
});

app.get('/signup', function(req, res){
   if (req.session.user) {
      res.redirect("/");
  } else {
      fs.readFile(__dirname + '/signup.html', function (err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data, 'utf8');
        res.send();
      });
  }  
});

app.post('/signup', function(req, res){
  connection.query('INSERT INTO user SET first_name=?, last_name=?, username=?, password=?',
        [req.body.firstname, req.body.lastname, req.body.username, req.body.password],
        function (errors, results, fields) {
            if (errors) throw errors;
            insert_result = {
                'success': true,
                'message': 'Singup is successfully'
            }
           res.redirect('/login');
        }
    );
});

app.post('/login', function(req, res){
    connection.query('SELECT username FROM user WHERE username="' + req.body.username + '" AND password="' + req.body.password + '"',
        function (err, results, fields) {
            if (err) {
                throw err;
            }
            if (results[0]) {
              req.session.user = results[0];
              req.session.is_logged_in = true;
              res.redirect('/');
            }
            else {
              res.redirect('/login');
            }
        }
    );
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});
//~ http.createServer(app).listen(app.get('port'), function(){
  //~ console.log('Express server listening on port ' + app.get('port'));
//~ })

var port_number = http.createServer(app).listen(process.env.PORT || 3000);
app.listen(port_number);

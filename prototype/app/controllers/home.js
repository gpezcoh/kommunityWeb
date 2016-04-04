var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Group = mongoose.model('Group'),
  Post = mongoose.model('Post'),
  nodemailer = require('nodemailer'),
  mailer = require('nodemailer-express-handlebars');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  User.findOne({name : "Gabe"}, function (err, user) {
    if (!user){
      console.log("no user")
        var newUser = new User({
          name: "Gabe",
        });

        newUser.save(function (err) {
          if (err) return console.error(err);
        });
        user = newUser;
    }
        var newPosts = sortAllPosts(user.groups)
    console.log(newPosts)
    res.render('index', {
      userName: user.name,
      userId: user.id,
      user: user.id,
      newPosts: newPosts,
      groups: user.groups,
      msg: req.query.msg
    });
  });
});

function sortAllPosts(groups){
  // var categories = []
  var newPosts = []
  var newerPosts = []
  // for(var j = 0; j < user.groups.length; ++j){
  //   for(var i = 0; i < group.postStructures.length; ++i){
  newPosts.push({"name": "Announcement", "posts": []})
  newPosts.push({"name": "Job", "posts": []})
  newPosts.push({"name": "Event", "posts": []})

  //   }
  // }

  //CHANGE THIS LATER
  for(var k = 0; k < groups.length; ++k){
    for(var i = 0; i < groups[k].newPosts.length; ++i){
      for(var j= 0; j < newPosts.length; ++j){
        if(groups[k].newPosts[i].name === newPosts[j].name){
          newPosts[j].posts.unshift(groups[k].newPosts[i])
          break;
        }
      }
    }
  }
  for(var j= 0; j < newPosts.length; ++j){
      if(newPosts[j].posts.length !== 0){
        newerPosts.push(newPosts[j]);
      }
    }
  return newerPosts
}

router.get('/new', function (req, res, next) {
  res.render('new');
});

router.get('/group/new' , function (req,res,next){
  //res.render('newGroup');
  User.findOne({name : "Gabe"}, function (err, user) {
    if (!user){
      console.log("no user")
        var newUser = new User({
          name: "Gabe",
        });

        newUser.save(function (err) {
          if (err) return console.error(err);
        });
        user = newUser;
    }
    res.render('newGroup', {
      userName: user.name,
      userId: user.id,
      user: user.id,
      groups: user.groups,
      msg: req.query.msg
    });
  });
});

router.post('/posts/new/value' , function(req,res,next){
  console.log(req.body);
    User.findOne({_id: req.body.user}, function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.body.groupId){
             if(req.body.postName === "Announcement"){
                var cats = ["Summary", "Description", "Title"];
                var newPost = new Post({
                  group: user.groups[i].name,
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
              }
              else if(req.body.postName === "Event"){
                console.log("ayyy")
                var cats = ["Title", "Description", "Date", "Location"];
                var newPost = new Post({
                  group: user.groups[i].name,
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
              }
              else if(req.body.postName === "Job"){
                var cats = ["Company", "Role", "Location", "Description", "Date"];
                var newPost = new Post({
                  group: user.groups[i].name,
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
              }
              console.log(newPost.group)
              user.groups[i].posts.unshift(newPost)
              user.groups[i].newPosts.unshift(newPost)
              user.save(function (err,group) {
                  if (err) return console.error(err);
               });
          res.redirect('../../groups/' + user._id + "/" + req.body.groupId)
        }
      }     
  });
});

router.post('/posts/new' , function (req,res,next){
  User.findOne({_id: req.body.user}, function (err,user){
    for(var i = 0; i < user.groups.length; ++i){
      if(user.groups[i].id === req.body.groupId){       
        if(req.body.postType === "Job"){
          var cats = ["Company", "Role", "Location", "Description", "Date"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                isGroup: true,
                name: "Job",
                categoryNames: cats
            });        
         }
        else if(req.body.postType === "Event"){
          var cats = ["Title", "Description", "Date", "Location"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                isGroup: true,
                name: "Event",
                categoryNames: cats
            });
        }
        else if(req.body.postType === "Announcement"){
          var cats = ["Title", "Description"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                isGroup: true,
                name: "Announcement",
                categoryNames: cats
            });
        }
      }
    }
  });
});


router.get('/posts/new' , function (req,res,next){
  User.findOne({_id: req.query.user}, function (err,user){
    for(var i = 0; i < user.groups.length; ++i){
      if(user.groups[i].id === req.query.groupId){       
        if(req.query.postType === "Job"){
          var cats = ["Company", "Role", "Location", "Description", "Date"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                name: "Job",
                categoryNames: cats
            });        
         }
        else if(req.query.postType === "Event"){
          var cats = ["Title", "Description", "Date", "Location"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                name: "Event",
                categoryNames: cats
            });
        }
        else if(req.query.postType === "Announcement"){
          var cats = ["Title", "Description"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                name: "Announcement",
                categoryNames: cats
            });
        }
      }
    }
  });
});

function sortPosts(group){
  var newPosts = []
  var newerPosts = []
  for(var i = 0; i < group.postStructures.length; ++i){
    newPosts.push({"name": group.postStructures[i], "posts": []})
  }
  for(var i = 0; i < group.newPosts.length; ++i){
    for(var j= 0; j < newPosts.length; ++j){
      if(group.newPosts[i].name === newPosts[j].name){
        newPosts[j].posts.unshift(group.newPosts[i])
        break;
      }
    }
  }
  for(var j= 0; j < newPosts.length; ++j){
      if(newPosts[j].posts.length !== 0){
        newerPosts.push(newPosts[j]);
      }
    }
  return newerPosts
}

router.post('/groups/new' , function(req,res,next){
    var posts = [];
    if(req.body.events){
      posts.push("Event");
    }
    if(req.body.jobs){
      posts.push("Job");
    }
    if(req.body.announcements){
      posts.push("Announcement");
    }
      var newGroup = new Group({
        name: req.body.name,
        postStructures: posts,
        posts: []
      });
      // console.log(newGroup.postStructures)
      newGroup.save(function (err,group) {
        if (err) return console.error(err);
    });
    User.findOne({name : "Gabe"}, function (err, user) {
      // user.groups = newGroup;
      user.groups.push(newGroup);
      user.save(function (err,group) {
        if (err) return console.error(err);
      });
    var newPosts = sortPosts(user.groups[user.groups.length-1])
     res.render('group', {
                user: user.id,
                groupName: user.groups[user.groups.length-1].name,
                groupId: user.groups[user.groups.length-1].id,
                groups: user.groups,
                newPosts: newPosts,
                isNew: true,
                isGroup: true,
                // postType: req.query.postType,
                postStructures: user.groups[user.groups.length-1].postStructures
              });  });
});

router.get('/posts/view', function(req,res){
  User.findOne({_id: req.query.user}, function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.query.groupId){
            if(req.query.postType === "New"){
              newPosts = sortPosts(user.groups[i])
             res.render('group', {
                        user: user.id,
                        groupName: user.groups[i].name,
                        groupId: user.groups[i].id,
                        groups: user.groups,
                        newPosts: newPosts,
                        isNew: true,
                        isGroup: true,
                        postType: req.query.postType,
                        postStructures: user.groups[i].postStructures
                      });
            }
            else{
               var retPosts = [];
               for(var j = 0; j < user.groups[i].posts.length; ++j){
                if(user.groups[i].posts[j].name === req.query.postType){
                  retPosts.push(user.groups[i].posts[j]);
                }
               }
              res.render('group', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                isNew: false,
                isGroup: true,
                posts: retPosts,
                postType: req.query.postType,
                postStructures: user.groups[i].postStructures
              });
              break;
            }
        }
      }
    }); 
});

router.get('/groups/:userId/:id', function (req,res){
// router.get('/groups/:id', function (req,res){
    User.findOne({_id: req.params.userId},function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.params.id){
          if(user.groups[i].newPosts.length !== 0){
            var newPosts = checkNew(user.groups[i]);
          }
          var newPosts = sortPosts(user.groups[i])
          res.render('group', {
            user: user.id,
            newPosts: newPosts,
            isNew: true,
            userName: user.name,
            groupName: user.groups[i].name,
            groupId: user.groups[i].id,
            postStructures: user.groups[i].postStructures,
            groups: user.groups,
            isGroup: true
          });
        break;
      }
    }
  });
});

function checkNew(group){
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  var firstDate = new Date();
  var secondDate = group.newPosts[group.newPosts.length - 1].date;
  // var secondDate = group.posts[0].date;
  var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

  if(diffDays >= 7){
    group.newPosts.pop();
    group.save(function (err,group) {
        if (err) return console.error(err);
    });
    if(group.newPosts.length > 0){
      checkNew(group);
    }
  }
}

router.get('/newsletter/:userId/:id', function (req,res){
// router.get('/groups/:id', function (req,res){
    User.findOne({_id: req.params.userId},function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.params.id){
          res.render('newsLetter', {
            user: user.id,
            userName: user.name,
            groupName: user.groups[i].name,
            groupId: user.groups[i].id,
            postStructures: user.groups[i].postStructures,
            groups: user.groups,
            isGroup: true
          });
        break;
      }
    }
  });
});

router.post('/posts/email/send', function (req,res){
  var mg = require('nodemailer-mailgun-transport');
  var hbs = require('nodemailer-express-handlebars');
  var options = {
     viewEngine: {
         extname: ".handlebars",
         layoutsDir: 'app/views/email/',
         defaultLayout : 'newsletter',
         partialsDir : 'app/views/partials/'
     },
     viewPath: 'app/views/email/'
 };

  // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
  var sgTransport = require('nodemailer-sendgrid-transport');
  var send_grid = {
     auth: {
         api_user: 'kommunity',
         api_key: 'kommunity1234'
     }
  }
  var auth = {
    auth: {
      api_key: 'key-a6ceeb68f6dc46f74c70e74495042e48',
      domain: 'sandbox20f236709d6249009c584c43af758c2a.mailgun.org'
    }
  }

  //var nodemailerMailgun = nodemailer.createTransport(mg(auth));
  var nodemailerMailgun = nodemailer.createTransport(sgTransport(send_grid));
  nodemailerMailgun.use('compile', hbs(options));

  /*res.render('newsletter', {
    name: 'Kommunity Newsletter'
  }, function(err, html) {
*/
  var newPosts = []
   User.findOne({_id: req.body.user}, function (err,user){
    console.log("user found")
    for(var i = 0; i < user.groups.length; ++i){
      if(user.groups[i].id === req.body.groupId){
            console.log("group found")
          newPosts = sortPosts(user.groups[i]);
                      console.log(newPosts)
        }
      }
    });

  nodemailerMailgun.sendMail({
    from: 'newsletter@kommunity.com',
    to: req.body.email, // An array if you have multiple recipients.
    //cc:'second@domain.com',
    //bcc:'secretagent@company.gov',
    subject: req.body.subject,
    'h:Reply-To': 'newsletter@kommunity.com',
    //You can use "html:" to send HTML email content. It's magic!
    template: "newsletter",
    context: {
        newsdate : req.body.newsdate,
        newPosts: newPosts,
        isNew: true,
        isGroup: true,
        // postType: req.query.postType,
   }
    //You can use "text:" to send plain-text content. It's oldschool!
    //text: 'Mailgun rocks, pow pow!'
  }, function (err, info) {
    if (err) {
      console.log('Error: ' + err + '=>' + req.body.email);
      nodemailerMailgun.close();
      res.redirect('/?msg=failed to send newsletter');
    }
    else {
      console.log('Response: ' + info + '=>' + req.body.email);
      nodemailerMailgun.close();
      res.redirect('/?msg=newsletter sent successfully');
    }
  });

  //});

});
const   mongoose    = require('mongoose'),
        Blog        = require('./models/blog'),
        Comment     = require('./models/comment'),
        chance      = require('chance')


const data = [
    {title: 'Seed One', url: 'https://images.unsplash.com/photo-1580566176138-daa588058b59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80', body: 'What an awesome post!'},
    {title: 'Seed Two', url: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80', body: 'What a cool piece!'}
]

function seedDB(){
    Blog.deleteMany({}, (err)=>{
        if(err){
            console.log(err);
        }
    });

    Comment.deleteMany({}, (err)=>{
        if(err){
            console.log(err);
        }
    });

    data.forEach(seed => {
       Blog.create(seed, (err, blog)=>{
           if(err){
               console.log(err)
           }else{
               Comment.create({
                   content: 'Woo, first!',
                   author: 'Buzz Aldren'
               },(err, newComment)=>{
                   if(err){
                       console.log(err);
                   }else{
                        blog.comments.push(newComment);
                        blog.save((err)=>{
                            if(err){
                                console.log(err);
                            }
                        });
                   }
               })
           }
       }); 
    });
    
};
module.exports = seedDB;


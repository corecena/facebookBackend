const router = require("express").Router();
const  bcrypt = require( "bcrypt")
const  Users = require("../models/Users");
 
//update user
router.put("/:id" , async (req , res)=>{
    if(req.body.userId=== req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await  bcrypt.genSalt(10);
                req.body.password =  await bcrypt.hash(req.body.password , salt);
            } catch (err) {
                return res.status(500).json(err)
            }}

            try {
                const user = await  Users.findByIdAndUpdate(req.params.id ,{$set:req.body, });
                res.status(200).json("Account has been updated");
            } catch (err) {
                return res.status(500).json(err);
                
            }

        }else{
            return res.status(403).json("you can only update your account ")
        }
    }

);

//delete a user 
router.delete("/:id" , async (req , res)=>{
    if(req.body.userId=== req.params.id || req.body.isAdmn){
        
            try {
                const user = await  Users.findByIdAndDelete(req.params.id );
                res.status(200).json("Account has been deleted");
            } catch (err) {
                return res.status(500).json(err);
                
            }

        }else{
            return res.status(403).json("you can only delete your account ")
        }
    }

);

router.get("/:id", async (req, res)=>{
    try {
        const user = await Users.findById(req.params.id);
            if(!user) return res.status(404).send('no user with the given id');
        const {password,updatedAt, ...other} =user._doc;

        return res.status(200).json(other);
        
        
    } catch (err) {
       return  res.status(500).json(err);
    }
    
});
//follow a user 
router.put("/:id/follow", async(req, res)=>{
    if(req.body.userId !==req.params.id){
        try {
            const user = await Users.findById(req.params.id);
            const currentUser = await  Users.findById(req.body.userId);
            if(!user || !currentUser) return res.status(404).send('user not found');
         
        if(!user.followers.includes(req.body.userId)){
            
            await user.updateOne({$push: {followers:req.body.userId}});
           await currentUser.updateOne({$push:{followings:req.params.id}});
            res.status(200).json("user has been followed");
        }else{
            res.status(403).json("you already follow this user");
        }

        } catch (err) {
           return  res.status(500).json(err);
            
        }
    }else{
        res.status(403).json("you cant follow yourself");
    }
});

//unfollow aa user 
router.put("/:id/unfollow", async(req, res)=>{
    if(req.body.userId !==req.params.id){
        try {
            const user = await Users.findById(req.params.id);
            const currentUser = Users.findById(req.body.userId);
         
        if(user.followers.includes(req.body.userId)){
            await user.updateOne({$pull: {followers:req.body.userId}});
            await currentUser.updateOne({$pull:{followings:req.params.id}});
            res.status(200).json("user has been unfollowed");
        }else{
            res.status(403).json("you dont follow this user");
        }

        } catch (err) {
            res.status(500).json(err);
            
        }
    }else{
        res.status(403).json("you cant unfollow yourself");
    }
});


module.exports = router; 
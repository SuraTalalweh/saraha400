import userModel from "../../../../DB/Models/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signupSchema } from "../Auth.validation.js";
import sendEmail from "../../../Services/sendEmail.js";

export const signup=async(req,res,next)=>{
   
   const {userName,email,password,gender,age,cpassword}=req.body;
   const user=await userModel.findOne({email});
   if(user){
    return res.status(409).json({message:"Email exists"});
   }
   const hashedPassword= bcrypt.hashSync(password,parseInt(process.env.SALTROUND));
   // return res.json(hashedPassword);
   const createUser=await userModel.create({
    userName,email,password:hashedPassword,gender,age,cpassword
   });
   const token=jwt.sign({email},process.env.EMAILTOKEN,{expiresIn:'1h'});
   const refreshToken=jwt.sign({email},process.env.EMAILTOKEN,{expiresIn:60*60*24});
   const link=`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
   const refreshLink=`${req.protocol}://${req.headers.host}/auth/NewconfirmEmail/${refreshToken}`
   const html=`<a href=${link}>verify email</a> <br/> <br/>or <a href=${refreshLink}>request new email to verify your email</a>`
   sendEmail(email,"confim email",html);

   return res.json({message:"success",user:createUser._id});

}
export const signin=async(req,res,next)=>{
   const {email,password}=req.body;
   const user=await userModel.findOne({email});
   if(!user){
      return res.status(404).json({message:"data invales"});
   }
   if(!user.confirmEmail){
      return res.status(400).json({message:"plz confirm your email"});
   }
   const match=bcrypt.compareSync(password,user.password);
   if(!match){
      return res.status(404).json({message:"data invalid"});
   }
   const token =jwt.sign({id:user._id},process.env.LOGINSIGNATURE);
   return res.status(201).json({message:"success",token}); 

} 
export const confirmEmail=async(req,res,next)=>{
   const {token}=req.params;
   const decoded=jwt.verify(token,process.env.EMAILTOKEN);
  
   const user=await userModel.findOneAndUpdate({email:decoded.email,confirmEmail:false},{confirmEmail:true});
  if(!user){
   return res.status(400).json({message:"your email is verified"});
  }
   else{
      return res.json({message:process.env.FRONTEND_LOGIN});
   }
}
export const newconfirmEmail=async(req,res,next)=>{
   const {Refreshtoken}=req.params;
   const decoded=jwt.verify(Refreshtoken,process.env.EMAILTOKEN);
   const token=jwt.sign({email:decoded.email},process.env.EMAILTOKEN,{expiresIn:'1h'});
   const link=`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
   const html=`<a href=${link}>verify email</a> `
   sendEmail(decoded.email,"confim email",html);
   return res.status(201).json({message:"new email is sent successfully "})

   // return res.json({message:"new email is sent successfully"});

}
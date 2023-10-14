  const dataMethods=['body','query','params','headers']
const validation=(Schema)=>{
  return(req,res,next)=>{
    const validationArray=[];
    dataMethods.forEach((key)=>{
      if(Schema[key]){
        const validationResult=Schema[key].validate(req[key],{abortEarly:false});
        if(validationResult.error){
          validationArray.push(validationResult.error.details);
        }
      }
    })
    if(validationArray.length>0){
      return res.json({message:"validation error",validationArray});
    }else{
      // return next();
      next();
    }
  }
}
export default validation;
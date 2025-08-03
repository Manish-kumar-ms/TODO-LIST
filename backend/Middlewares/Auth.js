import jwt from 'jsonwebtoken'

export const ensureAuthenticated=(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token) return res.status(401).json({message: "jwt token not found"});
        // Verify token
       const decoded=jwt.verify(token, process.env.JWT_SECRET);
       req.user=decoded; 
       next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "unauthorized jwt token",
        });
        
    }
}
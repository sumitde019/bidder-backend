const authService = require('../../service/auth/authService');
const { sendSuccessResponse } = require('../../utils/response');

const registerUser=async (req,res)=>{
    try {
        const userInfo = await authService.saveUser(req.body);
        // res.send(userInfo);
        sendSuccessResponse(res,)
    } catch (error) {
        res.send(error.message);
    }
};


module.exports = {registerUser};
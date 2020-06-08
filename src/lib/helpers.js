const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);// generatehash
    const encryptPass = await bcrypt.hash(password, salt);
    return encryptPass;
};

//Login
helpers.matchPassword = async(password, savedpass) => {
    try {
        return await bcrypt.compare(password, savedpass);
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;
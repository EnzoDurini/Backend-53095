import bcrypt from 'bcrypt'


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(11));


export const validatePassword = (user_password, password) =>  bcrypt.compareSync(user_password, password);
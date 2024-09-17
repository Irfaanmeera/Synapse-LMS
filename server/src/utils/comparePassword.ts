import bcrypt from 'bcryptjs'

interface IComparePassword{
    compare(password:string,hashedPassword:string) : Promise<boolean>
}

class Encrypt implements IComparePassword{

async compare(password:string,hashedPassword:string):Promise<boolean>{
    return await bcrypt.compare(password,hashedPassword)
}

async hashPassword(password:string): Promise<string>{
    return await bcrypt.hash(password,10)
}
}

export default Encrypt;
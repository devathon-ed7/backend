import { PrismaClient, User_accounts} from '@prisma/client'
import { omitFields } from '../../utils/middleware'

export interface UserDocument extends User_accounts {

} 

const prisma = new PrismaClient()



export default class UserModel {
    
    static getAll = async () => {
        const users = await prisma.user_accounts.findMany()
        const usersWithoutPassword =  users.map(user => omitFields(user, ['password']))
        return usersWithoutPassword
    }

    static getById = async (id: number)  => {
        const user = await prisma.user_accounts.findUnique({
            where: {
                id
            }
        })
              
        return user
    }
}


import { prisma } from "@/prisma/prisma client"
import { getUserSession } from "./get-user-session";
import { number } from "zod";


export const findOrCreateCart = async (token: string) => {
    let userCart =await prisma.cart.findFirst({
        where: {
            token,
        },
    });

    if(!userCart){

        userCart = await prisma.cart.create({
            data: {
                token,
            },
        });
    }

    return userCart;
}
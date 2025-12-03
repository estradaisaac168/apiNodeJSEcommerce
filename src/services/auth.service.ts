import bcrypt from "bcryptjs";
import prisma from "../database/prismaClient.js";
import { AppError } from "../utils/AppError.js";
import type { LoginInput } from "../validators/auth.validator.js";
import { generateToken } from "../config/jwt.js";
import type { CreateUserInput } from "../validators/user.validator.js";

export const loginUser = async (data: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: {email: data.email},
        include: {
            roles: {
                include:{
                    role: true
                }
            }
        }
    });

    if(!user){
        throw new AppError("Usuario no encontrado", 404)
    }

    const isPasswordValid = bcrypt.compare(data.password, user.password);

    if(!isPasswordValid){
        throw new AppError("Password incorrecto", 401);
    }

    //Crear el token de session
    const token = generateToken({
        id: user.id,
        email: user.email
    });

    const { password, roles, ...userData } = user

    const formattedRoles = roles.map((userRole) => ({
        id: userRole.role.id,
        name: userRole.role.name,
        route: userRole.role.route,
        image: userRole.role.image,
    }));

    return {
        "token": `Bearer ${token}`,
        "user": {
            ...userData,
            image: userData.image ? `http://${process.env.HOST}:${process.env.PORT}${userData.image}` : null,
            roles: formattedRoles
        }
    }
}


export const register = async (data: CreateUserInput) => {
    const {name, lastname, email, phone, password } = data; //Deconstruccion

    const existEmail = await findByEmail(data.email) //Validar que el email no exista en la base de datos

    if(existEmail){
        throw new AppError("El email ingresado ya existe prueba con otro", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10) //Hasheo del password

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: name,
                lastname: lastname,
                email: email,
                phone: phone,
                password: hashedPassword,

            }
        });

        const clientRole = await tx.role.findUnique({where: {id: "CLIENT"}});

        if(!clientRole){
            throw new AppError("El rol del cliente", 404);
        }

        await tx.userHasRole.create({
            data: {
                id_user: user.id,
                id_rol: clientRole.id
            }
        });


            //Crear el token de session
        const token = generateToken({
            id: user.id,
            email: user.email
        });

        return {
            token: `Bearer ${token}`,
            user:{
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                image: user.image,
                notification_token: user.notification_token,
                roles:[ //Por defecto le estamos pasando el rol de cliente
                    {
                        id: clientRole.id,
                        name: clientRole.name,
                        route: clientRole.route,
                        image: clientRole.image
                    }
                ]
            }
        }
    });

    return result;
}


export const findByEmail = async (email: string) => {
    return await prisma.user.findUnique({where: {email}});
}
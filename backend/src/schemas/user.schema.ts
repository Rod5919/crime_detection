import { User } from "../models/user.model";

import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsUUID,
    Length,
    IsBoolean,
} from "class-validator";

export interface GetUserDTO extends Pick<User, "id" | "name" | "username" | "email"> {}

export interface DeleteUserDTO extends Pick<User, "id" | "name"> {}

export interface IUpdateUserDTO extends Pick<User, "id" | "name" | "username" | "email" | "password"> {}

export class UpdateUserDTO implements IUpdateUserDTO {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    password: string;
}

export interface ICreateUserDTO extends Pick<User, "name" | "username" | "email" | "password"> {}

export class CreateUserDTO implements ICreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    password: string;
}

export interface ILoginUserDTO extends Pick<User, "username" | "password"> {}

export class LoginUserDTO implements ILoginUserDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    password: string;
}

export interface IChangePasswordDTO extends Pick<User, "id" | "password"> {}

export class ChangePasswordDTO implements IChangePasswordDTO {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    password: string;
}


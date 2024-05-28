export class User {}


import { ObjectId } from "mongodb";

import { Column, Entity, ObjectIdColumn } from "typeorm";


@Entity('user')
export class UserEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    avatar: string

}
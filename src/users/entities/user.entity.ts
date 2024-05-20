export class User {}


import { ObjectId } from "mongodb";

import { Column, Entity, ObjectIdColumn } from "typeorm";


@Entity('user')
export class UserEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    avatar: string;

    @Column({default: null})
    job: string;

}
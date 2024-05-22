import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";


@Entity('image')
export class ImageEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    userId: string

    @Column()
    hash: string

    @Column()
    filePath: string
}
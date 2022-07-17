import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {
    @Field( ( _type ) => Int )
        id: number;

    @Field( )
        text: string;

    @Field( )
        isCompleted: boolean;
}

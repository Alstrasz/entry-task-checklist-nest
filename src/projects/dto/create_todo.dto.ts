import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTodoDto {
    @Field()
        title: string;
    @Field()
        text: string;

    constructor ( data: CreateTodoDto ) {
        Object.assign( this, data );
    }
}

import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SetCompletedDto {
    @Field( ()=> Int )
        id: number;
    @Field()
        new_value: boolean;

    constructor ( data: Partial<SetCompletedDto> ) {
        Object.assign( this, data );
    }
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Todo } from 'src/todos/todo.model';

@ObjectType()
export class Project {
    @Field( ( _type ) => Int )
        id: number;

    @Field( )
        title: string;

    @Field( ( _type ) => [Todo] )
        todos: Array<Todo>;
}

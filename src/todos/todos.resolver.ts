import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { TodosService } from 'src/todos/todos.service';
import { SetCompletedDto } from './dto/set_completed.dto';
import { Todo } from './todo.model';

@Resolver( () => Todo )
export class ProjectsResolver {
    constructor (
        private todos_service: TodosService,
    ) {}

    @Mutation( () => Todo, { name: 'set_completed' } )
    async set_todo_completed ( @Args( 'set_completed_dto', { type: () => SetCompletedDto } ) set_completed_dto: SetCompletedDto ) {
        return this.todos_service.set_checked( set_completed_dto );
    }
}

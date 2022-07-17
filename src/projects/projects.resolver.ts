import { ConflictException } from '@nestjs/common';
import { Args, Int, Parent, ResolveField, Resolver, Query, Mutation } from '@nestjs/graphql';
import { db_error_codes } from 'src/constants';
import { TodosService } from 'src/todos/todos.service';
import { CreateTodoDto } from './dto/create_todo.dto';
import { Project } from './project.model';
import { ProjectsService } from './projects.service';

@Resolver( ( _of ) => Project )
export class ProjectsResolver {
    constructor (
        private projects_service: ProjectsService,
        private todos_service: TodosService,
    ) {}

    @Query( ( _returns ) => Project, { name: 'project' } )
    async get_one_project ( @Args( 'id', { type: () => Int } ) id: number ) {
        return this.projects_service.find_by_id( id );
    }

    @Query( ( _returns ) => [Project], { name: 'all_projects' } )
    async get_all_projects () {
        return this.projects_service.get_all();
    }

    @Mutation( () => Project, { name: 'create_todo' } )
    async create_todo ( @Args( 'create_todo_dto', { type: () => CreateTodoDto } ) create_todo_dto: CreateTodoDto ) {
        return this.projects_service.find_or_create( { title: create_todo_dto.title } )
            .then( async ( project ) => {
                await this.todos_service.save_todo( {
                    text: create_todo_dto.text,
                    project_id: project.id,
                } )
                    .catch( ( err ) => {
                        if ( err.code == db_error_codes.conflict ) {
                            throw new ConflictException( { code: db_error_codes.conflict, type: 'conflict', description: 'Value already present' } );
                        }
                    } );
                return project;
            } );
    }

    @ResolveField()
    async todos ( @Parent() project: Project ) {
        return this.todos_service.find_by_project_id( project.id );
    }
}

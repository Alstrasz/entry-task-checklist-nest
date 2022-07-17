import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { ProjectsResolver } from './todos.resolver';
import { TodosService } from './todos.service';

@Module( {
    providers: [
        TodosService,
        ProjectsResolver,
    ],
    imports: [TypeOrmModule.forFeature( [Todo] )],
    exports: [TodosService],
} )
export class TodosModule {}

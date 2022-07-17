import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from 'src/todos/todos.module';
import { Project } from './project.entity';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module( {
    providers: [
        ProjectsService,
        ProjectsResolver,
    ],
    imports: [
        TypeOrmModule.forFeature( [Project] ),
        TodosModule,
    ],
} )
export class ProjectsModule {}

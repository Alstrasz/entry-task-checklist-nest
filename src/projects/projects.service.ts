import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodosService } from 'src/todos/todos.service';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import * as DEFAULT_DATA from './default_data.json';

@Injectable()
export class ProjectsService {
    constructor (
        @InjectRepository( Project )
        private projects_repository: Repository<Project>,
        private todos_service: TodosService,
    ) {
        this.seed_repositories();
    }

    async save_project ( create_project_dto: Omit<Project, 'id' | 'todos'> ): Promise<Project> {
        return this.projects_repository.save( [create_project_dto] ).then( ( val ) => {
            return val[0];
        } );
    }

    async find_or_create ( create_project_dto: Omit<Project, 'id' | 'todos'> ): Promise<Project> {
        return await this.projects_repository.findOneBy( create_project_dto ).then( async ( val ) => {
            if ( val == null ) {
                return this.save_project( create_project_dto );
            }
            return val;
        } );
    }

    /**
     * Creates prject corresponding yo dto and returns it. Does nothing if project already exists
     *
     * @param {(Omit<Project, 'id' | 'todos'>)} seed_projct_dto
     * @return {Promise<Project>}
     * @memberof ProjectsService
     */
    async seed_project ( seed_projct_dto: Omit<Project, 'id' | 'todos'> ): Promise<Project> {
        return this.find_or_create( seed_projct_dto );
    }


    /**
     * Seeds Projet and Todo repository with data from ./default_data.json. Does nothing if data already present
     *
     * @memberof ProjectsService
     */
    async seed_repositories () {
        DEFAULT_DATA.forEach( async ( project ) => {
            this.seed_project( { title: project.title } )
                .then( ( project_saved ) => {
                    project.todos.map( ( todo ) => {
                        return {
                            text: todo.text,
                            project_id: project_saved.id,
                            isCompleted: todo.isCompleted,
                        };
                    } ).forEach( ( todo ) => {
                        this.todos_service.seed_todo( todo );
                    } );
                } );
        } );
    }

    async find_by_id ( id: number ): Promise<Project> {
        return this.projects_repository.findOne( { where: { id } } );
    }

    async get_all (): Promise<Array<Project>> {
        return this.projects_repository.find();
    }
}

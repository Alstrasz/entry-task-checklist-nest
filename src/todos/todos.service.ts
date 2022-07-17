import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import * as _ from 'lodash';
import { SetCompletedDto } from './dto/set_completed.dto';

@Injectable()
export class TodosService {
    constructor (
        @InjectRepository( Todo )
        private todos_repository: Repository<Todo>,
    ) {}

    async save_todo ( create_todo_dto: Omit<Todo, 'id' | 'isCompleted' | 'project'> ): Promise<Todo> {
        return this.todos_repository.save( [create_todo_dto] ).then( ( val ) => {
            return val[0];
        } );
    }

    /**
     * Creates todo corresponging to dto if one not present already
     *
     * @param {(Omit<Todo, 'id' | 'project'>)} seed_todo_dto
     * @return {*}  {Promise<Todo>}
     * @memberof TodosService
     */
    async seed_todo ( seed_todo_dto: Omit<Todo, 'id' | 'project'> ): Promise<Todo> {
        return await this.todos_repository.findOneBy( _.omit( seed_todo_dto, ['isCompleted'] ) ).then( async ( val ) => {
            if ( val == null ) {
                return this.todos_repository.save( [seed_todo_dto] )
                    .then( ( val ) => {
                        return val[0];
                    } );
            }
        } );
    }

    async find_by_id ( id: number ): Promise<Todo> {
        return this.todos_repository.findOne( { where: { id } } );
    }

    async find_by_project_id ( project_id: number ): Promise<Array<Todo>> {
        return this.todos_repository.find( { where: { project_id } } );
    }


    /**
     * Set isCompleted field for todo and return todo entity. Returns null if no todo found corresponding to id
     *
     * @param {SetCompletedDto} set_completed_dto
     * @return {*}  {Promise<Todo>}
     * @memberof TodosService
     */
    async set_checked ( set_completed_dto: SetCompletedDto ): Promise<Todo> {
        return this.todos_repository.createQueryBuilder()
            .update( {
                isCompleted: set_completed_dto.new_value,
            } )
            .where( {
                id: set_completed_dto.id,
            } )
            .returning( '*' )
            .execute()
            .then( ( val ) => {
                if ( val.affected == 0 ) {
                    return null;
                }
                return val.raw[0];
            } );
    }
}

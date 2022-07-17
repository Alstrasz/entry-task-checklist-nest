import { Todo } from 'src/todos/todo.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
        id: number;

    @Column( { unique: true } )
        title: string;

    @OneToMany( () => Todo, ( todo: Todo ) => todo.project, {
        cascade: ['remove'],
    } )
        todos: Array<Todo>;
}

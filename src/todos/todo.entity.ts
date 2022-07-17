import { Project } from 'src/projects/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn } from 'typeorm';

@Entity()
@Unique( 'unique_todo_per_project', ['text', 'project_id'] )
export class Todo {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        text: string;

    @Column( { default: false } )
        isCompleted: boolean;

    @ManyToOne( () => Project )
    @JoinColumn( { name: 'project_id' } )
        project: number;

    @Column()
        project_id: number;
}

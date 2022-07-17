import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { TodosModule } from './todos/todos.module';

@Module( {
    imports: [
        ProjectsModule,
        TodosModule,
        TypeOrmModule.forRoot( {
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: parseInt( process.env.POSTGRES_PORT || '5432' ),
            username: process.env.POSTGRES_USER || 'root',
            password: process.env.POSTGRES_PASSWORD || 'root',
            database: process.env.POSTGRES_DB || 'test',
            synchronize: true,
            autoLoadEntities: true,
            ssl: process.env.POSTGRES_USE_SSL !== undefined,
            extra: process.env.POSTGRES_USE_SSL === undefined ? undefined : {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        } ),
        GraphQLModule.forRoot<ApolloDriverConfig>( {
            driver: ApolloDriver,
            autoSchemaFile: join( process.cwd(), 'src/schema.gql' ),
        } ),
    ],
    controllers: [AppController],
    providers: [AppService],
} )
export class AppModule {}

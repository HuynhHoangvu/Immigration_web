import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudyApplicationsController } from './study-applications.controller'
import { StudyApplicationsService } from './study-applications.service'
import { StudyApplication } from './study-application.entity'

@Module({
  imports: [TypeOrmModule.forFeature([StudyApplication])],
  controllers: [StudyApplicationsController],
  providers: [StudyApplicationsService],
  exports: [StudyApplicationsService],
})
export class StudyApplicationsModule {}

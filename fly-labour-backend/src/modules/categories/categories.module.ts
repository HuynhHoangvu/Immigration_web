import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'
import { GcsModule } from '../../common/services/gcs.module'

@Module({
  imports: [TypeOrmModule.forFeature([Category]), GcsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { JobType, JobStatus } from '../job.entity'

export class CreateJobDto {
  @ApiProperty({ example: 'Công nhân Hái Quả Mùa Vụ' })
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  requirements?: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  benefits?: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  company?: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  location?: string

  @ApiProperty({ example: 'australia' })
  @IsString()
  country: string

  @ApiProperty({ enum: JobType, required: false })
  @IsEnum(JobType) @IsOptional()
  jobType?: JobType

  @ApiProperty({ enum: JobStatus, required: false })
  @IsEnum(JobStatus) @IsOptional()
  status?: JobStatus

  @ApiProperty({ required: false })
  @IsNumber() @IsOptional() @Type(() => Number)
  salaryMin?: number

  @ApiProperty({ required: false })
  @IsNumber() @IsOptional() @Type(() => Number)
  salaryMax?: number

  @ApiProperty({ required: false, default: 'AUD' })
  @IsString() @IsOptional()
  salaryCurrency?: string

  @ApiProperty({ required: false })
  @IsNumber() @IsOptional() @Type(() => Number)
  slots?: number

  @ApiProperty({ required: false })
  @IsOptional()
  deadline?: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  image?: string

  @ApiProperty({ required: false })
  @IsOptional() @Transform(({ value }) => value === 'true' || value === true)
  isHot?: boolean

  @ApiProperty({ required: false })
  @IsOptional() @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  categoryId?: string
}

export class UpdateJobDto extends CreateJobDto {}

export class QueryJobDto {
  @IsOptional() @Type(() => Number)
  page?: number = 1

  @IsOptional() @Type(() => Number)
  limit?: number = 12

  @IsOptional()
  search?: string

  @IsOptional()
  country?: string

  @IsOptional()
  categoryId?: string

  @IsOptional()
  jobType?: string

  @IsOptional() @Transform(({ value }) => value === 'true')
  isHot?: boolean
}

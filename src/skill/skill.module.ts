import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  providers: [SkillService],
  exports: [SkillService],
  controllers: [SkillController],
})
export class SkillModule {}

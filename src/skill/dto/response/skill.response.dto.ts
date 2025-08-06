import { ApiProperty } from '@nestjs/swagger';
import { Skill } from '../../skill.entity';

export class SkillResponseDto {
  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the skill',
  })
  id: number;

  @ApiProperty({
    example: 'JavaScript',
    description: 'The name of the skill',
  })
  name: string;

  constructor(skill: Skill) {
    this.id = skill.id;
    this.name = skill.name;
  }
}

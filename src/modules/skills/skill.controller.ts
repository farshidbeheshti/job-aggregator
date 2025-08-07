import { Controller, Get } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillResponseDto } from './dto/response/skill.response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all skills' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all skills',
    type: [SkillResponseDto],
  })
  async findAll(): Promise<SkillResponseDto[]> {
    const skills = await this.skillService.findAll();
    return skills.map((skill) => new SkillResponseDto(skill));
  }
}

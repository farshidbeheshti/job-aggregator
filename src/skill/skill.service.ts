import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find();
  }

  async findOrCreate(name: string): Promise<Skill> {
    let skill = await this.skillRepository.findOne({ where: { name } });
    if (!skill) {
      skill = this.skillRepository.create({ name });
      await this.skillRepository.save(skill);
    }
    return skill;
  }
}

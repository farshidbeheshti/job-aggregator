import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findOrCreate(city: string, state: string): Promise<Location> {
    let location = await this.locationRepository.findOne({
      where: { city, state },
    });
    if (!location) {
      location = this.locationRepository.create({ city, state });
      await this.locationRepository.save(location);
    }
    return location;
  }
}

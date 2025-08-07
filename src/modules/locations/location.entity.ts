import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('locations')
@Unique(['city', 'state'])
export class Location {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the location',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'New York', description: 'The city of the location' })
  @Column()
  city: string;

  @ApiProperty({ example: 'NY', description: 'The state of the location' })
  @Column()
  state: string;
}

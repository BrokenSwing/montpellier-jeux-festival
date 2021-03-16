import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { User } from '../user/entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { GameQuantities } from '../booking/entities/game-quantities.entity';
import { TableQuantities } from '../booking/entities/table-quantities.entity';
import { Company } from '../company/entities/company.entity';
import { Contact } from '../company/entities/contact.entity';
import { Area } from '../festival/entities/area.entity';
import { Festival } from '../festival/entities/festival.entity';
import { Price } from '../festival/entities/prices.entity';
import { Game } from '../game/entities/game.entity';

/**
 * Checks whether or not the passed object has field.
 *
 * @param obj The object to check fields count of
 * @returns true if no fields can be found on the given object
 */
export function hasNoFields(obj: any) {
  return Object.keys(obj).length === 0;
}

/**
 * Checks whether or not the given error matches a constraint
 * error and that the constraint indicated in the error
 * is the one passed in parameter.
 *
 * @param e The error thrown by the ORM method
 * @param constraintName The name of the constraint
 * @returns true if the error matches a constraint error
 */
export function isConstraint(e: any, constraintName: string) {
  return e && e.constraint === constraintName;
}

/**
 * Checks if the given error is the result of an invalid foreign key.
 *
 * @param e The error thrown by the ORM method
 * @returns true if the error is relation to a foreign key
 */
export function isForeignKeyError(e: any) {
  return (
    e &&
    typeof e.constraint === 'string' &&
    (e.constraint as string).startsWith('FK_')
  );
}

/**
 * A pipe that checks if the value is an UUID.
 */
@Injectable()
export class UUIDPipe implements PipeTransform<string, string> {
  transform(value: string, _: ArgumentMetadata): string {
    if (!isUUID(value)) {
      throw new NotFoundException();
    }
    return value;
  }
}

export const allEntities = [
  Festival,
  Price,
  Area,
  Contact,
  Company,
  Booking,
  TableQuantities,
  GameQuantities,
  Game,
  User
];

/**
 * @returns the typeorm module featuring all entities
 */
export function databaseAccessModule() {
  return TypeOrmModule.forFeature(allEntities);
}

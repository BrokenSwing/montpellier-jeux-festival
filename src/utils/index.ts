import { applyDecorators, ExecutionContext } from '@nestjs/common';
import { createParamDecorator, NotFoundException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { Booking } from 'src/booking/entities/booking.entity';
import { GameQuantities } from 'src/booking/entities/game-quantities.entity';
import { TableQuantities } from 'src/booking/entities/table-quantities.entity';
import { Company } from 'src/company/entities/company.entity';
import { Contact } from 'src/company/entities/contact.entity';
import { Area } from 'src/festival/entities/area.entity';
import { Festival } from 'src/festival/entities/festival.entity';
import { Price } from 'src/festival/entities/prices.entity';
import { Game } from 'src/game/entities/game.entity';

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
 * A decorator that extracts an UUID from the route parameters.
 * If the extracted value is not an UUID, a BadRequestException is thrown.
 *
 * @param name The name of the parameter in the route
 */
export const UUID = createParamDecorator<string>(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const uuid = request.params[data];
    if (uuid && isUUID(uuid)) {
      return uuid;
    }
    throw new NotFoundException();
  },
);

/**
 * @returns the typeorm module featuring all entities
 */
export function databaseAccessModule() {
  return TypeOrmModule.forFeature([
    Festival,
    Price,
    Area,
    Contact,
    Company,
    Booking,
    TableQuantities,
    GameQuantities,
    Game,
  ]);
}

/**
 * @file: update-user.dto.ts
 * @description: DTO для обновления пользователя. Все поля опциональные
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * UpdateUserDto - данные для обновления пользователя
 *
 * PartialType делает все поля из CreateUserDto опциональными
 * Это означает, что можно обновить только некоторые поля, а не все сразу
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}

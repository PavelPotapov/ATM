/**
 * @file: add-user-to-workspace.dto.ts
 * @description: DTO для добавления пользователя в workspace
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * AddUserToWorkspaceDto - данные для добавления пользователя в workspace
 */
export class AddUserToWorkspaceDto {
  @ApiProperty({
    description: 'UUID пользователя для добавления в workspace',
    example: '63191c61-a5d5-4553-8d93-93d2cb4af829',
  })
  @IsUUID(4, { message: 'ID пользователя должен быть валидным UUID' })
  userId!: string;
}

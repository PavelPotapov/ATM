/**
 * @file: update-workspace.dto.ts
 * @description: DTO для обновления рабочего пространства
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';

/**
 * UpdateWorkspaceDto - данные для обновления workspace
 * Все поля опциональны (наследуется от CreateWorkspaceDto)
 */
export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}

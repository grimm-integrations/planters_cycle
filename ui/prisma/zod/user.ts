import * as z from 'zod';

import {
  CompletePlantHistory,
  CompleteUsersInRoles,
  RelatedPlantHistoryModel,
  RelatedUsersInRolesModel,
} from './index';

export const UserModel = z.object({
  id: z.string().uuid(),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  lastLogin: z.date().nullish(),
  createdAt: z.date(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  roles: CompleteUsersInRoles[];
  PlantHistory: CompletePlantHistory[];
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    roles: RelatedUsersInRolesModel.array(),
    PlantHistory: RelatedPlantHistoryModel.array(),
  })
);

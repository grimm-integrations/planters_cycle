import * as z from 'zod';

import {
  CompleteRole,
  CompleteUser,
  RelatedRoleModel,
  RelatedUserModel,
} from './index';

export const UsersInRolesModel = z.object({
  userId: z.string(),
  roleId: z.number().int(),
  assignedAt: z.date(),
  assignedBy: z.string(),
});

export interface CompleteUsersInRoles
  extends z.infer<typeof UsersInRolesModel> {
  user: CompleteUser;
  role: CompleteRole;
}

/**
 * RelatedUsersInRolesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUsersInRolesModel: z.ZodSchema<CompleteUsersInRoles> =
  z.lazy(() =>
    UsersInRolesModel.extend({
      user: RelatedUserModel,
      role: RelatedRoleModel,
    })
  );

import * as z from 'zod';
import {
  CompleteUser,
  RelatedUserModel,
  CompleteRole,
  RelatedRoleModel,
} from './index';

export const UsersInRolesModel = z.object({
  userId: z.string().uuid('Invalid user id').optional(),
  roleId: z.number().int().min(1, 'Role ID needs to be set'),
  assignedAt: z.date(),
  assignedBy: z.string().uuid('Assigner must be set'),
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

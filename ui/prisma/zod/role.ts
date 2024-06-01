import * as z from "zod"
import { CompleteUsersInRoles, RelatedUsersInRolesModel } from "./index"

export const RoleModel = z.object({
  id: z.number().int(),
  name: z.string().min(2, "Role name must be at least 2 characters long"),
})

export interface CompleteRole extends z.infer<typeof RoleModel> {
  users: CompleteUsersInRoles[]
}

/**
 * RelatedRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoleModel: z.ZodSchema<CompleteRole> = z.lazy(() => RoleModel.extend({
  users: RelatedUsersInRolesModel.array(),
}))

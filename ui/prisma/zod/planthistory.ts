import * as z from "zod"
import { CompletePlant, RelatedPlantModel, CompleteUser, RelatedUserModel } from "./index"

export const PlantHistoryModel = z.object({
  id: z.string(),
  plantId: z.string(),
  action: z.string(),
  createdAt: z.date(),
  userId: z.string(),
})

export interface CompletePlantHistory extends z.infer<typeof PlantHistoryModel> {
  plant: CompletePlant
  user: CompleteUser
}

/**
 * RelatedPlantHistoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPlantHistoryModel: z.ZodSchema<CompletePlantHistory> = z.lazy(() => PlantHistoryModel.extend({
  plant: RelatedPlantModel,
  user: RelatedUserModel,
}))

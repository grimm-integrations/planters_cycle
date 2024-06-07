import * as z from "zod"
import { PlantStage } from "@prisma/client"
import { CompleteGenetic, RelatedGeneticModel, CompletePlantHistory, RelatedPlantHistoryModel } from "./index"

export const PlantModel = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Plant name must be at least 1 character long"),
  geneticId: z.string().uuid("Genetic ID must be set"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  stage: z.nativeEnum(PlantStage).optional(),
  motherId: z.string().optional().nullish(),
})

export interface CompletePlant extends z.infer<typeof PlantModel> {
  genetic: CompleteGenetic
  plantHistory: CompletePlantHistory[]
  mother?: CompletePlant | null
  children: CompletePlant[]
}

/**
 * RelatedPlantModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPlantModel: z.ZodSchema<CompletePlant> = z.lazy(() => PlantModel.extend({
  genetic: RelatedGeneticModel,
  plantHistory: RelatedPlantHistoryModel.array(),
  mother: RelatedPlantModel.optional().nullish(),
  children: RelatedPlantModel.array(),
}))

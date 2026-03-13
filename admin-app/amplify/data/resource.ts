// Amplify Gen2 Data Schema
// Run: npx amplify sandbox
import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  CourseBatch: a
    .model({
      programName: a.string().required(),
      courseCode: a.string(),
      trainerName: a.string(),
      startDate: a.date(),
      endDate: a.date(),
      listPrice: a.float(),
      discountedPrice: a.float(),
      discountStartDate: a.date(),
      discountEndDate: a.date(),
      currency: a.string(),
      maxSeats: a.integer(),
    })
    .authorization((allow) => [allow.group('Admins')]),
})

export type Schema = ClientSchema<typeof schema>
export const data = defineData({ schema })

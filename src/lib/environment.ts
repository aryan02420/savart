import { z } from 'zod';

const envSchema = z.object({
  KV_REST_API_URL: z.string().url(),
  KV_REST_API_TOKEN: z.string().min(1),
})

export type Environment = z.infer<typeof envSchema>

const env = envSchema.parse(process.env)
export default env

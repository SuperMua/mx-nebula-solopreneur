import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  username: z.string().min(3, '用户名至少 3 个字符').max(50),
  password: z.string().min(8, '密码至少 8 个字符'),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(300).optional(),
  comment: z.string().optional(),
})

export const workflowSchema = z.object({
  name: z.string().min(1).max(300),
  description: z.string().optional(),
  dagJson: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
  isPublic: z.boolean().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

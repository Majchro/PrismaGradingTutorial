import { UserRole } from '@prisma/client';

export interface UserInput {
  firstName: string
  lastName: string
  email: string
  social: {
    facebook?: string
    twitter?: string
    github?: string
    website?: string
  }
}

export interface CourseInput {
  name: string
  courseDetails?: string
}

export interface TestInput {
  name: string
  date: Date
}

export interface UserEnrollmentInput {
  courseId: number
  role: UserRole
}

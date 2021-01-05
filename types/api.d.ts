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

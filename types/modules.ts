import { PrismaClient } from '@prisma/client';

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient
    sendEmailToken(email: string, token: string): Promise<void>
  }
  interface AuthCredentials {
    userId: number
    tokenId: number
    isAdmin: boolean
    teacherOf: Array<number>
  }
}

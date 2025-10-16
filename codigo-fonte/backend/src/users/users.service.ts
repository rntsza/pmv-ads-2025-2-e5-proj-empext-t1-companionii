import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async updateProfile(userId: string, data: UpdateUserDto) {
    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.imageUrl && { imageUrl: data.imageUrl }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updated;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        // P2002 = Unique constraint failed
        throw new ConflictException('Email already in use');
      }
      throw err;
    }
  }

  async updateByAdmin(targetUserId: string, data: UpdateUserDto) {
    return await this.updateProfile(targetUserId, data);
  }
}

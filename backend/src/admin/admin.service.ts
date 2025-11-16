import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { SalaryCalculation } from '../salary/entities/salary-calculation.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SalaryCalculation)
    private salaryRepository: Repository<SalaryCalculation>,
  ) {}

  async getUsers(page: number = 1, limit: number = 50, search?: string) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.username LIKE :search OR user.email LIKE :search OR user.displayName LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const calculationsCount = await this.salaryRepository.count({ where: { userId: user.id } });

        return {
          ...user,
          stats: {
            calculationsCount,
          },
        };
      }),
    );

    return {
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const calculations = await this.salaryRepository.find({
      where: { userId: id },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      ...user,
      recentCalculations: calculations,
    };
  }

  async updateUser(id: string, updateData: { role?: UserRole; isActive?: boolean }) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateData.role !== undefined) {
      user.role = updateData.role;
    }
    if (updateData.isActive !== undefined) {
      user.isActive = updateData.isActive;
    }

    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting the last admin
    if (user.role === UserRole.ADMIN) {
      const adminCount = await this.userRepository.count({ where: { role: UserRole.ADMIN } });
      if (adminCount === 1) {
        throw new BadRequestException('Cannot delete the last admin user');
      }
    }

    await this.userRepository.remove(user);
    return { success: true, message: 'User deleted successfully' };
  }
}


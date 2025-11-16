import { Controller, Get, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { UserRole } from '../user/entities/user.entity';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    async getUsers(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50',
        @Query('search') search?: string,
    ) {
        return this.adminService.getUsers(
            parseInt(page) || 1,
            parseInt(limit) || 50,
            search,
        );
    }

    @Get('users/:id')
    async getUser(@Param('id') id: string) {
        return this.adminService.getUserById(id);
    }

    @Put('users/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateData: { role?: UserRole; isActive?: boolean },
    ) {
        return this.adminService.updateUser(id, updateData);
    }

    @Delete('users/:id')
    async deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }
}


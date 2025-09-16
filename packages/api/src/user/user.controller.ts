import { Controller, Post, Body, ValidationPipe, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { OnboardUserDto } from './dto/onboard-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('onboard')
    onboard(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        onboardUserDto: OnboardUserDto,
    ) {
        return this.userService.onboard(onboardUserDto);
    }

    @Get('submissions')
    getAllSubmissions() {
        return this.userService.getAllSubmissions();
    }

    @Get('submissions/:id')
    getSubmissionById(@Param('id') id: string) {
        return this.userService.getSubmissionById(id);
    }

    /**
     * Endpoint to update the status of a KYC submission.
     * URL: PATCH /user/submissions/:id/status
     */
    @Patch('submissions/:id/status')
    updateSubmissionStatus(
        @Param('id') id: string,
        @Body('status') status: 'approved' | 'rejected',
    ) {
        return this.userService.updateSubmissionStatus(id, status);
    }
}
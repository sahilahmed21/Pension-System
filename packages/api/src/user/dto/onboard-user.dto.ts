import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

/**
 * Defines the shape and validation rules for the data
 * received during the user onboarding process.
 */
export class OnboardUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Full name must not be empty.' })
    fullName: string;

    @IsDateString({}, { message: 'Date of birth must be a valid date string.' })
    @IsNotEmpty({ message: 'Date of birth must not be empty.' })
    dateOfBirth: string; // We receive it as an ISO string from the frontend

    @IsString()
    @IsNotEmpty({ message: 'National ID must not be empty.' })
    nationalId: string;

    // We'll handle the file upload in a later step.
    // For now, we'll focus on the JSON data.
}


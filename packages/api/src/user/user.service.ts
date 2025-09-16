import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { OnboardUserDto } from './dto/onboard-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
    private readonly logger = new Logger(UserService.name);
    private supabase: SupabaseClient;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL or Key not configured in .env');
        }
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.logger.log('Supabase client initialized.');
    }

    async onboard(onboardUserDto: OnboardUserDto) {
        this.logger.log('Saving new KYC submission to database...');
        const { data, error } = await this.supabase
            .from('kyc_submissions')
            .insert([onboardUserDto])
            .select();

        if (error) {
            this.logger.error('Error saving submission to Supabase. Detailed Error:',
                JSON.stringify(error, null, 2),
            );
            throw new Error(`Database insertion failed: ${error.message}`);
        }

        this.logger.log('Submission saved successfully:', data);
        return {
            message: 'User onboarding data saved. Verification pending.',
            submission: data[0],
        };
    }

    async getAllSubmissions() {
        const { data, error } = await this.supabase
            .from('kyc_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            this.logger.error('Error fetching submissions', error);
            throw new Error('Database query failed.');
        }
        return data;
    }

    async getSubmissionById(id: string) {
        const { data, error } = await this.supabase
            .from('kyc_submissions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            this.logger.error(`Error fetching submission with id ${id}`, error);
            throw new Error('Database query failed.');
        }
        return data;
    }

    /**
     * Updates the status of a KYC submission.
     */
    async updateSubmissionStatus(id: string, status: 'approved' | 'rejected') {
        this.logger.log(`Updating submission ${id} to status: ${status}`);
        const { data, error } = await this.supabase
            .from('kyc_submissions')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) {
            this.logger.error(`Error updating status for submission ${id}`, error);
            throw new Error('Database update failed.');
        }
        return data[0];
    }
}
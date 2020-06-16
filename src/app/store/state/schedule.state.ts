import { ISchedule } from 'src/app/models/schedule.interface';

export interface ScheduleState {
    items: ISchedule[];
    currentItem: ISchedule;
    status: 'idle' | 'loading' | 'error';
    error?: string;
    // sort: 'asc' | 'desc' | null;
}

import * as moment from 'moment-timezone';

moment.tz.setDefault('Europe/Budapest');
moment.locale('hu');

export class Problem {
    ISO_8601_FORMAT: string = 'YYYY-MM-DDTHH:mm:ss';
    workingHoursStart: number = 9;
    workingHoursEnd: number = 17;
    workingHoursDiff: number = this.workingHoursEnd - this.workingHoursStart;

    calculateDueDate(submitDateString: string, turnaroundTime: number): string {
        let submitDate: moment.Moment = moment(submitDateString, this.ISO_8601_FORMAT);
        if (!this._isWorkingDay(submitDate)) {
            throw new Error('The submitted date is not a working day.');
        }
        let startOfWorkingDay: moment.Moment = moment(submitDate).startOf('day').add(this.workingHoursStart, 'hours');
        let startOfWorkingDayDiff: number = submitDate.diff(startOfWorkingDay, 'hours', true);
        if (startOfWorkingDayDiff < 0 || startOfWorkingDayDiff > this.workingHoursDiff) {
            throw new Error('The submitted date is not part of the working day.');
        }
        let numberOfDays = Math.floor((turnaroundTime + startOfWorkingDayDiff) / this.workingHoursDiff);
        while (numberOfDays > 0) {
            startOfWorkingDay.add(24, 'hours');
            if (this._isWorkingDay(startOfWorkingDay)) {
                numberOfDays--;
            }
        }
        let dueDate = moment(startOfWorkingDay).add((turnaroundTime + startOfWorkingDayDiff) % this.workingHoursDiff, 'hours');
        return dueDate.format(this.ISO_8601_FORMAT);
    }

    _isWorkingDay(date: moment.Moment): boolean {
        let dayOfWeek = date.day();
        return (dayOfWeek > 0 && dayOfWeek < 6);
    }

}

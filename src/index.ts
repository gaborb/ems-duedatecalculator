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
        let hoursDiff: number = submitDate.diff(startOfWorkingDay, 'hours', true);
        if (hoursDiff < 0 || hoursDiff > this.workingHoursDiff) {
            throw new Error('The submitted date is not part of the working day.');
        }
        let dueTime: number = turnaroundTime + hoursDiff;
        startOfWorkingDay = this._iterateDays(startOfWorkingDay, dueTime);
        let numberOfHoursRemain: number = dueTime % this.workingHoursDiff;
        let dueDate: moment.Moment = moment(startOfWorkingDay).add(numberOfHoursRemain, 'hours');
        return dueDate.format(this.ISO_8601_FORMAT);
    }

    _isWorkingDay(date: moment.Moment): boolean {
        let dayOfWeek = date.day();
        return (dayOfWeek > 0 && dayOfWeek < 6);
    }

    _iterateDays(startDate: moment.Moment, dueTime: number): moment.Moment {
        let date: moment.Moment = moment(startDate);
        let numberOfDaysOverlaps: number = Math.floor(dueTime / this.workingHoursDiff);
        while (numberOfDaysOverlaps > 0) {
            date.add(24, 'hours');
            if (this._isWorkingDay(date)) {
                numberOfDaysOverlaps--;
            }
        }
        return date;
    }

}

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
        let dayOfWeek = submitDate.day();
        console.log('--dayOfWeek', dayOfWeek);
        if (dayOfWeek == 0 || dayOfWeek == 6) {
            throw new Error('The submitted date is not a working day.');
        }
        let startOfWorkingDay: moment.Moment = moment(submitDate).startOf('day').add(this.workingHoursStart, 'hours');
        let startOfWorkingDayDiff: number = submitDate.diff(startOfWorkingDay, 'hours', true);
        if (startOfWorkingDayDiff < 0 || startOfWorkingDayDiff > this.workingHoursDiff) {
            throw new Error('The submitted date is not part of the working day.');
        }
        console.log('--startOfWorkingDayDiff', startOfWorkingDayDiff);
        let numberOfDays = Math.floor((turnaroundTime + startOfWorkingDayDiff) / this.workingHoursDiff);
        console.log('--numberOfDays', numberOfDays);
        while (numberOfDays > 0) {
            startOfWorkingDay.add(24, 'hours');
            console.log('--startOfWorkingDay', startOfWorkingDay.format(this.ISO_8601_FORMAT));
            let dayOfWeek = startOfWorkingDay.day();
            if (dayOfWeek > 0 && dayOfWeek < 6) {
                console.log('--isWorkingDay', true);
                numberOfDays--;
            }
        }
        let dueDate = moment(startOfWorkingDay).add((turnaroundTime + startOfWorkingDayDiff) % this.workingHoursDiff, 'hours');
        return dueDate.format(this.ISO_8601_FORMAT);
    }

}

let problem = new Problem();
let submitDateString = '2018-04-20T09:00:00';
let turnaroundTime = 10;
console.log('submitDateString', submitDateString);
console.log('turnaroundTime', turnaroundTime);
console.log('dueDateString', problem.calculateDueDate(submitDateString, turnaroundTime));

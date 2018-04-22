"use strict";
exports.__esModule = true;
var moment = require("moment-timezone");
moment.tz.setDefault('Europe/Budapest');
moment.locale('hu');
var Problem = /** @class */ (function () {
    function Problem() {
        this.ISO_8601_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
        this.workingHoursStart = 9;
        this.workingHoursEnd = 17;
        this.workingHoursDiff = this.workingHoursEnd - this.workingHoursStart;
    }
    Problem.prototype.calculateDueDate = function (submitDateString, turnaroundTime) {
        var submitDate = moment(submitDateString, this.ISO_8601_FORMAT);
        var dayOfWeek = submitDate.day();
        if (dayOfWeek == 0 || dayOfWeek == 6) {
            throw new Error('The submitted date is not a working day.');
        }
        var startOfWorkingDay = moment(submitDate).startOf('day').add(this.workingHoursStart, 'hours');
        var startOfWorkingDayDiff = submitDate.diff(startOfWorkingDay, 'hours', true);
        if (startOfWorkingDayDiff < 0 || startOfWorkingDayDiff > this.workingHoursDiff) {
            throw new Error('The submitted date is not part of the working day.');
        }
        var numberOfDays = Math.floor((turnaroundTime + startOfWorkingDayDiff) / this.workingHoursDiff);
        while (numberOfDays > 0) {
            startOfWorkingDay.add(24, 'hours');
            var dayOfWeek_1 = startOfWorkingDay.day();
            if (dayOfWeek_1 > 0 && dayOfWeek_1 < 6) {
                numberOfDays--;
            }
        }
        var dueDate = moment(startOfWorkingDay).add((turnaroundTime + startOfWorkingDayDiff) % this.workingHoursDiff, 'hours');
        return dueDate.format(this.ISO_8601_FORMAT);
    };
    return Problem;
}());
exports.Problem = Problem;
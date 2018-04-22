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
        if (!this._isWorkingDay(submitDate)) {
            throw new Error('The submitted date is not a working day.');
        }
        var startOfWorkingDay = moment(submitDate).startOf('day').add(this.workingHoursStart, 'hours');
        var hoursDiff = submitDate.diff(startOfWorkingDay, 'hours', true);
        if (hoursDiff < 0 || hoursDiff > this.workingHoursDiff) {
            throw new Error('The submitted date is not part of the working day.');
        }
        var dueTime = turnaroundTime + hoursDiff;
        startOfWorkingDay = this._iterateDays(startOfWorkingDay, dueTime);
        var numberOfHoursRemain = dueTime % this.workingHoursDiff;
        var dueDate = moment(startOfWorkingDay).add(numberOfHoursRemain, 'hours');
        return dueDate.format(this.ISO_8601_FORMAT);
    };
    Problem.prototype._isWorkingDay = function (date) {
        var dayOfWeek = date.day();
        return (dayOfWeek > 0 && dayOfWeek < 6);
    };
    Problem.prototype._iterateDays = function (startDate, dueTime) {
        var date = moment(startDate);
        var numberOfDaysOverlaps = Math.floor(dueTime / this.workingHoursDiff);
        while (numberOfDaysOverlaps > 0) {
            date.add(24, 'hours');
            if (this._isWorkingDay(date)) {
                numberOfDaysOverlaps--;
            }
        }
        return date;
    };
    return Problem;
}());
exports.Problem = Problem;

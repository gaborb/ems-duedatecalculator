(function () {
    'use strict';
    
    describe('Problem', function() {
        var Problem = require('../src/index').Problem;
        var problem;

        beforeEach(function() {
            problem = new Problem();
        });

        describe('#calculateDueDate', function() {

            it('should throw an error if the submitted date is not a working day', function() {
                expect(function() {
                    problem.calculateDueDate('2018-04-21T09:00:00', 1);
                }).toThrowError('The submitted date is not a working day.');
            });
        
            it('should throw an error if the submitted date is not part of the working day (before the workday)', function() {
                expect(function() {
                    problem.calculateDueDate('2018-04-23T08:00:00', 1);
                }).toThrowError('The submitted date is not part of the working day.');
            });
        
            it('should throw an error if the submitted date is not part of the working day (after the workday)', function() {
                expect(function() {
                    problem.calculateDueDate('2018-04-23T18:00:00', 1);
                }).toThrowError('The submitted date is not part of the working day.');
            });
        
            it('should return a timestamp which is the expected due date (on the same day)', function() {
                expect(problem.calculateDueDate('2018-04-23T09:00:00', 1))
                    .toBe('2018-04-23T10:00:00');
            });
        
            it('should return a timestamp which is the expected due date (on the other day)', function() {
                expect(problem.calculateDueDate('2018-04-23T09:00:00', 10))
                    .toBe('2018-04-24T11:00:00');
            });
        
            it('should return a timestamp which is the expected due date (laps over the weekend)', function() {
                expect(problem.calculateDueDate('2018-04-20T09:00:00', 10))
                    .toBe('2018-04-23T11:00:00');
            });
        
        })

    });
    
})();
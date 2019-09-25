import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

describe('Service:: CalculatorService', () => {
  let calculator: CalculatorService;
  let loggerSpy: LoggerService;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });
    calculator = TestBed.get(CalculatorService);
  });

  it('should add two numbers', () => {
    const result = calculator.add(2, 2);
    expect(result)
      .toEqual(4);
    expect(loggerSpy.log)
      .toHaveBeenCalledTimes(1);
  });


  it('should substract two numbers', () => {
    const result = calculator.subtract(2, 2);
    expect(result)
      .toEqual(0, 'unexpected substraction result');
    expect(loggerSpy.log)
      .toHaveBeenCalledTimes(1);
  });
});

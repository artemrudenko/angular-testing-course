import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Async Testing Examples', () => {

  it('Async test example with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions done()');

      test = true;

      expect(test).toBeTruthy();

      done();
    }, 1000);
  });

  it('Async test example - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout(() => { });

    setTimeout(() => {
      console.log('running assertions setTimeout()');

      test = true;
      // expect(test).toBeTruthy();
    }, 1000);

    // wait for certain amount of time
    // tick(1000);

    //  the same
    // tick(500);
    // tick(499);
    // tick(1);

    // or use flush to flush all
    flush();

    expect(test).toBeTruthy();

  }));

  it('Async test example with - plain Promise', fakeAsync(() => {
    let test = false;

    console.log('Creating Promise');

    Promise.resolve().then(() => {
      console.log('Promise first then() evaluated successfully');
      test = true;

      return Promise.resolve();
    })
      .then(() => {
        console.log('Promise second then() evaluated successfully');
      });

    flushMicrotasks();

    console.log('Running test assertions');

    expect(test).toBeTruthy();
  }));

  it('Async test example - Promises + setTimeout()', fakeAsync(() => {

    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;

        setTimeout(() => {

          counter += 1;

        }, 1000);
      });

    console.log('Running test assertions');

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);

    tick(500);
    // OR
    // flush();

    expect(counter).toBe(11);
  }));

  it('Async test example - Observables', fakeAsync(() => {
    let test = false;

    console.log('Creating Observable');

    const test$ = of(test)
      .pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log('Running test assertions');

    expect(test).toBeTruthy();
  }));

});

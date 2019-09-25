import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CoursesModule } from '../courses.module';
import { HomeComponent } from './home.component';
import { CoursesService } from '../services/courses.service';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { click } from '../common/test-utils';

describe('Component:: HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const courses = setupCourses();
  const beginnerCourses = courses.filter(c => c.category === 'BEGINNER');
  const advancedCourses = courses.filter(c => c.category === 'ADVANCED');

  beforeEach(async(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.get(CoursesService);
      });
  }));

  it('should create the component', () => {
    expect(component)
      .toBeTruthy();
  });

  it('should display only beginner courses', () => {
    coursesService.findAllCourses
      .and.returnValue(of(beginnerCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length)
      .toBe(1, 'Unexpected number of tabs found');
    expect(tabs[0].nativeElement.textContent)
      .toBe('Beginners');
  });

  it('should display only advanced courses', () => {
    coursesService.findAllCourses
      .and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length)
      .toBe(1, 'Unexpected number of tabs found');
    expect(tabs[0].nativeElement.textContent)
      .toBe('Advanced');
  });

  it('should display both tabs', () => {
    coursesService.findAllCourses
      .and.returnValue(of(courses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length)
      .toBe(2, 'Unexpected number of tabs found');
  });

  it('should display advanced courses when tab clicked - fakeAsync', fakeAsync(() => {
    coursesService.findAllCourses
      .and.returnValue(of(courses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length)
      .toBeGreaterThan(0, 'Could not find card titles!');
    expect(cardTitles[0].nativeElement.textContent)
      .toContain('Angular Security Course');
  }));

  it('should display advanced courses when tab clicked - async', async(() => {
    coursesService.findAllCourses
      .and.returnValue(of(courses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        console.log('called whenStable()');

        const cardTitles = el.queryAll(By.css('.mat-card-title'));
        expect(cardTitles.length)
          .toBeGreaterThan(0, 'Could not find card titles!');
        expect(cardTitles[0].nativeElement.textContent)
          .toContain('Angular Security Course');
      });
  }));

});

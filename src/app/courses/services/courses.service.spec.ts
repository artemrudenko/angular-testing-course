import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoursesService } from './courses.service';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';

describe('Service:: CoursesService', () => {
  const courseId = 12;
  let service: CoursesService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService
      ]
    });
    service = TestBed.get(CoursesService);
    controller = TestBed.get(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    service.findAllCourses()
      .subscribe(courses => {
        expect(courses)
          .toBeTruthy(`No courses returned!`);
        expect(courses.length)
          .toEqual(12, `Incorrect number of courses`);

        const course = courses.find(c => c.id === 12);
        expect(course.titles.description)
          .toBe('Angular Testing Course');
      });

    const req = controller.expectOne('/api/courses');
    expect(req.request.method)
      .toEqual('GET');

    req.flush({
      payload: Object.values(COURSES)
    });
  });

  it('should find a course by id', () => {
    service.findCourseById(courseId)
      .subscribe(course => {
        expect(course)
          .toBeTruthy();
        expect(course.id)
          .toBe(courseId);
      });

    const req = controller.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method)
      .toEqual('GET');

    req.flush(COURSES[courseId]);
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = {
      titles: {
        description: 'Testing Course'
      }
    };
    service.saveCourse(courseId, changes)
      .subscribe(course => {
        expect(course.id)
          .toBe(courseId);
      });

    const req = controller.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method)
      .toEqual('PUT');
    expect(req.request.body.titles.description)
      .toEqual(changes.titles.description);

    req.flush({ ...COURSES[courseId], ...changes });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {
      titles: {
        description: 'Testing Course'
      }
    };
    service.saveCourse(courseId, changes)
      .subscribe(
        () => fail(`the save course operation should have faield`),
        (error: HttpErrorResponse) => {
          expect(error.status)
            .toBe(500);
        });

    const req = controller.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method)
      .toEqual('PUT');
    req.flush(
      'Save course failed',
      {
        status: 500, statusText: `Internal Server Error`
      });
  });

  it('should find a list of lessons', () => {
    const pageSize = 3;
    const pageNumber = 0;
    const startAt = pageNumber * pageSize;
    service.findLessons(courseId)
      .subscribe(lessons => {
        expect(lessons)
          .toBeTruthy();
        expect(lessons.length)
          .toBe(3);
      });
    const req = controller.expectOne(
      r => r.url === `/api/lessons`);
    expect(req.request.method)
      .toEqual('GET');
    expect(req.request.params.get('courseId'))
      .toEqual(`${courseId}`);
    expect(req.request.params.get('filter'))
      .toEqual(``);
    expect(req.request.params.get('sortOrder'))
      .toEqual(`asc`);
    expect(req.request.params.get('pageNumber'))
      .toEqual(`${pageNumber}`);
    expect(req.request.params.get('pageSize'))
      .toEqual(`${pageSize}`);

    req.flush({
      payload: findLessonsForCourse(courseId).slice(startAt, startAt + pageSize)
    });
  });

  afterEach(() => {
    controller.verify();
  });

});

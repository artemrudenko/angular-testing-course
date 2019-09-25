import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent {

    course: Course;
    form: FormGroup;

    constructor(
        fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course,
        private coursesService: CoursesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.titles.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.titles.longDescription, Validators.required]
        });
    }

    save() {
        const val = this.form.value;
        this.coursesService.saveCourse(this.course.id, { titles: { description: val.description, longDescription: val.longDescription } })
            .pipe(
                tap(() => this.dialogRef.close(this.form.value))
            )
            .subscribe();
    }

    close() {
        this.dialogRef.close();
    }
}

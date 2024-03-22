import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../models/api-models/ui-models/student.model';
import { GenderServiceService } from '../services/gender-service.service';
import { Gender } from '../../models/api-models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrl: './view-student.component.css'
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }

  genderList: Gender[] = [];
  isNewStudent = false;
  header: string = "";
  displayProfileImageUrl = '';

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderServiceService,
    private router: Router,
    private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');
        //studentId add ise eklemeye göre 
        if (this.studentId === "add") {
          this.isNewStudent = true
          this.header = "Öğrenci Ekle"
          this.setImage()
        }
        else {
          this.isNewStudent = false
          this.header = "Öğrenci Düzenle"

          this.studentService.getStudent(this.studentId).subscribe(
            (success) => {
              this.student = success;
              this.setImage()
            },
            (err) => {
              this.setImage()
            }
          )
        }

        this.genderService.getGenderList().subscribe(
          (success) => {
            this.genderList = success;
          },
          (err) => {

          }
        )
      }


    )

  }

  onUpdate() {

    this.studentService.updateStudent(this.student.id, this.student).subscribe(
      (success) => {
        this._snackBar.open('Öğrenci başarılı bir şekilde güncellendi', undefined, {
          duration: 2000
        })
        this.router.navigateByUrl('students')
      },
      (err) => {
        this._snackBar.open('Öğrenci güncellenenmedi', undefined, {
          duration: 2000
        })
      },
    )
  }

  onDelete() {
    this.studentService.deletStudent(this.student.id).subscribe(
      (success) => {
        this._snackBar.open('Öğrenci başarılı bir şekilde silindi', undefined, {
          duration: 2000
        })
        setTimeout(() => {
          this.router.navigateByUrl('students')
        }, 2000)

      },
      (err) => {
        this._snackBar.open('Öğrenci silinemedi', undefined, {
          duration: 2000
        })
      }
    )
  }

  onAdd() {
    this.studentService.addStudent(this.student).subscribe(
      (success) => {
        this._snackBar.open('Öğrenci başarılı bir şekilde eklendi', undefined, {
          duration: 2000
        })
        setTimeout(() => {
          this.router.navigateByUrl(`students/${success.id}`)
        }, 2000)
      },
      (err) => {
        this._snackBar.open('Öğrenci eklenemedi', undefined, {
          duration: 2000
        })
      },
    )
  }

  setImage() {
    if (this.student.profileImageUrl) {
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl)
    }
    else {
      this.displayProfileImageUrl = '/assets/logo-social.png'
    }
  }

  uploadImage(event: any) {
    if(this.studentId) {
      const file : File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file).subscribe(
        (success)=> {
          this.student.profileImageUrl = success;
          this.setImage()

          this._snackBar.open('Başarılı bir şekilde resim güncellendi', undefined, {
            duration: 2000
          })
        },
        (err)=> {
          
        }
      )
    }
  }
}

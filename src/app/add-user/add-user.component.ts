import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  modalRef?: BsModalRef;


  public isSubmitted = false;

  public filterUser: any;

  public addUser: any = true;
  public editUser: any = false;
  public viewUser: any = false;
  public isReadOnly: any = false;

  public name: any;
  public email: any;
  public mobile: any;
  public selectedId:any;

  public userForm!: FormGroup;
  public userData: any = [];

  public currentPageNo = 1;

  public pagesize = 3;

  public totalCount = 0;
  
  public deleteData:any;

   

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService
  ) {  }

  // Add Modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
      class: 'add-user-modal modal-dialog-centered',
    });
    this.addUser = true;
    this.editUser = false;
    this.viewUser = false;
    this.isReadOnly = false;
    this.userForm.reset();
  }

  
  //Get Form Controls
  get f() {
    return this.userForm.controls;
  }


  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
    });
    this.getAllUsers();
  }

  numberOnly(event : any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.toastr.error('Allowed Numeric Only...', '');
      return false;
    }
    return true;
  }

 //Get all User
  getAllUsers() {
    this.api.getUser().subscribe((res) => {
      this.userData = res;
      this.totalCount = this.userData.length;
    });
  }

  //Post User
  postUserDetails() {
    if (this.userForm.invalid) {
      this.isSubmitted = true;  
      return;
    }
    else {    
      this.addUser = true;
      this.editUser = false;
      this.api.postUser(this.userForm.value).subscribe(
        (res) => {
          this.userForm.reset();
          this.modalRef?.hide();
          this.userData.push(this.userForm.value);
          this.toastr.success('User added Succssfully', '');
          this.getAllUsers();
        },
        (err) => {
          this.toastr.error('Something went wrong', '');
        }
      );
    }
  }

  //Edit User
  editUserDetails(row: any, template: TemplateRef<any>) {
    this.selectedId = row.id;
    this.userForm.patchValue({
      name: row.name,
      email: row.email,
      mobile: row.mobile,
    });
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
      class: 'add-user-modal modal-dialog-centered',
    });
    this.addUser = false;
    this.editUser = true;
    this.viewUser = false;
    this.isReadOnly = false;
  }

  //Update User
  updateUserDetails() {
    this.api.updateUser(this.userForm.value, this.selectedId).subscribe(
      (res) => {
        this.userForm.reset();
        this.modalRef?.hide();
        this.toastr.success('User updated Succssfully', '');
        this.getAllUsers();
      },
      (err) => {
        this.toastr.error('Something went wrong', '');
      }
    );
  }

  //View user
  viewUserDetails(row: any, template: TemplateRef<any>) {
    this.selectedId = row.id;
    this.addUser = false;
    this.editUser = false;
    this.viewUser = true;
    this.isReadOnly = true;

    this.userForm.patchValue({
      name: row.name,
      email: row.email,
      mobile: row.mobile,
    });
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
      class: 'add-user-modal modal-dialog-centered',
    });
  }

  //Delete Confirmation
  openModal1(template: TemplateRef<any>, id: any) {
    this.deleteData = id;
    this.modalRef = this.modalService.show(template,{
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog-centered',
    });
  }

//Delete User
  deleteUserDetails() {
    this.api.deleteUser(this.deleteData).subscribe((res) => {
      this.toastr.success('User deleted Succssfully', '');
      this.getAllUsers();
      this.modalRef?.hide();
    });
  }
  
}

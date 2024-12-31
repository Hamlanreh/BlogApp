import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-post-detail',
  standalone: false,
  
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  postId: number | undefined;
  post: any;
  comments: any = [];

  formData: any = {
    author: '',
    text: '',
    postId: 0,
  }

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = params['id'];
      this.formData.postId = this.postId;

      this.getPostById(this.postId);
      this.getPostComments();
    })  
  }


  getPostById(id: any) {
    this.apiService
      .get(environment.baseUrl + `api/Posts/${id}`, { responseType: 'json' })
      .subscribe(
        (res: any) => { this.post = res; },
        (error) => { console.log(error); }
      );
  }


  getPostComments() {
   this.apiService
     .get(environment.baseUrl + `api/Comments/${this.postId}`, { responseType: 'json' })
     .subscribe(
       (res: any) => { this.comments = res; },
       (error) => { console.log(error); }
     );
  }


  createComment(form: NgForm) {
    if (form.valid) {
      this.apiService
        .post(environment.baseUrl + 'api/Comments', this.formData, { responseType: 'json' })
        .subscribe(
          (res: any) => {
            form.reset();
            location.reload();
          },
          (error) => { console.log(error); }
        );
    }
  }


  deletePost(postId: number) {    
    this.apiService
      .delete(environment.baseUrl + `api/Posts/${postId}`, { responseType: 'json' })
      .subscribe(
        (res: any) => {
          this.router.navigate(['']);
        },
        (error) => { console.log(error); }
      );
  }


  deleteComment(commentId: number) {
    this.apiService
      .delete(environment.baseUrl + `api/Comments/${commentId}`, { responseType: 'json' })
      .subscribe(
        (res: any) => {
          location.reload();
        },
        (error) => { console.log(error); }
      );
  }

}

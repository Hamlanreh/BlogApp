import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { NgForm } from '@angular/forms';

interface Category {
  id: number,
  name: string,
  posts: any
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  categories: Category[] = [];
  trendingPosts: any[] = [];

  isFormOpen: boolean = false;

  formData = {
    author: '',
    title: '',
    content: '',
    categoryId: '',
  };

  constructor(private apiService: ApiService) { }


  ngOnInit() {
    this.getAllCategories();
    this.getTrendingPosts()
  }


  getAllCategories() {
    this.apiService
      .get('https://localhost:7143/api/Categories', { responseType: 'json' })
      .subscribe(
        (res: any) => { this.categories = res },
        (error) => { console.log(error); }
      );
  }

  getTrendingPosts() {
    this.apiService
      .get('https://localhost:7143/api/Posts/trending', { responseType: 'json' })
      .subscribe(
        (res: any) => {
          this.trendingPosts = res;
        },
        (error) => { console.log(error); }
      )
  }

  createPost(form: NgForm) {
    if (form.valid) {
      this.apiService
        .post('https://localhost:7143/api/Posts', this.formData, { responseType: 'json' })
        .subscribe(
          (res: any) => {
            form.reset();
            location.reload();
          },
          (error) => { console.log(error); }
        )
    }
  }

  


  toggleForm() {
    this.isFormOpen = !this.isFormOpen;
  }


  title = 'blogapp.client';
}

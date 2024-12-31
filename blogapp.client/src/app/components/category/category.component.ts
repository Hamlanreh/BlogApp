import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-category',
  standalone: false,
  
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryId: string | undefined;
  category: any;
  posts: any[] = [];
  pageNumber: number = 1;
  totalPages: number = 0;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      //Get category from id
      this.getCategoryById(this.categoryId);
      //Get category posts
      this.getCategoryPostsById(this.categoryId, this.pageNumber);
    })
  }

  getCategoryById(id: any) {
    this.apiService
      .get(environment.baseUrl + `api/categories?id=${id}`, { responseType: 'json' })
      .subscribe(
        (res: any) => {
          this.category = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getCategoryPostsById(id: any, pageNumber: any) {
    this.apiService
      .get(environment.baseUrl + `api/Categories/${id}/posts?pageNumber=${pageNumber}`, { responseType: 'json' })
      .subscribe(
        (res: any) => {
          this.posts = res.category.posts;
          this.pageNumber = res.currentPage;
          this.totalPages = res.totalPages;
        },
        (error) => {
          console.log(error);
        }
      );
  }


  previousPage() {
    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
      return;
    }
    this.pageNumber -= 1;
    this.getCategoryPostsById(this.categoryId, this.pageNumber);
  }

  nextPage() {
    if (this.pageNumber > this.totalPages) {
      return;
    }
    this.pageNumber += 1;
    this.getCategoryPostsById(this.categoryId, this.pageNumber);
  }

}

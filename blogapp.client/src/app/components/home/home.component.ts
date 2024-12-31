import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  posts: any[] = [];
  pageNumber: number = 1;
  totalPages: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getPosts();
  }


  previousPage() {
    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
      return;
    }
    this.pageNumber -= 1;
    this.getPosts()
  }

  nextPage() {
    if (this.pageNumber > this.totalPages) {
      return;
    }
    this.pageNumber += 1;
    this.getPosts();
  }

  getPosts() {
    this.apiService
      .get(environment.baseUrl + `api/Posts?pageNumber=${this.pageNumber}`, { responseType: 'json' })
      .subscribe(
        (res: any) => {
          this.posts = res.posts;
          this.pageNumber = res.currentPage;
          this.totalPages = res.totalPages;
        },
        (error) => { console.log(error); }
      );
  }

}

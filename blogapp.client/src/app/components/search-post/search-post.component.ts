import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-search-post',
  standalone: false,
  
  templateUrl: './search-post.component.html',
  styleUrl: './search-post.component.css'
})
export class SearchPostComponent {
  searchText: string = '';
  posts: any[] = [];
  pageNumber: number = 1;
  totalPages: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchText = params['searchText'];

      if (this.searchText == '' || this.searchText == null) {
        this.router.navigate(['']);
        return;
      }

      this.searchPost(this.searchText);
    })
  }

  searchPost(searchText: string) {
    this.apiService
      .get(environment.baseUrl + `api/Posts?searchTitle=${searchText}&pageNumber=${this.pageNumber}`, { responseType: 'json' })
      .subscribe(
        (res: any) => {
          this.posts = res.posts;
        },
        (error) => { console.log(error); }
      );
  }


  previousPage() {
    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
      return;
    }
    this.pageNumber -= 1;
    this.searchPost(this.searchText)
  }

  nextPage() {
    if (this.pageNumber > this.totalPages) {
      return;
    }
    this.pageNumber += 1;
    this.searchPost(this.searchText);
  }

}

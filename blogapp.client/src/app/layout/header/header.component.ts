import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface Category {
  id: number,
  name: string,
  posts: any
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  categories: Category[] = [];
  searchText: string = '';
  
  
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.apiService
      .get('https://localhost:7143/api/Categories', { responseType: 'json' })
      .subscribe(
        (res: any) => { this.categories = res },
        (error) => { console.log(error); }
      );
  }

}
